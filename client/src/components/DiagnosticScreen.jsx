const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    question: "How do you best learn new things? (Select all that apply)",
    field: "learning_style",
    type: "multiselect",
    options: [
      { value: "videos", label: "Videos & visuals" },
      { value: "reading", label: "Reading articles" },
      { value: "interactive", label: "Interactive examples & quizzes" },
      { value: "doing", label: "Learning by doing / real examples" },
      { value: "audio", label: "Podcasts & audio" },
      { value: "social", label: "Talking it through with others" }
    ]
  },
  {
    id: 2,
    question: "What's your biggest financial priority right now?",
    field: "primary_goal",
    options: [
      { value: "emergency_fund", label: "Build emergency fund" },
      { value: "pay_debt", label: "Pay off debt" },
      { value: "start_investing", label: "Start investing" },
      { value: "save_specific", label: "Save for something specific" },
      { value: "understand_money", label: "Understand my money better" }
    ]
  },
  {
    id: 3,
    question: "Which of these goals do you see in your future? (Select all that apply)",
    field: "future_goals",
    type: "multiselect",
    options: [
      { value: "buy_house", label: "Buy a house/condo" },
      { value: "start_business", label: "Start a business" },
      { value: "travel", label: "Travel extensively" },
      { value: "fire", label: "Early retirement (FIRE)" },
      { value: "family", label: "Get married/start a family" },
      { value: "buy_car", label: "Buy a car" },
      { value: "grad_school", label: "Go to grad school" },
      { value: "move_city", label: "Move to a new city" },
      { value: "debt_free", label: "Become debt-free" },
      { value: "stable", label: "Just be financially stable" },
      { value: "none", label: "None of these yet" }
    ]
  },
  {
    id: 4,
    question: "How confident do you feel about your finances?",
    field: "financial_confidence",
    options: [
      { value: "very_stressed", label: "Very stressed/overwhelmed" },
      { value: "somewhat_worried", label: "Somewhat worried" },
      { value: "neutral", label: "Neutral/okay" },
      { value: "pretty_confident", label: "Pretty confident" },
      { value: "very_confident", label: "Very confident" }
    ]
  },
  {
    id: 5,
    question: "What best describes your current work situation? (Select all that apply)",
    field: "work_situation",
    type: "multiselect",
    options: [
      { value: "w2_fulltime", label: "W-2 employed (full-time)" },
      { value: "w2_parttime", label: "W-2 employed (part-time)" },
      { value: "gig_contract", label: "Gig / freelance / contract work" },
      { value: "self_employed", label: "Self-employed / business owner" },
      { value: "student_fulltime", label: "Full-time student" },
      { value: "student_parttime", label: "Part-time student" },
      { value: "not_working", label: "Not currently working" }
    ]
  },
  {
    id: 6,
    question: "When making money decisions, I prefer:",
    field: "risk_tolerance",
    options: [
      { value: "safe", label: "Playing it safe (low risk)" },
      { value: "balanced", label: "Balanced approach" },
      { value: "aggressive", label: "Aggressive growth (higher risk)" },
      { value: "figuring_out", label: "Still figuring it out" }
    ]
  }
];

const DiagnosticScreen = ({
  userId,
  diagnosticAnswers,
  setDiagnosticAnswers,
  currentDiagnosticQuestion,
  setCurrentDiagnosticQuestion,
  setShowDiagnostic,
  setView,
}) => {
  const question = DIAGNOSTIC_QUESTIONS[currentDiagnosticQuestion];
  const progress = ((currentDiagnosticQuestion + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Progress Bar */}
        <div style={{
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '999px',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            width: `${progress}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Question Counter */}
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#64748b',
          marginBottom: '16px'
        }}>
          Question {currentDiagnosticQuestion + 1} of {DIAGNOSTIC_QUESTIONS.length}
        </div>

        {/* Question */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '32px',
          lineHeight: '1.4'
        }}>
          {question.question}
        </h2>

        {/* Options */}
        {question.type === 'multiselect' ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {question.options.map((option, idx) => {
                const isSelected = diagnosticAnswers[question.id]?.includes(option.value);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const currentSelections = diagnosticAnswers[question.id] || [];
                      let newSelections;
                      if (isSelected) {
                        newSelections = currentSelections.filter(v => v !== option.value);
                      } else {
                        newSelections = [...currentSelections, option.value];
                      }
                      setDiagnosticAnswers({ ...diagnosticAnswers, [question.id]: newSelections });
                    }}
                    style={{
                      padding: '16px',
                      background: isSelected ? '#f0f9ff' : 'white',
                      border: isSelected ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1e293b',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid ' + (isSelected ? '#3b82f6' : '#cbd5e1'),
                      borderRadius: '4px',
                      background: isSelected ? '#3b82f6' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}>
                      {isSelected ? '✓' : ''}
                    </div>
                    {option.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                if (currentDiagnosticQuestion < DIAGNOSTIC_QUESTIONS.length - 1) {
                  setCurrentDiagnosticQuestion(currentDiagnosticQuestion + 1);
                } else {
                  setShowDiagnostic(false);
                  setView('dashboard');
                  if (userId) localStorage.setItem('migo_diagnostic_' + userId, JSON.stringify(diagnosticAnswers));
                }
              }}
              disabled={!diagnosticAnswers[question.id] || diagnosticAnswers[question.id].length === 0}
              style={{
                width: '100%',
                padding: '16px',
                background: (!diagnosticAnswers[question.id] || diagnosticAnswers[question.id].length === 0) ? '#e2e8f0' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!diagnosticAnswers[question.id] || diagnosticAnswers[question.id].length === 0) ? 'not-allowed' : 'pointer',
                opacity: (!diagnosticAnswers[question.id] || diagnosticAnswers[question.id].length === 0) ? 0.5 : 1
              }}
            >
              Continue →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newAnswers = { ...diagnosticAnswers, [question.field]: option.value };
                  setDiagnosticAnswers(newAnswers);
                  if (currentDiagnosticQuestion < DIAGNOSTIC_QUESTIONS.length - 1) {
                    setCurrentDiagnosticQuestion(currentDiagnosticQuestion + 1);
                  } else {
                    setShowDiagnostic(false);
                    setView('dashboard');
                    const finalAnswers = { ...diagnosticAnswers, [question.field]: option.value };
                    if (userId) localStorage.setItem('migo_diagnostic_' + userId, JSON.stringify(finalAnswers));
                  }
                }}
                style={{
                  padding: '20px',
                  background: diagnosticAnswers[question.field] === option.value ? '#f0f9ff' : 'white',
                  border: diagnosticAnswers[question.field] === option.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1e293b',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (diagnosticAnswers[question.field] !== option.value) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (diagnosticAnswers[question.field] !== option.value) {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = 'white';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Back Button */}
        {currentDiagnosticQuestion > 0 && (
          <button
            onClick={() => setCurrentDiagnosticQuestion(currentDiagnosticQuestion - 1)}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: 'transparent',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default DiagnosticScreen;
