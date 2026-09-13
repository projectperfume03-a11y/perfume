import { createPortal } from 'react-dom';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel,
  confirmText = 'Confirmer', cancelText = 'Annuler',
  isDanger = false, isLoading = false, dark = false,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className={`modal-overlay ${dark ? 'modal-admin-overlay' : ''}`} onClick={isLoading ? undefined : onCancel}>
      <div
        className={`modal ${dark ? 'modal-admin modal-confirm-admin' : ''}`}
        style={{ maxWidth: 460 }}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header modal-admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {dark && (
              <span className={`confirm-icon-badge ${isDanger ? 'danger' : 'gold'}`}>
                {isDanger ? <AlertTriangle size={18} strokeWidth={2} /> : <AlertCircle size={18} strokeWidth={2} />}
              </span>
            )}
            <h2>{title}</h2>
          </div>
          <button type="button" className="icon-btn-dark" onClick={onCancel} aria-label="Fermer" disabled={isLoading}>
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>
        <div className="modal-body modal-admin-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        <div className="modal-footer modal-admin-footer">
          <button
            type="button"
            className={`btn btn-sm ${dark ? 'btn-outline' : 'btn-ghost'}`}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${isDanger ? (dark ? 'btn-vip-danger' : 'btn-danger') : dark ? 'btn-gold' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner-inline" /> : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
