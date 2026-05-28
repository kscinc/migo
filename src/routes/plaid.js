const express = require('express');
const router = express.Router();
const plaidClient = require('../services/plaidClient');
const supabase = require('../config/supabase');
const verifyJWT = require('../middleware/auth');
const aiService = require('../services/ai');
const { validate, validateQuery } = require('../middleware/validate');
const {
  createLinkTokenSchema,
  exchangePublicTokenSchema,
  saveBudgetSchema,
  completeActionSchema,
  educationViewedSchema,
  quizSubmitSchema,
  insightsSaveSchema,
  analyzeDaySchema,
  spendingByCategoryQuerySchema,
  budgetVsActualQuerySchema
} = require('../config/schemas');

// ========== EXISTING ROUTES ==========

// 1. Create Link Token (frontend calls this to open Plaid Link)
router.post('/create_link_token', verifyJWT, validate(createLinkTokenSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { userLevel } = req.body;
    
    // Dynamic products based on user level
    let products = ['transactions'];
    if (userLevel >= 4) products.push('liabilities');
    if (userLevel >= 5) products.push('investments');
    
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Migo',
      products: products,
      country_codes: ['US'],
      language: 'en',
    });
    
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// 2. Exchange Public Token (after user connects bank)
router.post('/exchange_public_token', verifyJWT, validate(exchangePublicTokenSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { publicToken } = req.body;
    
    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get institution info
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });
    
    const institutionId = itemResponse.data.item.institution_id;
    const instResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US'],
    });
    
    const institutionName = instResponse.data.institution.name;
    
    // Store in Supabase
    const { error } = await supabase.from('plaid_items').insert({
      user_id: userId,
      access_token: accessToken,
      item_id: itemId,
      institution_name: institutionName,
    });
    
    if (error) throw error;
    
    res.json({ success: true, institution: institutionName });
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// 3. Sync Transactions
router.post('/sync_transactions', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user's access tokens
    const { data: items } = await supabase
      .from('plaid_items')
      .select('access_token, id')
      .eq('user_id', userId);
    
    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'No bank accounts connected' });
    }
    
    for (const item of items) {
      // Fetch last 30 days of transactions
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const response = await plaidClient.transactionsGet({
        access_token: item.access_token,
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      });
      
      const accounts = response.data.accounts;
      const transactions = response.data.transactions;
      
      // Store accounts
      for (const account of accounts) {
        await supabase.from('accounts').upsert({
          user_id: userId,
          plaid_account_id: account.account_id,
          account_name: account.name,
          account_type: account.type,
          current_balance: account.balances.current,
          available_balance: account.balances.available,
          last_synced: new Date().toISOString(),
        }, { onConflict: 'plaid_account_id' });
      }
      
      // Store transactions
      for (const tx of transactions) {
        await supabase.from('transactions').upsert({
          user_id: userId,
          plaid_transaction_id: tx.transaction_id,
          date: tx.date,
          merchant_name: tx.merchant_name || tx.name,
          amount: tx.amount,
          category: tx.category?.[0] || 'Other',
          pending: tx.pending,
        }, { onConflict: 'plaid_transaction_id' });
      }
    }
    
    res.json({ success: true, message: 'Transactions synced successfully' });
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// 4. Get User Financial Summary
router.get('/financial_summary', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get accounts
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    
    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });
    
    // Calculate metrics
    const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.current_balance || 0), 0) || 0;
    const totalSpent = transactions?.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0) || 0;
    const totalIncome = transactions?.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    
    res.json({
      accounts,
      transactions,
      summary: {
        totalBalance,
        totalSpent,
        totalIncome,
        savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalSpent) / totalIncome) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
});

