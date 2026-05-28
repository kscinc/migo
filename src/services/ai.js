// aiService.js - OpenAI GPT-4o-mini Integration for Smart Financial Analysis
// Add this file to C:\Users\jaily\migo-backend\

const https = require('https');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = 'gpt-4o-mini'; // Cost-effective and fast
    
    if (!this.apiKey) {
      console.warn('⚠️  OpenAI API key not set. AI features disabled.');
      console.warn('   Add OPENAI_API_KEY to .env to enable AI personalization');
    }
  }

  // Core OpenAI API call
  async callGPT(systemPrompt, userPrompt, temperature = 0.7) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestData = JSON.stringify({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: temperature,
      response_format: { type: 'json_object' }, // Ensures JSON response
      max_tokens: 1500
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(requestData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => data += chunk);
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(response);
            } else {
              console.error('OpenAI Error:', response);
              reject(response);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(requestData);
      req.end();
    });
  }

  // FEATURE 1: AI-Powered Personalized Budget
  async generatePersonalizedBudget(userData) {
    try {
      const systemPrompt = `You are a financial advisor for Migo, helping Gen Z users (16-26) build financial literacy. Analyze their actual spending and create a realistic, personalized budget. Always return valid JSON.`;

      const userPrompt = `Analyze this user and create a personalized budget:

PROFILE:
- Age: ${userData.age || 23}
- Monthly Income: $${userData.monthlyIncome}
- Current Level: ${userData.currentLevel}/6
- Location: ${userData.location || 'US'}

LAST 30 DAYS SPENDING:
${this.formatSpending(userData.spending)}

CURRENT FINANCES:
- Checking: $${userData.checking || 0}
- Savings: $${userData.savings || 0}
- Credit Card Debt: $${userData.creditCardDebt || 0}
- Emergency Fund: ${(userData.emergencyFundMonths || 0).toFixed(1)} months

Create a budget that:
1. Reflects their ACTUAL spending patterns (don't suggest impossible cuts)
2. Gradually improves their habits
3. Prioritizes emergency fund if Level 1-3, debt if Level 4, investing if Level 5+
4. Is sustainable and achievable

Return JSON:
{
  "budget": {
    "needs": {"pct": 50, "amount": 2500},
    "savings": {"pct": 20, "amount": 1000},
    "wants": {"pct": 20, "amount": 1000},
    "debt": {"pct": 10, "amount": 500}
  },
  "reasoning": "Why this budget works for this user",
  "recommendations": ["Specific tip 1", "Specific tip 2", "Specific tip 3"],
  "monthlySavingsTarget": 500,
  "priorityFocus": "Emergency fund" or "Debt payoff" or "Investing"
}`;

      const response = await this.callGPT(systemPrompt, userPrompt, 0.7);
      const result = JSON.parse(response.choices[0].message.content);
      
      console.log('🤖 AI Budget Generated:', result.reasoning);
      return result;
    } catch (error) {
      console.error('AI Budget failed:', error);
      return this.getFallbackBudget(userData);
    }
  }

  // FEATURE 2: AI-Powered Level Assignment
  async calculateUserLevel(userData) {
    try {
      const systemPrompt = `You are evaluating financial literacy levels for Migo users. Consider ALL factors holistically, not just numbers. Be realistic but encouraging. Always return valid JSON.`;

      const userPrompt = `Assign the correct Migo level (1-6) for this user:

FINANCIAL DATA:
- Income: $${userData.monthlyIncome}/month (${userData.incomeType || 'stable W-2'})
- Checking: $${userData.checking || 0}
- Savings: $${userData.savings || 0}
- Investments: $${userData.investments || 0}
- Credit Card Debt: $${userData.creditCardDebt || 0} at ${userData.creditCardAPR || 18}% APR
- Student Loans: $${userData.studentLoans || 0}
- Emergency Fund: ${(userData.emergencyFundMonths || 0).toFixed(1)} months
- Savings Rate: ${userData.savingsRate || 0}%

LEVELS:
1. Getting Stable: Learning basics, tracking spending
2. Building Safety: Creating 1-3 month emergency fund
3. Spending Smart: 3+ month fund, optimized spending
4. Crushing Debt: Aggressively paying high-interest debt
5. Growing Wealth: 6+ month fund, investing 15-20%
6. Financially Free: Financial independence, teaching others

KEY RULE: High-interest debt (>10% APR) = Level 4, even with good savings

Analyze holistically:
- Emergency fund coverage
- Debt situation (amount AND interest rate)
- Savings discipline
- Investment activity
- Age-appropriate expectations

Return JSON:
{
  "recommendedLevel": 4,
  "confidence": 90,
  "reasoning": "Detailed explanation of why this level",
  "strengths": ["What they're doing well"],
  "improvements": ["What needs work"],
  "nextMilestone": "Specific next goal",
  "actionPlan": ["Action 1", "Action 2", "Action 3"],
  "timeToNextLevel": "6-8 months"
}`;

      const response = await this.callGPT(systemPrompt, userPrompt, 0.5);
      const result = JSON.parse(response.choices[0].message.content);
      
      console.log(`🤖 AI Level: ${result.recommendedLevel} (${result.confidence}% confidence)`);
      return result;
    } catch (error) {
      console.error('AI Level calculation failed:', error);
      return this.getFallbackLevel(userData);
    }
  }

  // FEATURE 3: Weekly AI Insights
  async generateWeeklyInsights(weekData) {
    try {
      const systemPrompt = `You're a supportive financial coach for Gen Z. Generate 2-3 personalized, encouraging insights. Be specific and actionable. Always return valid JSON.`;

      const userPrompt = `Generate weekly insights:

THIS WEEK:
- Spent: $${weekData.spent}
- Saved: $${weekData.saved}
- Budget: $${weekData.budget}
- Notable: ${weekData.notable || 'Standard week'}

Top Categories:
${this.formatSpending(weekData.topCategories)}

Return JSON:
{
  "insights": [
    {"emoji": "🎉", "message": "Positive insight"},
    {"emoji": "💡", "message": "Suggestion"}
  ]
}`;

      const response = await this.callGPT(systemPrompt, userPrompt, 0.8);
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Weekly insights failed:', error);
      return { insights: [] };
    }
  }

  // Helper: Format spending for prompts
  formatSpending(spending) {
    if (!spending || Object.keys(spending).length === 0) {
      return '- No spending data available';
    }
    return Object.entries(spending)
      .map(([cat, amt]) => `- ${cat}: $${amt}`)
      .join('\n');
  }

  // Fallback budget if AI unavailable
  getFallbackBudget(userData) {
    const income = userData.monthlyIncome;
    const level = userData.currentLevel;
    
    const budgets = {
      1: { needs: 60, savings: 20, wants: 20 },
      2: { needs: 60, savings: 25, wants: 15 },
      3: { needs: 50, savings: 25, wants: 20, debt: 5 },
      4: { needs: 50, savings: 15, wants: 15, debt: 20 },
      5: { needs: 50, savings: 10, wants: 15, investing: 20, debt: 5 },
      6: { needs: 40, savings: 10, wants: 15, investing: 35 }
    };

    const percentages = budgets[level] || budgets[1];
    const budget = {};
    
    Object.entries(percentages).forEach(([key, pct]) => {
      budget[key] = { pct, amount: (income * pct / 100) };
    });

    return {
      budget,
      reasoning: 'Standard Migo budget for Level ' + level,
      recommendations: ['Enable AI for personalized tips'],
      monthlySavingsTarget: income * 0.2,
      priorityFocus: level <= 3 ? 'Emergency fund' : level === 4 ? 'Debt payoff' : 'Investing'
    };
  }

  // Fallback level if AI unavailable
  getFallbackLevel(userData) {
    const { emergencyFundMonths, savingsRate, creditCardDebt, investments } = userData;
    
    let level = 1;
    
    if (emergencyFundMonths >= 6 && savingsRate >= 20 && !creditCardDebt && investments > 10000) {
      level = 6;
    } else if (emergencyFundMonths >= 6 && savingsRate >= 15 && !creditCardDebt) {
      level = 5;
    } else if (creditCardDebt > 0) {
      level = 4; // Debt payoff priority
    } else if (emergencyFundMonths >= 3) {
      level = 3;
    } else if (emergencyFundMonths >= 1) {
      level = 2;
    }

    return {
      recommendedLevel: level,
      confidence: 75,
      reasoning: 'Basic calculation. Enable OpenAI for detailed analysis.',
      strengths: [],
      improvements: [],
      nextMilestone: 'Continue building habits',
      actionPlan: ['Track spending', 'Save consistently'],
      timeToNextLevel: '3-6 months'
    };
  }
}

module.exports = new AIService();
