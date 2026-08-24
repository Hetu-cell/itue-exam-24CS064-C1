import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookmarkCheck, Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const { token, member } = useContext(AuthContext);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load bookings');
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyBookings();
    }
  }, [token]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);

    try {
      const response = await fetch(`/api/v1/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      // Refresh list
      fetchMyBookings();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const bookedCount = bookings.filter((b) => b.status === 'booked').length;
  const attendedCount = bookings.filter((b) => b.status === 'attended').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Class Bookings</h1>
          <p className="page-subtitle">
            Manage your scheduled gym classes, check trainer details, and track your attendance.
          </p>
        </div>

        <Link to="/classes" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          + Book New Class
        </Link>
      </div>

      {/* Quick Summary KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1.5rem' }}>
        <div className="kpi-card" style={{ padding: '1rem' }}>
          <span className="kpi-label">Total Bookings</span>
          <span className="kpi-number">{bookings.length}</span>
        </div>
        <div className="kpi-card" style={{ padding: '1rem' }}>
          <span className="kpi-label" style={{ color: 'var(--accent-blue)' }}>Upcoming</span>
          <span className="kpi-number" style={{ color: 'var(--accent-blue)' }}>{bookedCount}</span>
        </div>
        <div className="kpi-card" style={{ padding: '1rem' }}>
          <span className="kpi-label" style={{ color: 'var(--accent-green)' }}>Attended</span>
          <span className="kpi-number" style={{ color: 'var(--accent-green)' }}>{attendedCount}</span>
        </div>
        <div className="kpi-card" style={{ padding: '1rem' }}>
          <span className="kpi-label" style={{ color: 'var(--accent-rose)' }}>Cancelled</span>
          <span className="kpi-number" style={{ color: 'var(--text-muted)' }}>{cancelledCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All ({bookings.length})
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'booked' ? 'active' : ''}`}
          onClick={() => setStatusFilter('booked')}
        >
          Booked ({bookedCount})
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'attended' ? 'active' : ''}`}
          onClick={() => setStatusFilter('attended')}
        >
          Attended ({attendedCount})
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('cancelled')}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-state-box card">
          <span className="spinner"></span>
          <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Loading your reservations...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="empty-box">
          <div className="empty-box-icon">📋</div>
          <h3>No bookings found</h3>
          <p>
            {statusFilter === 'all'
              ? "You don't have any class reservations yet. Explore the Classes page to get started!"
              : `No bookings with status "${statusFilter}".`}
          </p>
          <Link to="/classes" className="btn-primary" style={{ marginTop: '1.25rem' }}>
            Explore Classes & Trainers
          </Link>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div>
          {filteredBookings.map((b) => (
            <div key={b._id} className="booking-card-item">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{b.className}</h3>
                  <span className={`status-pill status-${b.status}`}>
                    {b.status === 'attended' && <CheckCircle2 size={12} style={{ marginRight: '3px' }} />}
                    {b.status === 'cancelled' && <XCircle size={12} style={{ marginRight: '3px' }} />}
                    {b.status === 'attended' ? 'Completed / Attended' : b.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span>
                    🏋️ Trainer: <strong>{b.trainerId ? b.trainerId.name : 'Unassigned'}</strong>
                    {b.trainerId?.specialization && <span style={{ color: 'var(--text-muted)' }}> ({b.trainerId.specialization})</span>}
                  </span>
                  <span>
                    <Calendar size={13} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                    {b.date}
                  </span>
                  <span>
                    <Clock size={13} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                    {b.timeSlot}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  <span>
                    <User size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                    Member: {b.memberId ? `${b.memberId.name} (${b.memberId.email})` : member?.name}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons: ONLY active when status is 'booked' */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {b.status === 'booked' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(b._id, 'attended')}
                      disabled={updatingId === b._id}
                      className="btn-success-sm"
                    >
                      {updatingId === b._id ? 'Updating...' : '✓ Mark Attended'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                      disabled={updatingId === b._id}
                      className="btn-danger-sm"
                    >
                      {updatingId === b._id ? 'Updating...' : '✕ Cancel Booking'}
                    </button>
                  </>
                ) : b.status === 'attended' ? (
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--accent-green)',
                      backgroundColor: '#f0fdf4',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Completed & Verified</span>
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      backgroundColor: '#f4f4f5',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #e4e4e7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <XCircle size={14} />
                    <span>Cancelled</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