// 5. Get Investment Holdings (for Level 5+)
router.get('/investments', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data: items } = await supabase
      .from('plaid_items')
      .select('access_token')
      .eq('user_id', userId);
    
    if (!items || items.length === 0) {
      return res.json({ holdings: [], accounts: [] });
    }
    
    const allHoldings = [];
    const allAccounts = [];
    
    for (const item of items) {
      try {
        const response = await plaidClient.investmentsHoldingsGet({
          access_token: item.access_token,
        });
        
        allHoldings.push(...response.data.holdings);
        allAccounts.push(...response.data.accounts);
      } catch (error) {
        console.log('No investment data for this account');
      }
    }
    
    // Calculate total investment value
    const totalValue = allAccounts.reduce((sum, acc) => sum + (acc.balances.current || 0), 0);
    
    res.json({ 
      holdings: allHoldings,
      accounts: allAccounts,
      totalValue 
    });
  } catch (error) {
    console.error('Failed to fetch investments:', error);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// 6. Get Liabilities (for Level 4+)
router.get('/liabilities', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data: items } = await supabase
      .from('plaid_items')
      .select('access_token')
      .eq('user_id', userId);
    
    if (!items || items.length === 0) {
      return res.json({ credit: [], student: [], mortgage: [] });
    }
    
    const allLiabilities = {
      credit: [],
      student: [],
      mortgage: []
    };
    
    for (const item of items) {
      try {
        const response = await plaidClient.liabilitiesGet({
          access_token: item.access_token,
        });
        
        const liabilities = response.data.liabilities;
        
        if (liabilities.credit) allLiabilities.credit.push(...liabilities.credit);
        if (liabilities.student) allLiabilities.student.push(...liabilities.student);
        if (liabilities.mortgage) allLiabilities.mortgage.push(...liabilities.mortgage);
      } catch (error) {
        console.log('No liability data for this account');
      }
    }
    
    // Calculate total debt
    const totalCreditDebt = allLiabilities.credit.reduce((sum, cc) => sum + (cc.balances?.current || 0), 0);
    const totalStudentDebt = allLiabilities.student.reduce((sum, loan) => sum + (loan.balances?.current || 0), 0);
    const totalMortgageDebt = allLiabilities.mortgage.reduce((sum, mtg) => sum + (mtg.balances?.current || 0), 0);
    
    res.json({
      ...allLiabilities,
      totals: {
        credit: totalCreditDebt,
        student: totalStudentDebt,
        mortgage: totalMortgageDebt,
        overall: totalCreditDebt + totalStudentDebt + totalMortgageDebt
      }
    });
  } catch (error) {
    console.error('Failed to fetch liabilities:', error);
    res.status(500).json({ error: 'Failed to fetch liabilities' });
  }
});

// 7. Get Spending by Category (for calendar insights)
router.get('/spending_by_category', verifyJWT, validateQuery(spendingByCategoryQuerySchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gt('amount', 0); // Only expenses (positive amounts)
    
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);
    
    const { data: transactions } = await query;
    
    // Group by category
    const byCategory = {};
    transactions?.forEach(tx => {
      const category = tx.category || 'Other';
      if (!byCategory[category]) {
        byCategory[category] = { total: 0, count: 0, transactions: [] };
      }
      byCategory[category].total += tx.amount;
      byCategory[category].count += 1;
      byCategory[category].transactions.push(tx);
    });
    
    res.json({ byCategory });
  } catch (error) {
    console.error('Failed to fetch spending by category:', error);
    res.status(500).json({ error: 'Failed to fetch spending data' });
  }
});

// ========== NEW ROUTES FOR ENHANCED FEATURES ==========

