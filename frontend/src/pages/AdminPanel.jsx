import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Shield,
  Users,
  Dumbbell,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  PlusCircle,
  Trash2,
  Sparkles,
  BarChart3,
} from 'lucide-react';

const AdminPanel = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview', 'trainers', 'members', 'bookings'

  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filters
  const [searchMember, setSearchMember] = useState('');
  const [searchBooking, setSearchBooking] = useState('');
  const [searchTrainer, setSearchTrainer] = useState('');

  // Add Trainer form state
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerEmail, setNewTrainerEmail] = useState('');
  const [newTrainerPhone, setNewTrainerPhone] = useState('');
  const [newTrainerSpec, setNewTrainerSpec] = useState('');
  const [newTrainerAvail, setNewTrainerAvail] = useState(true);
  const [trainerActionMsg, setTrainerActionMsg] = useState('');

  const { token } = useContext(AuthContext);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, membersRes, bookingsRes, trainersRes] = await Promise.all([
        fetch('/api/v1/admin/stats', { headers }),
        fetch('/api/v1/admin/members', { headers }),
        fetch('/api/v1/admin/bookings', { headers }),
        fetch('/api/v1/trainers'),
      ]);

      const statsData = await statsRes.json();
      const membersData = await membersRes.json();
      const bookingsData = await bookingsRes.json();
      const trainersData = await trainersRes.json();

      if (!statsRes.ok) throw new Error(statsData.message || 'Failed to load stats');

      setStats(statsData.stats);
      setMembers(membersData.members || []);
      setBookings(bookingsData.bookings || []);
      setTrainers(trainersData.trainers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Toggle Trainer Availability
  const handleToggleAvailability = async (trainerId, currentStatus) => {
    try {
      const response = await fetch(`/api/v1/trainers/${trainerId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentStatus }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to toggle availability');
      }

      setTrainerActionMsg(`Updated: ${data.message}`);
      setTimeout(() => setTrainerActionMsg(''), 4000);
      fetchAdminData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Add New Trainer
  const handleAddTrainer = async (e) => {
    e.preventDefault();
    if (!newTrainerName || !newTrainerSpec) return;

    try {
      const response = await fetch('/api/v1/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTrainerName,
          email: newTrainerEmail,
          phone: newTrainerPhone,
          specialization: newTrainerSpec,
          available: newTrainerAvail,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add trainer');
      }

      setTrainerActionMsg(`🎉 Added new trainer "${data.trainer.name}"!`);
      setNewTrainerName('');
      setNewTrainerEmail('');
      setNewTrainerPhone('');
      setNewTrainerSpec('');
      setShowAddTrainer(false);
      setTimeout(() => setTrainerActionMsg(''), 4000);
      fetchAdminData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete Trainer
  const handleDeleteTrainer = async (trainerId, name) => {
    if (!window.confirm(`Are you sure you want to remove trainer "${name}"?`)) return;

    try {
      const response = await fetch(`/api/v1/trainers/${trainerId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to remove trainer');
      }

      setTrainerActionMsg(`Removed trainer "${name}"`);
      setTimeout(() => setTrainerActionMsg(''), 4000);
      fetchAdminData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getMembershipClass = (type) => {
    const map = {
      basic: 'membership-basic',
      premium: 'membership-premium',
      platinum: 'membership-platinum',
    };
    return map[type] || 'membership-basic';
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.membershipType?.toLowerCase().includes(searchMember.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.className?.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.memberId?.name?.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.trainerId?.name?.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.status?.toLowerCase().includes(searchBooking.toLowerCase())
  );

  const filteredTrainers = trainers.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTrainer.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchTrainer.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(searchTrainer.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-state-box card">
          <span className="spinner"></span>
          <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Loading FitZone Admin Dashboard...</p>
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

  return (
    <div className="page-content">
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h1 className="page-title">
            <Shield
              size={24}
              style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--primary)' }}
            />
            Admin Operations Center
          </h1>
          <p className="page-subtitle">
            System overview, trainer rosters, member directories, and master booking logs. (Lazy-loaded)
          </p>
        </div>

        <button type="button" onClick={fetchAdminData} className="btn-outline">
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {trainerActionMsg && (
        <div className="alert-success" style={{ marginBottom: '1.25rem' }}>
          <Sparkles size={18} />
          <span>{trainerActionMsg}</span>
        </div>
      )}

      {/* Admin Section Tabs */}
      <div className="section-tabs-bar">
        <button
          type="button"
          className={`section-tab-btn ${activeAdminTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('overview')}
        >
          <BarChart3 size={16} />
          <span>Analytics Overview</span>
        </button>

        <button
          type="button"
          className={`section-tab-btn ${activeAdminTab === 'trainers' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('trainers')}
        >
          <Dumbbell size={16} />
          <span>Trainer Management ({filteredTrainers.length})</span>
        </button>

        <button
          type="button"
          className={`section-tab-btn ${activeAdminTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('members')}
        >
          <Users size={16} />
          <span>Member Directory ({filteredMembers.length})</span>
        </button>

        <button
          type="button"
          className={`section-tab-btn ${activeAdminTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('bookings')}
        >
          <Calendar size={16} />
          <span>Bookings Roster ({filteredBookings.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeAdminTab === 'overview' && stats && (
        <div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Registered Members</span>
              <span className="kpi-number">{stats.totalMembers}</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Active Trainers</span>
              <span className="kpi-number" style={{ color: 'var(--accent-blue)' }}>
                {stats.totalTrainers}
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Available Slots</span>
              <span className="kpi-number" style={{ color: 'var(--accent-green)' }}>
                {stats.availableTrainers}
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Total Bookings</span>
              <span className="kpi-number">{stats.totalBookings}</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Active Reservations</span>
              <span className="kpi-number" style={{ color: 'var(--accent-blue)' }}>
                {stats.activeBookings}
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Completed / Attended</span>
              <span className="kpi-number" style={{ color: 'var(--accent-green)' }}>
                {stats.attendedBookings}
              </span>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              ⚡ System Health & Database Diagnostics
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Database: <strong>MongoDB (local/cloud)</strong> &nbsp;|&nbsp; API Version: <strong>v1.0.0</strong> &nbsp;|&nbsp; Status: <strong style={{ color: 'var(--accent-green)' }}>Operational</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setActiveAdminTab('trainers')} className="btn-outline">
                Manage Trainers →
              </button>
              <button type="button" onClick={() => setActiveAdminTab('members')} className="btn-outline">
                Inspect Members →
              </button>
              <button type="button" onClick={() => setActiveAdminTab('bookings')} className="btn-outline">
                View All Bookings →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRAINER MANAGEMENT */}
      {activeAdminTab === 'trainers' && (
        <div className="table-container">
          <div className="table-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Dumbbell size={18} />
              <span>Trainer Roster & Availability ({filteredTrainers.length})</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ width: '180px', position: 'relative' }}>
                <Search
                  size={13}
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '0.3rem 0.5rem 0.3rem 1.75rem', fontSize: '0.78rem' }}
                  placeholder="Search trainers..."
                  value={searchTrainer}
                  onChange={(e) => setSearchTrainer(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddTrainer(!showAddTrainer)}
                className="btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                <PlusCircle size={14} />
                <span>{showAddTrainer ? 'Cancel' : 'Add Trainer'}</span>
              </button>
            </div>
          </div>

          {/* Add Trainer Accordion Form */}
          {showAddTrainer && (
            <form
              onSubmit={handleAddTrainer}
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                ✨ Register New Gym Trainer
              </h3>
              <div className="form-grid-2">
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    Trainer Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTrainerName}
                    onChange={(e) => setNewTrainerName(e.target.value)}
                    placeholder="e.g. Liam Smith"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    Trainer Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={newTrainerEmail}
                    onChange={(e) => setNewTrainerEmail(e.target.value)}
                    placeholder="liam@fitzone.com"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={newTrainerPhone}
                    onChange={(e) => setNewTrainerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    Specialization *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTrainerSpec}
                    onChange={(e) => setNewTrainerSpec(e.target.value)}
                    placeholder="e.g. Pilates & Core Strength"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newTrainerAvail}
                    onChange={(e) => setNewTrainerAvail(e.target.checked)}
                  />
                  <span>Set as Available for Booking immediately</span>
                </label>

                <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                  Save Trainer
                </button>
              </div>
            </form>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Trainer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Current Status</th>
                  <th>Quick Action</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                      No trainers found.
                    </td>
                  </tr>
                ) : (
                  filteredTrainers.map((t) => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.name}</td>
                      <td>{t.email || '—'}</td>
                      <td>{t.phone || '—'}</td>
                      <td>{t.specialization}</td>
                      <td>
                        <span className={`badge ${t.available ? 'badge-available' : 'badge-booked'}`}>
                          {t.available ? '● Available' : '○ Fully Booked'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(t._id, t.available)}
                          className="btn-outline"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          {t.available ? 'Mark as Fully Booked' : 'Mark as Available'}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteTrainer(t._id, t.name)}
                          className="btn-danger-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Delete Trainer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MEMBER DIRECTORY */}
      {activeAdminTab === 'members' && (
        <div className="table-container">
          <div className="table-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} />
              <span>Registered Member Directory ({filteredMembers.length})</span>
            </div>

            <div style={{ width: '220px', position: 'relative' }}>
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
                style={{ padding: '0.35rem 0.5rem 0.35rem 2rem', fontSize: '0.8rem' }}
                placeholder="Search members..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>Membership Tier</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No matching members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.phone || '—'}</td>
                      <td>
                        <span className={`membership-tag ${getMembershipClass(m.membershipType)}`}>
                          {m.membershipType}
                        </span>
                      </td>
                      <td
                        style={{
                          fontWeight: 600,
                          color: m.role === 'Admin' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        }}
                      >
                        {m.role}
                      </td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MASTER BOOKING LEDGER */}
      {activeAdminTab === 'bookings' && (
        <div className="table-container">
          <div className="table-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              <span>Master Class Bookings Roster ({filteredBookings.length})</span>
            </div>

            <div style={{ width: '220px', position: 'relative' }}>
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
                style={{ padding: '0.35rem 0.5rem 0.35rem 2rem', fontSize: '0.8rem' }}
                placeholder="Search bookings..."
                value={searchBooking}
                onChange={(e) => setSearchBooking(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Member</th>
                  <th>Assigned Trainer</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.className}</td>
                      <td>{b.memberId ? `${b.memberId.name} (${b.memberId.email})` : '—'}</td>
                      <td>{b.trainerId ? `${b.trainerId.name} (${b.trainerId.specialization})` : '—'}</td>
                      <td>{b.date}</td>
                      <td>{b.timeSlot}</td>
                      <td>
                        <span className={`status-pill status-${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
