// ===================================
// AI Level Placement Logic (Backend)
// Add to: server.js or create new file: aiPlacementService.js
// ===================================

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyzes diagnostic answers + Plaid financial data to determine optimal starting level
 * @param {Object} diagnosticAnswers - User's 6 diagnostic question responses
 * @param {Object} plaidData - Financial data from Plaid
 * @param {String} userId - User ID for tracking
 * @returns {Object} Placement recommendation with reasoning
 */
async function determineUserLevel(diagnosticAnswers, plaidData, userId) {
  
  // Step 1: Analyze Plaid Financial Data
  const financialProfile = analyzePlaidData(plaidData);
  
  // Step 2: Prepare context for AI
  const systemPrompt = `You are a financial literacy placement advisor for Migo, a Gen Z financial literacy app.

Your job is to analyze a user's self-reported knowledge (diagnostic) and their ACTUAL financial situation (bank data) to recommend which level they should start at.

LEVEL SYSTEM:
Level 1: Building Foundation 🏗️
- For: Complete beginners, living paycheck-to-paycheck
- Goals: Track spending, first budget, $500-1k emergency fund
- Graduation: 1 month emergency fund + spending < income

Level 2: Building Safety 🛡️  
- For: Has basic habits, building real security
- Prerequisites: ✅ 1 month emergency fund
- Goals: 3-6 month emergency fund, HYSA, side hustles
- Graduation: 3-6 month fund + 15% savings rate + no high-interest debt

Level 3: Crushing Debt ⚔️
- For: Has emergency fund, needs to eliminate debt
- Prerequisites: ✅ 3+ month emergency fund
- Goals: Eliminate ALL debt >6% APR
- Graduation: NO debt above 6% APR
- NOTE: Can SKIP if no debt >6% → Go to Level 4

Level 4: Tax-Advantaged Accounts 🧠
- For: Debt-free (or only low-interest), ready to invest
- Prerequisites: ✅ 3-6 month fund + no high-interest debt
- Goals: 401k match, Roth IRA, 15% to retirement
- Graduation: Contributing 15% + maxing Roth OR 401k match

Level 5: Growing Wealth 📈
- For: Maxing retirement accounts, optimizing returns
- Prerequisites: ✅ Maxing Roth + getting 401k match + 6+ month fund
- Goals: Max ALL tax space ($34k+), taxable brokerage, real estate
- Graduation: $100k net worth OR 25%+ investing

Level 6: Financially Free 🏆
- For: High net worth, multiple income streams
- Prerequisites: ✅ $250k+ net worth + multiple income streams
- Goals: Passive income, estate planning, mentoring
- Graduation: Already financially free

PLACEMENT RULES:
1. ALWAYS prioritize actual financial situation over self-reported knowledge
2. If someone says they know investing but has no emergency fund → Level 1
3. If someone has 6 months saved but high-interest debt → Level 3
4. If someone has emergency fund + NO debt >6% → Level 4 (SKIP Level 3)
5. Never skip Level 1 or 2 - foundations are critical
6. Be encouraging but honest

Respond in JSON:
{
  "recommendedLevel": 1-6,
  "reasoning": "2-3 sentences explaining why",
  "canSkipLevel3": true/false,
  "nextSteps": "What they should focus on first"
}`;

  const userPrompt = `DIAGNOSTIC ANSWERS:
${formatDiagnosticAnswers(diagnosticAnswers)}

ACTUAL FINANCIAL SITUATION:
${formatFinancialProfile(financialProfile)}

Based on this data, where should this user start?`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const placement = JSON.parse(response.choices[0].message.content);
    
    // Log placement decision
    await logPlacementDecision(userId, diagnosticAnswers, financialProfile, placement);
    
    return {
      ...placement,
      financialProfile, // Include for frontend display
      diagnosticAnswers // Include for reference
    };
    
  } catch (error) {
    console.error('AI Placement Error:', error);
    
    // Fallback to rule-based placement
    return fallbackPlacement(financialProfile, diagnosticAnswers);
  }
}

