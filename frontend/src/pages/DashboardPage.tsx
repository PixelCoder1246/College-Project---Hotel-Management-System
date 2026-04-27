import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Administrator',
    color: '#c9a84c',
    icon: '👑',
    description: 'Full system access — manage rooms, bookings, and operations.',
  },
  STAFF: {
    label: 'Staff Member',
    color: '#3b82f6',
    icon: '👷',
    description: 'Hotel operations — manage rooms and guest reservations.',
  },
  CUSTOMER: {
    label: 'Guest',
    color: '#10b981',
    icon: '🧳',
    description: 'Welcome back! Browse rooms and manage your reservations.',
  },
} as const;

type ModuleKey =
  | 'Room Booking'
  | 'My Bookings'
  | 'Manage Rooms'
  | 'Manage Bookings'
  | 'Profile';

const MODULES: {
  icon: string;
  title: ModuleKey;
  desc: string;
  roles: ('ADMIN' | 'STAFF' | 'CUSTOMER')[];
}[] = [
  // Customer-only
  {
    icon: '🏨',
    title: 'Room Booking',
    desc: 'Browse available rooms and make a reservation.',
    roles: ['CUSTOMER'],
  },
  {
    icon: '📅',
    title: 'My Bookings',
    desc: 'View and manage your personal reservations.',
    roles: ['CUSTOMER'],
  },
  // Admin / Staff
  {
    icon: '🛏️',
    title: 'Manage Rooms',
    desc: 'Add, edit, or remove hotel rooms and update availability.',
    roles: ['ADMIN', 'STAFF'],
  },
  {
    icon: '📝',
    title: 'Manage Bookings',
    desc: 'Review, confirm or cancel all guest reservations.',
    roles: ['ADMIN', 'STAFF'],
  },
  // Shared
  {
    icon: '👤',
    title: 'Profile',
    desc: 'Update your personal information and preferences.',
    roles: ['ADMIN', 'STAFF', 'CUSTOMER'],
  },
];

const ROUTE_MAP: Record<ModuleKey, string> = {
  'Room Booking': '/rooms',
  'My Bookings': '/my-bookings',
  'Manage Rooms': '/dashboard/rooms',
  'Manage Bookings': '/dashboard/bookings',
  Profile: '/profile',
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/login');
  };

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role];
  const visibleModules = MODULES.filter((m) => m.roles.includes(user.role));

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <Link to="/" className="dashboard-header__brand">
          <div className="dashboard-header__brand-icon">⚜</div>
          Royal Orchid
        </Link>

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
            className="btn btn--outline-danger btn--sm"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Welcome Banner */}
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
              borderColor: `${roleConfig.color}40`,
              color: roleConfig.color,
            }}
          >
            {roleConfig.label}
          </div>
        </section>

        {/* Info Cards */}
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
              <span className="info-card__label">Access Level</span>
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

        {/* Modules */}
        <section aria-labelledby="modules-heading">
          <div className="modules-section__title" id="modules-heading">
            Quick Access
          </div>
          <div className="modules-grid">
            {visibleModules.map((mod) => (
              <div
                key={mod.title}
                className="module-card"
                onClick={() => navigate(ROUTE_MAP[mod.title])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && navigate(ROUTE_MAP[mod.title])
                }
                aria-label={mod.title}
              >
                <div className="module-card__icon" aria-hidden="true">
                  {mod.icon}
                </div>
                <div className="module-card__body">
                  <h3 className="module-card__title">{mod.title}</h3>
                  <p className="module-card__desc">{mod.desc}</p>
                </div>
                <span className="module-card__arrow">→</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
