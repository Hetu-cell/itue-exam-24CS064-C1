import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Phone, Lock, ArrowRight, Dumbbell, Sparkles, CheckCircle2, Info, BookOpen } from 'lucide-react';
import AuthHeroSlider from '../components/AuthHeroSlider';

const RegisterPage = () => {
  const [roleType, setRoleType] = useState('Member'); // 'Member' or 'Trainer'

  // Member fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [membershipType, setMembershipType] = useState('premium');

  // Trainer fields
  const [trainerName, setTrainerName] = useState('');
  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerPhone, setTrainerPhone] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');
  const [specialization, setSpecialization] = useState('CrossFit & Strength Training');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect
  if (token) {
    navigate('/classes');
    return null;
  }

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, membershipType }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.errors ? data.errors.join(', ') : data.message;
        throw new Error(errMsg || 'Registration failed');
      }

      login(data.member, data.token);
      navigate('/classes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/v1/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trainerName,
          email: trainerEmail,
          phone: trainerPhone,
          password: trainerPassword,
          specialization,
          available: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to register trainer');
      }

      // Automatically log the trainer in if token is returned
      if (data.token && data.member) {
        login(data.member, data.token);
        navigate('/classes');
      } else {
        setSuccessMessage(`🎉 Trainer "${data.trainer.name}" registered successfully! You can now log in.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* Left Column: Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-icon-badge">
              {roleType === 'Member' ? <UserPlus size={22} /> : <Dumbbell size={22} />}
            </div>
            <h2>Join FitZone</h2>
            <p>
              {roleType === 'Member'
                ? 'Create a gym member account & pick your tier'
                : 'Register as an official FitZone certified trainer'}
            </p>
          </div>

          {/* Role Switcher: Member vs Trainer using .auth-tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${roleType === 'Member' ? 'active' : ''}`}
              onClick={() => {
                setRoleType('Member');
                setError('');
                setSuccessMessage('');
              }}
            >
              🏋️ Member
            </button>
            <button
              type="button"
              className={`auth-tab ${roleType === 'Trainer' ? 'active' : ''}`}
              onClick={() => {
                setRoleType('Trainer');
                setError('');
                setSuccessMessage('');
              }}
            >
              💪 Trainer
            </button>
          </div>

          {error && <div className="alert-error">⚠️ {error}</div>}
          {successMessage && (
            <div className="alert-success">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Member Registration Form */}
          {roleType === 'Member' ? (
            <form onSubmit={handleMemberSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.2rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                    }}
                  />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.2rem' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-subtle)',
                      }}
                    />
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '2rem' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-subtle)',
                      }}
                    />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '2rem' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Membership Tier Cards Selector */}
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Membership Tier</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  <div
                    onClick={() => setMembershipType('basic')}
                    style={{
                      border: membershipType === 'basic' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: membershipType === 'basic' ? '#f1f5f9' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.35rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <strong style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-main)' }}>BASIC</strong>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>1 Slot</span>
                  </div>

                  <div
                    onClick={() => setMembershipType('premium')}
                    style={{
                      border: membershipType === 'premium' ? '2px solid var(--primary)' : '1px solid #fde68a',
                      backgroundColor: membershipType === 'premium' ? '#fef3c7' : '#fffbeb',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.35rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <strong style={{ fontSize: '0.78rem', display: 'block', color: '#b45309' }}>PREMIUM</strong>
                    <span style={{ fontSize: '0.65rem', color: '#b45309' }}>3 Slots</span>
                  </div>

                  <div
                    onClick={() => setMembershipType('platinum')}
                    style={{
                      border: membershipType === 'platinum' ? '2px solid var(--primary)' : '1px solid #e9d5ff',
                      backgroundColor: membershipType === 'platinum' ? '#f3e8ff' : '#faf5ff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.35rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <strong style={{ fontSize: '0.78rem', display: 'block', color: '#7e22ce' }}>PLATINUM</strong>
                    <span style={{ fontSize: '0.65rem', color: '#7e22ce' }}>Unlimited</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.65rem' }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-white"></span> Creating Account...
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Trainer Registration Form */
            <form onSubmit={handleTrainerSubmit}>
              <div className="form-group">
                <label className="form-label">Trainer Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.2rem' }}
                    value={trainerName}
                    onChange={(e) => setTrainerName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Trainer Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                    }}
                  />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.2rem' }}
                    value={trainerEmail}
                    onChange={(e) => setTrainerEmail(e.target.value)}
                    placeholder="trainer@fitzone.com"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-subtle)',
                      }}
                    />
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '2rem' }}
                      value={trainerPhone}
                      onChange={(e) => setTrainerPhone(e.target.value)}
                      placeholder="+91 98765"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-subtle)',
                      }}
                    />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '2rem' }}
                      value={trainerPassword}
                      onChange={(e) => setTrainerPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <div style={{ position: 'relative' }}>
                  <Sparkles
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.2rem' }}
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="CrossFit, Yoga, HIIT"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.65rem' }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-white"></span> Registering Trainer...
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: '0.85rem', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Already have an account?{' '}
              <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Sign In here
              </Link>
            </span>
          </div>

          {/* Quick Explore Links */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
              <Info size={13} />
              <span>About FitZone</span>
            </Link>
            <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
              <BookOpen size={13} />
              <span>Fitness Blog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Hero Image Slider */}
      <AuthHeroSlider />
    </div>
  );
};

export default RegisterPage;
