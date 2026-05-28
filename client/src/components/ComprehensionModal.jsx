import React, { useState, useEffect } from 'react';
import { evaluateComprehension, saveComprehensionResult } from '../lib/api';
import { LESSON_CONFIG } from '../config/education';

// ─── ComprehensionModal ───────────────────────────────────────────────────
const HYSA_OPTIONS = [
  { name: 'Fidelity Cash Management', apy: '~4.7%', min: 'No minimum', url: 'https://www.fidelity.com/cash-management/fidelity-cash-management-account/overview', note: 'No fees, FDIC insured up to $5M, also supports investing' },
  { name: 'Ally Bank', apy: '~4.3%', min: 'No minimum', url: 'https://www.ally.com/bank/online-savings-account/', note: 'No monthly fees, 24/7 support, FDIC insured' },
  { name: 'SoFi', apy: '~4.6%', min: 'No minimum', url: 'https://www.sofi.com/banking/savings-account/', note: 'Bonus APY with direct deposit, FDIC insured' },
];

const LESSON_NAVIGATE_MAP = {
  'Needs vs Wants':             { label: 'Tag Expenses in Calendar',  section: 'calendar' },
  'Track Your Spending':        { label: 'Tag Expenses in Calendar',  section: 'calendar' },
  '50/30/20 Budget Basics':     { label: 'Set Up Your Budget',        section: 'budget'   },
  'What is an Emergency Fund?': { label: 'Check Your Savings Balance', section: 'budget'  },
};

