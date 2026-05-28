import { supabase } from '../lib/supabase';
import { TrendingUp, Award, Target, BarChart3, CheckCircle2, Circle, ArrowRight, Sparkles, Users } from './Icons';
import { LEVEL_CONFIG } from '../config/levels';
import { LEVEL_ACTIONS, LEVEL_PAIRS } from '../config/actions';
import { PERSONAS } from '../config/personas';

const DashboardView = ({
  persona,
  currentPersona,
  setCurrentPersona,
  financialData,
  plaidConnected,
  completedLessons,
  completedActions,
  completeAction,
  formatCurrency,
  calculateProjection,
  projectionYears,
  setProjectionYears,
  setView,
  setSelectedLesson,
  setShowComprehension,
  selectedDay,
  setSelectedDay,
  calendarMonth,
  setCalendarMonth,
  budgetPrefs,
  setBudgetPrefs,
  userId,
  expenseTags,
  toggleExpenseTag,
  expenseCategories,
  tagExpenseCategory,
  dayReview,
  setDayReview,
  dayReviewLoading,
  submitDayReview,
  manualSavingsTransfer,
  setManualSavingsTransfer,
  showCheckSavingsModal,
  setShowCheckSavingsModal,
  checkSavingsStep,
  setCheckSavingsStep,
  checkSavingsAmount,
  setCheckSavingsAmount,
  showWantsModal,
  setShowWantsModal,
  wantsLog,
  setWantsLog,
  wantsInput,
  setWantsInput,
  buildRealCalendarData,
  generateCalendarData,
  setDashboardScrollTarget,
}) => {
  const projectionData = calculateProjection(projectionYears);
  const currentLevel = LEVEL_CONFIG[persona.level];
  const _nextLevelRaw = LEVEL_CONFIG[persona.level + 1];
  const nextLevel = _nextLevelRaw?.locked ? null : _nextLevelRaw;
  const maxProjection = Math.max(...projectionData.map(d => d.amount));

    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', -apple-system, sans-serif"
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={24} color="white" strokeWidth={2.5} />
                </div>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>
                  Migo
                </h1>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setView('friends')}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Users size={16} />
                  Friends
                </button>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'white'
                }}>
                  {persona.name}, {persona.age}
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Level Progress */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>
                    Current Level
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                    Level {persona.level}: {currentLevel.name} {currentLevel.emoji}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                    {currentLevel.subtitle}
                  </div>
                </div>
                <Award size={32} color={currentLevel.color} />
              </div>

              {(() => {
                const levelLessons = [...new Set([...currentLevel.fullPath, ...currentLevel.essentialPath])];
                const lessonsDone = levelLessons.filter(n => completedLessons.has(n)).length;
                const levelActionsArr = LEVEL_ACTIONS[persona.level] || [];
                const actionsDone = levelActionsArr.filter(a => completedActions.has(a.id)).length;
                const totalItems = levelLessons.length + levelActionsArr.length;
                const doneItems = lessonsDone + actionsDone;
                const progressPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
                return (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${currentLevel.color} 0%, ${nextLevel?.color || currentLevel.color} 100%)`,
                        width: `${progressPct}%`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {progressPct}% · {lessonsDone}/{levelLessons.length} lessons · {actionsDone}/{levelActionsArr.length} actions
                      </span>
                      {nextLevel && (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Next: {nextLevel.name}</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>

          {/* Learning Path */}
          {(() => {
            const level = LEVEL_CONFIG[persona.level];
            const _seenLessons = new Set();
            const allLessons = [
              ...level.fullPath.map(name => ({ name, track: 'Full Path' })),
              ...level.essentialPath.map(name => ({ name, track: 'Essential Path' }))
            ].filter(item => {
              if (_seenLessons.has(item.name)) return false;
              _seenLessons.add(item.name);
              return true;
            });
            return (
              <div style={{
                background: 'white', borderRadius: '12px', padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    Your Learning Path
                  </h3>
                  <span style={{
                    fontSize: '12px', padding: '4px 10px',
                    background: `${level.color}15`, color: level.color,
                    borderRadius: '20px', fontWeight: '600'
                  }}>
                    Level {persona.level}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {allLessons.map((lesson, idx) => {
                    const passed = completedLessons.has(lesson.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => { setSelectedLesson(lesson.name); setView('lesson'); setShowComprehension(false); }}
                        style={{
                          padding: '8px 14px',
                          background: passed ? '#f0fdf4' : '#f8fafc',
                          border: `1px solid ${passed ? '#86efac' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: passed ? '#166534' : '#374151',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'all 0.15s'
                        }}
                      >
                        {passed && <span style={{ fontSize: '12px', color: '#16a34a' }}>✓</span>}
                        {lesson.name}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f0fdf4', border: '1px solid #86efac' }}></div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Passed knowledge check</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f8fafc', border: '1px solid #e2e8f0' }}></div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Not yet completed</span>
                  </div>
                </div>
              </div>
            );
          })()}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Financial Snapshot - UPDATED */}
            <div id="budget" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Financial Snapshot
                </h3>
                <BarChart3 size={20} color="#64748b" />
              </div>

              {/* Always show data — real when connected, persona mock otherwise */}
              {(() => {
                const fd = plaidConnected && financialData;
                const checking = fd ? (financialData.accounts?.find(a => a.account_type === 'depository')?.current_balance || 0) : persona.financials.checking;
                const savings = fd ? (financialData.accounts?.filter(a => a.account_type === 'depository').reduce((s, a) => s + (a.current_balance || 0), 0) || 0) : persona.financials.savings;
                const creditDebt = fd ? 0 : persona.financials.creditCardDebt;
                const efMonths = persona.financials.emergencyFundMonths;
                const nextCheck = persona.financials.nextPaycheck;
                const paycheckDt = persona.financials.paycheckDate;
                const income = (fd ? financialData.summary?.totalIncome : null) || persona.financials.monthlyIncome;
                const needsPct = budgetPrefs.needs;
                const wantsPct = budgetPrefs.wants;
                const savingsPct = budgetPrefs.savings;
                const budgetIncome = budgetPrefs.income || income;
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {!fd && (
                      <div style={{ padding: '8px 12px', background: '#eff6ff', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#1d4ed8' }}>🔗 Demo data — connect bank for real numbers</span>
                        <button onClick={() => setView('plaidConnect')} style={{ fontSize: '11px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Connect →</button>
                      </div>
                    )}
                    {/* Key metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ padding: '14px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                        <div style={{ fontSize: '11px', color: '#166534', marginBottom: '4px', fontWeight: '600' }}>Emergency Fund</div>
                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#15803d' }}>{efMonths.toFixed(1)} mo</div>
                        <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '2px' }}>Target: 3–6 months</div>
                      </div>
                      <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>Checking</div>
                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b' }}>{formatCurrency(checking)}</div>
                      </div>
                      <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>Savings</div>
                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#10b981' }}>{formatCurrency(savings + manualSavingsTransfer)}</div>
                        {manualSavingsTransfer > 0 && (
                          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>+{formatCurrency(manualSavingsTransfer)} transferred ✓</div>
                        )}
                      </div>
                      <div style={{ padding: '14px', background: '#fefce8', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: '11px', color: '#92400e', marginBottom: '4px', fontWeight: '600' }}>Next Paycheck</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#92400e' }}>{formatCurrency(nextCheck)}</div>
                        <div style={{ fontSize: '10px', color: '#b45309', marginTop: '2px' }}>{paycheckDt}</div>
                      </div>
                    </div>
                    {creditDebt > 0 && (
                      <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a', marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '2px', fontWeight: '600' }}>⚠️ Credit Card Debt</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#92400e' }}>{formatCurrency(creditDebt)}</div>
                      </div>
                    )}
                    {/* Editable Budget */}
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>My Budget</div>
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Monthly Income</div>
                        <input
                          type="number"
                          value={budgetPrefs.income || ''}
                          placeholder={String(Math.round(income))}
                          onChange={e => setBudgetPrefs(p => ({ ...p, income: Number(e.target.value) || income }))}
                          style={{ width: '100%', padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b', boxSizing: 'border-box' }}
                        />
                      </div>
                      {[
                        { key: 'needs', label: 'Needs', color: '#3b82f6' },
                        { key: 'wants', label: 'Wants', color: '#a855f7' },
                        { key: 'savings', label: 'Savings', color: '#10b981' },
                      ].map(({ key, label, color }) => (
                        <div key={key} style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '500' }}>{label}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{budgetPrefs[key]}% · {formatCurrency(budgetIncome * budgetPrefs[key] / 100)}</span>
                          </div>
                          <input
                            type="range" min="0" max="100" value={budgetPrefs[key]}
                            onChange={e => setBudgetPrefs(p => ({ ...p, [key]: Number(e.target.value) }))}
                            style={{ width: '100%', accentColor: color }}
                          />
                        </div>
                      ))}
                      <div style={{ fontSize: '11px', color: needsPct + wantsPct + savingsPct !== 100 ? '#ef4444' : '#10b981', marginBottom: '8px' }}>
                        {needsPct + wantsPct + savingsPct !== 100 ? `⚠️ Total: ${needsPct + wantsPct + savingsPct}% (must equal 100%)` : '✓ Budget adds up to 100%'}
                      </div>
                      <button
                        onClick={() => { completeAction('save_budget'); localStorage.setItem('migo_budget_' + userId, JSON.stringify(budgetPrefs)); }}
                        style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Save My Budget
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Future Projection Chart - UPDATED with 5Y/10Y toggle */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              gridColumn: 'span 1'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    Your Financial Future
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                    {projectionYears}-year projection at current savings rate
                  </p>
                </div>
                <Sparkles size={20} color="#3b82f6" />
              </div>

              {/* 5Y / 10Y Toggle */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
                padding: '4px',
                background: '#f1f5f9',
                borderRadius: '8px'
              }}>
                <button
                  onClick={() => setProjectionYears(5)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: projectionYears === 5 ? '#3b82f6' : 'transparent',
                    color: projectionYears === 5 ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  5 Years
                </button>
                <button
                  onClick={() => setProjectionYears(10)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: projectionYears === 10 ? '#3b82f6' : 'transparent',
                    color: projectionYears === 10 ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  10 Years
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                  Projected Wealth in {projectionYears} Years
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>
                  {formatCurrency(projectionData[projectionYears].amount)}
                </div>
              </div>

              {/* Projection curve */}
              <div style={{
                position: 'relative',
                height: '180px',
                background: 'linear-gradient(to top, #eff6ff 0%, transparent 100%)',
                borderRadius: '8px',
                padding: '20px 10px',
                marginTop: '20px'
              }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <line
                      key={pct}
                      x1="0"
                      y1={100 - pct}
                      x2="100"
                      y2={100 - pct}
                      stroke="#e2e8f0"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}

                  <path
                    d={projectionData.map((point, idx) => {
                      const x = (idx / projectionYears) * 100;
                      const y = 100 - (point.amount / maxProjection) * 100;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#projection-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  <defs>
                    <linearGradient id="projection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  {projectionData.filter((_, idx) => idx % (projectionYears === 10 ? 2 : 1) === 0).map((point) => (
                    <text
                      key={point.year}
                      x={(point.year / projectionYears) * 100}
                      y="108"
                      textAnchor="middle"
                      fontSize="4"
                      fill="#64748b"
                    >
                      {point.year}yr
                    </text>
                  ))}
                </svg>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: '#f0fdf4',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#166534',
                lineHeight: '1.5'
              }}>
                💡 By maintaining your current {persona.financials.savingsRate}% savings rate and investing wisely, 
                you could grow your wealth by {Math.round(((projectionData[projectionYears].amount / (persona.financials.checking + persona.financials.savings)) - 1) * 100)}% 
                over the next {projectionYears} years.
              </div>
            </div>

            {/* Action Feed */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              gridColumn: 'span 2'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Your Next Steps
                </h3>
                <Target size={20} color="#64748b" />
              </div>

              {(() => {
                const pairs = LEVEL_PAIRS[persona.level] || [];
                const levelActionsDef = LEVEL_ACTIONS[persona.level] || [];
                const orderedItems = [];
                for (const pair of pairs) {
                  if (pair.lessonName && !completedLessons.has(pair.lessonName))
                    orderedItems.push({ id: `lesson_${pair.lessonName}`, title: pair.lessonName, type: 'lesson', lessonName: pair.lessonName, category: 'lesson', completed: false });
                  const actionDef = levelActionsDef.find(a => a.id === pair.actionId);
                  if (actionDef) {
                    const actionDone = completedActions.has(pair.actionId);
                    if (!actionDone) orderedItems.push({ ...actionDef, type: 'action', completed: false });
                  }
                }
                // Fallback: if no LEVEL_PAIRS defined, show remaining lessons then actions
                if (pairs.length === 0) {
                  const level = LEVEL_CONFIG[persona.level];
                  const levelLessons = [...new Set([...(level.essentialPath || []), ...(level.fullPath || [])])];
                  levelLessons.filter(n => !completedLessons.has(n)).forEach(n => orderedItems.push({ id: `lesson_${n}`, title: n, type: 'lesson', lessonName: n, category: 'lesson', completed: false }));
                  levelActionsDef.filter(a => !completedActions.has(a.id)).forEach(a => orderedItems.push({ ...a, type: 'action', completed: false }));
                }
                const levelActions = orderedItems.slice(0, 3);
                const totalPairItems = pairs.length > 0
                  ? pairs.length * 2
                  : (LEVEL_CONFIG[persona.level] ? [...new Set([...LEVEL_CONFIG[persona.level].fullPath, ...LEVEL_CONFIG[persona.level].essentialPath])].length + levelActionsDef.length : 0);
                const doneCount = levelActionsDef.filter(a => completedActions.has(a.id)).length +
                  (pairs.length > 0 ? pairs.filter(p => completedLessons.has(p.lessonName)).length : completedLessons.size);
                return (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {levelActions.map((action) => (
                        <div
                          key={action.id}
                          style={{
                            padding: '16px',
                            background: action.completed ? '#f0fdf4' : '#f8fafc',
                            borderRadius: '10px',
                            border: `1px solid ${action.completed ? '#86efac' : '#e2e8f0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: action.completed ? 'default' : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => {
                            if (action.completed) return;
                            if (action.type === 'lesson') { setSelectedLesson(action.lessonName); setView('lesson'); }
                            else if (action.id === 'check_savings') { setCheckSavingsStep(1); setCheckSavingsAmount(''); setShowCheckSavingsModal(true); }
                            else if (action.id === 'find_extra_money') { setWantsInput(''); setShowWantsModal(true); }
                            else if (action.id === 'save_budget') { setDashboardScrollTarget('budget'); }
                            else if (action.id === 'tag_expenses') { setDashboardScrollTarget('calendar'); }
                            else completeAction(action.id);
                          }}
                        >
                          {action.completed ? (
                            <CheckCircle2 size={24} color="#10b981" />
                          ) : (
                            <Circle size={24} color={action.type === 'lesson' ? '#6366f1' : '#cbd5e1'} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: action.type === 'lesson' ? '#6366f1' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                              {action.type === 'lesson' ? 'Lesson' : 'Action'}
                            </div>
                            <div style={{
                              fontSize: '14px', fontWeight: '500',
                              color: action.completed ? '#166534' : '#1e293b',
                            }}>
                              {action.title}
                            </div>
                            {action.id === 'tag_expenses' && !action.completed && (
                              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                                {Math.min(Object.keys(expenseTags).length, 21)}/21 tagged
                              </div>
                            )}
                            {action.id === 'find_extra_money' && !action.completed && (
                              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                                {Math.min(wantsLog.length, 3)}/3 weeks logged
                              </div>
                            )}
                          </div>
                          {!action.completed && <ArrowRight size={18} color="#cbd5e1" />}
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: '20px', padding: '16px',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                      borderRadius: '10px', border: '1px solid #bfdbfe'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                        💪 Keep going, {persona.name}!
                      </div>
                      <div style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5' }}>
                        You've completed {doneCount} of {totalPairItems} Level {persona.level} steps.
                        {doneCount < totalPairItems
                          ? ` ${totalPairItems - doneCount} more to finish this level.`
                          : ' Level complete — you\'re crushing it! 🎉'}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Spending Calendar */}
            <div id="calendar" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              gridColumn: 'span 2'
            }}>
              {(() => {
            const calData = plaidConnected && financialData ? buildRealCalendarData() : generateCalendarData();
                return (
                  <>
                        <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                        Spending History - Last 2 Weeks
                      </h3>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
                        {plaidConnected && financialData ? 'From your bank' : 'Recent Activity'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <div key={idx} style={{
                          fontSize: '12px',
                          color: '#64748b',
                          textAlign: 'center',
                          fontWeight: '600',
                          padding: '8px 0'
                        }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                      {calData.days.map((dayData, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedDay(dayData)}
                          style={{
                            minHeight: '90px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: dayData.isToday ? '#eff6ff' :
                                       dayData.status === 'good' ? 'rgba(16, 185, 129, 0.15)' :
                                       dayData.status === 'average' ? 'rgba(251, 191, 36, 0.15)' :
                                       'rgba(239, 68, 68, 0.15)',
                            color: dayData.status === 'good' ? '#059669' :
                                  dayData.status === 'average' ? '#d97706' :
                                  '#dc2626',
                            border: dayData.isToday ? '2px solid #3b82f6' :
                                   `2px solid ${dayData.status === 'good' ? '#86efac' :
                                   dayData.status === 'average' ? '#fde68a' :
                                   '#fca5a5'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            padding: '8px',
                            textAlign: 'left'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                            {dayData.day}
                            {dayData.isToday && <span style={{ fontSize: '10px', marginLeft: '4px' }}>📍</span>}
                          </div>
                          
                          {/* Show insight for green/red days, just amount for yellow */}
                          {dayData.status === 'average' ? (
                            <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.9 }}>
                              {formatCurrency(dayData.spent)}
                            </div>
                          ) : (
                            <>
                              <div style={{ 
                                fontSize: '10px', 
                                fontWeight: '600', 
                                marginBottom: '4px',
                                lineHeight: '1.2'
                              }}>
                                {dayData.insight}
                              </div>
                              {dayData.highlightEvent && (
                                <div style={{
                                  fontSize: '9px',
                                  lineHeight: '1.3',
                                  opacity: 0.95,
                                  marginTop: 'auto',
                                  paddingTop: '4px',
                                  borderTop: `1px solid ${dayData.highlightEvent.color}40`
                                }}>
                                  {dayData.highlightEvent.text}
                                </div>
                              )}
                            </>
                          )}
                        </button>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginTop: '16px',
                      fontSize: '12px',
                      justifyContent: 'center',
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#86efac', border: '2px solid #10b981' }}></div>
                        <span style={{ color: '#64748b' }}>Under budget</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fde68a', border: '2px solid #fbbf24' }}></div>
                        <span style={{ color: '#64748b' }}>On budget</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fca5a5', border: '2px solid #ef4444' }}></div>
                        <span style={{ color: '#64748b' }}>Over budget</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Demo Controls */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            border: '2px dashed #e2e8f0'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px' }}>
              Demo Mode - Switch Personas:
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(PERSONAS).filter(([, p]) => !LEVEL_CONFIG[p.level]?.locked).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setCurrentPersona(key)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: currentPersona === key ? 'white' : '#475569',
                    background: currentPersona === key
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.name}, {p.age} • Level {p.level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Check Savings Modal ── */}
        {showCheckSavingsModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}
            onClick={() => setShowCheckSavingsModal(false)}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}
              onClick={e => e.stopPropagation()}>

              {checkSavingsStep === 1 && (
                <>
                  <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time to make it real</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Verify & Move Your Savings</h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
                    You now know the 50/30/20 rule. Based on your income, your savings target is{' '}
                    <strong style={{ color: '#10b981' }}>{formatCurrency(Math.round((budgetPrefs.income || persona.financials.monthlyIncome) * 0.20))}/month</strong>.
                    Open your banking app and:
                  </p>
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#6366f1', color: 'white', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                      <div style={{ fontSize: '14px', color: '#1e293b' }}>Confirm you have both a <strong>checking</strong> and a <strong>savings</strong> account</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#6366f1', color: 'white', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                      <div style={{ fontSize: '14px', color: '#1e293b' }}>Transfer <strong style={{ color: '#10b981' }}>{formatCurrency(Math.round((budgetPrefs.income || persona.financials.monthlyIncome) * 0.20))}</strong> from checking → savings</div>
                    </div>
                  </div>
                  <a href="https://www.google.com/search?q=my+bank+login" target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', width: '100%', padding: '13px', marginBottom: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', borderRadius: '10px', fontSize: '15px', fontWeight: '600', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
                    Open My Bank →
                  </a>
                  <button onClick={() => setCheckSavingsStep(2)}
                    style={{ width: '100%', padding: '13px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                    I've done it — log my transfer
                  </button>
                </>
              )}

              {checkSavingsStep === 2 && (
                <>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Almost done!</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>How much did you move?</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.6' }}>
                    This will update your Savings balance in the Financial Snapshot below.
                  </p>
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '18px', fontWeight: '600' }}>$</span>
                    <input
                      type="number"
                      value={checkSavingsAmount}
                      onChange={e => setCheckSavingsAmount(e.target.value)}
                      placeholder="0"
                      autoFocus
                      style={{ width: '100%', padding: '14px 14px 14px 32px', fontSize: '22px', fontWeight: '700', border: '2px solid #6366f1', borderRadius: '12px', outline: 'none', boxSizing: 'border-box', color: '#1e293b' }}
                    />
                  </div>
                  <button
                    disabled={!checkSavingsAmount || parseFloat(checkSavingsAmount) <= 0}
                    onClick={() => {
                      const amt = parseFloat(checkSavingsAmount) || 0;
                      setManualSavingsTransfer(prev => prev + amt);
                      completeAction('check_savings');
                      setCheckSavingsStep(3);
                    }}
                    style={{ width: '100%', padding: '14px', background: (!checkSavingsAmount || parseFloat(checkSavingsAmount) <= 0) ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: (!checkSavingsAmount || parseFloat(checkSavingsAmount) <= 0) ? 'not-allowed' : 'pointer', boxSizing: 'border-box' }}>
                    Confirm Transfer ✓
                  </button>
                </>
              )}

              {checkSavingsStep === 3 && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎉</div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Savings locked in!</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                    <strong style={{ color: '#10b981' }}>{formatCurrency(parseFloat(checkSavingsAmount) || 0)}</strong> moved to savings.
                    Your Financial Snapshot has been updated — you're building real wealth now.
                  </p>
                  <button onClick={() => { setShowCheckSavingsModal(false); setCheckSavingsStep(1); setCheckSavingsAmount(''); setDashboardScrollTarget('budget'); }}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                    View My Financial Snapshot →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Weekly Wants Log Modal ── */}
        {showWantsModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}
            onClick={() => setShowWantsModal(false)}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '420px', width: '100%', boxSizing: 'border-box' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Habit</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Log This Week's Wants</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '8px' }}>
                Look at your tagged transactions and add up everything you spent on <strong>Wants</strong> this week. No judgment — awareness is the goal.
              </p>
              <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#166534' }}>
                {wantsLog.length}/3 weeks logged — keep going for 3 weeks to complete this habit!
              </div>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '18px', fontWeight: '600' }}>$</span>
                <input
                  type="number"
                  value={wantsInput}
                  onChange={e => setWantsInput(e.target.value)}
                  placeholder="0"
                  autoFocus
                  style={{ width: '100%', padding: '14px 14px 14px 34px', fontSize: '22px', fontWeight: '700', border: '2px solid #6366f1', borderRadius: '12px', outline: 'none', boxSizing: 'border-box', color: '#1e293b' }}
                />
              </div>
              <button
                disabled={!wantsInput || parseFloat(wantsInput) < 0}
                onClick={() => {
                  const amt = parseFloat(wantsInput) || 0;
                  const week = wantsLog.length + 1;
                  const newLog = [...wantsLog, { week, amount: amt, date: new Date().toLocaleDateString() }];
                  setWantsLog(newLog);
                  setWantsInput('');
                  if (newLog.length >= 3 && !completedActions.has('find_extra_money')) {
                    completeAction('find_extra_money');
                  }
                  setShowWantsModal(false);
                }}
                style={{ width: '100%', padding: '14px', background: (!wantsInput || parseFloat(wantsInput) < 0) ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: (!wantsInput || parseFloat(wantsInput) < 0) ? 'not-allowed' : 'pointer', boxSizing: 'border-box' }}>
                Log Week {wantsLog.length + 1} ✓
              </button>
            </div>
          </div>
        )}

        {/* ── Day Detail Modal overlay ── */}
        {selectedDay && (() => {
          const sdStatusColor = selectedDay.status === 'good' ? '#10b981' : selectedDay.status === 'average' ? '#f59e0b' : '#ef4444';
          const sdStatusBg = selectedDay.status === 'good' ? '#f0fdf4' : selectedDay.status === 'average' ? '#fffbeb' : '#fef2f2';
          const sdStatusText = selectedDay.status === 'good' ? 'Great Day!' : selectedDay.status === 'average' ? 'On Track' : 'Over Budget';
          return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}
              onClick={() => { setSelectedDay(null); setDayReview(null); }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box' }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>
                      {selectedDay.fullDate ? new Date(selectedDay.fullDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : `Day ${selectedDay.day}`}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      Spending Breakdown
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '6px 12px', background: sdStatusBg, borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: sdStatusColor }}>
                      {sdStatusText}
                    </div>
                    <button onClick={() => { setSelectedDay(null); setDayReview(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '22px', padding: '0', lineHeight: '1' }}>×</button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { label: 'Spent', value: formatCurrency(selectedDay.spent), bg: '#f8fafc', border: '#e2e8f0', color: '#1e293b' },
                    { label: 'Saved', value: formatCurrency(selectedDay.saved), bg: '#f0fdf4', border: '#86efac', color: '#059669' },
                    { label: 'Budget', value: formatCurrency(selectedDay.budget), bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af' },
                  ].map((card, i) => (
                    <div key={i} style={{ padding: '12px 8px', background: card.bg, borderRadius: '10px', border: `1px solid ${card.border}`, textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>{card.label}</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: card.color }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Migo Review — shown at top so it's immediately visible after clicking */}
                {dayReview && !dayReview.error ? (() => {
                  const txList = selectedDay.transactions || [];
                  const needsAmt = txList.reduce((s, tx, idx) => {
                    const txId = tx.plaid_transaction_id || `${selectedDay.day}-${idx}`;
                    return expenseTags[txId] === 'need' ? s + (tx.amount || 0) : s;
                  }, 0);
                  const wantsAmt = txList.reduce((s, tx, idx) => {
                    const txId = tx.plaid_transaction_id || `${selectedDay.day}-${idx}`;
                    return expenseTags[txId] === 'want' ? s + (tx.amount || 0) : s;
                  }, 0);
                  const taggedTotal = needsAmt + wantsAmt;
                  const needsPct = taggedTotal > 0 ? Math.round((needsAmt / taggedTotal) * 100) : 0;
                  const wantsPct = taggedTotal > 0 ? 100 - needsPct : 0;
                  const catMap = {};
                  txList.forEach((tx, idx) => {
                    const txId = tx.plaid_transaction_id || `${selectedDay.day}-${idx}`;
                    const cat = expenseCategories[txId];
                    if (cat) catMap[cat] = (catMap[cat] || 0) + (tx.amount || 0);
                  });
                  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
                  return (
                    <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '12px', padding: '16px', marginBottom: '16px', color: 'white' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                        Migo's Day Review
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', lineHeight: '1.4', marginBottom: '14px' }}>
                        {dayReview.headline || `You spent ${formatCurrency(selectedDay.spent)} today`}
                      </div>

                      {taggedTotal > 0 && (
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '8px', marginBottom: '6px', background: 'rgba(255,255,255,0.15)' }}>
                            <div style={{ width: `${needsPct}%`, background: '#60a5fa' }} />
                            <div style={{ width: `${wantsPct}%`, background: '#c084fc' }} />
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                            <span style={{ color: '#93c5fd', fontWeight: '600' }}>Needs {needsPct}% · {formatCurrency(needsAmt)}</span>
                            <span style={{ color: '#d8b4fe', fontWeight: '600' }}>Wants {wantsPct}% · {formatCurrency(wantsAmt)}</span>
                          </div>
                        </div>
                      )}

                      {topCats.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Categories</div>
                          {topCats.map(([cat, amt]) => {
                            const pct = selectedDay.spent > 0 ? Math.round((amt / selectedDay.spent) * 100) : 0;
                            return (
                              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                <div style={{ flex: 1, fontSize: '12px', color: '#e0e7ff' }}>{cat}</div>
                                <div style={{ flex: 2, height: '5px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: '#818cf8' }} />
                                </div>
                                <div style={{ fontSize: '11px', color: '#c7d2fe', minWidth: '56px', textAlign: 'right' }}>{pct}% · {formatCurrency(amt)}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {dayReview.categoryNote && (
                        <div style={{ fontSize: '13px', color: '#c7d2fe', lineHeight: '1.5', marginBottom: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                          {dayReview.categoryNote}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', color: '#bbf7d0', lineHeight: '1.5', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', color: '#4ade80' }}>Insight: </span>{dayReview.insight}
                      </div>
                      <div style={{ fontSize: '13px', color: '#fef08a', lineHeight: '1.5' }}>
                        <span style={{ fontWeight: '700', color: '#facc15' }}>Tomorrow: </span>{dayReview.tip}
                      </div>
                    </div>
                  );
                })() : !dayReview && (
                  <button onClick={() => submitDayReview(selectedDay)} disabled={dayReviewLoading}
                    style={{ width: '100%', padding: '14px', marginBottom: '16px', background: dayReviewLoading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: dayReviewLoading ? 'not-allowed' : 'pointer', boxSizing: 'border-box' }}>
                    {dayReviewLoading ? 'Analyzing your day...' : 'Review My Day with Migo'}
                  </button>
                )}

                {/* Highlight Event */}
                {selectedDay.highlightEvent && (
                  <div style={{ padding: '12px 14px', background: `${selectedDay.highlightEvent.color}15`, borderRadius: '10px', border: `1px solid ${selectedDay.highlightEvent.color}40`, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '18px', flexShrink: 0 }}>
                      {selectedDay.highlightEvent.type === 'savings' ? '💰' : selectedDay.highlightEvent.type === 'bill' ? '💳' : selectedDay.highlightEvent.type === 'good' ? '✨' : '⚠️'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: selectedDay.highlightEvent.color }}>{selectedDay.highlightEvent.type === 'savings' ? 'Savings Achievement' : selectedDay.highlightEvent.type === 'bill' ? 'Bill Paid' : selectedDay.highlightEvent.type === 'good' ? 'Great Spending' : 'Overspending Alert'}</div>
                      <div style={{ fontSize: '12px', color: selectedDay.highlightEvent.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedDay.highlightEvent.text}</div>
                    </div>
                  </div>
                )}

                {/* Transactions */}
                {selectedDay.transactions && selectedDay.transactions.length > 0 ? (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Tag Transactions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedDay.transactions.map((tx, idx) => {
                        const txId = tx.plaid_transaction_id || `${selectedDay.day}-${idx}`;
                        const tag = expenseTags[txId];
                        return (
                          <div key={idx} style={{ padding: '10px 12px', background: tag === 'need' ? '#eff6ff' : tag === 'want' ? '#faf5ff' : '#f8fafc', borderRadius: '8px', border: `1px solid ${tag === 'need' ? '#bfdbfe' : tag === 'want' ? '#e9d5ff' : '#e2e8f0'}`, boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tx.isIncome ? '0' : '7px', gap: '8px' }}>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.merchant || 'Unknown'}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{tx.time}</div>
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: tx.isIncome ? '#10b981' : '#1e293b', flexShrink: 0 }}>
                                {tx.isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                              </div>
                            </div>
                            {!tx.isIncome && (
                              <>
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
                                  {['need', 'want'].map(t => (
                                    <button key={t} onClick={() => toggleExpenseTag(txId, t)} style={{ flex: 1, padding: '4px', fontSize: '11px', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: 'pointer', background: tag === t ? (t === 'need' ? '#3b82f6' : '#a855f7') : '#e2e8f0', color: tag === t ? 'white' : '#64748b', textTransform: 'capitalize' }}>
                                      {t}
                                    </button>
                                  ))}
                                </div>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  {['Food', 'Housing', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other'].map(cat => (
                                    <button key={cat} onClick={() => tagExpenseCategory(txId, cat)} style={{ padding: '3px 7px', fontSize: '10px', fontWeight: '500', borderRadius: '20px', border: 'none', cursor: 'pointer', background: expenseCategories[txId] === cat ? '#0f172a' : '#f1f5f9', color: expenseCategories[txId] === cat ? 'white' : '#64748b' }}>
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', background: '#f8fafc', borderRadius: '10px', marginBottom: '12px' }}>
                    No transactions recorded for this day.
                  </div>
                )}

                <button onClick={() => { setSelectedDay(null); setDayReview(null); }} style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxSizing: 'border-box' }}>
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );

};

export default DashboardView;
