import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PERSONAS } from '../config/personas';
import {
  getFinancialSummary,
  createLinkToken,
  exchangePublicToken,
  syncTransactions,
  analyzeDay,
} from '../lib/api';
import AuthScreen from './AuthScreen';
import DiagnosticScreen from './DiagnosticScreen';
import PlaidConnectScreen from './PlaidConnectScreen';
import WelcomeScreen from './WelcomeScreen';
import DashboardView from './DashboardView';
import LessonView from './LessonView';
import FriendsScreen from './FriendsScreen';

const Migo = () => {
  // Auth state
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('signin');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [view, setView] = useState('plaidConnect');
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [currentPersona, setCurrentPersona] = useState('maya');
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [currentDiagnosticQuestion, setCurrentDiagnosticQuestion] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [projectionYears, setProjectionYears] = useState(10);
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showComprehension, setShowComprehension] = useState(false);
  const [linkToken, setLinkToken] = useState(null);
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [financialData, setFinancialData] = useState(null);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [completedActions, setCompletedActions] = useState(new Set());
  const [expenseTags, setExpenseTags] = useState({});
  const [expenseCategories, setExpenseCategories] = useState({});
  const [budgetPrefs, setBudgetPrefs] = useState({ income: null, needs: 50, wants: 30, savings: 20 });
  const [lessonViewMode, setLessonViewMode] = useState('video');
  const [dayReview, setDayReview] = useState(null);
  const [dayReviewLoading, setDayReviewLoading] = useState(false);
  const [dashboardScrollTarget, setDashboardScrollTarget] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [tripForm, setTripForm] = useState({ title: '', budget: '', members: [{ name: '', contact: '' }] });
  const [tripSaving, setTripSaving] = useState(false);
  const [tripSaved, setTripSaved] = useState(false);
  const [showCheckSavingsModal, setShowCheckSavingsModal] = useState(false);
  const [checkSavingsStep, setCheckSavingsStep] = useState(1);
  const [checkSavingsAmount, setCheckSavingsAmount] = useState('');
  const [manualSavingsTransfer, setManualSavingsTransfer] = useState(0);
  const [showWantsModal, setShowWantsModal] = useState(false);
  const [wantsLog, setWantsLog] = useState([]);
  const [wantsInput, setWantsInput] = useState('');

  const persona = PERSONAS[currentPersona];
  const userId = user?.id;

  // ─── API helpers ────────────────────────────────────────────────────────────

  const fetchFinancialSummary = async () => {
    try {
      const data = await getFinancialSummary();
      setFinancialData(data);
    } catch (e) {
      console.error('fetchFinancialSummary error:', e);
    }
  };

  const fetchLinkToken = async () => {
    try {
      const data = await createLinkToken(1);
      if (data.link_token) setLinkToken(data.link_token);
    } catch (e) {
      console.error('fetchLinkToken error:', e);
    }
  };

  const handlePlaidSuccess = async (publicToken) => {
    setPlaidLoading(true);
    try {
      await exchangePublicToken(publicToken);
      await syncTransactions();
      await fetchFinancialSummary();
      setPlaidConnected(true);
      setShowDiagnostic(true);
    } catch (e) {
      console.error('handlePlaidSuccess error:', e);
    } finally {
      setPlaidLoading(false);
    }
  };

  const openPlaidLink = () => {
    if (!linkToken || !window.Plaid) return;
    const handler = window.Plaid.create({
      token: linkToken,
      onSuccess: (public_token) => handlePlaidSuccess(public_token),
      onExit: (err) => { if (err) console.error('Plaid exit:', err); }
    });
    handler.open();
  };

  const loadUserProgress = async (uid) => {
    try {
      const [{ data: passedLessons }, { data: doneActions }] = await Promise.all([
        supabase.from('comprehension_results').select('lesson_id').eq('user_id', uid).eq('passed', true),
        supabase.from('user_actions').select('action_id').eq('user_id', uid),
      ]);
      if (passedLessons) setCompletedLessons(new Set(passedLessons.map(r => r.lesson_id)));
      if (doneActions) setCompletedActions(new Set(doneActions.map(r => r.action_id)));
    } catch(e) { console.error('loadUserProgress error:', e); }
  };

  const routeAfterAuth = async (session) => {
    setUser(session.user);
    const { data: items } = await supabase
      .from('plaid_items')
      .select('id')
      .eq('user_id', session.user.id)
      .limit(1);
    if (items && items.length > 0) {
      setPlaidConnected(true);
      await Promise.all([
        fetchFinancialSummary(),
        loadUserProgress(session.user.id),
      ]);
      setShowDiagnostic(false);
      setView('dashboard');
    } else {
      setShowDiagnostic(false);
      setView('plaidConnect');
      await fetchLinkToken();
    }
  };

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        routeAfterAuth(session);
      } else {
        setUser(null);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        routeAfterAuth(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setPlaidConnected(false);
        setFinancialData(null);
        setLinkToken(null);
        setView('plaidConnect');
        setShowDiagnostic(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !selectedLesson) return;
    const saved = localStorage.getItem('migo_diagnostic_' + userId);
    if (saved) {
      try {
        const answers = JSON.parse(saved);
        const style = answers.learning_style || [];
        const preferArticle = Array.isArray(style) ? style.includes('reading') : style === 'reading';
        setLessonViewMode(preferArticle ? 'article' : 'video');
      } catch(e) { setLessonViewMode('video'); }
    } else {
      setLessonViewMode('video');
    }
  }, [userId, selectedLesson]);

  useEffect(() => {
    if (!dashboardScrollTarget) return;
    const el = document.getElementById(dashboardScrollTarget);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setDashboardScrollTarget(null);
  }, [dashboardScrollTarget]);

  useEffect(() => {
    localStorage.setItem('migo_current_view', view);
  }, [view]);

  // ─── Shared helpers ─────────────────────────────────────────────────────────

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const completeAction = async (actionId) => {
    setCompletedActions(prev => new Set([...prev, actionId]));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await supabase.from('user_actions').upsert(
        { user_id: userId, action_id: actionId, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,action_id' }
      );
    } catch(e) { console.error('completeAction error:', e); }
  };

  const toggleExpenseTag = (txId, tag) => {
    setExpenseTags(prev => {
      const next = { ...prev };
      if (next[txId] === tag) delete next[txId];
      else next[txId] = tag;
      const newCount = Object.keys(next).length;
      if (newCount >= 21 && !completedActions.has('tag_expenses')) {
        completeAction('tag_expenses');
      }
      return next;
    });
  };

  const tagExpenseCategory = (txId, category) => {
    setExpenseCategories(prev => {
      const next = { ...prev };
      if (next[txId] === category) delete next[txId];
      else next[txId] = category;
      return next;
    });
  };

  const submitDayReview = async (dayData) => {
    setDayReviewLoading(true);
    setDayReview(null);
    try {
      const txs = (dayData.transactions || []).map((tx, idx) => {
        const txId = tx.plaid_transaction_id || `${dayData.day}-${idx}`;
        return { merchant: tx.merchant, amount: tx.amount, tag: expenseTags[txId] || 'untagged', category: expenseCategories[txId] || 'uncategorized' };
      });
      const needs = txs.filter(t => t.tag === 'need').reduce((s, t) => s + t.amount, 0);
      const wants = txs.filter(t => t.tag === 'want').reduce((s, t) => s + t.amount, 0);
      const totals = { needs, wants, untagged: dayData.spent - needs - wants };
      const result = await analyzeDay(dayData.fullDate, txs, totals, dayData.budget);
      setDayReview(result);
    } catch(e) { console.error('submitDayReview error:', e); }
    finally { setDayReviewLoading(false); }
  };

  const generateInviteLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const link = `https://migo.app/invite/${randomId}`;
    setInviteLink(link);
    setShowInviteModal(true);
  };

  const [inviteCopied, setInviteCopied] = useState(false);
  const copyInviteLink = () => {
    try {
      navigator.clipboard.writeText(inviteLink);
    } catch(e) {
      const el = document.getElementById('invite-link-input');
      if (el) { el.select(); document.execCommand('copy'); }
    }
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2500);
  };

  const calculateProjection = (years) => {
    const currentSavings = persona.financials.savings + persona.financials.checking;
    const monthlySavings = persona.financials.monthlyIncome * (persona.financials.savingsRate / 100);
    const assumedReturn = 0.07;
    const data = [];
    for (let year = 0; year <= years; year++) {
      const months = year * 12;
      const compoundGrowth = currentSavings * Math.pow(1 + assumedReturn, year);
      const contributionGrowth = monthlySavings * ((Math.pow(1 + assumedReturn/12, months) - 1) / (assumedReturn/12));
      data.push({ year, amount: Math.round(compoundGrowth + contributionGrowth) });
    }
    return data;
  };

  const buildRealCalendarData = () => {
    const today = new Date();
    const txs = financialData?.transactions || [];
    const dailyBudget = (financialData?.summary?.totalIncome || persona.financials.monthlyIncome) / 30;
    const byDate = {};
    txs.forEach(tx => { if (!byDate[tx.date]) byDate[tx.date] = []; byDate[tx.date].push(tx); });
    const currentDayOfWeek = today.getDay();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - currentDayOfWeek - 7);
    const calendar = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(lastWeekStart);
      d.setDate(lastWeekStart.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];
      const dayTxs = byDate[dateKey] || [];
      const spent = dayTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
      const saved = dayTxs.filter(t => t.amount < 0 && (t.category || '').toLowerCase().includes('transfer')).reduce((s, t) => s + Math.abs(t.amount), 0);
      let status = 'average', insight = 'Stayed on track', highlightEvent = null;
      if (spent < dailyBudget * 0.85) {
        status = 'good';
        insight = `Under budget by ${formatCurrency(dailyBudget - spent)}`;
        highlightEvent = { type: 'good', text: `Spent less than usual`, color: '#10b981' };
      } else if (spent > dailyBudget * 1.1) {
        status = 'over';
        insight = `Over by ${formatCurrency(spent - dailyBudget)}`;
        highlightEvent = { type: 'overspend', text: `Overspent by ${formatCurrency(spent - dailyBudget)}`, color: '#ef4444' };
      }
      calendar.push({
        day: d.getDate(), fullDate: d, status, spent: Math.round(spent), saved: Math.round(saved),
        budget: Math.round(dailyBudget), insight, highlightEvent,
        transactions: dayTxs.map(t => ({ merchant: t.merchant_name || 'Unknown', amount: Math.abs(t.amount), time: t.date, plaid_transaction_id: t.plaid_transaction_id, isIncome: t.amount < 0 })),
        isToday: d.toDateString() === today.toDateString(),
      });
    }
    return { days: calendar, startDate: lastWeekStart, endDate: new Date(lastWeekStart.getTime() + 13 * 24 * 60 * 60 * 1000) };
  };

  const generateTransactions = (status, totalSpent, bill = null) => {
    const txCount = status === 'good' ? 2 + Math.floor(Math.random() * 2) :
                   status === 'average' ? 3 + Math.floor(Math.random() * 3) :
                   5 + Math.floor(Math.random() * 3);
    const categories = ['Grocery Store', 'Gas Station', 'Restaurant', 'Coffee Shop', 'Amazon', 'Target', 'Uber'];
    const transactions = [];
    let remaining = totalSpent;
    if (bill) {
      transactions.push({ merchant: bill.name, amount: bill.amount, time: `9:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`, category: 'Bills' });
      remaining -= bill.amount;
    }
    for (let i = 0; i < txCount; i++) {
      const amount = i === txCount - 1 ? remaining : Math.round(remaining * (0.2 + Math.random() * 0.4));
      transactions.push({
        merchant: categories[Math.floor(Math.random() * categories.length)],
        amount: Math.max(5, amount),
        time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        category: status === 'over' ? 'Discretionary' : 'Essentials'
      });
      remaining -= amount;
    }
    return transactions.sort((a, b) => b.amount - a.amount);
  };

  const generateCalendarData = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - currentDayOfWeek - 7);
    const calendar = [];
    const levelMultiplier = persona.level <= 2 ? 0.7 : persona.level <= 4 ? 0.85 : 0.95;
    const billSchedule = {
      1: { name: "Rent", amount: persona.financials.monthlyIncome * 0.3 },
      5: { name: "Phone Bill", amount: 55 },
      8: { name: "Internet", amount: 65 },
      12: { name: "Car Insurance", amount: 125 }
    };
    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(lastWeekStart);
      currentDate.setDate(lastWeekStart.getDate() + i);
      const dayOfMonth = currentDate.getDate();
      const rand = Math.random() * levelMultiplier;
      let status, spent, saved, budget, insight, highlightEvent;
      budget = persona.financials.monthlyBudget / 30;
      const billToday = billSchedule[i];
      const isSavingsDay = i % 7 === 0;
      if (rand < 0.35) {
        status = 'good'; spent = budget * (0.5 + Math.random() * 0.3); saved = budget * 0.2;
        if (isSavingsDay) {
          const savingsAmount = Math.round(persona.financials.monthlyIncome * 0.05 * (1 + Math.random() * 0.5));
          saved += savingsAmount;
          highlightEvent = { type: 'savings', text: `Moved ${formatCurrency(savingsAmount)} to savings`, color: '#10b981' };
          insight = `Great! You saved ${formatCurrency(saved)} today`;
        } else {
          const underBy = Math.round(budget - spent);
          insight = `Under budget by ${formatCurrency(underBy)}`;
          highlightEvent = { type: 'good', text: `Spent ${formatCurrency(underBy)} less than usual`, color: '#10b981' };
        }
      } else if (rand < 0.7) {
        status = 'average'; spent = budget * (0.85 + Math.random() * 0.2); saved = budget * 0.05;
        insight = `Stayed on track`;
        if (isSavingsDay) {
          const savingsAmount = Math.round(persona.financials.monthlyIncome * 0.05);
          saved += savingsAmount;
          highlightEvent = { type: 'savings', text: `Moved ${formatCurrency(savingsAmount)} to savings`, color: '#10b981' };
        }
      } else {
        status = 'over'; spent = budget * (1.2 + Math.random() * 0.5); saved = 0;
        const overspendReasons = [
          { place: 'the bar', emoji: '🍺' }, { place: 'restaurants', emoji: '🍽️' },
          { place: 'online shopping', emoji: '📦' }, { place: 'coffee shops', emoji: '☕' },
          { place: 'entertainment', emoji: '🎮' }, { place: 'impulse purchases', emoji: '🛍️' }
        ];
        const reason = overspendReasons[Math.floor(Math.random() * overspendReasons.length)];
        const overBy = Math.round(spent - budget);
        insight = `Over by ${formatCurrency(overBy)}`;
        highlightEvent = { type: 'overspend', text: `${reason.emoji} Overspent at ${reason.place} (+${formatCurrency(overBy)})`, color: '#ef4444' };
      }
      if (billToday) {
        spent += billToday.amount;
        highlightEvent = { type: 'bill', text: `💳 Paid ${billToday.name}`, color: '#3b82f6' };
      }
      calendar.push({
        day: dayOfMonth, fullDate: currentDate, status, spent: Math.round(spent), saved: Math.round(saved),
        budget: Math.round(budget), insight, highlightEvent,
        transactions: generateTransactions(status, spent, billToday),
        isToday: currentDate.toDateString() === today.toDateString()
      });
    }
    return { days: calendar, startDate: lastWeekStart, endDate: new Date(lastWeekStart.getTime() + 13 * 24 * 60 * 60 * 1000) };
  };

  // ─── View routing ───────────────────────────────────────────────────────────

  if (!user) {
    return <AuthScreen
      authView={authView} setAuthView={setAuthView}
      authLoading={authLoading} setAuthLoading={setAuthLoading}
      authError={authError} setAuthError={setAuthError}
    />;
  }

  if (showDiagnostic) {
    return <DiagnosticScreen
      userId={userId}
      diagnosticAnswers={diagnosticAnswers} setDiagnosticAnswers={setDiagnosticAnswers}
      currentDiagnosticQuestion={currentDiagnosticQuestion} setCurrentDiagnosticQuestion={setCurrentDiagnosticQuestion}
      setShowDiagnostic={setShowDiagnostic} setView={setView}
    />;
  }

  if (view === 'plaidConnect') {
    return <PlaidConnectScreen
      linkToken={linkToken} plaidLoading={plaidLoading}
      openPlaidLink={openPlaidLink}
      onSkip={() => setShowDiagnostic(true)}
    />;
  }

  if (view === 'welcome') {
    return <WelcomeScreen
      currentPersona={currentPersona} setCurrentPersona={setCurrentPersona}
      setView={setView} setShowDiagnostic={setShowDiagnostic}
    />;
  }

  if (view === 'dashboard') {
    return <DashboardView
      persona={persona} currentPersona={currentPersona} setCurrentPersona={setCurrentPersona}
      financialData={financialData} plaidConnected={plaidConnected}
      completedLessons={completedLessons} completedActions={completedActions}
      completeAction={completeAction} formatCurrency={formatCurrency}
      calculateProjection={calculateProjection}
      projectionYears={projectionYears} setProjectionYears={setProjectionYears}
      setView={setView} setSelectedLesson={setSelectedLesson} setShowComprehension={setShowComprehension}
      selectedDay={selectedDay} setSelectedDay={setSelectedDay}
      calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth}
      budgetPrefs={budgetPrefs} setBudgetPrefs={setBudgetPrefs}
      userId={userId}
      expenseTags={expenseTags} toggleExpenseTag={toggleExpenseTag}
      expenseCategories={expenseCategories} tagExpenseCategory={tagExpenseCategory}
      dayReview={dayReview} setDayReview={setDayReview}
      dayReviewLoading={dayReviewLoading} submitDayReview={submitDayReview}
      manualSavingsTransfer={manualSavingsTransfer} setManualSavingsTransfer={setManualSavingsTransfer}
      showCheckSavingsModal={showCheckSavingsModal} setShowCheckSavingsModal={setShowCheckSavingsModal}
      checkSavingsStep={checkSavingsStep} setCheckSavingsStep={setCheckSavingsStep}
      checkSavingsAmount={checkSavingsAmount} setCheckSavingsAmount={setCheckSavingsAmount}
      showWantsModal={showWantsModal} setShowWantsModal={setShowWantsModal}
      wantsLog={wantsLog} setWantsLog={setWantsLog}
      wantsInput={wantsInput} setWantsInput={setWantsInput}
      buildRealCalendarData={buildRealCalendarData} generateCalendarData={generateCalendarData}
      setDashboardScrollTarget={setDashboardScrollTarget}
    />;
  }

  if (view === 'lesson' && selectedLesson) {
    return <LessonView
      selectedLesson={selectedLesson} persona={persona}
      lessonViewMode={lessonViewMode} setLessonViewMode={setLessonViewMode}
      showComprehension={showComprehension} setShowComprehension={setShowComprehension}
      setView={setView} setDashboardScrollTarget={setDashboardScrollTarget}
    />;
  }

  if (view === 'friends') {
    return <FriendsScreen
      persona={persona} formatCurrency={formatCurrency} setView={setView}
      showInviteModal={showInviteModal} setShowInviteModal={setShowInviteModal}
      inviteLink={inviteLink} generateInviteLink={generateInviteLink}
      inviteCopied={inviteCopied} copyInviteLink={copyInviteLink}
      showTripModal={showTripModal} setShowTripModal={setShowTripModal}
      tripForm={tripForm} setTripForm={setTripForm}
      tripSaving={tripSaving} setTripSaving={setTripSaving}
      tripSaved={tripSaved} setTripSaved={setTripSaved}
    />;
  }

  return null;
};

export default Migo;
