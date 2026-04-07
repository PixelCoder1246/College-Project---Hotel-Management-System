import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Administrator',
    color: '#ef4444',
    icon: '👑',
    description: 'Full system access and control',
  },
  STAFF: {
    label: 'Staff Member',
    color: '#3b82f6',
    icon: '👷',
    description: 'Hotel operations access',
  },
  CUSTOMER: {
    label: 'Customer',
    color: '#10b981',
    icon: '🧑',
    description: 'Guest portal access',
  },
} as const;

const MODULES = [
  {
    icon: '🛏️',
    title: 'Room Booking',
    desc: 'Manage reservations and room availability',
    roles: ['ADMIN', 'STAFF', 'CUSTOMER'],
  },
  {
    icon: '💳',
    title: 'Payments',
    desc: 'Process and track all payment transactions',
    roles: ['ADMIN', 'STAFF', 'CUSTOMER'],
  },
  {
    icon: '👥',
    title: 'Staff Management',
    desc: 'Manage your team, schedules, and shifts',
    roles: ['ADMIN'],
  },
  {
    icon: '📊',
    title: 'Reports & Analytics',
    desc: 'Real-time performance dashboards and insights',
    roles: ['ADMIN', 'STAFF'],
  },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/login');
  };

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role];
  const visibleModules = MODULES.filter((m) => m.roles.includes(user.role));

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dashboard-header">
        <div className="dashboard-header__brand">
          <span className="dashboard-header__icon">⚜</span>
          <span className="dashboard-header__name">Hotel MS</span>
        </div>

        <div className="dashboard-header__actions">
          <div className="header-user">
            <div className="header-user__avatar" aria-hidden="true">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="header-user__info">
              <span className="header-user__name">{user.name}</span>
              <span
                className="header-user__role"
                style={{ color: roleConfig.color }}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>

          <button
            id="logout-btn"
            className="btn btn--outline-danger"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="dashboard-main">
        {/* Welcome banner */}
        <section className="welcome-banner" aria-labelledby="welcome-heading">
          <div className="welcome-banner__content">
            <div className="welcome-banner__icon" aria-hidden="true">
              {roleConfig.icon}
            </div>
            <div>
              <h1 id="welcome-heading" className="welcome-banner__title">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <p className="welcome-banner__subtitle">
                {roleConfig.description}
              </p>
            </div>
          </div>

          <div
            className="welcome-banner__badge"
            style={{
              background: `${roleConfig.color}18`,
              borderColor: `${roleConfig.color}44`,
            }}
          >
            <span style={{ color: roleConfig.color }}>{roleConfig.label}</span>
          </div>
        </section>

        {/* Account info cards */}
        <section className="info-grid" aria-label="Account information">
          <div className="info-card">
            <div className="info-card__icon" aria-hidden="true">
              📧
            </div>
            <div className="info-card__body">
              <span className="info-card__label">Email</span>
              <span className="info-card__value">{user.email}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon" aria-hidden="true">
              🔐
            </div>
            <div className="info-card__body">
              <span className="info-card__label">Account Type</span>
              <span
                className="info-card__value"
                style={{ color: roleConfig.color }}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card__icon" aria-hidden="true">
              🆔
            </div>
            <div className="info-card__body">
              <span className="info-card__label">User ID</span>
              <span className="info-card__value info-card__value--mono">
                {user.id.slice(0, 8)}…
              </span>
            </div>
          </div>
        </section>

        {/* Quick-access modules */}
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="section-title">
            Quick Access
          </h2>

          <div className="modules-grid">
            {visibleModules.map((mod) => (
              <div
                key={mod.title}
                className="module-card"
              >
                <div className="module-card__icon" aria-hidden="true">
                  {mod.icon}
                </div>
                <div className="module-card__body">
                  <h3 className="module-card__title">{mod.title}</h3>
                  <p className="module-card__desc">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
