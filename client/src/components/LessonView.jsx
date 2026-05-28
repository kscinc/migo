import { LEVEL_CONFIG } from '../config/levels';
import { EDUCATION_CONTENT, LESSON_CONFIG } from '../config/education';
import ComprehensionModal from './ComprehensionModal';

const LessonView = ({
  selectedLesson,
  persona,
  lessonViewMode,
  setLessonViewMode,
  showComprehension,
  setShowComprehension,
  setView,
  setDashboardScrollTarget,
}) => {
  const lessonContent = EDUCATION_CONTENT[selectedLesson] || {};
  const lessonCfg = LESSON_CONFIG[selectedLesson] || null;
  const currentLevel = LEVEL_CONFIG[persona.level];

  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => { setView('dashboard'); setShowComprehension(false); }}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', padding: '4px 8px' }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
              Level {persona.level} · {currentLevel.name}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
              {selectedLesson}
            </div>
          </div>
          {lessonContent.duration && (
            <div style={{
              marginLeft: 'auto', padding: '4px 10px',
              background: 'rgba(255,255,255,0.1)', borderRadius: '20px',
              fontSize: '12px', color: '#94a3b8'
            }}>
              {lessonContent.duration}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Video / Article toggle */}
        {(() => {
          const hasArticle = lessonCfg && lessonCfg.articleUrl;
          const effectiveMode = hasArticle ? lessonViewMode : 'video';
          return (
            <div style={{ marginBottom: '20px' }}>
              {hasArticle && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <button
                    onClick={() => setLessonViewMode(effectiveMode === 'video' ? 'article' : 'video')}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', border: '1px solid #cbd5e1',
                      background: 'white', color: '#475569', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    {effectiveMode === 'video' ? '📖 Read Article Instead' : '▶ Watch Video Instead'}
                  </button>
                </div>
              )}

              {effectiveMode === 'article' && hasArticle ? (
                <div style={{
                  background: 'white', borderRadius: '12px', padding: '24px',
                  border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', letterSpacing: '0.06em', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Article
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
                    {lessonCfg.articleTitle}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                    {lessonCfg.articleDescription}
                  </div>
                  <a
                    href={lessonCfg.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '10px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    Read on Investopedia →
                  </a>
                </div>
              ) : (
                lessonContent.video ? (
                  <div style={{
                    position: 'relative', width: '100%', paddingBottom: '56.25%',
                    background: '#000', borderRadius: '12px', overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    <iframe
                      src={lessonContent.video}
                      title={selectedLesson}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    height: '200px', background: '#1e293b', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', fontSize: '14px'
                  }}>
                    Video not available
                  </div>
                )
              )}
            </div>
          );
        })()}

        {/* Description */}
        {lessonContent.description && (
          <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', marginBottom: '20px', margin: '0 0 20px 0' }}>
            {lessonContent.description}
          </p>
        )}

        {/* Special content (e.g. credit building methods table) */}
        {lessonContent.specialContent && (
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            border: '1px solid #e2e8f0', marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', margin: '0 0 16px 0' }}>
              {lessonContent.specialContent.title}
            </h3>
            {lessonContent.specialContent.methods && lessonContent.specialContent.methods.map((m, i) => (
              <div key={i} style={{
                padding: '14px', borderRadius: '8px', marginBottom: '10px',
                background: '#f8fafc', border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{m.name}</div>
                  {m.rating && (
                    <span style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                      background: m.rating === 'BEST' ? '#d1fae5' : '#f1f5f9',
                      color: m.rating === 'BEST' ? '#065f46' : '#64748b',
                      fontWeight: '700', flexShrink: 0, marginLeft: '8px'
                    }}>{m.rating}</span>
                  )}
                </div>
                {m.how && <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{m.how}</div>}
                {m.services && <div style={{ fontSize: '12px', color: '#94a3b8' }}>Services: {m.services}</div>}
                {m.cost && <div style={{ fontSize: '12px', color: '#94a3b8' }}>Cost: {m.cost}</div>}
                {m.impact && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>{m.impact}</div>}
              </div>
            ))}
            {lessonContent.specialContent.caveat && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>{lessonContent.specialContent.caveat.title}</div>
                <div style={{ fontSize: '13px', color: '#78350f' }}>{lessonContent.specialContent.caveat.content}</div>
              </div>
            )}
          </div>
        )}

        {/* Key Takeaways (L1-L3 only) */}
        {lessonCfg && (
          <div style={{
            background: 'white', borderRadius: '12px', padding: '24px',
            border: '1px solid #e2e8f0', marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', margin: '0 0 20px 0' }}>
              Key Takeaways
            </h3>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#059669', letterSpacing: '0.02em', marginBottom: '10px' }}>
                Do's
              </div>
              {lessonCfg.mustDos.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>{item}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', letterSpacing: '0.02em', marginBottom: '10px' }}>
                Don'ts
              </div>
              {lessonCfg.mustNeverDos.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>✗</span>
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test My Knowledge button (L1-L3 only) */}
        {lessonCfg ? (
          <button
            onClick={() => setShowComprehension(true)}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              transition: 'all 0.2s'
            }}
          >
            Test My Knowledge →
          </button>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '14px' }}>
            Comprehension checks coming soon for this level.
          </div>
        )}
      </div>

      {/* ComprehensionModal overlay */}
      {showComprehension && (
        <ComprehensionModal
          lessonId={selectedLesson}
          onClose={() => setShowComprehension(false)}
          onPass={() => setShowComprehension(false)}
          onNavigate={(section) => {
            setShowComprehension(false);
            setView('dashboard');
            setDashboardScrollTarget(section);
          }}
        />
      )}
    </div>
  );
};

export default LessonView;
