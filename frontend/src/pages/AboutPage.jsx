import React from 'react';
import { Dumbbell, Shield, Award, Clock, MapPin, Sparkles, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const facilities = [
    {
      title: 'Olympic Lifting & Power Racks',
      desc: 'Eleiko bars, bumper plates, calibrated steel plates, and heavy-duty competition power cages.',
      icon: Dumbbell,
      tag: 'Strength Zone',
    },
    {
      title: 'Cardio & Endurance Theater',
      desc: 'Curved woodway treadmills, Concept2 rowing machines, air bikes, and stairmasters.',
      icon: HeartPulse,
      tag: 'Cardio Zone',
    },
    {
      title: 'Mindfulness & Yoga Sanctuary',
      desc: 'Heated bamboo flooring, anti-microbial yoga mats, blocks, straps, and acoustic calming soundscapes.',
      icon: Sparkles,
      tag: 'Wellness',
    },
    {
      title: 'Active Recovery & Spa',
      desc: 'Infrared cedarwood saunas, cold plunge ice tubs, and percussion massage therapy stations.',
      icon: Award,
      tag: 'Recovery',
    },
  ];

  return (
    <div className="page-content">
      {/* Header Banner */}
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--accent-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          ⚡ Elevate Your Potential
        </span>
        <h1 className="page-title" style={{ fontSize: '2.4rem', marginTop: '0.35rem' }}>
          About FitZone Athletic Club
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
          Founded with a mission to deliver elite strength training, science-backed cardiovascular conditioning, and world-class certified coaching to everyone.
        </p>
      </div>

      {/* Hero Image Showcase */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          height: '380px',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop"
          alt="FitZone Gym Interior"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.9) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2.5rem',
            color: '#ffffff',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800 }}>
              25,000 Sq. Ft. of Purpose-Built Training Ground
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Engineered for athletic performance, functional movement, and sustainable healthy lifestyles.
            </p>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
          🏟️ World-Class Facilities & Equipment
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.75rem', fontSize: '0.92rem' }}>
          Every square foot is optimized for safety, biomechanics, and ultimate performance.
        </p>

        <div className="facility-grid">
          {facilities.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="facility-card card-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="facility-icon-box">
                    <Icon size={22} color="var(--primary)" />
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.5rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timings & Location Section */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Clock size={20} color="var(--accent-blue)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Operating Hours</h3>
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <li><strong>Monday – Friday:</strong> 05:00 AM – 11:00 PM</li>
              <li><strong>Saturday:</strong> 06:00 AM – 10:00 PM</li>
              <li><strong>Sunday:</strong> 07:00 AM – 08:00 PM</li>
              <li><strong>Public Holidays:</strong> 08:00 AM – 06:00 PM</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <MapPin size={20} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Location & Contact</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              FitZone Elite Athletic Club<br />
              Plot 42, Central Boulevard, Ring Road<br />
              Ahmedabad / Gandhinagar, Gujarat<br />
              <strong>Phone:</strong> +91 98765 43210<br />
              <strong>Email:</strong> support@fitzone.com
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          Ready to Begin Your Fitness Journey?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '540px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
          Choose from our Basic, Premium, or VIP Platinum membership tiers and reserve your first certified class today.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            Join FitZone Now
          </Link>
          <Link
            to="/classes"
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            Explore Classes Roster
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
