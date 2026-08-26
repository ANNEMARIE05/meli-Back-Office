import React from 'react';
import { KeyRound, Copy, Check, X } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  generatedPassword: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  userName,
  generatedPassword,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--warning-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--warning)',
                flexShrink: 0,
              }}
            >
              <KeyRound size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3>
                Mot de passe réinitialisé
              </h3>
              <p>
                Compte : <strong>{userName}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon" style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Le nouveau mot de passe temporaire pour ce compte a été généré avec succès :
          </p>

          <div className="password-reveal">
            <span className="password-code">
              {generatedPassword}
            </span>
            <button
              onClick={handleCopy}
              className="btn btn-secondary btn-icon"
              title="Copier le mot de passe"
              style={{ height: '34px', width: '34px', flexShrink: 0 }}
            >
              {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Veuillez transmettre ce mot de passe au client. Il lui sera demandé de le modifier lors de sa prochaine connexion sur Meli-App.
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