// 8. Save User Budget
router.post('/budget/save', verifyJWT, validate(saveBudgetSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { budget, approved } = req.body;
    
    const { error } = await supabase
      .from('user_budgets')
      .upsert({
        user_id: userId,
        budget_breakdown: budget,
        approved: approved,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    
    if (error) throw error;
    
    console.log(`✅ Budget saved for user ${userId}`);
    res.json({ success: true, message: 'Budget saved successfully' });
  } catch (error) {
    console.error('Failed to save budget:', error);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// 9. Get User's Approved Budget
router.get('/budget', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data: budget } = await supabase
      .from('user_budgets')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    res.json({ budget });
  } catch (error) {
    console.error('Failed to fetch budget:', error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// 10. Get Transactions for Specific Day
router.get('/transactions/day/:date', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.params;
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('amount', { ascending: false });
    
    // Categorize transactions
    const spending = transactions?.filter(tx => tx.amount > 0) || [];
    const income = transactions?.filter(tx => tx.amount < 0) || [];
    
    // Calculate totals
    const totalSpent = spending.reduce((sum, tx) => sum + tx.amount, 0);
    const totalIncome = income.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    // Identify savings/transfers
    const savings = transactions?.filter(tx => 
      tx.category?.toLowerCase().includes('transfer') && tx.amount < 0
    ) || [];
    
    // Identify bills paid
    const bills = transactions?.filter(tx =>
      ['Bills', 'Utilities', 'Phone', 'Internet', 'Insurance'].some(cat => 
        tx.category?.includes(cat)
      )
    ) || [];
    
    res.json({
      spending,
      income,
      savings,
      bills,
      summary: {
        totalSpent,
        totalIncome,
        totalSaved: savings.reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
        netChange: totalIncome - totalSpent
      }
    });
  } catch (error) {
    console.error('Failed to fetch day transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 11. Track Action Completion
router.post('/actions/complete', verifyJWT, validate(completeActionSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { actionId, actionType, points } = req.body;
    
    // Record completion in user_actions table
    const { error: actionError } = await supabase
      .from('user_actions')
      .upsert({
        user_id: userId,
        action_id: actionId,
        completed: true,
        completed_at: new Date().toISOString(),
        points: points || 1
      }, { onConflict: 'action_id,user_id' });
    
    if (actionError) throw actionError;
    
    // Update user's total points in financial_profiles
    const { data: profile } = await supabase
      .from('financial_profiles')
      .select('action_points_earned')
      .eq('user_id', userId)
      .single();
    
    const newTotal = (profile?.action_points_earned || 0) + (points || 1);
    
    const { error: updateError } = await supabase
      .from('financial_profiles')
      .update({
        action_points_earned: newTotal,
        last_calculated: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    console.log(`✅ Action ${actionId} completed by user ${userId}. Total points: ${newTotal}`);
    res.json({ 
      success: true, 
      newTotal,
      pointsEarned: points || 1
    });
  } catch (error) {
    console.error('Failed to track action:', error);
    res.status(500).json({ error: 'Failed to track action completion' });
  }
});

// 12. Get User's Completed Actions
router.get('/actions/completed', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data: actions } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false });
    
    res.json({ actions });
  } catch (error) {
    console.error('Failed to fetch completed actions:', error);
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

// 13. Check Investment Account Status
router.get('/investments/check', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data: items } = await supabase
      .from('plaid_items')
      .select('access_token')
      .eq('user_id', userId);
    
    if (!items || items.length === 0) {
      return res.json({ 
        hasInvestmentAccount: false,
        accounts: []
      });
    }
    
    const investmentAccounts = [];
    
    for (const item of items) {
      try {
        const response = await plaidClient.investmentsHoldingsGet({
          access_token: item.access_token,
        });
        
        if (response.data.accounts.length > 0) {
          investmentAccounts.push(...response.data.accounts);
        }
      } catch (error) {
        console.log('No investment data for this item');
      }
    }
    
    res.json({ 
      hasInvestmentAccount: investmentAccounts.length > 0,
      accounts: investmentAccounts,
      count: investmentAccounts.length
    });
  } catch (error) {
    console.error('Failed to check investments:', error);
    res.status(500).json({ error: 'Failed to check investment status' });
  }
});

// 14. Get Budget vs Actual Spending (for calendar insights)
router.get('/budget/vs-actual', verifyJWT, validateQuery(budgetVsActualQuerySchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    
    // Get user's approved budget
    const { data: budget } = await supabase
      .from('user_budgets')
      .select('budget_breakdown')
      .eq('user_id', userId)
      .eq('approved', true)
      .single();
    
    if (!budget) {
      return res.json({ 
        error: 'No approved budget found',
        hasBudget: false
      });
    }
    
    // Get transactions in date range
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);
    
    const { data: transactions } = await query;
    
    // Calculate actual spending by category
    const actualSpending = {};
    transactions?.forEach(tx => {
      const category = tx.category || 'Other';
      actualSpending[category] = (actualSpending[category] || 0) + tx.amount;
    });
    
    res.json({
      hasBudget: true,
      budget: budget.budget_breakdown,
      actual: actualSpending,
      transactions: transactions?.length || 0
    });
  } catch (error) {
    console.error('Failed to compare budget vs actual:', error);
    res.status(500).json({ error: 'Failed to fetch budget comparison' });
  }
});

// 15. Record Education Module Viewed
router.post('/education/viewed', verifyJWT, validate(educationViewedSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { moduleId, moduleTitle, completed } = req.body;
    
    const { error } = await supabase
      .from('education_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        module_title: moduleTitle,
        viewed_at: new Date().toISOString(),
        completed: completed || false
      }, { onConflict: 'user_id,module_id' });
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to record education progress:', error);
    res.status(500).json({ error: 'Failed to record education progress' });
  }
});

