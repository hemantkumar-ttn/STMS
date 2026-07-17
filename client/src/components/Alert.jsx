/**
 * Alert banner for success and error messages.
 */
export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-medium hover:opacity-70"
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
    </div>
  );
}