const ComprehensionModal = ({ lessonId, onClose, onPass, onNavigate }) => {
  const [phase, setPhase] = React.useState('check_in');
  const [checkInAnswer, setCheckInAnswer] = React.useState('');
  const [coachMessage, setCoachMessage] = React.useState('');
  const [currentQuestion, setCurrentQuestion] = React.useState('');
  const [evaluation, setEvaluation] = React.useState(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [conversationHistory, setConversationHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [gaps, setGaps] = React.useState([]);
  const [summary, setSummary] = React.useState('');
  const [turnCount, setTurnCount] = React.useState(0);
  const [initError, setInitError] = React.useState('');
  const [showHelp, setShowHelp] = React.useState(false);
  const [helpQuestion, setHelpQuestion] = React.useState('');
  const [helpResponse, setHelpResponse] = React.useState('');
  const [helpLoading, setHelpLoading] = React.useState(false);
  const [actionSuggestion, setActionSuggestion] = React.useState('');
  const [isHYSALesson, setIsHYSALesson] = React.useState(false);
  const [hysaChatInput, setHysaChatInput] = React.useState('');
  const [hysaChatMessages, setHysaChatMessages] = React.useState([]);
  const [hysaChatLoading, setHysaChatLoading] = React.useState(false);

  const lessonData = LESSON_CONFIG[lessonId] || {};

  const callEvaluate = async (answer, history, interactionMode) => {
    return evaluateComprehension({ lessonId, userAnswer: answer, conversationHistory: history, interactionMode });
  };

  const sendHysaChat = async (question) => {
    const q = (question || hysaChatInput).trim();
    if (!q) return;
    const userMsg = { role: 'user', content: q };
    const newMessages = [...hysaChatMessages, userMsg];
    setHysaChatMessages(newMessages);
    setHysaChatInput('');
    setHysaChatLoading(true);
    try {
      const data = await callEvaluate(q, [], 'clarify');
      const reply = data.question || data.coachResponse || 'Happy to help — what else would you like to know?';
      setHysaChatMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (e) {
      setHysaChatMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Try again!' }]);
    } finally {
      setHysaChatLoading(false);
    }
  };

  const saveResult = async (passed, finalScore, finalGaps, history) => {
    try {
      await saveComprehensionResult({ lessonId, passed, score: finalScore, phaseReached: 'complete', conversationHistory: history, gaps: finalGaps });
    } catch (err) { console.warn('Failed to save comprehension result:', err); }
  };

  const processComprehensionResult = async (result, prevHistory) => {
    if (result.question === null) {
      const passed = result.passed || false;
      const finalScore = result.score || 0;
      const finalGaps = result.gaps || [];
      const finalSummary = result.evaluation || '';
      setScore(finalScore);
      setGaps(finalGaps);
      setSummary(finalSummary);
      await saveResult(passed, finalScore, finalGaps, prevHistory);
      if (passed) {
        // Fetch action suggestion before showing passed
        try {
          const actionResult = await callEvaluate('', prevHistory, 'action');
          if (actionResult.action || actionResult.question) {
            setActionSuggestion(actionResult.action || actionResult.question || '');
            const isHYSA = lessonId?.toLowerCase().includes('hysa') || lessonId?.toLowerCase().includes('savings account') || lessonId?.toLowerCase().includes('high-yield');
            setIsHYSALesson(isHYSA);
            setPhase('action');
          } else {
            setPhase('passed');
          }
        } catch(e) { setPhase('passed'); }
      } else {
        setPhase('failed');
      }
    } else {
      const newHistory = [...prevHistory, { role: 'assistant', content: result.question }];
      setConversationHistory(newHistory);
      setCurrentQuestion(result.question);
      setEvaluation(result.evaluation);
      setTurnCount(c => c + 1);
      setUserAnswer('');
      setShowHelp(false);
      setHelpResponse('');
    }
  };

  const handleCheckInSubmit = async () => {
    if (!checkInAnswer.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const history = [{ role: 'user', content: checkInAnswer.trim() }];
      const result = await callEvaluate(checkInAnswer.trim(), [], 'check_in');
      setCoachMessage(result.coachResponse || '');
      const nextMode = result.nextMode || 'comprehension';
      if (nextMode === 'action') {
        // User already understands — skip to action
        const actionResult = await callEvaluate('', history, 'action');
        setActionSuggestion(actionResult.action || actionResult.question || '');
        const isHYSA = lessonId?.toLowerCase().includes('hysa') || lessonId?.toLowerCase().includes('savings account') || lessonId?.toLowerCase().includes('high-yield');
        setIsHYSALesson(isHYSA);
        setPhase('action');
      } else {
        // Go to questioning phase — fetch first question
        const qResult = await callEvaluate('', history, 'comprehension');
        if (qResult.question !== null && qResult.question !== undefined) {
          const newHistory = [...history, { role: 'assistant', content: qResult.question }];
          setConversationHistory(newHistory);
          setCurrentQuestion(qResult.question);
          setEvaluation(qResult.evaluation);
          setTurnCount(1);
          setPhase('questioning');
        } else {
          // Unexpectedly concluded immediately — treat as passed
          setPhase('passed');
        }
      }
    } catch (err) {
      setInitError('Could not connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim() || isLoading) return;
    setIsLoading(true);
    const historyWithAnswer = [...conversationHistory, { role: 'user', content: userAnswer.trim() }];
    try {
      const result = await callEvaluate(userAnswer.trim(), conversationHistory, 'comprehension');
      await processComprehensionResult(result, historyWithAnswer);
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskHelp = async () => {
    if (!helpQuestion.trim() || helpLoading) return;
    setHelpLoading(true);
    try {
      const helpHistory = [...conversationHistory, { role: 'user', content: `[Help request] ${helpQuestion.trim()}` }];
      const result = await callEvaluate(helpQuestion.trim(), helpHistory, 'clarify');
      setHelpResponse(result.question || result.coachResponse || "Here's a hint: try re-reading the key takeaways for this lesson.");
    } catch(e) {
      setHelpResponse('Sorry, I had trouble answering that. Try reviewing the lesson takeaways.');
    } finally {
      setHelpLoading(false);
    }
  };

  const mustDoGaps = gaps.filter(g => g.type === 'must_do');
  const mustNeverGaps = gaps.filter(g => g.type === 'must_never_do');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        maxWidth: '580px', width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        maxHeight: '90vh', overflow: 'auto'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              {phase === 'check_in' ? 'Sense Check' : phase === 'questioning' ? 'Knowledge Check' : phase === 'action' ? 'Take Action' : 'Results'}
            </div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>{lessonId}</div>
          </div>
          {phase === 'questioning' && turnCount > 0 && (
            <div style={{ fontSize: '13px', color: '#94a3b8', paddingTop: '4px' }}>Q{turnCount} of ~3</div>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '22px', padding: '0', marginLeft: '8px' }}>×</button>
        </div>

        {/* Init error */}
        {initError && (
          <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: '#dc2626' }}>
            {initError}
            <button onClick={onClose} style={{ marginLeft: '12px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Close</button>
          </div>
        )}

        {/* CHECK-IN PHASE */}
        {phase === 'check_in' && !initError && (
          <>
            <div style={{ fontSize: '17px', fontWeight: '600', color: '#1e293b', lineHeight: '1.5', marginBottom: '8px' }}>
              How are you feeling about <span style={{ color: '#10b981' }}>{lessonId}</span>?
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Be honest — Migo will tailor the next steps based on your answer.
            </div>
            <textarea
              value={checkInAnswer}
              onChange={e => setCheckInAnswer(e.target.value)}
              placeholder="e.g. I get the basics but I'm not sure about the percentages..."
              rows={4}
              style={{
                width: '100%', padding: '14px', fontSize: '14px',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                resize: 'vertical', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.5'
              }}
            />
            <button
              onClick={handleCheckInSubmit}
              disabled={!checkInAnswer.trim() || isLoading}
              style={{
                marginTop: '16px', width: '100%', padding: '14px',
                background: (!checkInAnswer.trim() || isLoading) ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '600',
                cursor: (!checkInAnswer.trim() || isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Checking in with Migo...' : 'Share with Migo →'}
            </button>
          </>
        )}

        {/* QUESTIONING PHASE */}
        {phase === 'questioning' && !initError && (
          <>
            {coachMessage && (
              <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: '#166534', lineHeight: '1.5' }}>
                <span style={{ fontWeight: '600' }}>Migo: </span>{coachMessage}
              </div>
            )}
            {isLoading && !currentQuestion ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
                <div>Preparing your question...</div>
              </div>
            ) : (
              <>
                {evaluation && (
                  <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: '#166534', lineHeight: '1.5' }}>
                    <span style={{ fontWeight: '600' }}>Feedback: </span>{evaluation}
                  </div>
                )}
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', lineHeight: '1.5', marginBottom: '16px' }}>
                  {currentQuestion}
                </div>

                {/* "I Need Help" toggle */}
                <div style={{ marginBottom: '16px' }}>
                  <button
                    onClick={() => { setShowHelp(h => !h); setHelpResponse(''); setHelpQuestion(''); }}
                    style={{
                      padding: '6px 14px', background: showHelp ? '#eff6ff' : 'white',
                      border: `1px solid ${showHelp ? '#93c5fd' : '#e2e8f0'}`,
                      borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                      color: showHelp ? '#2563eb' : '#64748b', cursor: 'pointer'
                    }}
                  >
                    {showHelp ? '↑ Hide Help' : '🙋 I Need Help'}
                  </button>

                  {showHelp && (
                    <div style={{ marginTop: '12px', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                      <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px', fontWeight: '600' }}>
                        What part is confusing? Migo will explain it.
                      </div>
                      <textarea
                        value={helpQuestion}
                        onChange={e => setHelpQuestion(e.target.value)}
                        placeholder="e.g. What does 'needs' actually include?"
                        rows={3}
                        style={{ width: '100%', padding: '10px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={handleAskHelp}
                        disabled={!helpQuestion.trim() || helpLoading}
                        style={{ marginTop: '8px', padding: '8px 16px', background: helpLoading ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        {helpLoading ? 'Asking Migo...' : 'Ask Migo'}
                      </button>
                      {helpResponse && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
                          <span style={{ fontWeight: '700' }}>Migo: </span>{helpResponse}
                          <div style={{ marginTop: '10px' }}>
                            <button onClick={() => setShowHelp(false)} style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                              Got it, back to the question →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  style={{ width: '100%', padding: '14px', fontSize: '15px', border: '1px solid #e2e8f0', borderRadius: '10px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.5' }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim() || isLoading}
                  style={{
                    marginTop: '16px', width: '100%', padding: '14px',
                    background: (!userAnswer.trim() || isLoading) ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    fontSize: '15px', fontWeight: '600',
                    cursor: (!userAnswer.trim() || isLoading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </>
            )}
          </>
        )}

        {/* ACTION PHASE */}
        {phase === 'action' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>Nice work! Now put it into action.</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Migo suggests your next step:</div>
            </div>

            <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1px solid #86efac', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', color: '#065f46', lineHeight: '1.6' }}>
                {actionSuggestion || 'Take one concrete step based on what you just learned.'}
              </div>
            </div>

            {/* HYSA curated options */}
            {isHYSALesson && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                  Top high-yield savings accounts right now:
                </div>
                {HYSA_OPTIONS.map((opt, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{opt.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{opt.note} · {opt.min}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#059669' }}>{opt.apy} APY</div>
                      <a href={opt.url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', background: '#0f172a', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
                        Open →
                      </a>
                    </div>
                  </div>
                ))}
                {/* Migo HYSA chat */}
                <div style={{ marginTop: '14px', border: '1px solid #bfdbfe', borderRadius: '12px', overflow: 'hidden', background: '#f8faff' }}>
                  <div style={{ padding: '10px 14px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>
                    💬 Ask Migo to help you choose
                  </div>

                  {/* Quick-start chips */}
                  {hysaChatMessages.length === 0 && (
                    <div style={{ padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Which has the best APY right now?', 'Are all of these FDIC insured?', 'Help me pick based on my situation', 'I want to search for my own — what should I look for?'].map((chip, i) => (
                        <button key={i} onClick={() => sendHysaChat(chip)}
                          style={{ padding: '5px 10px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '20px', fontSize: '12px', color: '#1e40af', cursor: 'pointer', fontWeight: '500' }}>
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Chat messages */}
                  {hysaChatMessages.length > 0 && (
                    <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {hysaChatMessages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div style={{ maxWidth: '85%', padding: '8px 12px', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: msg.role === 'user' ? '#3b82f6' : 'white', color: msg.role === 'user' ? 'white' : '#1e293b', fontSize: '13px', lineHeight: '1.5', border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none' }}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {hysaChatLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ padding: '8px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px 12px 12px 2px', fontSize: '13px', color: '#94a3b8' }}>Migo is thinking…</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Input row */}
                  <div style={{ padding: '8px 10px', borderTop: hysaChatMessages.length > 0 ? '1px solid #e2e8f0' : 'none', display: 'flex', gap: '6px', alignItems: 'center', background: 'white' }}>
                    <input
                      value={hysaChatInput}
                      onChange={e => setHysaChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !hysaChatLoading) sendHysaChat(); }}
                      placeholder="Ask Migo anything about HYSAs…"
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '13px', outline: 'none', background: '#f8fafc' }}
                    />
                    <button
                      onClick={() => sendHysaChat()}
                      disabled={hysaChatLoading || !hysaChatInput.trim()}
                      style={{ padding: '8px 14px', background: hysaChatLoading || !hysaChatInput.trim() ? '#e2e8f0' : '#3b82f6', color: hysaChatLoading || !hysaChatInput.trim() ? '#94a3b8' : 'white', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: hysaChatLoading || !hysaChatInput.trim() ? 'default' : 'pointer' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {LESSON_NAVIGATE_MAP[lessonId] && (
              <button
                onClick={() => { onNavigate && onNavigate(LESSON_NAVIGATE_MAP[lessonId].section); onPass && onPass(); onClose(); }}
                style={{ width: '100%', padding: '14px', marginBottom: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                {LESSON_NAVIGATE_MAP[lessonId].label} →
              </button>
            )}
            <button
              onClick={() => { onPass && onPass(); onClose(); }}
              style={{ width: '100%', padding: '14px', background: LESSON_NAVIGATE_MAP[lessonId] ? '#f1f5f9' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: LESSON_NAVIGATE_MAP[lessonId] ? '#64748b' : 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              {LESSON_NAVIGATE_MAP[lessonId] ? 'Skip for now' : 'Continue →'}
            </button>
          </div>
        )}

        {/* PASSED PHASE */}
        {phase === 'passed' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              {score > 0 ? `You scored ${score}/100` : 'Lesson complete!'}
            </div>
            <div style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '28px' }}>
              {summary || 'Great work! You demonstrated solid understanding of this lesson.'}
            </div>
            {actionSuggestion && (
              <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: '#065f46', textAlign: 'left', lineHeight: '1.6' }}>
                <span style={{ fontWeight: '600' }}>Reminder: </span>{actionSuggestion}
              </div>
            )}
            <button
              onClick={() => { onPass && onPass(); onClose(); }}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Back to Learning Path →
            </button>
          </div>
        )}

        {/* FAILED PHASE */}
        {phase === 'failed' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                {score > 0 ? `Score: ${score}/100` : 'Let\'s review this one more time'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                {summary || 'Let\'s reinforce a few key concepts before moving on.'}
              </div>
            </div>

            {mustDoGaps.length > 0 && (
              <div style={{ border: '1px solid #fca5a5', borderRadius: '10px', padding: '16px', marginBottom: '12px', background: '#fef2f2' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Do's to revisit
                </div>
                {mustDoGaps.map((g, i) => (
                  <div key={i} style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                    <span>✗</span><span>{g.topic}</span>
                  </div>
                ))}
              </div>
            )}

            {mustNeverGaps.length > 0 && (
              <div style={{ border: '1px solid #fca5a5', borderRadius: '10px', padding: '16px', marginBottom: '20px', background: '#fef2f2' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  DON'Ts to revisit
                </div>
                {mustNeverGaps.map((g, i) => (
                  <div key={i} style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                    <span>✗</span><span>{g.topic}</span>
                  </div>
                ))}
              </div>
            )}

            {gaps.length === 0 && (
              <div style={{ border: '1px solid #fca5a5', borderRadius: '10px', padding: '16px', marginBottom: '20px', background: '#fef2f2' }}>
                <div style={{ fontSize: '14px', color: '#7f1d1d' }}>
                  Review the full lesson and try again to strengthen your understanding.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Rewatch Video
              </button>
              {lessonData.articleUrl && (
                <button
                  onClick={() => { window.open(lessonData.articleUrl, '_blank'); onClose(); }}
                  style={{ flex: 1, padding: '13px', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Read Article →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LEVEL_ACTIONS = {
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

// Explicit lesson→action pairs per level for interleaved Next Steps ordering
const LEVEL_PAIRS = {
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

export default ComprehensionModal;
