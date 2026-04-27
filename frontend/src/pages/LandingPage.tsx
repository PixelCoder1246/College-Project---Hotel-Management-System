import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../styles/landing.css';

/* ── Data ───────────────────────────────────────────── */
const features = [
  {
    icon: '🛏️',
    title: 'Premium Room Selection',
    description:
      'Browse Single, Double, Deluxe, and Suite rooms with real-time availability and instant booking.',
  },
  {
    icon: '💳',
    title: 'Seamless Payments',
    description:
      'Secure, instant payment processing with digital invoices and booking confirmations.',
  },
  {
    icon: '📊',
    title: 'Smart Dashboard',
    description:
      'Role-based dashboards for admins, staff, and guests with real-time insights.',
  },
  {
    icon: '🔒',
    title: 'Secure Authentication',
    description:
      'JWT-based login with OTP email verification and trusted device support.',
  },
  {
    icon: '📅',
    title: 'Reservation Engine',
    description:
      'Precision overlap checking prevents double bookings across all date ranges.',
  },
  {
    icon: '👥',
    title: 'Guest Profiles',
    description:
      'Complete guest profile management with booking history and personalized experience.',
  },
];

const roomTypes = [
  {
    type: 'SINGLE',
    label: 'Standard Room',
    emoji: '🛏️',
    from: '₹8,900',
    gradient: 'room-card__img--single',
    desc: 'Cozy and comfortable for solo travellers.',
  },
  {
    type: 'DOUBLE',
    label: 'Double Room',
    emoji: '🛏️',
    from: '₹12,500',
    gradient: 'room-card__img--double',
    desc: 'Spacious room with twin or king-size bed.',
  },
  {
    type: 'DELUXE',
    label: 'Deluxe Room',
    emoji: '✨',
    from: '₹22,000',
    gradient: 'room-card__img--deluxe',
    desc: 'Premium amenities with city or garden views.',
  },
  {
    type: 'SUITE',
    label: 'Luxury Suite',
    emoji: '👑',
    from: '₹40,000',
    gradient: 'room-card__img--suite',
    desc: 'Ultimate luxury with separate living space.',
  },
];

const marqueeItems = [
  { icon: '✨', text: 'Free WiFi' },
  { icon: '🍳', text: 'Breakfast Included' },
  { icon: '🏊', text: 'Swimming Pool' },
  { icon: '💆', text: 'Spa & Wellness' },
  { icon: '🚗', text: 'Free Parking' },
  { icon: '🎮', text: 'Game Lounge' },
  { icon: '🍽️', text: 'Fine Dining' },
  { icon: '🧖', text: 'Sauna & Steam' },
  { icon: '🏋️', text: 'Fitness Center' },
  { icon: '🌿', text: 'Garden Views' },
  { icon: '📚', text: 'Library Lounge' },
  { icon: '🎭', text: 'Events Hall' },
];

/* ── Star generator ─────────────────────────────────── */
function useStars(count = 60) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  );
  return stars;
}

