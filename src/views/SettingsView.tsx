import React, { useState } from 'react';
import {
  Server,
  Database,
  RefreshCw,
  Check,
  Save,
  Shield,
} from 'lucide-react';

interface SettingsViewProps {
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDemo }) => {
  const [apiUrl, setApiUrl] = useState('https://api.whatsgps.com');
  const [apiKey, setApiKey] = useState('wg_live_948a8f1023bc49ef8821');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <div className="desktop-page-intro" style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Paramètres & Configuration Système</h1>
        <p className="page-subtitle">
          Gestion des passerelles API WhatsGPS, des clés d'accès et des données système.
        </p>
      </div>

      <div className="grid-split-2-1">
        {/* Left: API Form */}
        <div className="card">
          <div className="section-card-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Server size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Passerelle API WhatsGPS (Protocole GPS v1.4)
            </h3>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">URL Serveur WhatsGPS API</label>
              <input
                type="text"
                className="form-input"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.whatsgps.com"
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Point d'entrée pour la télémétrie GPS, commandes coupure moteur et historique.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Clé Secrète / Jeton Admin API</label>
              <input
                type="password"
                className="form-input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fuseau Horaire de la Flotte</label>
              <select className="form-select" defaultValue="UTC+0">
                <option value="UTC+0">GMT / UTC+0 (Abidjan, Yamoussoukro, San-Pédro)</option>
                <option value="UTC+1">UTC+1 (Paris, Bruxelles, Douala)</option>
              </select>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                <span>{savedSuccess ? 'Modifications enregistrées !' : 'Enregistrer la configuration'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Data Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="section-card-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Database size={20} color="var(--warning)" />
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Données de Démonstration
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Vous pouvez réinitialiser à tout moment l'ensemble des comptes et véhicules avec les données exemples d'Abidjan.
            </p>

            <button
              onClick={() => {
                if (window.confirm('Voulez-vous réinitialiser les comptes et véhicules de démonstration ?')) {
                  onResetDemo();
                }
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <RefreshCw size={15} />
              <span>Réinitialiser les données de test</span>
            </button>
          </div>

          <div className="card">
            <div className="section-card-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Shield size={20} color="var(--success)" />
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Version & Sécurité
              </h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Version Back-Office : <strong>1.0.0 (Release)</strong></div>
              <div>Protocole : <strong>WhatsGPS API v1.4.0</strong></div>
              <div>Environnement : <strong>Production Ready</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
