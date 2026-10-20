export default function Loading() {
  return (
    <div
      className="loading-page"
      role="status"
      aria-label="Loading SONIC EXCHANGE"
    >
      <div className="skeleton" style={{ maxWidth: 300 }} />
      <div className="skeleton tall" />
      <span className="sr-only">Finding your frequency…</span>
    </div>
  );
}
