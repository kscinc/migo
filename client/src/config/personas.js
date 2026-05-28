// Demo personas with social features
export const PERSONAS = {
  maya: {
    name: "Maya",
    age: 19,
    level: 1,
    progress: 35,
    diagnosticResults: {
      confidence: "Somewhat stressed",
      predictability: "Very unpredictable",
      automation: "Somewhat uncomfortable"
    },
    financials: {
      checking: 847,
      savings: 0,
      monthlyIncome: 1240,
      nextPaycheck: 1240,
      paycheckDate: "Friday, Feb 7",
      monthlyExpenses: 1150,
      monthlyBudget: 800,
      creditCardDebt: 320,
      emergencyFundMonths: 0,
      savingsRate: 4
    },
    completedActions: ['track_spending_week1', 'identify_subscriptions'],
    currentActions: [
      { id: 'cancel_unused_sub', title: 'Cancel unused subscription', category: 'spending', completed: false },
      { id: 'start_emergency_fund', title: 'Save $10 this week', category: 'savings', completed: false },
      { id: 'learn_needs_wants', title: 'Learn: Needs vs Wants', category: 'education', completed: false }
    ],
    friends: 3,
    activeGroupGoals: 1,
    groupTrips: [
      {
        id: 1,
        name: "Spring Break Road Trip 🚗",
        participants: 4,
        groupTotal: 480,
        groupGoal: 1200,
        yourPart: 45,
        yourGoal: 300,
        daysLeft: 52
      }
    ],
    challenges: [
      {
        id: 1,
        name: "No-Spend Weekend",
        participants: 3,
        status: "Live",
        reward: "Bragging rights",
        color: '#d97706'
      }
    ],
    recentActivity: [
      { emoji: "🎯", name: "Alex", action: "completed first budget", time: "3h ago" },
      { emoji: "💪", name: "Jordan", action: "saved $25", time: "1d ago" }
    ]
  },
  jordan: {
    name: "Jordan",
    age: 23,
    level: 2,
    progress: 60,
    diagnosticResults: {
      confidence: "Mostly okay",
      predictability: "Mostly predictable",
      automation: "Comfortable with limits"
    },
    financials: {
      checking: 2340,
      savings: 1800,
      monthlyIncome: 3800,
      nextPaycheck: 3800,
      paycheckDate: "Friday, Feb 14",
      monthlyExpenses: 3200,
      monthlyBudget: 2800,
      creditCardDebt: 0,
      emergencyFundMonths: 0.6,
      savingsRate: 15
    },
    completedActions: ['open_hysa', 'automate_savings', 'review_insurance'],
    currentActions: [
      { id: 'research_side_hustle', title: 'Research side hustle ideas', category: 'income', completed: false },
      { id: 'increase_emergency', title: 'Save $500 this month', category: 'savings', completed: false },
      { id: 'optimize_bills', title: 'Negotiate phone bill', category: 'spending', completed: false }
    ],
    friends: 8,
    activeGroupGoals: 2,
    groupTrips: [
      {
        id: 1,
        name: "Summer Music Festival 🎵",
        participants: 6,
        groupTotal: 1200,
        groupGoal: 2400,
        yourPart: 180,
        yourGoal: 400,
        daysLeft: 120
      }
    ],
    challenges: [
      {
        id: 1,
        name: "Side Hustle Challenge",
        participants: 5,
        status: "Soon",
        reward: "Revenue share tips",
        color: '#475569'
      },
      {
        id: 2,
        name: "Emergency Fund Race",
        participants: 12,
        status: "Live",
        reward: "Most saved invests $1000",
        color: '#d97706'
      }
    ],
    recentActivity: [
      { emoji: "🚀", name: "Maya", action: "started Level 2", time: "2h ago" },
      { emoji: "💰", name: "Alex", action: "maxed their 401k", time: "1d ago" },
      { emoji: "🎉", name: "Sarah", action: "hit $5k saved", time: "2d ago" }
    ]
  },
  alex: {
    name: "Alex",
    age: 28,
    level: 4,
    progress: 80,
    diagnosticResults: {
      confidence: "Comfortable",
      predictability: "Very predictable",
      automation: "Very comfortable"
    },
    financials: {
      checking: 5200,
      savings: 18000,
      monthlyIncome: 6500,
      nextPaycheck: 6500,
      paycheckDate: "Friday, Feb 21",
      monthlyExpenses: 4800,
      monthlyBudget: 4500,
      creditCardDebt: 0,
      emergencyFundMonths: 3.75,
      savingsRate: 26,
      retirement401k: 45000,
      rothIRA: 12000,
      has401k: true,
      hasRothIRA: true
    },
    completedActions: ['max_roth_ira', 'get_401k_match', 'automate_retirement'],
    currentActions: [
      { id: 'increase_401k', title: 'Increase 401(k) to 15%', category: 'investing', completed: false },
      { id: 'research_hsa', title: 'Research HSA options', category: 'investing', completed: false },
      { id: 'tax_optimization', title: 'Meet with CPA', category: 'planning', completed: false }
    ],
    friends: 15,
    activeGroupGoals: 1,
    groupTrips: [
      {
        id: 1,
        name: "Europe Trip 2026 ✈️",
        participants: 4,
        groupTotal: 8400,
        groupGoal: 16000,
        yourPart: 2100,
        yourGoal: 4000,
        daysLeft: 180
      }
    ],
    challenges: [
      {
        id: 1,
        name: "Max Out Challenge",
        participants: 8,
        status: "Live",
        reward: "Invest coach session",
        color: '#10b981'
      }
    ],
    recentActivity: [
      { emoji: "📈", name: "Jordan", action: "opened Roth IRA", time: "4h ago" },
      { emoji: "🏆", name: "Maya", action: "reached $500 saved", time: "1d ago" },
      { emoji: "💎", name: "Chris", action: "hit $50k net worth", time: "2d ago" }
    ]
  }
};
