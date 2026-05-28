// schemas.js — Zod schemas for all API request bodies
// Each schema validates and strips unknown fields.

const { z } = require('zod');

// ─── Plaid Routes ────────────────────────────────────────────────────────────

// 1. POST /api/plaid/create_link_token
const createLinkTokenSchema = z.object({
  userLevel: z.number().int().min(1).max(6).optional().default(1)
});

// 2. POST /api/plaid/exchange_public_token
const exchangePublicTokenSchema = z.object({
  publicToken: z.string().min(1, 'publicToken is required')
});

// 3. POST /api/plaid/sync_transactions
//    No body needed — userId comes from JWT
const syncTransactionsSchema = z.object({}).strict();

// 8. POST /api/plaid/budget/save
const saveBudgetSchema = z.object({
  budget: z.record(z.any()),
  approved: z.boolean().optional().default(false)
});

// 11. POST /api/plaid/actions/complete
const completeActionSchema = z.object({
  actionId: z.string().min(1, 'actionId is required'),
  actionType: z.string().optional(),
  points: z.number().int().min(0).optional().default(1)
});

// 15. POST /api/plaid/education/viewed
const educationViewedSchema = z.object({
  moduleId: z.string().min(1, 'moduleId is required'),
  moduleTitle: z.string().min(1, 'moduleTitle is required'),
  completed: z.boolean().optional().default(false)
});

// 16. POST /api/plaid/ai/generate_budget
//    No body needed — userId comes from JWT
const generateBudgetSchema = z.object({}).strict();

// 17. POST /api/plaid/ai/calculate_level
//    No body needed — userId comes from JWT
const calculateLevelSchema = z.object({}).strict();

// 20. POST /api/plaid/quiz/submit
const quizSubmitSchema = z.object({
  level: z.number().int().min(1).max(6),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  timeTaken: z.number().int().min(0).optional()
});

// POST /api/plaid/insights/save
const insightsSaveSchema = z.object({
  periodStart: z.string().min(1),
  periodEnd: z.string().min(1),
  needsTotal: z.number().min(0).optional().default(0),
  wantsTotal: z.number().min(0).optional().default(0),
  needsPct: z.number().min(0).max(100).optional().default(0),
  wantsPct: z.number().min(0).max(100).optional().default(0),
  topWantCategories: z.array(z.any()).optional().default([])
});

// POST /api/plaid/analyze_day
const analyzeDaySchema = z.object({
  date: z.string().min(1, 'date is required'),
  transactions: z.array(z.object({
    merchant: z.string().optional(),
    amount: z.number().optional(),
    tag: z.string().optional(),
    category: z.string().optional()
  })).optional().default([]),
  totals: z.object({
    needs: z.number().optional().default(0),
    wants: z.number().optional().default(0),
    untagged: z.number().optional().default(0)
  }).optional().default({}),
  dailyBudget: z.number().optional()
});

// ─── Query schemas (for GET routes with query params) ────────────────────────

// 7. GET /api/plaid/spending_by_category?startDate=...&endDate=...
const spendingByCategoryQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// 14. GET /api/plaid/budget/vs-actual?startDate=...&endDate=...
const budgetVsActualQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// ─── Comprehension Routes ────────────────────────────────────────────────────

// POST /api/comprehension/evaluate
const comprehensionEvaluateSchema = z.object({
  lessonId: z.string().min(1, 'lessonId is required'),
  userAnswer: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([]),
  userProfile: z.record(z.any()).optional(),
  spendingInsights: z.array(z.any()).optional(),
  interactionMode: z.enum(['check_in', 'clarify', 'action', 'comprehension']).optional(),
  bankInfo: z.string().optional()
});

// POST /api/comprehension/result
const comprehensionResultSchema = z.object({
  lessonId: z.string().min(1, 'lessonId is required'),
  passed: z.boolean(),
  score: z.number().int().min(0).max(100),
  phaseReached: z.string().optional().default('complete'),
  conversationHistory: z.array(z.any()).optional().default([]),
  gaps: z.array(z.any()).optional().default([])
});

// ─── Server.js Routes ────────────────────────────────────────────────────────

// POST /api/ai/level-placement
const levelPlacementSchema = z.object({
  diagnosticAnswers: z.record(z.any())
});

module.exports = {
  // Plaid
  createLinkTokenSchema,
  exchangePublicTokenSchema,
  syncTransactionsSchema,
  saveBudgetSchema,
  completeActionSchema,
  educationViewedSchema,
  generateBudgetSchema,
  calculateLevelSchema,
  quizSubmitSchema,
  insightsSaveSchema,
  analyzeDaySchema,
  spendingByCategoryQuerySchema,
  budgetVsActualQuerySchema,
  // Comprehension
  comprehensionEvaluateSchema,
  comprehensionResultSchema,
  // Server
  levelPlacementSchema
};
