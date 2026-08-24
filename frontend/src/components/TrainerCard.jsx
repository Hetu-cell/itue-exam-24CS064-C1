import React from 'react';
import { UserCheck, Sparkles, CheckCircle2, XCircle, Ban } from 'lucide-react';

const TrainerCard = ({ name, specialization, available, onSelect, isSelected }) => {
  // Object map for clean conditional availability text (Task 1 Requirement)
  const availabilityMap = {
    true: 'Available',
    false: 'Fully Booked',
  };

  // Object map for badge CSS classes
  const badgeClassMap = {
    true: 'badge badge-available',
    false: 'badge badge-booked',
  };

  const isAvail = Boolean(available);

  return (
    <div
      className={`trainer-card card-hover ${isSelected ? 'selected-card' : ''}`}
      style={{
        border: isSelected ? '2px solid var(--primary)' : isAvail ? '1px solid var(--border-color)' : '1px solid #fecdd3',
        backgroundColor: '#ffffff',
        opacity: isAvail ? 1 : 0.85,
      }}
    >
      <div>
        <div className="trainer-card-top">
          <div
            className="trainer-avatar-box"
            style={{
              backgroundColor: isAvail ? 'var(--bg-subtle)' : '#fff1f2',
            }}
          >
            {isAvail ? <UserCheck size={20} color="var(--primary)" /> : <Ban size={20} color="#e11d48" />}
          </div>
          <span className={badgeClassMap[isAvail]}>
            {isAvail ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {availabilityMap[isAvail]}
          </span>
        </div>

        <h3 className="trainer-name">{name}</h3>
        <p className="trainer-specialization">
          <Sparkles
            size={13}
            style={{
              display: 'inline',
              marginRight: '4px',
              verticalAlign: 'middle',
              color: isAvail ? 'var(--accent-blue)' : 'var(--text-muted)',
            }}
          />
          {specialization}
        </p>
      </div>

      <div className="trainer-card-footer">
        <span style={{ color: 'var(--text-muted)' }}>
          Status:{' '}
          <strong style={{ color: isAvail ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
            {availabilityMap[isAvail]}
          </strong>
        </span>

        {onSelect && (
          <button
            type="button"
            disabled={!isAvail}
            onClick={() => {
              if (isAvail) onSelect();
            }}
            className="btn-outline"
            style={{
              padding: '0.3rem 0.65rem',
              fontSize: '0.78rem',
              backgroundColor: isSelected ? 'var(--primary)' : isAvail ? '#ffffff' : '#f4f4f5',
              color: isSelected ? '#ffffff' : isAvail ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: isAvail ? 'pointer' : 'not-allowed',
              borderColor: isSelected ? 'var(--primary)' : isAvail ? 'var(--border-color)' : '#e4e4e7',
            }}
          >
            {isSelected ? 'Selected' : isAvail ? 'Select' : 'Unavailable'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerCard;
