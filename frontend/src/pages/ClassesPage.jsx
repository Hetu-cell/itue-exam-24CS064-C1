import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import TrainerCard from '../components/TrainerCard';
import { AuthContext } from '../context/AuthContext';
import {
  Search,
  Calendar,
  Dumbbell,
  Sparkles,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Crown,
  Users,
  Flame,
  Award,
  BookmarkCheck,
} from 'lucide-react';

const ClassesPage = () => {
  const { token, member } = useContext(AuthContext);

  // If logged in as Trainer, redirect exclusively to Trainer Portal
  if (member?.role === 'Trainer') {
    return <Navigate to="/trainer-dashboard" replace />;
  }

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState('roster'); // 'roster', 'booking', 'facilities'

  // Task 4 States: trainers, loading, error
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Member's active booking count state for tier quota enforcement
  const [activeBookingCount, setActiveBookingCount] = useState(0);

  // Client-side Search and Filter states
  const [searchSpec, setSearchSpec] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Task 2 Booking Form States (useState)
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [className, setClassName] = useState('Morning CrossFit Blast');
  const [bookingDate, setBookingDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('07:00 AM - 08:00 AM');

  // Form submission feedback
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', 'CrossFit', 'Yoga', 'HIIT', 'Endurance', 'Strength'];

  const timeSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
  ];

  const tierDetails = {
    basic: { name: 'Basic', maxSlots: '1 Active Slot', desc: 'Standard gym access & max 1 active class booking.', limit: 1, color: '#475569' },
    premium: { name: 'Premium', maxSlots: '3 Active Slots', desc: 'Group sessions, certified trainers & max 3 active class bookings.', limit: 3, color: '#b45309' },
    platinum: { name: 'Platinum', maxSlots: 'Unlimited Slots', desc: 'VIP All-Access, 1-on-1 priority trainers & unlimited bookings.', limit: Infinity, color: '#7e22ce' },
  };

  const currentTier = tierDetails[member?.membershipType] || tierDetails.basic;
  const isQuotaExceeded = activeBookingCount >= currentTier.limit;

  // Task 4: Fetch trainers and user's active bookings on mount
  const fetchPageData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [trainersRes, myBookingsRes] = await Promise.all([
        fetch('/api/v1/trainers'),
        fetch('/api/v1/bookings/my', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const trainersData = await trainersRes.json();
      const myBookingsData = await myBookingsRes.json();

      if (!trainersRes.ok || !trainersData.success) {
        throw new Error(trainersData.message || 'Failed to fetch trainers list');
      }

      const list = trainersData.trainers || [];
      setTrainers(list);

      // Auto-select first AVAILABLE trainer
      const firstAvailable = list.find((t) => t.available);
      if (firstAvailable) {
        setSelectedTrainerId(firstAvailable._id);
      } else if (list.length > 0) {
        setSelectedTrainerId(list[0]._id);
      }

      // Count active ('booked') sessions
      if (myBookingsRes.ok && myBookingsData.bookings) {
        const active = myBookingsData.bookings.filter((b) => b.status === 'booked').length;
        setActiveBookingCount(active);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [token]);

  // Client-side search and category filtering
  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.specialization.toLowerCase().includes(searchSpec.toLowerCase()) ||
      t.name.toLowerCase().includes(searchSpec.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' ||
      t.specialization.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const selectedTrainerObj = trainers.find((t) => t._id === selectedTrainerId);

  // Task 2 & 5: Handle Booking Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrainerId) return;

    if (isQuotaExceeded) {
      setSubmitMessage({
        type: 'error',
        text: `⚠️ [${currentTier.name} Tier Limit]: You already have ${activeBookingCount} active reservation. Your plan allows a maximum of ${currentTier.limit} active booking at a time.`,
      });
      return;
    }

    if (selectedTrainerObj && !selectedTrainerObj.available) {
      setSubmitMessage({
        type: 'error',
        text: `⚠️ Cannot book: Trainer "${selectedTrainerObj.name}" is fully booked. Please select an available trainer.`,
      });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainerId,
          className: className || 'Gym Training Session',
          date: bookingDate,
          timeSlot: selectedTimeSlot,
          status: 'booked',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.errors ? data.errors.join(', ') : data.message;
        throw new Error(errMsg || 'Failed to create booking');
      }

      setSubmitMessage({
        type: 'success',
        text: `🎉 Successfully reserved "${data.booking.className}" with ${data.booking.trainerId?.name || 'Trainer'} on ${data.booking.date}!`,
      });

      setActiveBookingCount((prev) => prev + 1);
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: `⚠️ ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      {/* Top Banner with Real-time Active Slot Quota */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          backgroundColor: '#ffffff',
          borderLeft: `4px solid ${currentTier.color}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.9rem 1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Crown size={18} color={currentTier.color} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: currentTier.color }}>
              {currentTier.name.toUpperCase()} MEMBERSHIP TIER
            </span>
            <span className={`membership-tag membership-${member?.membershipType}`}>
              {currentTier.maxSlots}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isQuotaExceeded ? '#fee2e2' : '#f0fdf4',
                color: isQuotaExceeded ? '#b91c1c' : '#15803d',
                border: `1px solid ${isQuotaExceeded ? '#fca5a5' : '#bbf7d0'}`,
              }}
            >
              Slots In Use: {activeBookingCount} / {currentTier.limit === Infinity ? '∞' : currentTier.limit}
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            {currentTier.desc}
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Active User: <strong style={{ color: 'var(--text-main)' }}>{member?.name}</strong>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <h1 className="page-title">Classes & Trainer Hub</h1>
        <p className="page-subtitle">
          Explore certified gym trainers, reserve workout sessions, and check fitness facilities.
        </p>
      </div>

      {/* Section Tabs Bar */}
      <div className="section-tabs-bar">
        <button
          type="button"
          className={`section-tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          <Users size={16} />
          <span>Trainers Roster ({filteredTrainers.length})</span>
        </button>

        <button
          type="button"
          className={`section-tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          <Calendar size={16} />
          <span>Reserve Class Slot</span>
        </button>

        <button
          type="button"
          className={`section-tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          <Dumbbell size={16} />
          <span>Gym Amenities & Schedule</span>
        </button>
      </div>

      {/* TAB 1: TRAINER ROSTER */}
      {activeTab === 'roster' && (
        <div>
          <div className="search-filter-bar">
            <div className="search-box-wrapper">
              <Search size={16} className="search-box-icon" />
              <input
                type="text"
                className="search-input-field"
                placeholder="Search trainers by name or specialization..."
                value={searchSpec}
                onChange={(e) => setSearchSpec(e.target.value)}
              />
            </div>
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="loading-state-box card">
              <span className="spinner"></span>
              <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Loading FitZone trainers roster...</p>
            </div>
          )}

          {error && (
            <div className="alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredTrainers.length === 0 ? (
                <div className="empty-box">
                  <div className="empty-box-icon">🔍</div>
                  <h3>No trainers found</h3>
                  <p>No trainers match your filter criteria. Try clearing search.</p>
                </div>
              ) : (
                <div className="trainer-grid">
                  {filteredTrainers.map((trainer) => (
                    <TrainerCard
                      key={trainer._id}
                      name={trainer.name}
                      specialization={trainer.specialization}
                      available={trainer.available}
                      isSelected={selectedTrainerId === trainer._id}
                      onSelect={() => {
                        if (trainer.available) {
                          setSelectedTrainerId(trainer._id);
                          setActiveTab('booking');
                          setSubmitMessage(null);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: CLASS BOOKING FORM */}
      {activeTab === 'booking' && (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              📅 Reserve Class Session
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Select your preferred trainer, class title, and session time slot.
            </p>

            {/* Quota Exhaustion Warning Card */}
            {isQuotaExceeded && (
              <div
                style={{
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem',
                  color: '#be123c',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <AlertTriangle size={18} />
                  <span>Maximum Active Reservation Limit Reached ({activeBookingCount}/{currentTier.limit})</span>
                </div>
                <p style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  Your <strong>{currentTier.name}</strong> membership allows maximum <strong>{currentTier.limit}</strong> active class reservation at a time.
                  Please attend or cancel your active booking under <Link to="/my-bookings" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>My Bookings</Link> before reserving a new slot.
                </p>
              </div>
            )}

            {submitMessage && (
              <div className={submitMessage.type === 'success' ? 'alert-success' : 'alert-error'}>
                {submitMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{submitMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Select Certified Trainer</label>
                <select
                  className="form-select"
                  value={selectedTrainerId}
                  onChange={(e) => {
                    setSelectedTrainerId(e.target.value);
                    setSubmitMessage(null);
                  }}
                  required
                >
                  <option value="">-- Choose Trainer --</option>
                  {trainers.map((t) => (
                    <option key={t._id} value={t._id} disabled={!t.available}>
                      {t.name} • {t.specialization} {t.available ? '(Available)' : '⛔ (Fully Booked - Unavailable)'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTrainerObj && !selectedTrainerObj.available && (
                <div
                  style={{
                    backgroundColor: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#be123c',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>This trainer is fully booked. Please select an available trainer above.</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Class / Session Title</label>
                <div style={{ position: 'relative' }}>
                  <Dumbbell
                    size={16}
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
                    style={{ paddingLeft: '2.3rem' }}
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. HIIT Cardio Blast"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Session Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-subtle)',
                    }}
                  />
                  <input
                    type="date"
                    className="form-input"
                    style={{ paddingLeft: '2.3rem' }}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      style={{
                        padding: '0.55rem 0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        border:
                          selectedTimeSlot === slot
                            ? '1.5px solid var(--primary)'
                            : '1px solid var(--border-color)',
                        backgroundColor: selectedTimeSlot === slot ? 'var(--primary)' : '#ffffff',
                        color: selectedTimeSlot === slot ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="live-preview-box">
                <div className="live-preview-title">
                  <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Live Selection Summary:
                </div>
                <div className="live-preview-item">
                  <span>Trainer:</span>
                  <strong>
                    {selectedTrainerObj ? selectedTrainerObj.name : 'None Selected'}
                    {selectedTrainerObj && !selectedTrainerObj.available && (
                      <span style={{ color: '#be123c', marginLeft: '6px', fontSize: '0.75rem' }}>(Unavailable)</span>
                    )}
                  </strong>
                </div>
                <div className="live-preview-item">
                  <span>Time Slot:</span>
                  <strong style={{ color: 'var(--accent-blue)' }}>{selectedTimeSlot}</strong>
                </div>
                <div className="live-preview-item">
                  <span>Date:</span>
                  <strong>{bookingDate}</strong>
                </div>
                <div className="live-preview-item">
                  <span>Your Plan Limit:</span>
                  <strong style={{ color: currentTier.color }}>
                    {activeBookingCount} / {currentTier.limit === Infinity ? 'Unlimited' : `${currentTier.limit} Slot(s)`}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={
                  submitting ||
                  isQuotaExceeded ||
                  !selectedTrainerId ||
                  (selectedTrainerObj && !selectedTrainerObj.available)
                }
              >
                {submitting ? (
                  <>
                    <span className="spinner-white"></span> Confirming Booking...
                  </>
                ) : isQuotaExceeded ? (
                  `⛔ ${currentTier.name} Plan Limit Reached (Max ${currentTier.limit} Slot)`
                ) : selectedTrainerObj && !selectedTrainerObj.available ? (
                  '⛔ Trainer Fully Booked'
                ) : (
                  'Confirm Class Booking'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: FACILITIES & SCHEDULE */}
      {activeTab === 'facilities' && (
        <div>
          <div className="facility-grid">
            <div className="facility-card">
              <div className="facility-icon-box">
                <Flame size={22} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Strength & Power Cages</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Eleiko Olympic Barbells, Texas Power Bars, calibrated steel plates, and 12 squat cages.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-icon-box">
                <Calendar size={22} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daily Group Classes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Morning CrossFit, High-Intensity Cardio, Power Yoga, and Core Conditioning held 6 days a week.
              </p>
            </div>

            <div className="facility-card">
              <div className="facility-icon-box">
                <Award size={22} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Certified Nutritionists</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Personalized dietary plans, body fat biometric scans, and custom macronutrient recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
