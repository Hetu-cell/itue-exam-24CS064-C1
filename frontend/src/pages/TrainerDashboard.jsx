import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Dumbbell,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  Power,
  RefreshCw,
  Sparkles,
  Search,
} from 'lucide-react';

const TrainerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [toggling, setToggling] = useState(false);

  // Search state for filtering assigned members
  const [searchMember, setSearchMember] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { token, member } = useContext(AuthContext);

  const fetchPortalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/trainers/me/portal', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to load trainer portal');
      }

      setData(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortalData();
    }
  }, [token]);

  // Toggle Trainer Availability (Available <-> Fully Booked)
  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const response = await fetch('/api/v1/trainers/me/toggle-availability', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to update availability');
      }

      setActionMsg(resData.message);
      setTimeout(() => setActionMsg(''), 4500);
      fetchPortalData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setToggling(false);
    }
  };

  // Update Booking Status (attended / cancelled)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/v1/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to update status');
      }

      setActionMsg(`Booking status updated to ${newStatus}!`);
      setTimeout(() => setActionMsg(''), 4000);
      fetchPortalData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-state-box card">
          <span className="spinner"></span>
          <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Loading Trainer Portal Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const { trainer, stats, myBookings } = data || {};

  // Filtered members list
  const filteredMyBookings = (myBookings || []).filter((b) => {
    const matchesSearch =
      (b.memberId?.name || '').toLowerCase().includes(searchMember.toLowerCase()) ||
      (b.memberId?.email || '').toLowerCase().includes(searchMember.toLowerCase()) ||
      (b.memberId?.phone || '').toLowerCase().includes(searchMember.toLowerCase()) ||
      (b.className || '').toLowerCase().includes(searchMember.toLowerCase()) ||
      (b.memberId?.membershipType || '').toLowerCase().includes(searchMember.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-content">
      {/* Top Trainer Header Card */}
      <div
        className="card"
        style={{
          marginBottom: '1.75rem',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.5rem',
          borderLeft: `4px solid ${trainer?.available ? '#16a34a' : '#e11d48'}`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <Dumbbell size={22} color="var(--primary)" />
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              Trainer Portal: {trainer?.name}
            </h1>
            <span className={`badge ${trainer?.available ? 'badge-available' : 'badge-booked'}`}>
              {trainer?.available ? '● Available for Bookings' : '○ Fully Booked'}
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Specialization: <strong>{trainer?.specialization}</strong> &nbsp;|&nbsp; Email: <strong>{trainer?.email}</strong> {trainer?.phone ? `| Phone: ${trainer.phone}` : ''}
          </p>
        </div>

        {/* 1-Click Availability Toggle Button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleToggleAvailability}
            disabled={toggling}
            className={trainer?.available ? 'btn-danger-sm' : 'btn-success-sm'}
            style={{ padding: '0.6rem 1.15rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Power size={15} />
            <span>
              {toggling
                ? 'Updating...'
                : trainer?.available
                ? 'Set to Fully Booked'
                : 'Set to Available'}
            </span>
          </button>

          <button type="button" onClick={fetchPortalData} className="btn-outline" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="alert-success" style={{ marginBottom: '1.25rem' }}>
          <Sparkles size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* KPI Metrics for This Trainer */}
      {stats && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Assigned Sessions</span>
            <span className="kpi-number">{stats.totalAssigned}</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Upcoming / Active</span>
            <span className="kpi-number" style={{ color: 'var(--accent-blue)' }}>
              {stats.activeSessions}
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Completed Classes</span>
            <span className="kpi-number" style={{ color: 'var(--accent-green)' }}>
              {stats.completedSessions}
            </span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Cancelled Sessions</span>
            <span className="kpi-number" style={{ color: 'var(--text-muted)' }}>
              {stats.cancelledSessions}
            </span>
          </div>
        </div>
      )}

      {/* MEMBERS WHO BOOKED WITH THIS TRAINER ONLY */}
      <div className="table-container">
        <div className="table-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} />
            <span>Members Assigned to You ({filteredMyBookings.length})</span>
          </div>

          {/* Search Bar for Booked Members */}
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <div style={{ width: '240px', position: 'relative' }}>
              <Search
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
                type="text"
                className="form-input"
                style={{ padding: '0.35rem 0.6rem 0.35rem 2rem', fontSize: '0.82rem' }}
                placeholder="Search member, email, phone..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member Details</th>
                <th>Contact</th>
                <th>Membership Tier</th>
                <th>Class Name</th>
                <th>Date & Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMyBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    {searchMember ? `No booked members match "${searchMember}".` : 'No members have booked sessions with you yet.'}
                  </td>
                </tr>
              ) : (
                filteredMyBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{b.memberId?.name || 'Unknown Member'}</strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        <div>{b.memberId?.email}</div>
                        {b.memberId?.phone && <div style={{ color: 'var(--text-muted)' }}>{b.memberId.phone}</div>}
                      </div>
                    </td>
                    <td>
                      <span className={`membership-tag membership-${b.memberId?.membershipType || 'basic'}`}>
                        {b.memberId?.membershipType || 'Basic'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{b.className}</td>
                    <td>
                      <div><strong>{b.date}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.timeSlot}</div>
                    </td>
                    <td>
                      <span className={`status-pill status-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'booked' ? (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b._id, 'attended')}
                            className="btn-success-sm"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                          >
                            Mark Attended
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                            className="btn-danger-sm"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