/**
 * Analyzes Plaid data to create financial profile
 */
function analyzePlaidData(plaidData) {
  const profile = {
    // Emergency Fund Analysis
    totalSavings: plaidData.savings || 0,
    monthlyExpenses: plaidData.monthlyExpenses || 0,
    emergencyFundMonths: plaidData.savings / (plaidData.monthlyExpenses || 1),
    hasStarterFund: plaidData.savings >= 500,
    has3MonthFund: plaidData.savings >= (plaidData.monthlyExpenses * 3),
    has6MonthFund: plaidData.savings >= (plaidData.monthlyExpenses * 6),
    
    // Income Analysis
    monthlyIncome: plaidData.monthlyIncome || 0,
    incomeStability: calculateIncomeStability(plaidData.incomeHistory),
    isLivingPaycheckToPaycheck: plaidData.checking < (plaidData.monthlyExpenses * 0.5),
    
    // Debt Analysis
    totalDebt: calculateTotalDebt(plaidData.debts),
    highInterestDebt: plaidData.debts?.filter(d => d.apr > 6) || [],
    hasHighInterestDebt: plaidData.debts?.some(d => d.apr > 6) || false,
    creditCardDebt: plaidData.debts?.filter(d => d.type === 'credit_card').reduce((sum, d) => sum + d.balance, 0) || 0,
    
    // Savings Behavior
    monthlySavings: plaidData.monthlySavings || 0,
    savingsRate: ((plaidData.monthlySavings || 0) / (plaidData.monthlyIncome || 1)) * 100,
    hasAutoSave: plaidData.recurringTransfers?.some(t => t.toAccount === 'savings') || false,
    
    // Investment Analysis  
    hasRetirementAccount: plaidData.accounts?.some(a => ['401k', 'ira', 'roth_ira'].includes(a.subtype)) || false,
    has401k: plaidData.accounts?.some(a => a.subtype === '401k') || false,
    hasIRA: plaidData.accounts?.some(a => ['ira', 'roth_ira'].includes(a.subtype)) || false,
    hasTaxableInvestments: plaidData.accounts?.some(a => a.subtype === 'brokerage') || false,
    totalInvestments: plaidData.accounts?.filter(a => ['401k', 'ira', 'roth_ira', 'brokerage'].includes(a.subtype)).reduce((sum, a) => sum + a.balance, 0) || 0,
    
    // Net Worth
    netWorth: calculateNetWorth(plaidData),
    
    // Risk Flags
    recentOverdrafts: plaidData.overdrafts?.filter(o => isRecent(o.date, 90)).length || 0,
    recentNSFFees: plaidData.fees?.filter(f => f.type === 'nsf' && isRecent(f.date, 90)).length || 0
  };
  
  return profile;
}

/**
 * Calculate income stability (0-1 score)
 */
function calculateIncomeStability(incomeHistory) {
  if (!incomeHistory || incomeHistory.length < 3) return 0.5;
  
  const amounts = incomeHistory.map(i => i.amount);
  const mean = amounts.reduce((a, b) => a + b) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  // Low CV = high stability
  return Math.max(0, Math.min(1, 1 - coefficientOfVariation));
}

/**
 * Calculate total debt
 */
function calculateTotalDebt(debts) {
  if (!debts || debts.length === 0) return 0;
  return debts.reduce((sum, d) => sum + d.balance, 0);
}

/**
 * Calculate net worth
 */
function calculateNetWorth(plaidData) {
  const assets = (plaidData.checking || 0) + 
                 (plaidData.savings || 0) + 
                 (plaidData.accounts?.filter(a => ['401k', 'ira', 'roth_ira', 'brokerage'].includes(a.subtype)).reduce((sum, a) => sum + a.balance, 0) || 0);
  
  const liabilities = calculateTotalDebt(plaidData.debts);
  
  return assets - liabilities;
}

