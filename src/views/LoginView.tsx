import React, { useState } from 'react';
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { MeliLogo } from '../components/MeliLogo';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [userName, setUserName] = useState('admin.super');
  const [password, setPassword] = useState('Admin@2026');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 600);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        backgroundImage: 'radial-gradient(ellipse at top, rgba(255, 107, 0, 0.12), transparent 70%)',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-card)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {/* Meli Logo & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <MeliLogo size="lg" />
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Portail d'Administration & Supervision Flotte
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Identifiant Administrateur</label>
            <div className="input-with-icon">
              <User size={16} />
              <input
                type="text"
                required
                className="form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Identifiant"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginBottom: '14px' }}
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Accéder au Back-Office</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '10px', fontSize: '0.84rem' }}
        >
          <Sparkles size={15} color="var(--primary)" />
          <span>Accès Démonstration Rapide (1-Clic)</span>
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © 2026 Meli App • Solution de Suivi & Gestion GPS
        </div>
      </div>
    </div>
  );
};