/* ── Scroll-reveal hook ─────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-visible');
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}



/* ── Component ──────────────────────────────────────── */
export default function LandingPage() {
  const stars = useStars(55);
  useScrollReveal();

  return (
    <div className="landing">
      {/* ─── Navbar ────────────────────────────────── */}
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="navbar__brand" id="nav-brand">
          <div className="navbar__brand-icon">⚜</div>
          Royal Orchid
        </Link>
        <div className="navbar__links">
          <a href="#rooms" className="navbar__link">
            Rooms
          </a>
          <a href="#features" className="navbar__link">
            Features
          </a>
          <Link to="/login" className="navbar__link" id="nav-login">
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn btn--primary btn--sm"
            id="hero-get-started"
          >
            Book Now
          </Link>
        </div>
      </nav>

      {/* ─── Hero ──────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__bg" />

        {/* Animated star field */}
        <div className="hero__stars" aria-hidden="true">
          {stars.map((s) => (
            <div
              key={s.id}
              className="hero__star"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                animationDuration: s.duration,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>

        {/* Floating orbs */}
        <div className="hero__orbs" aria-hidden="true">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
        </div>

        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            Premium Hospitality Experience
          </div>

          <h1 id="hero-heading" className="hero__title">
            Your Perfect Stay
            <br />
            <span className="hero__title-accent">Awaits You</span>
          </h1>

          <p className="hero__subtitle">
            Discover exceptional rooms, seamless booking, and world-class
            service at Royal Orchid — where every stay tells a story.
          </p>

          <div className="hero__cta">
            <Link
              to="/register"
              className="btn btn--primary btn--xl"
              id="cta-book-now"
            >
              Reserve a Room →
            </Link>
            <Link
              to="/login"
              className="btn btn--secondary btn--xl"
              id="hero-sign-in"
            >
              Sign In
            </Link>
          </div>

          {/* Static Amenities */}
          <div className="hero__stats">
            <div className="stat">
              <span className="stat__value">
                100+
              </span>
              <span className="stat__label">Premium Rooms</span>
            </div>
            <div className="stat__divider" />
            <div className="stat">
              <span className="stat__value">
                24/7
              </span>
              <span className="stat__label">Concierge</span>
            </div>
            <div className="stat__divider" />
            <div className="stat">
              <span className="stat__value">
                100%
              </span>
              <span className="stat__label">Secure Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marquee Ticker ────────────────────────── */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">
              <span>{item.icon}</span> {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Rooms Showcase ────────────────────────── */}
      <section
        className="rooms-showcase"
        id="rooms"
        aria-labelledby="rooms-heading"
      >
        <div className="showcase-header reveal">
          <span className="section-label">Our Collection</span>
          <h2 id="rooms-heading" className="section__title">
            Rooms &amp; Suites
          </h2>
          <p className="section__subtitle">
            Each room is crafted for comfort, elegance, and an unforgettable
            experience.
          </p>
        </div>
        <div className="showcase-grid">
          {roomTypes.map((room, i) => (
            <div
              key={room.type}
              className={`showcase-card reveal reveal--delay-${i + 1}`}
            >
              <div className={`room-card__img ${room.gradient}`}>
                <span
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '3.5rem',
                  }}
                >
                  {room.emoji}
                </span>
              </div>
              <div className="showcase-card__body">
                <div className="showcase-card__type">{room.type}</div>
                <div className="showcase-card__name">{room.label}</div>
                <p
                  style={{
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.6,
                  }}
                >
                  {room.desc}
                </p>
                <div className="showcase-card__price">
                  {room.from} <span>/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────── */}
      <section
        className="features"
        id="features"
        aria-labelledby="features-heading"
      >
        <div className="features__container">
          <div className="section__header reveal">
            <span className="section-label">Why Royal Orchid</span>
            <h2 id="features-heading" className="section__title">
              Everything You Need
            </h2>
            <p className="section__subtitle">
              A modern platform built for guests, staff, and management — all in
              one place.
            </p>
          </div>
          <div className="features__grid">
            {features.map((f, i) => (
              <article
                key={f.title}
                className={`feature-card reveal reveal--delay-${(i % 3) + 1}`}
              >
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────── */}
      <section className="cta-banner reveal" aria-labelledby="cta-heading">
        <div className="cta-banner__content">
          <h2 id="cta-heading" className="cta-banner__title">
            Begin Your Journey With Us
          </h2>
          <p className="cta-banner__subtitle">
            Join thousands of guests who have experienced the Royal Orchid
            difference. Your perfect stay is just a click away.
          </p>
          <Link
            to="/register"
            className="btn btn--primary btn--xl"
            id="cta-register"
          >
            Create Your Account — It's Free
          </Link>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <div className="footer__content">
          <div className="footer__logo">⚜ Royal Orchid Elite</div>
          <p className="footer__copy">
            © {new Date().getFullYear()} Royal Orchid Hotel Management System.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
