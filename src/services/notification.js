// notificationService.js
// Add this file to your migo-backend folder

const https = require('https');

// OneSignal configuration
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

// Helper function to send notification to specific user
async function sendToUser(userId, heading, message, data = {}) {
  try {
    const notificationData = {
      app_id: ONESIGNAL_APP_ID,
      filters: [
        { field: 'tag', key: 'user_id', relation: '=', value: userId }
      ],
      headings: { en: heading },
      contents: { en: message },
      data: {
        ...data,
        type: data.type || 'general',
        timestamp: new Date().toISOString()
      },
      url: data.url || 'https://migo.app/dashboard'
    };
    
    return new Promise((resolve, reject) => {
      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode === 200) {
              console.log('✅ Notification sent:', heading);
              resolve(parsed);
            } else {
              console.error('❌ Notification failed:', parsed);
              reject(parsed);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Request error:', error);
        reject(error);
      });

      req.write(JSON.stringify(notificationData));
      req.end();
    });
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    throw error;
  }
}

// Budget Alert Notifications
async function sendBudgetAlert(userId, category, spent, budget, percentUsed) {
  let emoji, heading, message;
  
  if (percentUsed >= 100) {
    emoji = '🔴';
    heading = 'Budget Exceeded';
    const over = spent - budget;
    message = `You're $${Math.round(over)} over your ${category} budget ($${Math.round(spent)}/$${Math.round(budget)})`;
  } else if (percentUsed >= 90) {
    emoji = '🟠';
    heading = 'Budget Warning';
    message = `You've used ${Math.round(percentUsed)}% of your ${category} budget ($${Math.round(spent)}/$${Math.round(budget)})`;
  } else if (percentUsed >= 80) {
    emoji = '🟡';
    heading = 'Budget Update';
    message = `Heads up: You're at ${Math.round(percentUsed)}% of your ${category} budget`;
  }
  
  return sendToUser(userId, `${emoji} ${heading}`, message, {
    type: 'budget_alert',
    category,
    spent,
    budget,
    percentUsed,
    url: 'https://migo.app/dashboard?view=budget'
  });
}

// Paycheck Received Notification
async function sendPaycheckNotification(userId, amount) {
  return sendToUser(
    userId,
    '💰 Paycheck Received!',
    `Your $${Math.round(amount)} paycheck is here. Ready to approve this month's budget?`,
    {
      type: 'paycheck',
      amount,
      url: 'https://migo.app/dashboard?action=approve-budget'
    }
  );
}

// Level Up Notification
async function sendLevelUpNotification(userId, newLevel, levelName) {
  return sendToUser(
    userId,
    '🏆 Level Up!',
    `Congratulations! You've reached Level ${newLevel}: ${levelName}`,
    {
      type: 'level_up',
      level: newLevel,
      levelName,
      url: 'https://migo.app/dashboard?view=progress'
    }
  );
}

// Weekly Summary Notification
async function sendWeeklySummary(userId, summary) {
  const { totalSpent, totalSaved, budgetPerformance, streak } = summary;
  
  let emoji = '📊';
  let message = '';
  
  if (budgetPerformance >= 75) {
    emoji = '🎉';
    message = `Great week! You stayed under budget in ${budgetPerformance}% of categories. You saved $${Math.round(totalSaved)}.`;
  } else if (budgetPerformance >= 50) {
    emoji = '👍';
    message = `Solid week! You were on track in ${budgetPerformance}% of categories. Keep it up!`;
  } else {
    emoji = '💪';
    message = `This week was tough, but you got this! You stayed on track in ${budgetPerformance}% of categories.`;
  }
  
  return sendToUser(
    userId,
    `${emoji} Weekly Summary`,
    message,
    {
      type: 'weekly_summary',
      totalSpent,
      totalSaved,
      budgetPerformance,
      url: 'https://migo.app/dashboard?view=calendar'
    }
  );
}

// Monthly Report Notification
async function sendMonthlyReport(userId, report) {
  const { totalSaved, savingsChange, levelProgress } = report;
  
  let message = '';
  if (savingsChange > 0) {
    message = `You saved $${Math.round(totalSaved)} this month (+${Math.round(savingsChange)}% vs last month). Keep crushing it! 💪`;
  } else {
    message = `Monthly report ready: You saved $${Math.round(totalSaved)} this month. Check your progress!`;
  }
  
  return sendToUser(
    userId,
    '📊 Monthly Report',
    message,
    {
      type: 'monthly_report',
      totalSaved,
      savingsChange,
      levelProgress,
      url: 'https://migo.app/dashboard?view=progress'
    }
  );
}

// Friend Activity Notification
async function sendFriendActivity(userId, friendName, activity) {
  return sendToUser(
    userId,
    `👥 ${friendName} just achieved something!`,
    `${friendName} ${activity}. Way to go! 🎉`,
    {
      type: 'friend_activity',
      friendName,
      activity,
      url: 'https://migo.app/friends'
    }
  );
}

// Group Goal Progress Notification
async function sendGroupGoalProgress(userId, goalName, progress, goal) {
  const percentComplete = Math.round((progress / goal) * 100);
  return sendToUser(
    userId,
    `🎯 ${goalName} Update`,
    `Your group is at ${percentComplete}% ($${Math.round(progress)}/$${Math.round(goal)}). Almost there!`,
    {
      type: 'group_goal',
      goalName,
      progress,
      goal,
      url: 'https://migo.app/friends'
    }
  );
}

// Savings Milestone Notification
async function sendSavingsMilestone(userId, amount, milestone) {
  return sendToUser(
    userId,
    '🎉 Savings Milestone!',
    `You just hit $${Math.round(amount)} in savings! ${milestone}`,
    {
      type: 'milestone',
      amount,
      milestone,
      url: 'https://migo.app/dashboard?view=progress'
    }
  );
}

// Action Reminder Notification
async function sendActionReminder(userId, actionTitle) {
  return sendToUser(
    userId,
    '✅ Quick Action Available',
    `Don't forget: ${actionTitle}`,
    {
      type: 'action_reminder',
      actionTitle,
      url: 'https://migo.app/dashboard?view=actions'
    }
  );
}

// Export all functions
module.exports = {
  sendToUser,
  sendBudgetAlert,
  sendPaycheckNotification,
  sendLevelUpNotification,
  sendWeeklySummary,
  sendMonthlyReport,
  sendFriendActivity,
  sendGroupGoalProgress,
  sendSavingsMilestone,
  sendActionReminder
};
