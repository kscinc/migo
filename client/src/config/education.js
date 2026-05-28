// Education content and lesson config
// EDUCATION CONTENT WITH CREDIT BUILDING
export const EDUCATION_CONTENT = {
  // Level 1
  "Track Your Spending": {
    video: "https://www.youtube.com/embed/K7JBAK18_b4?si=_fbRsUOd7vov4eDf",
    duration: "4 min",
    description: "Learn to track every dollar and identify spending patterns"
  },

  "Needs vs Wants": {
    video: "https://www.youtube.com/embed/w3qxDv7xESs?si=KwR8Mkil_TTL-dYq",
    duration: "3 min",
    description: "The critical skill of distinguishing needs from wants"
  },

  "50/30/20 Budget Basics": {
    video: "https://www.youtube.com/embed/LKxOamnP8J4", // Khan Academy: Budgeting and the 50:30:20 rule
    duration: "5 min",
    description: "Simple budgeting rule: 50% needs, 30% wants, 20% savings"
  },

  "Stop Living Paycheck to Paycheck": {
    video: "https://www.youtube.com/embed/pB6-FzOhiow?si=BYCNDOEacy4l_mvn",
    duration: "10 min",
    description: "Rachel Cruze's step-by-step roadmap to breaking the paycheck-to-paycheck cycle"
  },

  "What is an Emergency Fund?": {
    video: "https://www.youtube.com/embed/n4YoZDQs6VA",
    duration: "6 min",
    description: "Why a 3-6 month safety net changes everything"
  },

  "Build Credit Without Cards": {
    video: "https://www.youtube.com/embed/YoOsvcxLy40", // Khan Academy: A Tale of Two Credit Scores
    duration: "8 min",
    description: "Rent reporting, Experian Boost, authorized user strategy",
    specialContent: {
      title: "The Migo Way: Credit Without Cards",
      methods: [
        {
          name: "Rent Reporting Services ⭐",
          rating: "BEST",
          services: "Rental Kharma, RentTrack, LevelCredit",
          how: "Reports your rent payments to credit bureaus",
          cost: "Free - $10/month",
          impact: "Builds payment history (35% of score)"
        },
        {
          name: "Experian Boost (Free)",
          services: "Experian",
          how: "Links bank account, reports utility/phone bills",
          cost: "Free",
          impact: "Can raise score 10-20 points instantly",
          risk: "Zero"
        },
        {
          name: "Authorized User Strategy",
          how: "Get added to parent/family member's old, good card",
          impact: "Inherits their payment history",
          key: "Don't request physical card, never use it"
        },
        {
          name: "Credit Builder Loan",
          label: "Last Resort",
          services: "Self Lender, Credit Strong",
          how: "Make payments, get money back at end",
          cost: "Small interest fee",
          impact: "Builds payment history"
        },
        {
          name: "Secured Credit Card",
          label: "If Necessary",
          when: "Only if above methods don't work",
          how: "Put $200-500 deposit, becomes your limit",
          rule: "Use for ONE recurring bill (Netflix), auto-pay, never carry balance",
          stance: "We don't encourage credit card use, but if you need to build credit and other methods haven't worked, this is the safest approach."
        }
      ],
      caveat: {
        title: "Already Have a Credit Card?",
        content: "Many of you already have credit cards. That's okay! We'll teach you why they exist, how to use them smartly (or not at all), and most importantly - how to pay them off and stop relying on them."
      }
    }
  },
  
"Auto-Save $50/month": {
    video: "https://www.youtube.com/embed/k-RTEIaYvAg", // Khan Academy: Paying yourself first
    duration: "3 min",
    description: "Set up automatic savings so you never forget"
  },

  "Credit Building Basics": {
    video: "https://www.youtube.com/embed/YoOsvcxLy40", // Khan Academy: A Tale of Two Credit Scores
    duration: "5 min",
    description: "Essential path to building credit without cards"
  },

  // Level 2
  "High-Yield Savings Accounts": {
    video: "https://www.youtube.com/embed/YrzOfg6r2LM?si=eTbqz_KfSsPrQnps",
    duration: "5 min",
    description: "Earn 4-5% vs 0.01% at traditional banks"
  },

  "Insurance 101": {
    video: "https://www.youtube.com/embed/i4FAekxeS_o", // Khan Academy: How insurance works
    duration: "10 min",
    description: "Protect yourself without overpaying"
  },

  "Sinking Funds Strategy": {
    video: "https://www.youtube.com/embed/cnW_HDIBmz4", // Khan Academy: Why and how to save (closest match — revisit)
    duration: "6 min",
    description: "Save monthly for planned 'emergencies'"
  },

  "Side Hustles": {
    video: "https://www.youtube.com/embed/j9lsNNibk7c?si=ZnR87dul9E0KsIut",
    duration: "12 min",
    description: "Freelancing, content creation, gig work, and more"
  },

  "Income Growth Strategies": {
    video: "https://www.youtube.com/embed/qX5eHj0VQII",
    duration: "10 min",
    description: "Negotiate raises, switch jobs, build skills"
  },

  "Open HYSA & Automate": {
    video: "https://www.youtube.com/embed/qX5eHj0VQII", // Khan Academy: How to make your money grow
    duration: "4 min",
    description: "Quick guide to opening and automating HYSA"
  },

  "Side Hustle Quick Start": {
    video: "https://www.youtube.com/embed/SAjZj3ZwebA", // Khan Academy: Education as an investment (closest match — revisit)
    duration: "6 min",
    description: "Start earning extra income this week"
  },

  // Level 3
  "Debt Avalanche Method": {
    video: "https://www.youtube.com/embed/TZErzDOZc1k", // Khan Academy: Debt payoff
    duration: "7 min",
    description: "Pay highest interest first - mathematically optimal"
  },

  "Debt Snowball Method": {
    video: "https://www.youtube.com/embed/TZErzDOZc1k", // Khan Academy: Debt payoff
    duration: "7 min",
    description: "Pay smallest balance first - psychologically powerful"
  },

  "Balance Transfer Strategy": {
    video: "https://www.youtube.com/embed/Ri0arQOegsc", // Khan Academy: Debt management
    duration: "8 min",
    description: "Move debt to 0% cards and crush it"
  },

  "Negotiating Interest Rates": {
    video: "https://www.youtube.com/embed/Ri0arQOegsc", // Khan Academy: Debt management
    duration: "6 min",
    description: "Call and ask for lower rates - it works!"
  },

  "Debt Payoff Tracking": {
    video: "https://www.youtube.com/embed/TZErzDOZc1k", // Khan Academy: Debt payoff
    duration: "8 min",
    description: "Stay motivated through the debt-free journey"
  },

  "Choose Your Method": {
    video: "https://www.youtube.com/embed/TZErzDOZc1k", // Khan Academy: Debt payoff
    duration: "4 min",
    description: "Avalanche or Snowball? Decide quickly"
  },

  "Attack High-Interest First": {
    video: "https://www.youtube.com/embed/TZErzDOZc1k", // Khan Academy: Debt payoff
    duration: "5 min",
    description: "Focus on credit cards and personal loans"
  },
  
  // Level 4
  "401(k) Matching Explained": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "7 min",
    description: "Never leave free money on the table"
  },
  
  "Roth IRA vs Traditional IRA": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "10 min",
    description: "Tax now or tax later? We explain."
  },
  
  "HSA: Triple Tax Advantage": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "8 min",
    description: "The best account you've never heard of"
  },
  
  "Understanding Tax Brackets": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "9 min",
    description: "How taxes actually work"
  },
  
  "Index Funds & Diversification": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "12 min",
    description: "Simple investing that beats most pros"
  },
  
  "Get Your 401(k) Match": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "5 min",
    description: "Quick guide to getting free money"
  },
  
  "Open Roth IRA": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "6 min",
    description: "Step-by-step Roth IRA setup"
  },
  
  // Level 5
  "Maxing Tax-Advantaged Accounts": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "10 min",
    description: "The path to $34k+ tax-free growth"
  },
  
  "Taxable Brokerage Investing": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "9 min",
    description: "Investing beyond retirement accounts"
  },
  
  "Real Estate: REITs vs Rental Property": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "15 min",
    description: "Own real estate without being a landlord"
  },
  
  "Asset Allocation by Age": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "10 min",
    description: "Stocks vs bonds at every life stage"
  },
  
  "Tax-Loss Harvesting": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "11 min",
    description: "Advanced tax strategy for taxable accounts"
  },
  
  "Max Your Accounts": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "6 min",
    description: "Quick guide to maxing 401k, Roth, HSA"
  },
  
  "Real Estate Basics": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "8 min",
    description: "Start with REITs or rental property?"
  },
  
  // Level 6
  "Passive Income Strategies": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "14 min",
    description: "Dividends, rentals, businesses that run themselves"
  },
  
  "Wills & Trusts Explained": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "12 min",
    description: "Protect your wealth and family"
  },
  
  "Estate Tax Planning": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "10 min",
    description: "Minimize taxes on wealth transfer"
  },
  
  "Donor-Advised Funds": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "8 min",
    description: "Tax-smart charitable giving"
  },
  
  "Building Your Legacy": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "10 min",
    description: "Wealth, wisdom, and what you leave behind"
  },
  
  "Estate Planning Basics": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "7 min",
    description: "Wills, trusts, and beneficiaries made simple"
  },
  
  "Giving Strategy": {
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // REPLACE
    duration: "6 min",
    description: "Give smartly and tax-efficiently"
  },