// AI-POWERED API ROUTES
// Add these to your plaidRoutes.js file (at the bottom, before module.exports)

// ========== AI-POWERED ENDPOINTS ==========

// 16. Generate AI-Powered Personalized Budget
router.post('/ai/generate_budget', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    console.log(`🤖 Generating AI budget for user: ${userId}`);
    
    // Get user's transaction data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
    
    // Get accounts
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    
    // Get profile
    const { data: profile } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Analyze spending by category
    const spending = {};
    transactions?.forEach(tx => {
      if (tx.amount > 0) {
        const cat = tx.category || 'Other';
        spending[cat] = (spending[cat] || 0) + tx.amount;
      }
    });
    
    const checking = accounts?.find(a => a.account_type === 'depository')?.current_balance || 0;
    const savings = accounts?.filter(a => a.account_name?.toLowerCase().includes('savings'))
      .reduce((sum, a) => sum + a.current_balance, 0) || 0;
    
    // Prepare data for AI
    const userData = {
      monthlyIncome: profile?.monthly_income || 3800,
      currentLevel: profile?.current_level || 2,
      spending,
      checking,
      savings,
      creditCardDebt: 0, // TODO: Get from liabilities
      emergencyFundMonths: profile?.emergency_fund_months || 0,
      age: 23, // TODO: Add to user profile
      location: 'Dallas, TX' // TODO: Add to user profile
    };
    
    // Call AI service
    const aiBudget = await aiService.generatePersonalizedBudget(userData);
    
    // Save AI-generated budget
    await supabase
      .from('user_budgets')
      .upsert({
        user_id: userId,
        budget_breakdown: aiBudget.budget,
        approved: false,
        ai_generated: true,
        ai_reasoning: aiBudget.reasoning,
        ai_recommendations: aiBudget.recommendations,
        ai_savings_target: aiBudget.monthlySavingsTarget,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    
    console.log('✅ AI budget generated and saved');
    
    res.json({
      success: true,
      budget: aiBudget
    });
  } catch (error) {
    console.error('❌ AI budget generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI budget',
      message: error.message 
    });
  }
});

