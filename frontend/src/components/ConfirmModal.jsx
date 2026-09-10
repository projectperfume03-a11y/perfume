export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel,
  confirmText = 'Confirmer', cancelText = 'Annuler',
  isDanger = false, isLoading = false, dark = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isLoading ? undefined : onCancel}>
      <div
        className={`modal ${dark ? 'modal-dark' : ''}`}
        style={{ maxWidth: 420 }}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body" style={dark ? { color: 'var(--vip-text-2)' } : undefined}>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button
            className={`btn btn-sm ${dark ? 'btn-outline' : 'btn-ghost'}`}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`btn btn-sm ${isDanger ? (dark ? 'btn-vip-danger' : 'btn-danger') : dark ? 'btn-gold' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner-inline" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
