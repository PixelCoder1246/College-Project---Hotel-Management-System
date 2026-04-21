import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, verifyOtp } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/auth.css';

type Stage = 'credentials' | 'otp';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [stage, setStage] = useState<Stage>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const trustedToken = localStorage.getItem('trustedToken') ?? undefined;
      const res = await loginUser({ email, password, trustedToken });

      if (!res.data.requiresOtp && res.data.token && res.data.user) {
        login(res.data.token, res.data.user, res.data.trustedToken);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      } else {
        setStage('otp');
        toast.success('OTP sent! Please check your email inbox.');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? 'Login failed. Please try again.');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyOtp({ email, otp, rememberMe });
      login(res.data.token, res.data.user, res.data.trustedToken);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Invalid OTP. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
      </div>

      <div className="auth-container">
        <Link to="/" className="auth-brand" id="auth-logo">
          <span className="auth-brand__icon">⚜</span>
          <span className="auth-brand__name">Hotel MS</span>
        </Link>

        <div className="auth-card">
          <div
            className="auth-stages"
            role="progressbar"
            aria-valuetext={stage}
          >
            <div
              className={`auth-stage ${stage === 'credentials' ? 'active' : 'done'}`}
            >
              <span className="auth-stage__dot">1</span>
              <span className="auth-stage__label">Credentials</span>
            </div>
            <div className="auth-stage__line" />
            <div className={`auth-stage ${stage === 'otp' ? 'active' : ''}`}>
              <span className="auth-stage__dot">2</span>
              <span className="auth-stage__label">Verify OTP</span>
            </div>
          </div>

          {stage === 'credentials' ? (
            <>
              <div className="auth-card__header">
                <h1 className="auth-card__title">Welcome back</h1>
                <p className="auth-card__subtitle">
                  Sign in to your account to continue
                </p>
              </div>

              <form
                onSubmit={handleCredentials}
                className="auth-form"
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="input-toggle"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  className="btn btn--primary btn--full"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Continue →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-card__header">
                <div className="otp-icon">📧</div>
                <h1 className="auth-card__title">Check your email</h1>
                <p className="auth-card__subtitle">
                  We sent a 6-digit OTP to
                  <br />
                  <strong className="text-accent">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleOtp} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="otp-input" className="form-label">
                    One-Time Password
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    className="form-input form-input--otp"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    required
                  />
                </div>

                <label className="checkbox-label" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox__custom" />
                  <span className="checkbox__text">
                    Remember this device for 90 days
                  </span>
                </label>

                <button
                  id="otp-submit"
                  type="submit"
                  className="btn btn--primary btn--full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Verify & Sign In'
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn--ghost btn--full"
                  onClick={() => {
                    setStage('credentials');
                    setOtp('');
                  }}
                >
                  ← Back
                </button>
              </form>
            </>
          )}

          <p className="auth-card__footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" id="link-to-register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
