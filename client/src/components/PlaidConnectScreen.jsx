const PlaidConnectScreen = ({ linkToken, plaidLoading, openPlaidLink, onSkip }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '36px'
        }}>🏦</div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: 'white',
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>Connect Your Bank</h1>

        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Migo uses your real spending data to give you personalized financial advice, track your progress, and build habits that actually stick.
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          {[
            { icon: '🔒', title: 'Bank-level security', desc: 'Powered by Plaid — trusted by millions' },
            { icon: '📊', title: 'Real-time insights', desc: 'See your actual spending patterns' },
            { icon: '🎯', title: 'Personalized advice', desc: 'Lessons tailored to your finances' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: i < 2 ? '16px' : '0'
            }}>
              <span style={{ fontSize: '20px', marginTop: '2px' }}>{item.icon}</span>
              <div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{item.title}</div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={openPlaidLink}
          disabled={!linkToken || plaidLoading}
          style={{
            width: '100%',
            padding: '16px',
            background: (!linkToken || plaidLoading) ? '#334155' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: (!linkToken || plaidLoading) ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            transition: 'opacity 0.2s',
            opacity: (!linkToken || plaidLoading) ? 0.6 : 1
          }}
        >
          {plaidLoading ? 'Connecting...' : !linkToken ? 'Loading...' : 'Connect Bank Account'}
        </button>

        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Skip for now (demo mode)
        </button>
      </div>
    </div>
  );
};

export default PlaidConnectScreen;
