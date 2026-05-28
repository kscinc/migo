import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Award, Target, Users, ArrowRight } from './Icons';

const FriendsScreen = ({
  persona,
  formatCurrency,
  setView,
  // Invite modal
  showInviteModal,
  setShowInviteModal,
  inviteLink,
  generateInviteLink,
  inviteCopied,
  copyInviteLink,
  // Trip modal
  showTripModal,
  setShowTripModal,
  tripForm,
  setTripForm,
  tripSaving,
  setTripSaving,
  tripSaved,
  setTripSaved,
}) => {
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
              <button
                onClick={() => setView('dashboard')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '8px'
                }}
              >
                ←
              </button>
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

          {/* Active Group Goals Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', position: 'relative' }}>
              <Target size={24} color="white" />
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>Active group goals</h3>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'white', marginBottom: '8px', position: 'relative' }}>
              {persona.activeGroupGoals}
            </div>
            <p style={{ fontSize: '16px', color: 'white', opacity: 0.9, position: 'relative' }}>
              trips planned
            </p>
            <p style={{ fontSize: '14px', color: 'white', opacity: 0.8, marginTop: '4px', position: 'relative' }}>
              You're saving with {persona.friends} friends
            </p>
            <button
              onClick={generateInviteLink}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              + Invite a Friend
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Group Trips */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Group trips</h3>
            <button
              onClick={() => { setTripSaved(false); setTripForm({ title: '', budget: '', members: [{ name: '', contact: '' }] }); setShowTripModal(true); }}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              + Create Trip
            </button>
          </div>

          {persona.groupTrips.map((trip) => (
            <div key={trip.id} style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '12px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#0c4a6e' }}>{trip.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                  <Users size={16} />
                  <span style={{ fontSize: '14px' }}>{trip.participants}</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Group total</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#0c4a6e' }}>
                    {formatCurrency(trip.groupTotal)} / {formatCurrency(trip.groupGoal)}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)',
                    width: `${(trip.groupTotal / trip.groupGoal) * 100}%`,
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Your part</span>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#3b82f6' }}>
                    {formatCurrency(trip.yourPart)} / {formatCurrency(trip.yourGoal)}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: '#3b82f6',
                    width: `${(trip.yourPart / trip.yourGoal) * 100}%`,
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#64748b',
                fontSize: '14px'
              }}>
                <span>{trip.daysLeft} days left</span>
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Challenges */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Challenges</h3>
            <button style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#64748b',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              View all
            </button>
          </div>

          {persona.challenges.map((challenge) => (
            <div key={challenge.id} style={{
              background: challenge.color,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              border: `1px solid ${challenge.color === '#d97706' ? 'rgba(217, 119, 6, 0.5)' : 'rgba(71, 85, 105, 0.5)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>{challenge.name}</h4>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: challenge.status === 'Live' ? '#10b981' : '#475569',
                  color: 'white'
                }}>
                  {challenge.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={16} />
                  <span>{challenge.participants} friends</span>
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={16} />
                  <span>{challenge.reward}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Disclaimer */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <div style={{ fontSize: '20px', flexShrink: 0 }}>🔒</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Your privacy is protected</div>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              Migo never shares your personal financial data, milestones, or spending habits with anyone — including your friends. The only information visible in a group is the shared budget you create together and progress toward that group goal. Your individual finances always stay private.
            </div>
          </div>
        </div>

        {/* Invite modal */}
        {showInviteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
            onClick={() => setShowInviteModal(false)}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' }}>Invite a Friend to Migo</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Share your personal invite link</p>
                </div>
                <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '22px', padding: '0' }}>×</button>
              </div>
              <input
                id="invite-link-input"
                readOnly
                value={inviteLink}
                onClick={e => e.target.select()}
                style={{ width: '100%', padding: '12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '10px', fontFamily: 'monospace', color: '#475569', background: '#f8fafc', marginBottom: '12px', boxSizing: 'border-box', cursor: 'text', outline: 'none' }}
              />
              <button onClick={copyInviteLink} style={{ width: '100%', padding: '14px', background: inviteCopied ? '#10b981' : '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '10px', transition: 'background 0.2s' }}>
                {inviteCopied ? 'Copied!' : 'Copy Link'}
              </button>
              <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.5' }}>
                Your friend will create their own account. Migo never shares your financial data with them.
              </div>
            </div>
          </div>
        )}

        {/* Trip creation modal */}
        {showTripModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}
            onClick={() => setShowTripModal(false)}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Group Budget</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {tripSaved ? 'Trip Created!' : 'Create a Trip'}
                  </h3>
                </div>
                <button onClick={() => setShowTripModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '22px', padding: '0' }}>×</button>
              </div>

              {tripSaved ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Invites Sent!</div>
                  <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                    Your trip <strong>{tripForm.title}</strong> has been created and invite links have been sent to all {tripForm.members.filter(m => m.contact.trim()).length} contacts.
                  </div>
                  <button onClick={() => setShowTripModal(false)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '5px' }}>Trip Title</label>
                    <input
                      type="text"
                      value={tripForm.title}
                      onChange={e => setTripForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Miami Spring Break 2027"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '5px' }}>Total Trip Budget</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={tripForm.budget}
                        onChange={e => setTripForm(f => ({ ...f, budget: e.target.value }))}
                        placeholder="0"
                        style={{ width: '100%', padding: '10px 12px 10px 24px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    {tripForm.budget && tripForm.members.filter(m => m.name.trim()).length > 0 && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        ~{formatCurrency(parseFloat(tripForm.budget) / tripForm.members.filter(m => m.name.trim()).length)} per person
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                        Group Members ({tripForm.members.filter(m => m.name.trim()).length})
                      </label>
                      <button
                        onClick={() => setTripForm(f => ({ ...f, members: [...f.members, { name: '', contact: '' }] }))}
                        style={{ fontSize: '13px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                      >
                        + Add Person
                      </button>
                    </div>
                    {tripForm.members.map((member, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={member.name}
                          onChange={e => setTripForm(f => { const m = [...f.members]; m[idx] = { ...m[idx], name: e.target.value }; return { ...f, members: m }; })}
                          placeholder={`Person ${idx + 1} name`}
                          style={{ flex: 1, padding: '9px 10px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <input
                          type="text"
                          value={member.contact}
                          onChange={e => setTripForm(f => { const m = [...f.members]; m[idx] = { ...m[idx], contact: e.target.value }; return { ...f, members: m }; })}
                          placeholder="Email or phone"
                          style={{ flex: 1, padding: '9px 10px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                        />
                        {tripForm.members.length > 1 && (
                          <button
                            onClick={() => setTripForm(f => ({ ...f, members: f.members.filter((_, i) => i !== idx) }))}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', flexShrink: 0, padding: '0 2px' }}
                          >×</button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                    🔒 Migo only shares group budget progress with members. Individual finances stay private.
                  </div>

                  <button
                    disabled={tripSaving || !tripForm.title.trim() || !tripForm.budget}
                    onClick={async () => {
                      setTripSaving(true);
                      await new Promise(r => setTimeout(r, 1200));
                      setTripSaving(false);
                      setTripSaved(true);
                    }}
                    style={{ width: '100%', padding: '14px', background: tripSaving || !tripForm.title.trim() || !tripForm.budget ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed, #6366f1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: tripSaving || !tripForm.title.trim() || !tripForm.budget ? 'not-allowed' : 'pointer', boxSizing: 'border-box' }}
                  >
                    {tripSaving ? 'Sending Invites...' : 'Save Trip & Send Invites'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsScreen;
