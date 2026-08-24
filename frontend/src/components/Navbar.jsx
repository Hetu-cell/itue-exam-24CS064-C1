import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dumbbell, Calendar, BookmarkCheck, Shield, LogOut, UserCheck } from 'lucide-react';

const Navbar = () => {
  const { member, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar completely on Login and Register pages (Clean Fullscreen Layout)
  if (!token && (location.pathname === '/' || location.pathname === '/register')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMembershipClass = (type) => {
    const map = {
      basic: 'membership-basic',
      premium: 'membership-premium',
      platinum: 'membership-platinum',
    };
    return map[type] || 'membership-basic';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <NavLink
        to={
          !token
            ? '/'
            : member?.role === 'Trainer'
            ? '/trainer-dashboard'
            : '/classes'
        }
        className="nav-brand"
      >
        <div className="nav-logo-icon">
          <Dumbbell size={18} />
        </div>
        <span>FitZone</span>
      </NavLink>

      <ul className="nav-links">
        {token && (
          <>
            {/* If Trainer: ONLY Dedicated Trainer Portal */}
            {member?.role === 'Trainer' ? (
              <li>
                <NavLink to="/trainer-dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <UserCheck size={15} />
                  <span>Trainer Portal</span>
                </NavLink>
              </li>
            ) : (
              /* Regular Member Navigation */
              <>
                <li>
                  <NavLink to="/classes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <Calendar size={15} />
                    <span>Classes</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <BookmarkCheck size={15} />
                    <span>My Bookings</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Role Navigation */}
            {member && member.role === 'Admin' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Shield size={15} />
                  <span>Admin</span>
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="nav-right">
        {token && member ? (
          <>
            <div className="user-badge">
              <div className="user-avatar">{getInitials(member.name)}</div>
              <div className="user-info-text">
                <span className="user-name-text">{member.name}</span>
              </div>
              <span className={`membership-tag ${member.role === 'Trainer' ? 'membership-platinum' : getMembershipClass(member.membershipType)}`}>
                {member.role === 'Trainer' ? 'Trainer' : member.membershipType}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-logout" title="Sign Out">
              <LogOut size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/register" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            Get Started
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
