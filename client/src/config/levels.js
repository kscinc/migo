// Level system configuration (6 levels)
export const LEVEL_CONFIG = {
  1: {
    name: "Building a Foundation",
    emoji: "🏗️",
    color: "#10b981",
    subtitle: "Stability & Awareness",
    description: "Building basic money habits",
    prerequisites: "None - everyone starts here",
    
    goals: [
      "Track spending daily/weekly",
      "Understand needs vs wants",
      "Create first budget (even if imperfect)",
      "Stop living paycheck-to-paycheck",
      "Build $500-1,000 starter emergency fund"
    ],
    
    graduationCriteria: {
      emergencyFundMonths: 1,
      spendingLessThanIncome: true
    },
    
    fullPath: [
      "Needs vs Wants",
      "Track Your Spending",
      "50/30/20 Budget Basics"
    ],

    essentialPath: [
      "Needs vs Wants",
      "Track Your Spending",
      "50/30/20 Budget Basics"
    ],

    quiz: {
      questions: [
        {
          question: "Which of these is a NEED, not a want?",
          options: [
            "Netflix subscription",
            "Monthly rent payment",
            "New sneakers because they look cool"
          ],
          correct: 1,
          explanation: "Needs are essentials: rent, food, utilities, transportation to work. Everything else is a want — even if it feels necessary."
        },
        {
          question: "What's the 50/30/20 budget rule?",
          options: [
            "50% needs, 30% wants, 20% savings",
            "50% savings, 30% needs, 20% wants",
            "50% wants, 30% savings, 20% needs"
          ],
          correct: 0,
          explanation: "50% for needs (rent, food, bills), 30% for wants (fun stuff), 20% for savings and debt payoff."
        },
        {
          question: "What should you save FIRST?",
          options: [
            "Down payment for a house",
            "Retirement in a 401(k)",
            "$500-1,000 starter emergency fund"
          ],
          correct: 2,
          explanation: "A starter emergency fund prevents you from going into debt when unexpected expenses hit."
        }
      ]
    }
  },
  
  2: {
    name: "Building Safety",
    emoji: "🛡️",
    color: "#3b82f6",
    subtitle: "Emergency Fund: 3-6 Months",
    description: "Building real financial security",
    prerequisites: "✅ 1 month emergency fund + good spending habits",
    
    goals: [
      "Build 3-6 month emergency fund",
      "Automate savings consistently",
      "Optimize spending categories",
      "Understand insurance basics",
      "Explore side hustles (Gen Z focus)"
    ],
    
    graduationCriteria: {
      emergencyFundMonths: 3,
      savingsRate: 15,
      noHighInterestDebt: true
    },
    
    fullPath: [
      "Stop Living Paycheck to Paycheck",
      "What is an Emergency Fund?",
      "High-Yield Savings Accounts",
      "Income Growth Strategies",
      "Side Hustles"
    ],

    essentialPath: [
      "Stop Living Paycheck to Paycheck",
      "What is an Emergency Fund?",
      "High-Yield Savings Accounts"
    ],

    quiz: {
      questions: [
        {
          question: "What is the first step to stop living paycheck to paycheck?",
          options: [
            "Invest in the stock market",
            "Create a written budget and give every dollar a job",
            "Open a high-yield savings account"
          ],
          correct: 1,
          explanation: "A written budget lets you control where your money goes before you spend it — the foundation of every other financial step."
        },
        {
          question: "What's a HYSA?",
          options: [
            "High-Yield Savings Account (higher interest)",
            "Health Year Savings Account",
            "Highly Yielding Stock Account"
          ],
          correct: 0,
          explanation: "HYSAs pay 4-5% interest vs 0.01% at traditional banks. Free money!"
        },
        {
          question: "What's a good first side hustle for Gen Z?",
          options: [
            "Starting a real estate business",
            "Freelancing skills online (design, writing, video)",
            "Opening a restaurant"
          ],
          correct: 1,
          explanation: "Start with skills you already have - low risk, can test while employed, leverages tech."
        }
      ]
    }
  },
  
  3: {
    name: "Crushing Debt",
    emoji: "⚔️",
    color: "#f59e0b",
    subtitle: "Strategic Debt Elimination",
    description: "Eliminating debt before investing",
    prerequisites: "✅ 3+ month emergency fund established",
    skipCondition: "If no debt >6% APR → Skip to Level 4",
    
    goals: [
      "Eliminate all high-interest debt (>6% APR)",
      "Understand avalanche vs snowball",
      "Maintain emergency fund while paying debt",
      "Negotiate interest rates",
      "Extra payments toward principal"
    ],
    
    graduationCriteria: {
      noDebtAbove6Percent: true,
      emergencyFundMaintained: true
    },
    
    fullPath: [
      "Build Credit Without Cards",
      "Understanding Credit Cards",
      "Alternatives to Credit Cards",
      "Debt Avalanche Method",
      "Debt Snowball Method",
      "Negotiating Interest Rates"
    ],

    essentialPath: [
      "Build Credit Without Cards",
      "Understanding Credit Cards",
      "Alternatives to Credit Cards",
      "Debt Avalanche Method"
    ],
    
    quiz: {
      questions: [
        {
          question: "What's the debt avalanche method?",
          options: [
            "Pay smallest balance first",
            "Pay highest interest rate first",
            "Pay all debts equally"
          ],
          correct: 1,
          explanation: "Avalanche = highest interest first. Saves the most money mathematically."
        },
        {
          question: "Should you stop contributing to emergency fund while paying debt?",
          options: [
            "Yes, put all money toward debt",
            "No, keep at least 3 months saved",
            "It doesn't matter"
          ],
          correct: 1,
          explanation: "Never drain your emergency fund! You'll just go back into debt when life happens."
        },
        {
          question: "What APR should you prioritize paying off?",
          options: [
            "Any debt above 6%",
            "Only above 20%",
            "All debt immediately"
          ],
          correct: 0,
          explanation: "Debt above 6% costs more than you'd earn investing. Pay it off first!"
        }
      ]
    }
  },
  
  4: {
    locked: true,
    name: "Tax-Advantaged Accounts",
    emoji: "🧠",
    color: "#8b5cf6",
    subtitle: "Long-Term Thinking",
    description: "Building wealth through smart tax strategy",
    prerequisites: "✅ 3-6 month emergency fund + no high-interest debt",
    
    goals: [
      "Understand 401(k) and employer match",
      "Open and fund Roth IRA",
      "Understand HSA triple tax advantage",
      "Learn Traditional vs Roth differences",
      "Contribute 15% to retirement"
    ],
    
    graduationCriteria: {
      contributingToRetirement: true,
      savingsRate: 15
    },
    
    fullPath: [
      "401(k) Matching Explained",
      "Roth IRA vs Traditional IRA",
      "HSA: Triple Tax Advantage",
      "Understanding Tax Brackets",
      "Index Funds & Diversification"
    ],
    
    essentialPath: [
      "Get Your 401(k) Match",
      "Open Roth IRA"
    ],
    
    quiz: {
      questions: [
        {
          question: "What's a 401(k) employer match?",
          options: [
            "Your employer matches your dating profile",
            "Free money: employer contributes when you do",
            "A retirement matching game"
          ],
          correct: 1,
          explanation: "If your employer matches 5%, contribute 5% = instant 100% return!"
        },
        {
          question: "What's a Roth IRA?",
          options: [
            "Pay tax now, withdraw tax-free in retirement",
            "Tax-deferred now and in retirement",
            "No taxes ever"
          ],
          correct: 0,
          explanation: "Roth = pay taxes now while you're young, grow tax-free forever."
        },
        {
          question: "What makes an HSA special?",
          options: [
            "Triple tax advantage: deduct, grow, withdraw tax-free",
            "It's just for medical expenses",
            "High Savings Account"
          ],
          correct: 0,
          explanation: "HSA = contribute pre-tax, grow tax-free, withdraw tax-free for medical!"
        }
      ]
    }
  },
  
  5: {
    locked: true,
    name: "Growing Wealth",
    emoji: "📈",
    color: "#ec4899",
    subtitle: "Advanced Investing & Real Estate",
    description: "Building wealth actively",
    prerequisites: "✅ Maxing Roth + getting 401(k) match + 6+ month fund",
    
    goals: [
      "Max ALL tax-advantaged space ($34k+)",
      "Open taxable brokerage account",
      "Understand real estate investing",
      "Asset allocation strategies",
      "Invest 20-30% of income"
    ],
    
    graduationCriteria: {
      netWorth: 100000,
      investingRate: 25
    },
    
    fullPath: [
      "Maxing Tax-Advantaged Accounts",
      "Taxable Brokerage Investing",
      "Real Estate: REITs vs Rental Property",
      "Asset Allocation by Age",
      "Tax-Loss Harvesting"
    ],
    
    essentialPath: [
      "Max Your Accounts",
      "Real Estate Basics"
    ],
    
    quiz: {
      questions: [
        {
          question: "What's a REIT?",
          options: [
            "Real Estate Investment Trust",
            "Retirement Equity Investment Tool",
            "Real Estate Income Tax"
          ],
          correct: 0,
          explanation: "REITs let you invest in real estate with $100, get dividends, avoid being a landlord."
        },
        {
          question: "What's the 1% rule in real estate?",
          options: [
            "1% down payment",
            "Monthly rent should = 1% of property value",
            "1% annual appreciation"
          ],
          correct: 1,
          explanation: "$300k house should rent for $3k/month to be a good investment."
        }
      ]
    }
  },
  
  6: {
    locked: true,
    name: "Financially Free",
    emoji: "🏆",
    color: "#6366f1",
    subtitle: "Financial Independence & Legacy",
    description: "Achieving financial freedom",
    prerequisites: "✅ $250k+ net worth + multiple income streams",
    
    goals: [
      "Generate passive income",
      "Estate planning (wills, trusts)",
      "Mentor others on their journey",
      "Wealth preservation",
      "Legacy building"
    ],
    
    graduationCriteria: {
      netWorth: 250000,
      hasPassiveIncome: true
    },
    
    fullPath: [
      "Passive Income Strategies",
      "Wills & Trusts Explained",
      "Estate Tax Planning",
      "Donor-Advised Funds",
      "Building Your Legacy"
    ],
    
    essentialPath: [
      "Estate Planning Basics",
      "Giving Strategy"
    ],
    
    quiz: {
      questions: [
        {
          question: "What's a trust?",
          options: [
            "A type of savings account",
            "Legal entity to hold assets and control distribution",
            "Investment strategy"
          ],
          correct: 1,
          explanation: "Trusts avoid probate, protect assets, and control wealth distribution."
        },
        {
          question: "What's passive income?",
          options: [
            "Money earned without active daily work",
            "Part-time job income",
            "Retirement account withdrawals"
          ],
          correct: 0,
          explanation: "Passive income = money while you sleep. Financial freedom!"
        }
      ]
    }
  }
};
