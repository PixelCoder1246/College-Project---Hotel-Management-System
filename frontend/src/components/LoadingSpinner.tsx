interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  label,
  fullPage = false,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div
        className="spinner-page"
        role="status"
        aria-label={label || 'Loading'}
      >
        <div className={`spinner spinner--${size}`} />
        {label && <span className="spinner-page__label">{label}</span>}
      </div>
    );
  }

  return (
    <span
      className={`spinner spinner--${size}`}
      role="status"
      aria-label={label || 'Loading'}
    />
  );
}
