// lessonConfig.js — Comprehension evaluation config for Levels 1–3
// Each entry maps a lesson name (must match LEVEL_CONFIG keys exactly) to its
// evaluation scaffolding: mustDos, mustNeverDos, keyTopics, and Investopedia fallback.

module.exports = {

  // ─── LEVEL 1: Building a Foundation ───────────────────────────────────────

  "Track Your Spending": {
    level: 1,
    mustDos: [
      "Track every dollar spent for at least one week",
      "Categorize spending into needs, wants, and savings",
      "Review spending weekly to identify patterns"
    ],
    mustNeverDos: [
      "Never ignore small purchases — they accumulate into significant amounts",
      "Never track spending only when you think you've overspent",
      "Never skip categorizing a transaction"
    ],
    keyTopics: ["spending tracking", "budget categories", "financial awareness"],
    articleUrl: "https://www.investopedia.com/articles/budgeting-savings/07/budget_car.asp",
    articleTitle: "How to Budget Money",
    articleDescription: "A practical step-by-step guide to building and maintaining a personal budget."
  },

  "Needs vs Wants": {
    level: 1,
    mustDos: [
      "Distinguish between essential needs and discretionary wants before every purchase",
      "Ask 'do I need this or just want this?' before any non-essential spend",
      "Redirect want-spending money toward financial goals when funds are tight"
    ],
    mustNeverDos: [
      "Never treat wants as needs to justify unnecessary spending",
      "Never cut all wants from your budget — that leads to burnout and failure",
      "Never make large want-purchases impulsively without a 24-48 hour wait"
    ],
    keyTopics: ["needs vs wants", "spending decisions", "impulse control"],
    articleUrl: "https://www.investopedia.com/terms/n/needs-and-wants.asp",
    articleTitle: "Needs vs. Wants",
    articleDescription: "Understanding the difference between needs and wants is the first step to a budget that works."
  },

  "50/30/20 Budget Basics": {
    level: 1,
    mustDos: [
      "Allocate 50% of after-tax income to needs",
      "Put 20% toward savings and debt repayment",
      "Use the remaining 30% for wants and discretionary spending"
    ],
    mustNeverDos: [
      "Never count debt minimum payments as part of your 20% savings",
      "Never skip adjusting the percentages when your income changes",
      "Never use the wants bucket to cover needs overflow without rebalancing"
    ],
    keyTopics: ["50/30/20 rule", "budget allocation", "after-tax income"],
    articleUrl: "https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp",
    articleTitle: "What Is the 50/30/20 Budget Rule?",
    articleDescription: "The 50/30/20 rule is a popular and simple framework for personal budgeting."
  },

  "Emergency Fund Strategy": {
    level: 2,
    mustDos: [
      "Build a starter emergency fund of at least $500–$1,000 before anything else",
      "Keep emergency funds in a separate, easily accessible savings account",
      "Define what qualifies as a true emergency before you ever need the money"
    ],
    mustNeverDos: [
      "Never invest your emergency fund in the stock market — it must be liquid",
      "Never use your emergency fund for non-emergencies like vacations or sales",
      "Never stop contributing until you hit your target (3–6 months of expenses)"
    ],
    keyTopics: ["emergency fund", "financial safety net", "liquid savings"],
    articleUrl: "https://www.investopedia.com/terms/e/emergency_fund.asp",
    articleTitle: "Emergency Fund",
    articleDescription: "An emergency fund is a financial safety net that protects you from unexpected expenses and job loss."
  },

  "Build Credit Without Cards": {
    level: 1,
    mustDos: [
      "Use rent reporting services to build payment history without a credit card",
      "Become an authorized user on a trusted family member's card if possible",
      "Check your credit score regularly with a free service like Credit Karma"
    ],
    mustNeverDos: [
      "Never miss a payment on any account — payment history is 35% of your score",
      "Never apply for multiple credit products in a short period",
      "Never close old accounts unnecessarily — length of credit history matters"
    ],
    keyTopics: ["credit building", "payment history", "credit score factors"],
    articleUrl: "https://www.investopedia.com/how-to-build-credit-5202955",
    articleTitle: "How to Build Credit",
    articleDescription: "Building credit without a credit card is possible through several smart strategies."
  },

  "Quick Budget Setup": {
    level: 1,
    mustDos: [
      "List all fixed monthly expenses before setting variable spending limits",
      "Build your budget around actual take-home pay, not gross income",
      "Set specific dollar amounts for each category, not just percentages"
    ],
    mustNeverDos: [
      "Never build a budget without reviewing last month's actual spending first",
      "Never create a budget and then never look at it again",
      "Never budget for a 'perfect month' — budget for reality"
    ],
    keyTopics: ["budgeting basics", "income tracking", "expense categories"],
    articleUrl: "https://www.investopedia.com/personal-finance/how-make-budget/",
    articleTitle: "How to Make a Personal Budget",
    articleDescription: "A practical walkthrough for setting up your first personal budget step by step."
  },

  "Auto-Save $50/month": {
    level: 1,
    mustDos: [
      "Automate savings transfers on payday so money moves before you can spend it",
      "Start with any amount — even $25/month builds the habit",
      "Treat your savings transfer like a non-negotiable bill payment"
    ],
    mustNeverDos: [
      "Never rely on willpower alone to save — automate it",
      "Never cancel your auto-save when money gets tight without a plan to restart",
      "Never keep savings in the same account as spending money"
    ],
    keyTopics: ["automated savings", "pay yourself first", "savings habits"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/052014/3-ways-automate-your-savings.asp",
    articleTitle: "3 Ways to Automate Your Savings",
    articleDescription: "Automating savings removes willpower from the equation and makes building wealth effortless."
  },

  "Credit Building Basics": {
    level: 1,
    mustDos: [
      "Pay every bill on time — payment history is the single biggest factor in your score",
      "Keep credit utilization below 30% of any credit limit",
      "Monitor your credit report for errors at least once a year"
    ],
    mustNeverDos: [
      "Never max out a credit card even if you plan to pay it off",
      "Never ignore a collections notice — respond or dispute immediately",
      "Never let fear of credit stop you from building a credit history"
    ],
    keyTopics: ["credit score factors", "credit utilization", "payment history"],
    articleUrl: "https://www.investopedia.com/terms/c/credit_score.asp",
    articleTitle: "Credit Score",
    articleDescription: "Your credit score affects your ability to borrow money and the interest rates you pay."
  },

  // ─── LEVEL 2: Building Safety ──────────────────────────────────────────────

  "High-Yield Savings Accounts": {
    level: 2,
    mustDos: [
      "Open an HYSA earning at least 4x the national average interest rate",
      "Use your HYSA specifically for your emergency fund and short-term savings goals",
      "Compare APY rates across multiple online banks before opening"
    ],
    mustNeverDos: [
      "Never keep your emergency fund in a traditional savings account at 0.01% APY",
      "Never assume your current bank has the best rate — they rarely do",
      "Never confuse an HYSA with an investment account — it is not for long-term wealth building"
    ],
    keyTopics: ["high-yield savings", "APY", "FDIC insurance", "interest rates"],
    articleUrl: "https://www.investopedia.com/terms/h/high-yield-savings-account.asp",
    articleTitle: "High-Yield Savings Account (HYSA)",
    articleDescription: "A high-yield savings account earns significantly more interest than a traditional savings account."
  },

  "Insurance 101": {
    level: 2,
    mustDos: [
      "Maintain continuous health insurance — even catastrophic coverage prevents financial ruin",
      "Understand your deductible and out-of-pocket maximum before you need to use insurance",
      "Review your coverage annually as income and life circumstances change"
    ],
    mustNeverDos: [
      "Never go without health insurance if any affordable option exists",
      "Never buy insurance you don't understand — ask until it's clear",
      "Never skip renter's insurance — it costs under $20/month and covers thousands in losses"
    ],
    keyTopics: ["health insurance", "renter's insurance", "deductibles", "risk management"],
    articleUrl: "https://www.investopedia.com/terms/i/insurance.asp",
    articleTitle: "Insurance: Definition and Types",
    articleDescription: "Insurance is a contract that transfers financial risk from an individual to an insurance company."
  },

  "Sinking Funds Strategy": {
    level: 2,
    mustDos: [
      "Create separate sinking funds for predictable future expenses like car repairs and holidays",
      "Calculate the monthly contribution needed by dividing the target by months until needed",
      "Automate contributions to each sinking fund on payday"
    ],
    mustNeverDos: [
      "Never mix sinking fund money with your emergency fund — they serve different purposes",
      "Never skip contributions to sinking funds when cash is tight — reduce the amount instead",
      "Never use sinking fund money for anything other than its designated purpose"
    ],
    keyTopics: ["sinking funds", "planned savings", "expense forecasting"],
    articleUrl: "https://www.investopedia.com/terms/s/sinkingfund.asp",
    articleTitle: "What Is a Sinking Fund?",
    articleDescription: "A sinking fund is money set aside in advance to cover a future expense or pay off a debt."
  },

  "Side Hustle Ideas for Gen Z": {
    level: 2,
    mustDos: [
      "Calculate your effective hourly rate for any side hustle to make sure it's worth your time",
      "Track side hustle income and set aside 25–30% for taxes immediately",
      "Reinvest early profits into tools or skills that increase your income"
    ],
    mustNeverDos: [
      "Never start a side hustle that puts your primary income or job at risk",
      "Never forget to pay estimated quarterly taxes on self-employment income",
      "Never count on side hustle income as reliable until you've earned it for 3+ months straight"
    ],
    keyTopics: ["side hustle", "self-employment taxes", "income diversification"],
    articleUrl: "https://www.investopedia.com/side-hustles-5184726",
    articleTitle: "Side Hustle: Definition and Examples",
    articleDescription: "A side hustle is work done outside of your main job to earn extra income."
  },

  "Income Growth Strategies": {
    level: 2,
    mustDos: [
      "Negotiate your salary at every job offer and annual review — most employers expect it",
      "Invest in skills that directly increase your market value in your field",
      "Track your income growth annually and set a target increase percentage"
    ],
    mustNeverDos: [
      "Never accept a job offer without negotiating — the worst they can say is no",
      "Never stay in a role for more than 2 years without a raise or clear promotion path",
      "Never spend all of a pay raise — save at least 50% of every income increase"
    ],
    keyTopics: ["salary negotiation", "income growth", "career development"],
    articleUrl: "https://www.investopedia.com/financial-edge/0912/top-10-ways-to-increase-your-income.aspx",
    articleTitle: "Top Ways to Increase Your Income",
    articleDescription: "Practical strategies to grow your earned income over time."
  },

  "Open HYSA & Automate": {
    level: 2,
    mustDos: [
      "Open a high-yield savings account specifically for your emergency fund today",
      "Set up an automatic transfer of a fixed amount on every payday",
      "Label savings accounts by goal so you know exactly what each dollar is for"
    ],
    mustNeverDos: [
      "Never leave a large cash balance sitting in a checking account earning nothing",
      "Never automate an amount so large that you risk overdrafting your checking account",
      "Never skip the automation step — removing the decision is the whole point"
    ],
    keyTopics: ["HYSA", "savings automation", "goal-based savings", "pay yourself first"],
    articleUrl: "https://www.investopedia.com/best-high-yield-savings-accounts-4770633",
    articleTitle: "Best High-Yield Savings Accounts",
    articleDescription: "How to find and open the best high-yield savings account for your emergency fund."
  },

  "Side Hustle Quick Start": {
    level: 2,
    mustDos: [
      "Start with skills you already have before learning new ones purely for income",
      "Set a clear income goal for your side hustle in the first 90 days",
      "Complete at least one paid transaction within your first week — momentum matters"
    ],
    mustNeverDos: [
      "Never spend money on expensive courses or tools before earning your first dollar",
      "Never quit your main job to pursue a side hustle full-time before consistently replacing your income",
      "Never ignore the time cost — if it earns less than your hourly rate, reconsider it"
    ],
    keyTopics: ["side hustle launch", "first income milestone", "time value"],
    articleUrl: "https://www.investopedia.com/side-hustles-5184726",
    articleTitle: "Side Hustle Ideas",
    articleDescription: "How to start a side hustle and earn extra income using skills you already have."
  },

  // ─── LEVEL 3: Crushing Debt ────────────────────────────────────────────────

  "Debt Avalanche Method": {
    level: 3,
    mustDos: [
      "List all debts by interest rate from highest to lowest",
      "Make minimum payments on all debts, then put every extra dollar toward the highest-rate debt",
      "Once the highest-rate debt is gone, roll that full payment to the next one"
    ],
    mustNeverDos: [
      "Never pay extra on a low-interest debt while a high-interest debt exists",
      "Never stop making minimum payments on other debts to supercharge the avalanche payment",
      "Never confuse the avalanche with simply paying the largest balance first — it is rate-based"
    ],
    keyTopics: ["debt avalanche", "interest rate priority", "debt payoff optimization"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-avalanche.asp",
    articleTitle: "Debt Avalanche",
    articleDescription: "The debt avalanche method targets the highest interest rate first, saving the most money overall."
  },

  "Debt Snowball Method": {
    level: 3,
    mustDos: [
      "List all debts by balance from smallest to largest",
      "Make minimum payments on all debts, then put every extra dollar toward the smallest balance",
      "Use the motivational wins from quick payoffs to stay committed"
    ],
    mustNeverDos: [
      "Never ignore the higher interest rates — understand you will pay more with this method",
      "Never stop making minimum payments on other debts to accelerate the smallest",
      "Never switch methods mid-execution without a clear reason — consistency matters"
    ],
    keyTopics: ["debt snowball", "behavior and motivation", "smallest balance first"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-snowball.asp",
    articleTitle: "Debt Snowball",
    articleDescription: "The debt snowball method builds momentum by paying off the smallest debts first."
  },

  "Balance Transfer Strategy": {
    level: 3,
    mustDos: [
      "Calculate total fees vs. interest savings before doing a balance transfer",
      "Pay off the full transferred balance before the 0% promotional period ends",
      "Stop using the original card to prevent new debt from stacking up"
    ],
    mustNeverDos: [
      "Never assume a balance transfer is free — always check the transfer fee (typically 3–5%)",
      "Never use a balance transfer as an excuse to ignore the spending habits that created the debt",
      "Never miss a payment during the promotional period — it can void the 0% rate immediately"
    ],
    keyTopics: ["balance transfer", "0% APR promotions", "transfer fees", "debt consolidation"],
    articleUrl: "https://www.investopedia.com/terms/b/balance-transfer.asp",
    articleTitle: "Balance Transfer",
    articleDescription: "A balance transfer moves high-interest debt to a card with a lower or 0% promotional rate."
  },

  "Negotiating Interest Rates": {
    level: 3,
    mustDos: [
      "Call your credit card company directly and ask for a lower interest rate",
      "Reference your on-time payment history and competing offers when negotiating",
      "Ask about hardship programs if you're struggling — they often have unpublicized options"
    ],
    mustNeverDos: [
      "Never assume your rate is fixed — it can almost always be negotiated",
      "Never threaten to cancel without being prepared to follow through",
      "Never negotiate rates without also addressing the spending habits that created the debt"
    ],
    keyTopics: ["interest rate negotiation", "credit card hardship programs", "APR reduction"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/021015/how-negotiate-lower-interest-rate-your-credit-card.asp",
    articleTitle: "How to Negotiate a Lower Interest Rate",
    articleDescription: "A step-by-step guide to calling your credit card company and requesting a lower APR."
  },

  "Debt Payoff Tracking": {
    level: 3,
    mustDos: [
      "Create a visual tracker (spreadsheet, app, or paper) showing your balances monthly",
      "Celebrate milestone payoffs to maintain motivation through a long payoff journey",
      "Update your tracker every month without exception to see real progress"
    ],
    mustNeverDos: [
      "Never stop tracking because it feels discouraging — the truth enables change",
      "Never forget to account for new charges when calculating payoff timelines",
      "Never compare your timeline to others — everyone's starting point and income are different"
    ],
    keyTopics: ["debt tracking", "progress measurement", "payoff motivation"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/090716/how-debt-payoff-calculator-can-help-you.asp",
    articleTitle: "How a Debt Payoff Calculator Can Help",
    articleDescription: "Tracking your debt payoff progress keeps you motivated and on course to becoming debt-free."
  },

  "Choose Your Method": {
    level: 3,
    mustDos: [
      "Evaluate both avalanche and snowball methods against your actual debts and personality",
      "Choose the method you will actually stick to — the best method is the one you complete",
      "Write down your chosen strategy and review it monthly"
    ],
    mustNeverDos: [
      "Never choose a method because it sounds impressive — choose what works for your behavior",
      "Never switch between methods every few months — commit to one for at least 12 months",
      "Never start without writing down your full debt list including balances and interest rates"
    ],
    keyTopics: ["debt strategy selection", "avalanche vs snowball", "commitment to plan"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/080716/debt-avalanche-vs-debt-snowball-which-best-you.asp",
    articleTitle: "Debt Avalanche vs. Debt Snowball: Which Is Best?",
    articleDescription: "A comparison of the two most popular debt payoff strategies to help you choose the right one."
  },

  "Attack High-Interest First": {
    level: 3,
    mustDos: [
      "Identify any debt with an APR above 10% and prioritize eliminating it immediately",
      "Calculate how much that high-interest debt costs you per month in interest charges",
      "Cut discretionary spending temporarily to funnel maximum payment toward the high-rate debt"
    ],
    mustNeverDos: [
      "Never pay only minimums on high-interest debt — you may never pay it off",
      "Never invest before eliminating debt with an interest rate higher than your expected investment return",
      "Never normalize high-interest debt as something you will 'always have'"
    ],
    keyTopics: ["high-interest debt", "opportunity cost", "debt priority"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-avalanche.asp",
    articleTitle: "Eliminating High-Interest Debt First",
    articleDescription: "Why attacking your highest interest rate debt first is the mathematically optimal strategy."
  },

  // ─── LEVEL 2 ADDITIONS ──────────────────────────────────────────────────────

  "Finding Extra Money": {
    level: 2,
    mustDos: [
      "Audit every subscription and recurring charge — cancel anything you haven't used in 30 days",
      "Compare spending in at least 2 categories (food, transport, entertainment) to your prior month",
      "Immediately redirect any freed-up money to savings before you can spend it elsewhere"
    ],
    mustNeverDos: [
      "Never cancel then re-subscribe to the same service within 60 days — you're just delaying",
      "Never assume small purchases don't add up — $5/day is $1,825/year",
      "Never wait for a 'good time' to find savings — there's always something you can cut today"
    ],
    keyTopics: ["subscription audit", "spending comparison", "redirecting savings"],
    articleUrl: "https://www.investopedia.com/articles/budgeting-savings/07/budget_car.asp",
    articleTitle: "How to Find Extra Money in Your Budget",
    articleDescription: "Simple strategies for locating hidden cash in your current spending habits."
  },

  "Side Hustle Ideas for Gen Z": {
    level: 2,
    mustDos: [
      "Start with skills you already have — tutoring, freelance writing, design, or social media management",
      "Track all side hustle income separately and set aside 25–30% for taxes from the start",
      "Treat your side hustle like a business — invoice clients, keep receipts, and set regular hours"
    ],
    mustNeverDos: [
      "Never mix side hustle money with regular spending without tracking it first",
      "Never skip setting aside taxes — self-employment income isn't withheld automatically",
      "Never invest time in a side hustle with high startup costs before validating demand"
    ],
    keyTopics: ["side income", "self-employment taxes", "skill monetization"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/092415/what-side-hustle.asp",
    articleTitle: "What Is a Side Hustle?",
    articleDescription: "How to pick and start a side hustle that fits your schedule and earns real money."
  },

  "Income Growth Strategies": {
    level: 2,
    mustDos: [
      "Ask for a raise using data — know your market rate before any negotiation",
      "Invest in one skill annually that demonstrably increases your earning potential",
      "Diversify income streams so no single source represents more than 80% of total income"
    ],
    mustNeverDos: [
      "Never accept the first salary offer without negotiating — employers expect it",
      "Never spend income increases before they arrive — lifestyle inflation kills wealth",
      "Never ignore employer benefits like 401k matching — that is free money"
    ],
    keyTopics: ["salary negotiation", "skills investment", "income diversification"],
    articleUrl: "https://www.investopedia.com/articles/pf/07/salary-negotiation.asp",
    articleTitle: "Salary Negotiation Tips",
    articleDescription: "How to negotiate your salary effectively and grow your income over time."
  },

  // ─── LEVEL 3 ADDITIONS ──────────────────────────────────────────────────────

  "Understanding Credit Cards": {
    level: 3,
    mustDos: [
      "Always pay the full statement balance before the due date to avoid interest charges",
      "Know your card's APR — interest compounds daily on any balance you carry",
      "Only charge what you could pay in cash — a credit card is a convenience tool, not extra money"
    ],
    mustNeverDos: [
      "Never pay only the minimum — it can take years to pay off a $1,000 balance",
      "Never exceed 30% of your credit limit — high utilization damages your credit score",
      "Never open multiple new cards in a short period — each application creates a hard inquiry"
    ],
    keyTopics: ["APR", "minimum payments", "credit utilization", "compound interest"],
    articleUrl: "https://www.investopedia.com/terms/c/creditcard.asp",
    articleTitle: "How Credit Cards Work",
    articleDescription: "A complete breakdown of how credit cards charge interest and affect your credit score."
  },

  "Alternatives to Credit Cards": {
    level: 3,
    mustDos: [
      "Use a debit card or prepaid card if you struggle with overspending on credit",
      "Understand BNPL terms before using — missed payments often trigger high interest or fees",
      "Consider a secured credit card to build credit with less risk of overspending"
    ],
    mustNeverDos: [
      "Never use BNPL for non-essential purchases you couldn't afford in cash",
      "Never confuse a charge card with a credit card — charge cards must be paid in full monthly",
      "Never stack multiple BNPL plans simultaneously — it becomes impossible to track"
    ],
    keyTopics: ["debit cards", "prepaid cards", "buy-now-pay-later", "secured credit cards"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/050214/credit-vs-debit-cards-which-better.asp",
    articleTitle: "Credit vs. Debit Cards: Which Is Better?",
    articleDescription: "The tradeoffs between credit cards, debit cards, and BNPL — and when to use each."
  },

  "Debt Avalanche Method": {
    level: 3,
    mustDos: [
      "List all debts by interest rate from highest to lowest and attack the highest rate first",
      "Continue making minimum payments on all other debts while you target the top one",
      "Once the highest-rate debt is paid, roll that payment to the next highest — never pocket it"
    ],
    mustNeverDos: [
      "Never skip minimum payments on other debts while avalanching — late fees and credit damage offset savings",
      "Never restart the avalanche order without finishing — consistency is what makes it work",
      "Never abandon avalanche for snowball mid-journey without a clear reason"
    ],
    keyTopics: ["debt avalanche", "interest rate priority", "debt rollover"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-avalanche.asp",
    articleTitle: "The Debt Avalanche Method",
    articleDescription: "How to use the avalanche method to pay off debt while minimizing total interest paid."
  },

  "Debt Snowball Method": {
    level: 3,
    mustDos: [
      "List all debts by balance from smallest to largest and eliminate the smallest first",
      "Keep minimum payments on all others while you focus all extra cash on the smallest debt",
      "Roll each paid-off debt's payment into the next smallest balance — momentum compounds"
    ],
    mustNeverDos: [
      "Never ignore the cost of not using the avalanche method — snowball costs more interest over time",
      "Never add new debt while in snowball mode — it restarts your momentum",
      "Never celebrate too long — move the freed payment immediately to the next debt"
    ],
    keyTopics: ["debt snowball", "behavioral motivation", "momentum effect"],
    articleUrl: "https://www.investopedia.com/terms/d/debt-snowball.asp",
    articleTitle: "The Debt Snowball Method",
    articleDescription: "Why eliminating small debts first builds momentum and motivation for debt freedom."
  },

  "Negotiating Interest Rates": {
    level: 3,
    mustDos: [
      "Call your credit card issuer and explicitly ask for a lower APR — it works more often than you think",
      "Know your current rate and have a competing offer or your payment history ready before calling",
      "Ask to speak with a retention specialist if the first rep says no"
    ],
    mustNeverDos: [
      "Never threaten to close an account unless you are genuinely prepared to do so",
      "Never negotiate from a position of desperation — issuers respond better to good-standing customers",
      "Never ignore the possibility of a balance transfer — sometimes moving the debt is more effective than negotiating"
    ],
    keyTopics: ["APR negotiation", "balance transfer", "retention department"],
    articleUrl: "https://www.investopedia.com/articles/personal-finance/021015/how-negotiate-lower-interest-rate-your-credit-card.asp",
    articleTitle: "How to Negotiate a Lower Interest Rate",
    articleDescription: "Scripts and strategies for calling your credit card company and successfully lowering your APR."
  }

};
