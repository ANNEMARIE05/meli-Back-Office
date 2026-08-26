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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              }}
            >
              <KeyRound size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Mot de passe réinitialisé
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Compte : <strong>{userName}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon" style={{ border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Le nouveau mot de passe temporaire pour ce compte a été généré avec succès :
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-input)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.08em',
              }}
            >
              {generatedPassword}
            </span>
            <button
              onClick={handleCopy}
              className="btn btn-secondary btn-icon"
              title="Copier le mot de passe"
              style={{ height: '34px', width: '34px' }}
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
