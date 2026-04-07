import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/landing.css';

const features = [
  {
    icon: '🛏️',
    title: 'Room Management',
    description:
      'Efficiently manage room inventory, availability, and pricing in real time.',
  },
  {
    icon: '👥',
    title: 'Guest Experience',
    description:
      'Deliver personalized experiences with complete guest profile management.',
  },
  {
    icon: '📊',
    title: 'Analytics & Reports',
    description:
      'Get actionable insights from real-time dashboards and detailed reports.',
  },
  {
    icon: '🔒',
    title: 'Role-Based Access',
    description:
      'Secure, granular access control for Admins, Staff, and Customers.',
  },
  {
    icon: '💳',
    title: 'Billing & Payments',
    description:
      'Streamline invoicing, receipts, and payment processing seamlessly.',
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description:
      'Automated alerts for bookings, check-ins, check-outs, and more.',
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />


      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
        </div>

        <div className="hero__content">
          <div className="hero__badge">Premium Hospitality Experience</div>

          <h1 id="hero-heading" className="hero__title">
            The Future of
            <br />
            <span className="hero__title--accent">Hotel Management</span>
          </h1>

          <p className="hero__subtitle">
            A complete, modern platform to manage rooms, staff, guests, and
            operations — all in one beautiful, intuitive system.
          </p>

          <div className="hero__cta">
            <Link
              to="/register"
              className="btn btn--primary btn--lg"
              id="hero-get-started"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="btn btn--secondary btn--lg"
              id="hero-sign-in"
            >
              Sign In
            </Link>
          </div>

          <div className="hero__stats">
            <div className="stat">
              <span className="stat__value">10k+</span>
              <span className="stat__label">Hotels Trust Us</span>
            </div>
            <div className="stat__divider" />
            <div className="stat">
              <span className="stat__value">24/7</span>
              <span className="stat__label">Smart Support</span>
            </div>
            <div className="stat__divider" />
            <div className="stat">
              <span className="stat__value">Zero</span>
              <span className="stat__label">Setup Fees</span>
            </div>
          </div>
        </div>
      </section>


      <section
        className="features"
        id="features"
        aria-labelledby="features-heading"
      >
        <div className="features__container">
          <div className="section__header">
            <span className="section__label">Everything You Need</span>
            <h2 id="features-heading" className="section__title">
              Built for Modern Hotels
            </h2>
            <p className="section__subtitle">
              From a single property to a chain of hotels, our platform scales
              with you.
            </p>
          </div>

          <div className="features__grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-card__icon">{feature.icon}</span>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="cta-banner" aria-labelledby="cta-heading">
        <div className="cta-banner__content">
          <h2 id="cta-heading" className="cta-banner__title">
            Ready to Transform Your Hotel?
          </h2>
          <p className="cta-banner__subtitle">
            Join the platform built for the next generation of hospitality.
          </p>
          <Link
            to="/register"
            className="btn btn--primary btn--lg"
            id="cta-register"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>


      <footer className="footer" role="contentinfo">
        <div className="footer__content">
          <div className="footer__logo">⚜ Hotel MS</div>
          <p className="footer__copy">
            © {new Date().getFullYear()} Hotel Management System. Built for
            hospitality.
          </p>
        </div>
      </footer>
    </div>
  );
}
