// cronJobs.js
// Add this file to your migo-backend folder

const cron = require('node-cron');
const supabase = require('../config/supabase');
const {
  sendBudgetAlert,
  sendWeeklySummary,
  sendMonthlyReport,
  sendActionReminder
} = require('../services/notification');

// Helper: Get first day of current month
function getFirstOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('T')[0];
}

// Helper: Get 7 days ago
function getSevenDaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

// Helper: Map Plaid category to budget category
function mapToBudgetCategory(plaidCategory) {
  const categoryMap = {
    'Food and Drink': 'needs',
    'Restaurants': 'wants',
    'Groceries': 'needs',
    'Shopping': 'wants',
    'Entertainment': 'wants',
    'Transportation': 'needs',
    'Travel': 'wants',
    'Bills': 'needs',
    'Transfer': 'savings',
    'Payment': 'debt'
  };
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (plaidCategory?.includes(key)) return value;
  }
  return 'needs'; // Default
}

// DAILY: Check budgets at 6pm
cron.schedule('0 18 * * *', async () => {
  console.log('⏰ Running daily budget check (6pm)...');
  
  try {
    // Get all users with approved budgets
    const { data: budgets } = await supabase
      .from('user_budgets')
      .select('user_id, budget_breakdown')
      .eq('approved', true);
    
    if (!budgets) {
      console.log('No approved budgets found');
      return;
    }
    
    console.log(`Checking budgets for ${budgets.length} users...`);
    
    for (const userBudget of budgets) {
      await checkUserBudget(userBudget.user_id, userBudget.budget_breakdown);
    }
    
    console.log('✅ Daily budget check complete');
  } catch (error) {
    console.error('❌ Daily budget check failed:', error);
  }
});

// Check individual user's budget
async function checkUserBudget(userId, budgetBreakdown) {
  try {
    const startOfMonth = getFirstOfMonth();
    
    // Get this month's transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startOfMonth);
    
    if (!transactions || transactions.length === 0) {
      return; // No transactions yet
    }
    
    // Calculate spending by budget category
    const spending = {
      needs: 0,
      savings: 0,
      wants: 0,
      debt: 0,
      investing: 0
    };
    
    transactions.forEach(tx => {
      if (tx.amount > 0) { // Only count outgoing money
        const category = mapToBudgetCategory(tx.category);
        spending[category] += tx.amount;
      }
    });
    
    // Check each budget category and send alerts
    for (const [category, budgetInfo] of Object.entries(budgetBreakdown)) {
      const spent = spending[category] || 0;
      const budget = budgetInfo.amount;
      const percentUsed = (spent / budget) * 100;
      
      // Check if we should send an alert
      // Only alert at 80%, 90%, 100% thresholds
      if (percentUsed >= 100) {
        await sendBudgetAlertIfNotSent(userId, category, spent, budget, percentUsed, 100);
      } else if (percentUsed >= 90) {
        await sendBudgetAlertIfNotSent(userId, category, spent, budget, percentUsed, 90);
      } else if (percentUsed >= 80) {
        await sendBudgetAlertIfNotSent(userId, category, spent, budget, percentUsed, 80);
      }
    }
  } catch (error) {
    console.error(`Failed to check budget for user ${userId}:`, error);
  }
}

// Send alert only if we haven't sent this threshold before
async function sendBudgetAlertIfNotSent(userId, category, spent, budget, percentUsed, threshold) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const alertKey = `budget_${category}_${threshold}_${today}`;
    
    // Check if already sent today
    const { data: existing } = await supabase
      .from('notification_log')
      .select('id')
      .eq('user_id', userId)
      .eq('notification_key', alertKey)
      .single();
    
    if (existing) {
      return; // Already sent this alert today
    }
    
    // Send the notification
    await sendBudgetAlert(userId, category, spent, budget, percentUsed);
    
    // Log that we sent it
    await supabase.from('notification_log').insert({
      user_id: userId,
      notification_key: alertKey,
      notification_type: 'budget_alert',
      sent_at: new Date().toISOString()
    });
    
    console.log(`✅ Sent ${threshold}% budget alert to user ${userId} for ${category}`);
  } catch (error) {
    console.error('Failed to send budget alert:', error);
  }
}

