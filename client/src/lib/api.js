import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Plaid ────────────────────────────────────────────────────────────────────

export const createLinkToken = (userLevel = 1) =>
  apiFetch('/api/plaid/create_link_token', {
    method: 'POST',
    body: JSON.stringify({ userLevel }),
  });

export const exchangePublicToken = (publicToken) =>
  apiFetch('/api/plaid/exchange_public_token', {
    method: 'POST',
    body: JSON.stringify({ publicToken }),
  });

export const syncTransactions = () =>
  apiFetch('/api/plaid/sync_transactions', { method: 'POST', body: '{}' });

export const getFinancialSummary = () =>
  apiFetch('/api/plaid/financial_summary');

export const getInvestments = () =>
  apiFetch('/api/plaid/investments');

export const getLiabilities = () =>
  apiFetch('/api/plaid/liabilities');

export const getSpendingByCategory = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  return apiFetch(`/api/plaid/spending_by_category?${params}`);
};

// ─── Budget ───────────────────────────────────────────────────────────────────

export const saveBudget = (budget, approved = false) =>
  apiFetch('/api/plaid/budget/save', {
    method: 'POST',
    body: JSON.stringify({ budget, approved }),
  });

export const getBudget = () =>
  apiFetch('/api/plaid/budget');

export const getBudgetVsActual = (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  return apiFetch(`/api/plaid/budget/vs-actual?${params}`);
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const getTransactionsForDay = (date) =>
  apiFetch(`/api/plaid/transactions/day/${date}`);

export const analyzeDay = (date, transactions, totals, dailyBudget) =>
  apiFetch('/api/plaid/analyze_day', {
    method: 'POST',
    body: JSON.stringify({ date, transactions, totals, dailyBudget }),
  });

// ─── Actions & Progress ──────────────────────────────────────────────────────

export const completeAction = (actionId, actionType, points = 1) =>
  apiFetch('/api/plaid/actions/complete', {
    method: 'POST',
    body: JSON.stringify({ actionId, actionType, points }),
  });

export const getCompletedActions = () =>
  apiFetch('/api/plaid/actions/completed');

export const getProgress = () =>
  apiFetch('/api/plaid/progress');

// ─── Education ────────────────────────────────────────────────────────────────

export const recordEducationViewed = (moduleId, moduleTitle, completed = false) =>
  apiFetch('/api/plaid/education/viewed', {
    method: 'POST',
    body: JSON.stringify({ moduleId, moduleTitle, completed }),
  });

// ─── AI ───────────────────────────────────────────────────────────────────────

export const generateAIBudget = () =>
  apiFetch('/api/plaid/ai/generate_budget', { method: 'POST', body: '{}' });

export const calculateAILevel = () =>
  apiFetch('/api/plaid/ai/calculate_level', { method: 'POST', body: '{}' });

export const getWeeklyInsights = () =>
  apiFetch('/api/plaid/ai/weekly_insights');

export const testAIService = () =>
  apiFetch('/api/plaid/ai/test', { method: 'POST' });

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export const submitQuiz = (level, score, totalQuestions, timeTaken) =>
  apiFetch('/api/plaid/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ level, score, totalQuestions, timeTaken }),
  });

// ─── Spending Insights ────────────────────────────────────────────────────────

export const saveInsights = (data) =>
  apiFetch('/api/plaid/insights/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getLatestInsights = () =>
  apiFetch('/api/plaid/insights/latest');

// ─── Comprehension ────────────────────────────────────────────────────────────

export const evaluateComprehension = (data) =>
  apiFetch('/api/comprehension/evaluate', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const saveComprehensionResult = (data) =>
  apiFetch('/api/comprehension/result', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// ─── Level Placement ──────────────────────────────────────────────────────────

export const getLevelPlacement = (diagnosticAnswers) =>
  apiFetch('/api/ai/level-placement', {
    method: 'POST',
    body: JSON.stringify({ diagnosticAnswers }),
  });