/**
 * Check if date is within X days
 */
function isRecent(date, days) {
  const dateObj = new Date(date);
  const now = new Date();
  const diffDays = (now - dateObj) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

/**
 * Format diagnostic answers for AI
 */
function formatDiagnosticAnswers(answers) {
  const questions = {
    1: "Financial confidence",
    2: "Income predictability",
    3: "Automation comfort",
    4: "Tracking habits",
    5: "Biggest financial goal",
    6: "Investment knowledge"
  };
  
  let formatted = '';
  for (const [qId, answer] of Object.entries(answers)) {
    formatted += `${questions[qId]}: ${answer.label} (score: ${answer.score}/5)\n`;
  }
  return formatted;
}

/**
 * Format financial profile for AI
 */
function formatFinancialProfile(profile) {
  return `
Emergency Fund: $${profile.totalSavings.toLocaleString()} (${profile.emergencyFundMonths.toFixed(1)} months)
- Has starter fund ($500+): ${profile.hasStarterFund ? 'YES ✓' : 'NO ✗'}
- Has 3-month fund: ${profile.has3MonthFund ? 'YES ✓' : 'NO ✗'}
- Has 6-month fund: ${profile.has6MonthFund ? 'YES ✓' : 'NO ✗'}

Income: $${profile.monthlyIncome.toLocaleString()}/month
- Income stability: ${(profile.incomeStability * 100).toFixed(0)}%
- Living paycheck-to-paycheck: ${profile.isLivingPaycheckToPaycheck ? 'YES (RED FLAG)' : 'NO'}

Debt: $${profile.totalDebt.toLocaleString()} total
- High-interest debt (>6%): ${profile.hasHighInterestDebt ? `YES - $${profile.highInterestDebt.reduce((sum, d) => sum + d.balance, 0).toLocaleString()}` : 'NO ✓'}
- Credit card debt: $${profile.creditCardDebt.toLocaleString()}

Savings Behavior:
- Saving: $${profile.monthlySavings.toLocaleString()}/month (${profile.savingsRate.toFixed(1)}% of income)
- Auto-save enabled: ${profile.hasAutoSave ? 'YES ✓' : 'NO'}

Investments:
- Has retirement account: ${profile.hasRetirementAccount ? 'YES ✓' : 'NO'}
- Has 401(k): ${profile.has401k ? 'YES ✓' : 'NO'}
- Has IRA/Roth: ${profile.hasIRA ? 'YES ✓' : 'NO'}
- Total invested: $${profile.totalInvestments.toLocaleString()}

Net Worth: $${profile.netWorth.toLocaleString()}

Red Flags:
- Recent overdrafts (90 days): ${profile.recentOverdrafts}
- Recent NSF fees (90 days): ${profile.recentNSFFees}
`.trim();
}

/**
 * Fallback rule-based placement if AI fails
 */
function fallbackPlacement(financialProfile, diagnosticAnswers) {
  let level = 1;
  let reasoning = '';
  let canSkipLevel3 = false;
  
  // Level 1: No emergency fund or living paycheck-to-paycheck
  if (!financialProfile.hasStarterFund || financialProfile.isLivingPaycheckToPaycheck) {
    level = 1;
    reasoning = "You need to build a foundation first. Let's start with tracking spending and saving your first $500-1,000.";
  }
  // Level 2: Has starter fund but not 3 months
  else if (financialProfile.hasStarterFund && !financialProfile.has3MonthFund) {
    level = 2;
    reasoning = "Great start! Now let's build that 3-6 month emergency fund and explore income growth opportunities.";
  }
  // Level 3: Has 3 months but high-interest debt
  else if (financialProfile.has3MonthFund && financialProfile.hasHighInterestDebt) {
    level = 3;
    reasoning = "You have a solid emergency fund! Now let's crush that high-interest debt before investing.";
  }
  // Skip to Level 4: Has emergency fund + NO high-interest debt
  else if (financialProfile.has3MonthFund && !financialProfile.hasHighInterestDebt && !financialProfile.hasRetirementAccount) {
    level = 4;
    canSkipLevel3 = true;
    reasoning = "Perfect! You have an emergency fund and no high-interest debt. Let's skip Level 3 and start investing.";
  }
  // Level 5: Already investing, has 6+ months
  else if (financialProfile.hasRetirementAccount && financialProfile.has6MonthFund && financialProfile.savingsRate >= 15) {
    level = 5;
    reasoning = "You're already investing consistently. Let's optimize your strategy and explore real estate.";
  }
  // Level 6: High net worth
  else if (financialProfile.netWorth >= 250000) {
    level = 6;
    reasoning = "You're financially free! Let's focus on legacy building and mentoring others.";
  }
  // Default to appropriate level based on situation
  else {
    level = 2;
    reasoning = "Let's build a strong safety net with a 3-6 month emergency fund.";
  }
  
  return {
    recommendedLevel: level,
    reasoning,
    canSkipLevel3,
    nextSteps: getNextSteps(level),
    financialProfile,
    diagnosticAnswers
  };
}

/**
 * Get next steps for each level
 */
function getNextSteps(level) {
  const steps = {
    1: "Set up separate checking/savings accounts and start tracking every dollar you spend.",
    2: "Open a High-Yield Savings Account (HYSA) and automate $300-500/month to your emergency fund.",
    3: "List all your debts, choose avalanche or snowball method, and attack high-interest debt first.",
    4: "Contribute to your 401(k) to get the full employer match, then open a Roth IRA.",
    5: "Max out your 401(k) ($23k), Roth IRA ($7k), and HSA ($4.3k). Start taxable investing.",
    6: "Focus on passive income streams, estate planning, and helping others achieve financial freedom."
  };
  return steps[level] || steps[1];
}

/**
 * Log placement decision for analytics
 */
async function logPlacementDecision(userId, diagnosticAnswers, financialProfile, placement) {
  try {
    await supabase
      .from('user_placements')
      .insert({
        user_id: userId,
        diagnostic_answers: diagnosticAnswers,
        financial_profile: financialProfile,
        recommended_level: placement.recommendedLevel,
        reasoning: placement.reasoning,
        can_skip_level_3: placement.canSkipLevel3,
        created_at: new Date()
      });
  } catch (error) {
    console.error('Error logging placement:', error);
  }
}

// ===================================
// Express Route
// ===================================

app.post('/api/ai/level-placement', async (req, res) => {
  try {
    const { userId, diagnosticAnswers } = req.body;
    
    // Fetch Plaid data for this user
    const plaidData = await fetchUserPlaidData(userId);
    
    // Get AI placement recommendation
    const placement = await determineUserLevel(diagnosticAnswers, plaidData, userId);
    
    // Update user record
    await supabase
      .from('users')
      .update({
        current_level: placement.recommendedLevel,
        diagnostic_completed: true,
        updated_at: new Date()
      })
      .eq('id', userId);
    
    res.json(placement);
    
  } catch (error) {
    console.error('Placement error:', error);
    res.status(500).json({ error: 'Failed to determine level placement' });
  }
});

/**
 * Helper: Fetch user's Plaid data
 */
async function fetchUserPlaidData(userId) {
  // Get user's Plaid access token
  const { data: user } = await supabase
    .from('users')
    .select('plaid_access_token')
    .eq('id', userId)
    .single();
  
  if (!user || !user.plaid_access_token) {
    throw new Error('No Plaid data available for user');
  }
  
  // Fetch accounts
  const accountsResponse = await plaidClient.accountsGet({
    access_token: user.plaid_access_token
  });
  
  // Fetch transactions (last 90 days)
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const transactionsResponse = await plaidClient.transactionsGet({
    access_token: user.plaid_access_token,
    start_date: startDate,
    end_date: endDate
  });
  
  // Fetch liabilities (debts)
  let liabilities = [];
  try {
    const liabilitiesResponse = await plaidClient.liabilitiesGet({
      access_token: user.plaid_access_token
    });
    liabilities = liabilitiesResponse.data.liabilities;
  } catch (error) {
    console.log('No liabilities data available');
  }
  
  // Process and return structured data
  return processPlaidData(accountsResponse.data, transactionsResponse.data, liabilities);
}

/**
 * Process raw Plaid data into usable format
 */
function processPlaidData(accounts, transactions, liabilities) {
  // Calculate monthly expenses (average last 90 days)
  const expenses = transactions.transactions
    .filter(t => t.amount > 0) // Positive = money out
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = (expenses / 3).toFixed(2); // 90 days = 3 months
  
  // Calculate monthly income (average last 90 days)
  const income = transactions.transactions
    .filter(t => t.amount < 0) // Negative = money in
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthlyIncome = (income / 3).toFixed(2);
  
  // Calculate monthly savings
  const monthlySavings = monthlyIncome - monthlyExpenses;
  
  // Get account balances
  const checking = accounts.accounts
    .filter(a => a.subtype === 'checking')
    .reduce((sum, a) => sum + a.balances.current, 0);
  
  const savings = accounts.accounts
    .filter(a => a.subtype === 'savings')
    .reduce((sum, a) => sum + a.balances.current, 0);
  
  // Process debts
  const debts = [];
  if (liabilities.credit) {
    liabilities.credit.forEach(card => {
      if (card.balances.current > 0) {
        debts.push({
          type: 'credit_card',
          balance: card.balances.current,
          apr: card.aprs?.[0]?.apr_percentage || 18, // Default to 18% if not available
          name: card.name
        });
      }
    });
  }
  
  // Check for overdrafts
  const overdrafts = transactions.transactions
    .filter(t => t.name.toLowerCase().includes('overdraft') || t.name.toLowerCase().includes('nsf'))
    .map(t => ({ date: t.date, amount: t.amount }));
  
  return {
    accounts: accounts.accounts,
    checking,
    savings,
    monthlyIncome: parseFloat(monthlyIncome),
    monthlyExpenses: parseFloat(monthlyExpenses),
    monthlySavings: parseFloat(monthlySavings),
    debts,
    overdrafts,
    incomeHistory: calculateIncomeHistory(transactions.transactions),
    recurringTransfers: findRecurringTransfers(transactions.transactions)
  };
}

/**
 * Calculate income history for stability analysis
 */
function calculateIncomeHistory(transactions) {
  // Group income by month
  const incomeByMonth = {};
  
  transactions
    .filter(t => t.amount < 0) // Income
    .forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!incomeByMonth[month]) {
        incomeByMonth[month] = 0;
      }
      incomeByMonth[month] += Math.abs(t.amount);
    });
  
  return Object.entries(incomeByMonth).map(([month, amount]) => ({ month, amount }));
}

/**
 * Find recurring transfers (auto-save detection)
 */
function findRecurringTransfers(transactions) {
  // Look for transfers that happen regularly
  const transfers = transactions.filter(t => 
    t.name.toLowerCase().includes('transfer') || 
    t.transaction_type === 'transfer'
  );
  
  // Simple recurring detection: 3+ transfers of similar amount
  const recurring = [];
  const amounts = {};
  
  transfers.forEach(t => {
    const rounded = Math.round(t.amount / 10) * 10; // Round to nearest $10
    if (!amounts[rounded]) {
      amounts[rounded] = [];
    }
    amounts[rounded].push(t);
  });
  
  Object.entries(amounts).forEach(([amount, txns]) => {
    if (txns.length >= 3) {
      recurring.push({
        amount: parseFloat(amount),
        frequency: txns.length,
        toAccount: txns[0].account_id
      });
    }
  });
  
  return recurring;
}

module.exports = {
  determineUserLevel,
  analyzePlaidData,
  processPlaidData
};