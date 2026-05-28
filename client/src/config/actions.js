// Level actions and lesson-action pairs for interleaved Next Steps ordering

export const LEVEL_ACTIONS = {
  1: [
    { id: 'tag_expenses',     title: 'Tag 3 weeks of transactions as Needs or Wants', category: 'budgeting'  },
    { id: 'find_extra_money', title: 'Log your weekly wants total (3 weeks)',          category: 'budgeting'  },
    { id: 'save_budget',      title: 'Set your 50/30/20 spending targets',             category: 'budgeting'  },
    { id: 'check_savings',    title: 'Move money to savings in your bank',             category: 'foundation' },
  ],
  2: [
    { id: 'review_surplus',   title: 'Calculate your monthly income minus expenses', category: 'foundation' },
    { id: 'start_efund',      title: 'Start your emergency fund ($1,000 goal)',       category: 'savings'    },
    { id: 'open_hysa',        title: 'Open a high-yield savings account',             category: 'savings'    },
    { id: 'research_income',  title: 'Research one way to grow your income',          category: 'income'     },
    { id: 'pick_side_hustle', title: 'Pick one side hustle to try this month',        category: 'income'     },
  ],
  3: [
    { id: 'check_credit_score', title: 'Check your credit score for free', category: 'credit' },
    { id: 'extra_debt_payment', title: 'Make one extra debt payment', category: 'debt' },
    { id: 'cancel_subscriptions', title: 'Cancel unused subscriptions', category: 'savings' },
  ],
  4: [
    { id: 'open_roth_ira', title: 'Open a Roth IRA account', category: 'investing' },
    { id: 'get_401k_match', title: 'Maximize your 401k employer match', category: 'investing' },
    { id: 'invest_first_dollar', title: 'Make your first investment', category: 'investing' },
  ],
  5: [
    { id: 'diversify_portfolio', title: 'Diversify your investment portfolio', category: 'investing' },
    { id: 'max_roth_ira', title: 'Max out your Roth IRA ($7k/yr)', category: 'investing' },
    { id: 'passive_income_research', title: 'Research one passive income stream', category: 'wealth' },
  ],
  6: [
    { id: 'estate_planning', title: 'Create or update your will', category: 'legacy' },
    { id: 'tax_professional', title: 'Meet with a tax professional', category: 'taxes' },
    { id: 'charitable_giving', title: 'Set up a charitable giving strategy', category: 'legacy' },
  ],
};

export const LEVEL_PAIRS = {
  1: [
    { lessonName: 'Needs vs Wants',         actionId: 'tag_expenses'     },
    { lessonName: null,                      actionId: 'find_extra_money' },
    { lessonName: 'Track Your Spending',    actionId: 'save_budget'      },
    { lessonName: '50/30/20 Budget Basics', actionId: 'check_savings'    },
  ],
  2: [
    { lessonName: 'Stop Living Paycheck to Paycheck', actionId: 'review_surplus'   },
    { lessonName: 'What is an Emergency Fund?',       actionId: 'start_efund'      },
    { lessonName: 'High-Yield Savings Accounts',      actionId: 'open_hysa'        },
    { lessonName: 'Income Growth Strategies',          actionId: 'research_income'  },
    { lessonName: 'Side Hustles',                      actionId: 'pick_side_hustle' },
  ],
  3: [
    { lessonName: 'Build Credit Without Cards',   actionId: 'check_credit_score'  },
    { lessonName: 'Understanding Credit Cards',   actionId: 'extra_debt_payment'  },
    { lessonName: 'Debt Avalanche Method',        actionId: 'cancel_subscriptions' },
  ],
};