// 17. Calculate AI-Powered User Level
router.post('/ai/calculate_level', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    console.log(`🤖 Calculating AI level for user: ${userId}`);
    
    // Get accounts
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    
    // Get transactions (last 60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sixtyDaysAgo.toISOString().split('T')[0]);
    
    // Calculate metrics
    const checking = accounts?.find(a => a.account_type === 'depository')?.current_balance || 0;
    const savings = accounts?.filter(a => a.account_name?.toLowerCase().includes('savings'))
      .reduce((sum, a) => sum + a.current_balance, 0) || 0;
    
    const income = transactions?.filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    const expenses = transactions?.filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0) || 0;
    
    const monthlyIncome = income / 2; // 2 months of data
    const monthlyExpenses = expenses / 2;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    const emergencyFundMonths = monthlyExpenses > 0 ? savings / monthlyExpenses : 0;
    
    // Prepare data for AI
    const userData = {
      monthlyIncome,
      checking,
      savings,
      investments: 0, // TODO: Get from investments endpoint
      creditCardDebt: 0, // TODO: Get from liabilities
      creditCardAPR: 18,
      studentLoans: 0,
      emergencyFundMonths,
      savingsRate,
      incomeType: 'W-2 Employee'
    };
    
    // Call AI service
    const aiLevel = await aiService.calculateUserLevel(userData);
    
    // Update profile with AI results
    await supabase
      .from('financial_profiles')
      .update({
        current_level: aiLevel.recommendedLevel,
        monthly_income: monthlyIncome,
        emergency_fund_months: emergencyFundMonths,
        savings_rate: Math.round(savingsRate),
        ai_level_reasoning: aiLevel.reasoning,
        ai_next_milestone: aiLevel.nextMilestone,
        ai_action_plan: aiLevel.actionPlan,
        ai_time_to_next_level: aiLevel.timeToNextLevel,
        last_calculated: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    console.log(`✅ AI level: ${aiLevel.recommendedLevel} (${aiLevel.confidence}% confidence)`);
    
    res.json({
      success: true,
      level: aiLevel
    });
  } catch (error) {
    console.error('❌ AI level calculation failed:', error);
    res.status(500).json({ 
      error: 'Failed to calculate AI level',
      message: error.message 
    });
  }
});

// 18. Get Weekly AI Insights
router.get('/ai/weekly_insights', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get last 7 days transactions
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0]);
    
    // Get budget
    const { data: budget } = await supabase
      .from('user_budgets')
      .select('budget_breakdown')
      .eq('user_id', userId)
      .single();
    
    // Calculate week metrics
    const spent = transactions?.filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0) || 0;
    const saved = transactions?.filter(tx => tx.amount < 0 && tx.category?.includes('Transfer'))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    
    // Top spending categories
    const topCategories = {};
    transactions?.filter(tx => tx.amount > 0).forEach(tx => {
      const cat = tx.category || 'Other';
      topCategories[cat] = (topCategories[cat] || 0) + tx.amount;
    });
    
    const weeklyBudget = Object.values(budget?.budget_breakdown || {})
      .reduce((sum, cat) => sum + (cat.amount || 0), 0) / 4;
    
    const weekData = {
      spent,
      saved,
      budget: weeklyBudget,
      topCategories,
      notable: spent > weeklyBudget ? 'Over budget' : 'On track'
    };
    
    // Call AI service
    const insights = await aiService.generateWeeklyInsights(weekData);
    
    res.json({
      success: true,
      insights: insights.insights || []
    });
  } catch (error) {
    console.error('❌ Weekly insights failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      message: error.message 
    });
  }
});

// 19. Test AI Service
router.post('/ai/test', verifyJWT, async (req, res) => {
  try {
    console.log('🧪 Testing AI service...');
    
    const testData = {
      monthlyIncome: 3800,
      currentLevel: 2,
      spending: {
        'Restaurants': 450,
        'Groceries': 320,
        'Transportation': 250,
        'Entertainment': 180
      },
      checking: 2340,
      savings: 1800,
      creditCardDebt: 0,
      emergencyFundMonths: 0.5,
      age: 23,
      location: 'Dallas, TX'
    };
    
    const result = await aiService.generatePersonalizedBudget(testData);
    
    res.json({
      success: true,
      message: '✅ AI service is working!',
      testResult: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ AI service test failed',
      error: error.message,
      hint: 'Check that OPENAI_API_KEY is set in .env'
    });
  }
});