"Understanding Credit Cards": {
    video: "https://www.youtube.com/embed/9IUDDJbqBzA",
    duration: "6 min",
    description: "How credit cards really work — interest, minimum payments, and the true cost of debt"
  },

  "Alternatives to Credit Cards": {
    video: "https://www.youtube.com/embed/Gi7M3VeU8eM",
    duration: "5 min",
    description: "Debit, prepaid, buy-now-pay-later, and charge cards — which is right for you and when"
  }
};

// Lesson config — mustDos, mustNeverDos, and Investopedia fallback per lesson (L1–L3 only)
export const LESSON_CONFIG = {
  "Track Your Spending": {
    level: 1,
    mustDos: ["Track every dollar spent for at least one week", "Categorize spending into needs, wants, and savings", "Review spending weekly to identify patterns"],
    mustNeverDos: ["Never ignore small purchases — they accumulate into significant amounts", "Never track spending only when you think you've overspent", "Never skip categorizing a transaction"],
    articleUrl: "https://www.investopedia.com/articles/budgeting-savings/07/budget_car.asp",
    articleTitle: "How to Budget Money",
    articleDescription: "A practical step-by-step guide to building and maintaining a personal budget."
  },
  "Needs vs Wants": {
    level: 1,
    mustDos: ["Distinguish between essential needs and discretionary wants before every purchase", "Ask 'do I need this or just want this?' before any non-essential spend", "Redirect want-spending money toward financial goals when funds are tight"],
    mustNeverDos: ["Never treat wants as needs to justify unnecessary spending", "Never cut all wants from your budget — that leads to burnout", "Never make large want-purchases impulsively without a 24-48 hour wait"],
    articleUrl: "https://www.investopedia.com/terms/n/needs-and-wants.asp",
    articleTitle: "Needs vs. Wants",
    articleDescription: "Understanding the difference between needs and wants is the first step to a budget that works."
  },
  "50/30/20 Budget Basics": {
    level: 1,
    mustDos: ["Allocate 50% of after-tax income to needs", "Put 20% toward savings and debt repayment", "Use the remaining 30% for wants and discretionary spending"],
    mustNeverDos: ["Never count debt minimum payments as part of your 20% savings", "Never skip adjusting percentages when your income changes", "Never use the wants bucket to cover needs overflow without rebalancing"],
    articleUrl: "https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp",
    articleTitle: "What Is the 50/30/20 Budget Rule?",
    articleDescription: "The 50/30/20 rule is a popular and simple framework for personal budgeting."
  },
  "Stop Living Paycheck to Paycheck": {
    level: 2,
    mustDos: ["Create a written budget and give every dollar a job before the month begins", "Build a starter emergency fund of $1,000 before tackling other goals", "Pay off all consumer debt using the debt snowball method (smallest balance first)", "Invest 15% of your income into retirement once you're debt-free", "Give generously once your financial foundation is solid"],
    mustNeverDos: ["Never spend money without a plan — every dollar needs an assignment", "Never skip the $1,000 emergency fund step even if investing feels more urgent", "Never take on new consumer debt while paying off existing debt"],
    articleUrl: "https://www.ramseysolutions.com/budgeting/how-to-stop-living-paycheck-to-paycheck",
    articleTitle: "How to Stop Living Paycheck to Paycheck",
    articleDescription: "A step-by-step guide to breaking the paycheck-to-paycheck cycle and building real financial momentum."
  },
  "What is an Emergency Fund?": {
    level: 2,
    mustDos: ["Build a starter emergency fund of at least $500–$1,000 first", "Keep emergency funds in a separate, easily accessible savings account", "Define what qualifies as a true emergency before you need the money"],
    mustNeverDos: ["Never invest your emergency fund in the stock market — it must stay liquid", "Never use your emergency fund for non-emergencies like vacations or sales", "Never stop contributing until you hit your 3–6 month target"],
    articleUrl: "https://www.investopedia.com/terms/e/emergency_fund.asp",
    articleTitle: "Emergency Fund",
    articleDescription: "An emergency fund is a financial safety net that protects you from unexpected expenses and job loss."
  },
  "Build Credit Without Cards": {
    level: 3,
    mustDos: ["Use rent reporting services to build payment history without a credit card", "Become an authorized user on a trusted family member's card if possible", "Check your credit score regularly with a free service like Credit Karma"],
    mustNeverDos: ["Never miss a payment on any account — payment history is 35% of your score", "Never apply for multiple credit products in a short period", "Never close old accounts unnecessarily — length of credit history matters"],
    articleUrl: "https://www.investopedia.com/how-to-build-credit-5202955",
    articleTitle: "How to Build Credit",
    articleDescription: "Building credit without a credit card is possible through several smart strategies."
  },
"Auto-Save $50/month": {
    level: 1,
    mustDos: ["Automate savings transfers on payday so money moves before you can spend it", "Start with any amount — even $25/month builds the habit", "Treat your savings transfer like a non-negotiable bill payment"],
    mustNeverDos: ["Never rely on willpower alone to save — automate it", "Never cancel your auto-save when money gets tight without a plan to restart", "Never keep savings in the same account as spending money"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/052014/3-ways-automate-your-savings.asp",
    articleTitle: "3 Ways to Automate Your Savings",
    articleDescription: "Automating savings removes willpower from the equation and makes building wealth effortless."
  },
  "Credit Building Basics": {
    level: 1,
    mustDos: ["Pay every bill on time — payment history is the single biggest factor in your score", "Keep credit utilization below 30% of any credit limit", "Monitor your credit report for errors at least once a year"],
    mustNeverDos: ["Never max out a credit card even if you plan to pay it off", "Never ignore a collections notice — respond or dispute immediately", "Never let fear of credit stop you from building a credit history"],
    articleUrl: "https://www.investopedia.com/terms/c/credit_score.asp",
    articleTitle: "Credit Score",
    articleDescription: "Your credit score affects your ability to borrow money and the interest rates you pay."
  },
  "High-Yield Savings Accounts": {
    level: 2,
    mustDos: ["Open an HYSA earning at least 4x the national average interest rate", "Use your HYSA specifically for your emergency fund and short-term savings goals", "Compare APY rates across multiple online banks before opening"],
    mustNeverDos: ["Never keep your emergency fund in a traditional savings account at 0.01% APY", "Never assume your current bank has the best rate — they rarely do", "Never confuse an HYSA with an investment account — it is not for wealth building"],
    articleUrl: "https://www.investopedia.com/terms/h/high-yield-savings-account.asp",
    articleTitle: "High-Yield Savings Account (HYSA)",
    articleDescription: "A high-yield savings account earns significantly more interest than a traditional savings account."
  },
  "Insurance 101": {
    level: 2,
    mustDos: ["Maintain continuous health insurance — even catastrophic coverage prevents financial ruin", "Understand your deductible and out-of-pocket maximum before you need to use insurance", "Review your coverage annually as income and life circumstances change"],
    mustNeverDos: ["Never go without health insurance if any affordable option exists", "Never buy insurance you don't understand — ask until it's clear", "Never skip renter's insurance — it costs under $20/month and covers thousands in losses"],
    articleUrl: "https://www.investopedia.com/terms/i/insurance.asp",
    articleTitle: "Insurance: Definition and Types",
    articleDescription: "Insurance is a contract that transfers financial risk from an individual to an insurance company."
  },
  "Sinking Funds Strategy": {
    level: 2,
    mustDos: ["Create separate sinking funds for predictable future expenses like car repairs and holidays", "Calculate the monthly contribution by dividing the target by months until needed", "Automate contributions to each sinking fund on payday"],
    mustNeverDos: ["Never mix sinking fund money with your emergency fund", "Never skip contributions when cash is tight — reduce the amount instead", "Never use sinking fund money for anything other than its designated purpose"],
    articleUrl: "https://www.investopedia.com/terms/s/sinkingfund.asp",
    articleTitle: "What Is a Sinking Fund?",
    articleDescription: "A sinking fund is money set aside in advance to cover a future expense or pay off a debt."
  },
  "Side Hustles": {
    level: 2,
    mustDos: ["Calculate your effective hourly rate for any side hustle to make sure it's worth your time", "Track side hustle income and set aside 25–30% for taxes immediately", "Reinvest early profits into tools or skills that increase your income"],
    mustNeverDos: ["Never start a side hustle that puts your primary income at risk", "Never forget to pay estimated quarterly taxes on self-employment income", "Never count on side hustle income as reliable until you've earned it 3+ months straight"],
    articleUrl: "https://www.investopedia.com/side-hustles-5184726",
    articleTitle: "Side Hustle: Definition and Examples",
    articleDescription: "A side hustle is work done outside of your main job to earn extra income."
  },
  "Income Growth Strategies": {
    level: 2,
    mustDos: ["Negotiate your salary at every job offer and annual review", "Invest in skills that directly increase your market value in your field", "Track your income growth annually and set a target increase percentage"],
    mustNeverDos: ["Never accept a job offer without negotiating", "Never stay in a role for more than 2 years without a raise or clear promotion path", "Never spend all of a pay raise — save at least 50% of every income increase"],
    articleUrl: "https://www.investopedia.com/financial-edge/0912/top-10-ways-to-increase-your-income.aspx",
    articleTitle: "Top Ways to Increase Your Income",
    articleDescription: "Practical strategies to grow your earned income over time."
  },
  "Open HYSA & Automate": {
    level: 2,
    mustDos: ["Open a high-yield savings account specifically for your emergency fund today", "Set up an automatic transfer on every payday", "Label savings accounts by goal so you know exactly what each dollar is for"],
    mustNeverDos: ["Never leave a large cash balance in a checking account earning nothing", "Never automate an amount so large that you risk overdrafting your checking account", "Never skip the automation step — removing the decision is the whole point"],
    articleUrl: "https://www.investopedia.com/best-high-yield-savings-accounts-4770633",
    articleTitle: "Best High-Yield Savings Accounts",
    articleDescription: "How to find and open the best high-yield savings account for your emergency fund."
  },
  "Side Hustle Quick Start": {
    level: 2,
    mustDos: ["Start with skills you already have before learning new ones for income", "Set a clear income goal for the first 90 days", "Complete at least one paid transaction within your first week — momentum matters"],
    mustNeverDos: ["Never spend money on expensive courses before earning your first dollar", "Never quit your main job for a side hustle before consistently replacing your income", "Never ignore the time cost — calculate your effective hourly rate"],
    articleUrl: "https://www.investopedia.com/side-hustles-5184726",
    articleTitle: "Side Hustle Ideas",
    articleDescription: "How to start a side hustle and earn extra income using skills you already have."
  },
  "Debt Avalanche Method": {
    level: 3,
    mustDos: ["List all debts by interest rate from highest to lowest", "Make minimum payments on all debts, then put every extra dollar toward the highest-rate debt", "Roll the full payment to the next debt once the highest-rate one is eliminated"],
    mustNeverDos: ["Never pay extra on a low-interest debt while a high-interest debt exists", "Never stop making minimums on other debts to supercharge the avalanche payment", "Never confuse the avalanche with paying the largest balance first — it is rate-based"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-avalanche.asp",
    articleTitle: "Debt Avalanche",
    articleDescription: "The debt avalanche method targets the highest interest rate first, saving the most money overall."
  },
  "Debt Snowball Method": {
    level: 3,
    mustDos: ["List all debts by balance from smallest to largest", "Make minimum payments on all debts, then put every extra dollar toward the smallest balance", "Use the wins from quick payoffs to stay motivated through the whole journey"],
    mustNeverDos: ["Never ignore the higher interest rates — you will pay more with this method", "Never stop making minimums on other debts to accelerate the smallest", "Never switch methods mid-execution without a clear reason — consistency matters"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-snowball.asp",
    articleTitle: "Debt Snowball",
    articleDescription: "The debt snowball method builds momentum by paying off the smallest debts first."
  },
  "Balance Transfer Strategy": {
    level: 3,
    mustDos: ["Calculate total fees vs. interest savings before doing any balance transfer", "Pay off the full transferred balance before the 0% promotional period ends", "Stop using the original card to prevent new debt from stacking up"],
    mustNeverDos: ["Never assume a balance transfer is free — always check the transfer fee (typically 3–5%)", "Never use a balance transfer as an excuse to ignore the spending habits that created the debt", "Never miss a payment during the promo period — it can void the 0% rate immediately"],
    articleUrl: "https://www.investopedia.com/terms/b/balance-transfer.asp",
    articleTitle: "Balance Transfer",
    articleDescription: "A balance transfer moves high-interest debt to a card with a lower or 0% promotional rate."
  },
  "Negotiating Interest Rates": {
    level: 3,
    mustDos: ["Call your credit card company directly and ask for a lower rate", "Reference your on-time payment history and competing offers when negotiating", "Ask about hardship programs if you're struggling — they often have unpublicized options"],
    mustNeverDos: ["Never assume your rate is fixed — it can almost always be negotiated", "Never threaten to cancel without being prepared to follow through", "Never negotiate rates without also addressing the spending habits that created the debt"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/021015/how-negotiate-lower-interest-rate-your-credit-card.asp",
    articleTitle: "How to Negotiate a Lower Interest Rate",
    articleDescription: "A step-by-step guide to calling your credit card company and requesting a lower APR."
  },
  "Debt Payoff Tracking": {
    level: 3,
    mustDos: ["Create a visual tracker showing your debt balances monthly", "Celebrate milestone payoffs to stay motivated through a long journey", "Update your tracker every month without exception"],
    mustNeverDos: ["Never stop tracking because it feels discouraging — the truth enables change", "Never forget to account for new charges when calculating payoff timelines", "Never compare your timeline to others — everyone's starting point is different"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/090716/how-debt-payoff-calculator-can-help-you.asp",
    articleTitle: "How a Debt Payoff Calculator Can Help",
    articleDescription: "Tracking your debt payoff progress keeps you motivated and on course to becoming debt-free."
  },
  "Choose Your Method": {
    level: 3,
    mustDos: ["Evaluate both avalanche and snowball methods against your actual debts and personality", "Choose the method you will actually stick to — the best method is the one you complete", "Write down your chosen strategy and review it monthly"],
    mustNeverDos: ["Never choose a method because it sounds impressive — choose what fits your behavior", "Never switch between methods every few months — commit to one for at least 12 months", "Never start without a written list of all debts including balances and interest rates"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/080716/debt-avalanche-vs-debt-snowball-which-best-you.asp",
    articleTitle: "Debt Avalanche vs. Debt Snowball: Which Is Best?",
    articleDescription: "A comparison of the two most popular debt payoff strategies to help you choose the right one."
  },
  "Attack High-Interest First": {
    level: 3,
    mustDos: ["Identify any debt above 10% APR and prioritize eliminating it immediately", "Calculate how much that debt costs you per month in interest charges", "Cut discretionary spending temporarily to funnel maximum payment toward it"],
    mustNeverDos: ["Never pay only minimums on high-interest debt — you may never pay it off", "Never invest before eliminating debt with a rate higher than your expected investment return", "Never normalize high-interest debt as something you will 'always have'"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-avalanche.asp",
    articleTitle: "Eliminating High-Interest Debt First",
    articleDescription: "Why attacking your highest interest rate debt first is the mathematically optimal strategy."
  },
"Understanding Credit Cards": {
    level: 3,
    mustDos: ["Pay your statement balance in full every month to avoid interest charges", "Know your APR and minimum payment before you ever use the card", "Use credit cards only for purchases you can already afford with cash"],
    mustNeverDos: ["Never carry a balance if you have a high APR — interest compounds fast", "Never make only the minimum payment — you will pay 3x the original cost over time", "Never use a credit card to cover expenses you can't afford — that is debt, not spending"],
    articleUrl: "https://www.investopedia.com/terms/c/creditcard.asp",
    articleTitle: "Credit Card: Definition and How They Work",
    articleDescription: "How credit cards work, including interest, grace periods, and the true cost of carrying a balance."
  },
  "Alternatives to Credit Cards": {
    level: 3,
    mustDos: ["Use a debit card or cash for everyday spending if you struggle with overspending", "Understand the fees and terms of any buy-now-pay-later (BNPL) service before using it", "Consider a secured credit card as a lower-risk way to build credit"],
    mustNeverDos: ["Never use BNPL services for purchases you can't pay off within the promotional period", "Never assume prepaid cards build your credit score — they don't", "Never ignore the difference between a charge card and a credit card — charge cards must be paid in full"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/072316/alternatives-credit-cards-when-and-why-use-them.asp",
    articleTitle: "Alternatives to Credit Cards",
    articleDescription: "Debit cards, prepaid cards, charge cards, and BNPL options compared for everyday spending."
  }
};
