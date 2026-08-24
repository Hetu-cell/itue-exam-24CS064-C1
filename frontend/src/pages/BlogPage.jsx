import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    category: 'STRENGTH TRAINING',
    title: '5 Essential Compound Movements for Maximum Muscle & Power',
    excerpt:
      'Squats, deadlifts, bench presses, overhead presses, and barbell rows recruit the highest amount of muscle fiber for maximum hormonal response.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    content:
      'Compound exercises involve multiple joints and muscle groups simultaneously. Unlike isolation exercises, compound movements build functional athletic power, boost bone mineral density, and burn significantly more calories both during and after your training session.',
  },
  {
    id: 2,
    category: 'NUTRITION & DIET',
    title: 'The Science of Pre & Post-Workout Nutrition Timing',
    excerpt:
      'How carbohydrate loading 60 minutes before training and fast-absorbing protein within 45 minutes post-workout accelerates recovery and glycogen replenishment.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    content:
      'Your muscles rely on stored glycogen for explosive contractions. Consuming a 3:1 ratio of complex carbs to lean protein before training ensures sustained ATP production, while immediate post-workout whey or plant protein repairs micro-tears in muscle fibers.',
  },
  {
    id: 3,
    category: 'CARDIO & FAT LOSS',
    title: 'HIIT vs. Steady-State Cardio: Which Burns More Fat?',
    excerpt:
      'Unpacking EPOC (Excess Post-Exercise Oxygen Consumption) and why high-intensity interval training burns calories long after your gym session ends.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    content:
      'While low-intensity steady-state cardio (LISS) utilizes fat as a primary fuel source during exercise, High-Intensity Interval Training (HIIT) creates an oxygen deficit that elevates your metabolic rate for up to 24 hours post-workout.',
  },
  {
    id: 4,
    category: 'RECOVERY & MOBILITY',
    title: 'Daily 10-Minute Mobility Routine to Prevent Workout Injuries',
    excerpt:
      'Unlock tight hip flexors, thoracic spine rigidity, and stiff ankles to improve your squat depth and eliminate lower back discomfort.',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800&auto=format&fit=crop',
    content:
      'Mobility is the bridge between flexibility and strength. Performing dynamic stretches like the World’s Greatest Stretch, cat-camels, and ankle dorsiflexion rocks prepares synovial fluid in joints for heavy loading.',
  },
  {
    id: 5,
    category: 'NUTRITION & DIET',
    title: 'Hydration & Electrolytes: The Key to Peak Stamina',
    excerpt:
      'Why losing just 2% of body water reduces physical power output by up to 15%, and how sodium-potassium balance regulates muscle contractions.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    content:
      'Water alone is often not enough during intense sessions. Essential minerals like sodium, potassium, and magnesium ensure nerve impulses transmit efficiently and prevent involuntary cramping.',
  },
  {
    id: 6,
    category: 'STRENGTH TRAINING',
    title: 'Progressive Overload: The Golden Rule of Muscle Growth',
    excerpt:
      'How to systematically increase training stimulus through weight, reps, tempo, and rest intervals without hitting frustrating plateaus.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    content:
      'Progressive overload is the gradual increase of stress placed upon the musculoskeletal system. By consistently challenging your muscles with incremental loads or higher volume, you stimulate continuous hypertrophy and neurological adaptation.',
  },
];

const BlogPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'STRENGTH TRAINING', 'NUTRITION & DIET', 'CARDIO & FAT LOSS', 'RECOVERY & MOBILITY'];

  const filteredPosts = blogPosts.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--accent-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          📰 FitZone Knowledge Hub
        </span>
        <h1 className="page-title" style={{ fontSize: '2.3rem', marginTop: '0.35rem' }}>
          Fitness Insights, Training & Nutrition
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          Science-backed training tips, nutrition advice, and recovery strategies written by certified fitness professionals.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
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

      {/* Blog Posts Grid (6 Posts in clean 3x2 grid) */}
      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.image} alt={post.title} className="blog-img" />
            <div className="blog-body">
              <span className="blog-category-tag">{post.category}</span>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>

              {selectedPost?.id === post.id && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <p><strong>Deep Dive:</strong> {post.content}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>{selectedPost?.id === post.id ? 'Show Less' : 'Read Article'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
