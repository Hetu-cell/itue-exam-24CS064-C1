import React, { useState, useEffect } from 'react';
import { Dumbbell, Trophy, Sparkles, HeartPulse, Flame } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    tag: 'STRENGTH & POWER',
    title: 'Transform Your Body with World-Class Equipment',
    desc: 'State-of-the-art free weights, Olympic barbells, and certified personal trainers ready to push your boundaries.',
    icon: Flame,
    stat: '1,500+ Active Athletes',
  },
  {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    tag: 'HIIT & ENDURANCE',
    title: 'High-Energy Cardio & Functional Training',
    desc: 'Experience dynamic group classes engineered to maximize calorie burn, stamina, and cardiovascular health.',
    icon: HeartPulse,
    stat: '45+ Weekly Classes',
  },
  {
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1200&auto=format&fit=crop',
    tag: 'MINDFULNESS & MOBILITY',
    title: 'Yoga, Pilates & Active Recovery Studios',
    desc: 'Restore muscle balance, enhance flexibility, and release daily stress in our serene wellness sanctuaries.',
    icon: Sparkles,
    stat: 'Certified Yoga Masters',
  },
  {
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    tag: 'EXPERT COACHING',
    title: '1-on-1 Guidance Tailored to Your Fitness Goals',
    desc: 'Customized workout programming, nutritional consulting, and real-time biometric tracking for peak performance.',
    icon: Trophy,
    stat: '4.9/5 Member Rating',
  },
];

const AuthHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="auth-slider-side">
      {/* Background Image with cross-fade */}
      <img
        key={currentSlide}
        src={slide.image}
        alt={slide.title}
        className="auth-slider-bg-img"
      />
      <div className="auth-slider-overlay" />

      {/* Top Header Badge */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
            <Dumbbell size={18} />
          </div>
          <span>FitZone Arena</span>
        </div>

        <div style={{ padding: '0.3rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
          ⚡ {slide.stat}
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="auth-slider-content">
        <div className="auth-slider-badge">
          <IconComponent size={14} />
          <span>{slide.tag}</span>
        </div>

        <h2 className="auth-slider-title">{slide.title}</h2>
        <p className="auth-slider-desc">{slide.desc}</p>

        {/* Slider Dots */}
        <div className="slider-dots-container">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthHeroSlider;
