import { TrendingUp } from './Icons';
import { PERSONAS } from '../config/personas';

const WelcomeScreen = ({ currentPersona, setCurrentPersona, setView, setShowDiagnostic }) => {
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
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
        }}>
          <TrendingUp size={40} color="white" strokeWidth={2.5} />
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '16px',
          letterSpacing: '-0.02em'
        }}>
          Migo
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          marginBottom: '48px',
          lineHeight: '1.6'
        }}>
          Build real financial habits that level up your future.
          Save together, win together.
        </p>

        <button
          onClick={() => setShowDiagnostic(true)}
          style={{
            width: '100%',
            padding: '18px 32px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '16px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Get Started
        </button>

        <div style={{
          marginTop: '48px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#cbd5e1',
            marginBottom: '12px'
          }}>
            Demo Mode - Try Different Personas:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(PERSONAS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentPersona(key);
                  setView('dashboard');
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: currentPersona === key ? 'white' : '#cbd5e1',
                  background: currentPersona === key ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {p.name}, {p.age} (L{p.level})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