// NOTE: Add these routes BEFORE this line:
// module.exports = router;

// 20. Submit Quiz & Check Level Completion
router.post('/quiz/submit', verifyJWT, validate(quizSubmitSchema), async (req, res) => {
  try {
    const userId = req.userId;
    const { level, score, totalQuestions, timeTaken } = req.body;
    
    const passed = (score / totalQuestions) >= 0.8; // 80% to pass
    
    // Get attempt number
    const { data: prevAttempts } = await supabase
      .from('quiz_attempts')
      .select('attempt_number')
      .eq('user_id', userId)
      .eq('level', level)
      .order('attempt_number', { ascending: false })
      .limit(1);
    
    const attemptNumber = prevAttempts?.[0]?.attempt_number + 1 || 1;
    
    // Record attempt
    await supabase.from('quiz_attempts').insert({
      user_id: userId,
      level: level,
      score: score,
      total_questions: totalQuestions,
      passed: passed,
      attempt_number: attemptNumber,
      time_taken_seconds: timeTaken
    });
    
    // If passed, check if level is complete
    if (passed) {
      const { data: completion } = await supabase
        .from('level_completion')
        .select('*')
        .eq('user_id', userId)
        .eq('level', level)
        .single();
      
      // Check if all actions are done
      const allActionsDone = completion?.actions_completed >= completion?.actions_required;
      
      if (allActionsDone) {
        // Mark level complete!
        await supabase
          .from('level_completion')
          .update({
            completed_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('level', level);
        
        // Update current level in profile
        await supabase
          .from('financial_profiles')
          .update({
            current_level: level + 1
          })
          .eq('user_id', userId);
        
        console.log(`✅ User ${userId} completed Level ${level}!`);
      }
    }
    
    res.json({
      success: true,
      passed: passed,
      score: score,
      totalQuestions: totalQuestions,
      attemptNumber: attemptNumber,
      message: passed ? 'Great job! 🎉' : 'Not quite - review the material and try again!'
    });
  } catch (error) {
    console.error('Quiz submission failed:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// 21. Get User's Level Progress
router.get('/progress', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    
    const { data: profile } = await supabase
      .from('financial_profiles')
      .select('current_level')
      .eq('user_id', userId)
      .single();
    
    const { data: completions } = await supabase
      .from('level_completion')
      .select('*')
      .eq('user_id', userId)
      .order('level', { ascending: true });
    
    res.json({
      currentLevel: profile?.current_level || 1,
      levelCompletions: completions || []
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// ========== SPENDING INSIGHTS (biweekly needs/wants review) ==========

router.post('/insights/save', verifyJWT, validate(insightsSaveSchema), async (req, res) => {
  try {
    const { periodStart, periodEnd, needsTotal, wantsTotal, needsPct, wantsPct, topWantCategories } = req.body;

    const systemPrompt = `You are a supportive Gen Z financial coach. Write 1-2 encouraging but honest sentences summarizing this user's biweekly spending review. Be specific to the numbers. Don't be preachy. End with one actionable tip for next period.`;
    const userPrompt = `Needs: ${needsPct}% ($${(needsTotal||0).toFixed(2)}), Wants: ${wantsPct}% ($${(wantsTotal||0).toFixed(2)}). Top want categories: ${JSON.stringify(topWantCategories || [])}.`;

    let insightSummary = '';
    try {
      const aiResp = await aiService.callGPT(systemPrompt, userPrompt, 0.7);
      insightSummary = aiResp.choices[0].message.content;
    } catch (e) {
      insightSummary = `This period: ${needsPct}% needs, ${wantsPct}% wants.`;
    }

    const { error } = await supabase.from('spending_insights').insert({
      user_id: req.userId,
      period_start: periodStart,
      period_end: periodEnd,
      needs_total: needsTotal,
      wants_total: wantsTotal,
      needs_pct: needsPct,
      wants_pct: wantsPct,
      top_want_categories: topWantCategories || [],
      insight_summary: insightSummary
    });
    if (error) throw error;
    res.json({ success: true, summary: insightSummary });
  } catch (err) {
    console.error('insights/save error:', err);
    res.status(500).json({ error: 'Failed to save insights', details: err.message });
  }
});

router.get('/insights/latest/:userId', verifyJWT, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('spending_insights')
      .select('period_start, period_end, needs_pct, wants_pct, insight_summary')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    res.json({ insights: data || [] });
  } catch (err) {
    console.error('insights/latest error:', err);
    res.status(500).json({ error: 'Failed to fetch insights', details: err.message });
  }
});

// ─── Day Review ────────────────────────────────────────────────────────────────
// POST /api/plaid/analyze_day
router.post('/analyze_day', verifyJWT, validate(analyzeDaySchema), async (req, res) => {
  try {
    const { date, transactions = [], totals = {}, dailyBudget } = req.body;
    const needsTotal = totals.needs || 0;
    const wantsTotal = totals.wants || 0;
    const untaggedTotal = totals.untagged || 0;
    const totalSpent = needsTotal + wantsTotal + untaggedTotal;

    const txLines = transactions.map(tx =>
      `- ${tx.merchant || 'Unknown'}: $${(tx.amount || 0).toFixed(2)} [${tx.tag || 'untagged'}${tx.category ? ', ' + tx.category : ''}]`
    ).join('\n');

    const budgetLine = dailyBudget ? `Daily budget: $${dailyBudget.toFixed(2)}.` : '';
    const wantsPct = totalSpent > 0 ? Math.round((wantsTotal / totalSpent) * 100) : 0;

    const needsPct = totalSpent > 0 ? Math.round((needsTotal / totalSpent) * 100) : 0;
    const wantsPctVal = totalSpent > 0 ? Math.round((wantsTotal / totalSpent) * 100) : 0;

    // Category totals from tagged transactions
    const catMap = {};
    transactions.forEach(tx => {
      if (tx.category && tx.category !== 'uncategorized') {
        catMap[tx.category] = (catMap[tx.category] || 0) + (tx.amount || 0);
      }
    });
    const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const catSummary = topCats.map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`).join(', ');

    const systemPrompt = `You are Migo, a Gen Z financial coach. Analyze the user's spending day and give clear, actionable insights. Be warm and specific — reference their actual numbers and categories.
Reply ONLY with valid JSON:
{
  "headline": "punchy 1-line verdict on their day (e.g. 'Smart split — 60% needs, 40% wants')",
  "insight": "2-3 sentences: what their spending pattern reveals, which category stands out, and WHY it matters for their financial health",
  "tip": "1 specific, concrete action they can take tomorrow to improve (mention a real category or amount from their data)",
  "categoryNote": "1 sentence highlighting the biggest or most interesting category and whether it looks healthy"
}`;

    const userPrompt = `Date: ${date}
${budgetLine}
Transactions:\n${txLines || 'No transactions tagged.'}
Totals — Needs: $${needsTotal.toFixed(2)} (${needsPct}%), Wants: $${wantsTotal.toFixed(2)} (${wantsPctVal}%), Untagged: $${untaggedTotal.toFixed(2)}
Top categories: ${catSummary || 'none categorized yet'}
Total spent: $${totalSpent.toFixed(2)}`;

    const response = await aiService.callGPT(systemPrompt, userPrompt, 0.7);
    const content = response.choices[0].message.content.trim();
    const result = JSON.parse(content);
    res.json(result);
  } catch (err) {
    console.error('analyze_day error:', err);
    res.json({
      headline: 'Here is a look at your day.',
      insight: 'Tag more transactions as Needs or Wants to unlock a full breakdown of your spending habits.',
      tip: 'Try categorizing at least 3 transactions — even a few tags reveal useful patterns.',
      categoryNote: 'Keep going with categories to see where your money is really going.'
    });
  }
});

module.exports = router;