// WEEKLY: Send weekly summary on Sunday at 8pm
cron.schedule('0 20 * * 0', async () => {
  console.log('⏰ Running weekly summary (Sunday 8pm)...');
  
  try {
    // Get all active users (have approved budget)
    const { data: users } = await supabase
      .from('user_budgets')
      .select('user_id, budget_breakdown')
      .eq('approved', true);
    
    if (!users) return;
    
    for (const user of users) {
      await sendWeeklySummaryToUser(user.user_id, user.budget_breakdown);
    }
    
    console.log('✅ Weekly summaries sent');
  } catch (error) {
    console.error('❌ Weekly summary failed:', error);
  }
});

// Generate and send weekly summary for user
async function sendWeeklySummaryToUser(userId, budgetBreakdown) {
  try {
    const sevenDaysAgo = getSevenDaysAgo();
    
    // Get last 7 days of transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo);
    
    if (!transactions) return;
    
    // Calculate metrics
    const totalSpent = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const totalSaved = Math.abs(transactions.filter(tx => tx.amount < 0 && tx.category?.includes('Transfer')).reduce((sum, tx) => sum + tx.amount, 0));
    
    // Calculate budget performance
    const spending = { needs: 0, savings: 0, wants: 0, debt: 0, investing: 0 };
    transactions.forEach(tx => {
      if (tx.amount > 0) {
        const category = mapToBudgetCategory(tx.category);
        spending[category] += tx.amount;
      }
    });
    
    // Count how many categories stayed under budget (weekly portion)
    let categoriesUnderBudget = 0;
    let totalCategories = 0;
    
    for (const [category, budgetInfo] of Object.entries(budgetBreakdown)) {
      const weeklyBudget = budgetInfo.amount / 4; // Rough weekly budget
      if (spending[category] <= weeklyBudget) {
        categoriesUnderBudget++;
      }
      totalCategories++;
    }
    
    const budgetPerformance = Math.round((categoriesUnderBudget / totalCategories) * 100);
    
    await sendWeeklySummary(userId, {
      totalSpent,
      totalSaved,
      budgetPerformance,
      streak: 0 // TODO: Calculate streak
    });
  } catch (error) {
    console.error(`Failed to send weekly summary for user ${userId}:`, error);
  }
}

// MONTHLY: Send monthly report on 1st of month at 9am
cron.schedule('0 9 1 * *', async () => {
  console.log('⏰ Running monthly report (1st of month 9am)...');
  
  try {
    // Get all active users
    const { data: users } = await supabase
      .from('financial_profiles')
      .select('user_id');
    
    if (!users) return;
    
    for (const user of users) {
      await sendMonthlyReportToUser(user.user_id);
    }
    
    console.log('✅ Monthly reports sent');
  } catch (error) {
    console.error('❌ Monthly report failed:', error);
  }
});

// Generate and send monthly report for user
async function sendMonthlyReportToUser(userId) {
  try {
    // Get last month's date range
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    
    // Get previous month's date range
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0).toISOString().split('T')[0];
    
    // Calculate savings for both months
    const { data: lastMonth } = await supabase.from('transactions').select('amount').eq('user_id', userId).gte('date', lastMonthStart).lte('date', lastMonthEnd);
    const { data: prevMonth } = await supabase.from('transactions').select('amount').eq('user_id', userId).gte('date', prevMonthStart).lte('date', prevMonthEnd);
    
    const lastMonthSavings = lastMonth?.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    const prevMonthSavings = prevMonth?.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    
    const savingsChange = prevMonthSavings > 0 ? ((lastMonthSavings - prevMonthSavings) / prevMonthSavings) * 100 : 0;
    
    // Get current level progress
    const { data: profile } = await supabase
      .from('financial_profiles')
      .select('current_level, progress')
      .eq('user_id', userId)
      .single();
    
    await sendMonthlyReport(userId, {
      totalSaved: lastMonthSavings,
      savingsChange,
      levelProgress: profile?.progress || 0
    });
  } catch (error) {
    console.error(`Failed to send monthly report for user ${userId}:`, error);
  }
}

// Start all cron jobs
function startCronJobs() {
  console.log('⏰ Cron jobs initialized:');
  console.log('  📊 Daily budget check: 6:00 PM');
  console.log('  📈 Weekly summary: Sunday 8:00 PM');
  console.log('  📊 Monthly report: 1st of month 9:00 AM');
}

module.exports = { startCronJobs };
