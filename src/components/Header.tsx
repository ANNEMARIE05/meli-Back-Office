import React from 'react';
import { Search, Sun, Moon, Plus, Bell, RefreshCw, Menu } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onRefreshData: () => void;
  onOpenNewUser: () => void;
  onOpenNewVehicle: () => void;
  alarmsCount: number;
  onNavigateToAlarms: () => void;
  onToggleMobileSidebar?: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onRefreshData,
  onOpenNewUser,
  onOpenNewVehicle,
  alarmsCount,
  onNavigateToAlarms,
  onToggleMobileSidebar,
  pageTitle = 'Meli Fleet',
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="btn btn-secondary btn-icon mobile-menu-toggle"
            title="Ouvrir le menu"
          >
            <Menu size={19} />
          </button>
        )}

        <h1 className="header-page-title">{pageTitle}</h1>

        <div className="header-search-container">
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher..."
              style={{ fontSize: '0.84rem', height: '38px', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button
          onClick={onOpenNewUser}
          className="btn btn-primary header-quick-add"
          title="Nouveau Client"
          style={{ height: '38px', fontSize: '0.82rem', padding: '0 12px' }}
        >
          <Plus size={16} />
          <span className="header-btn-text">Nouveau Client</span>
        </button>

        <button
          onClick={onOpenNewVehicle}
          className="btn btn-secondary header-quick-add"
          title="Associer Balise"
          style={{ height: '38px', fontSize: '0.82rem', padding: '0 12px' }}
        >
          <Plus size={16} />
          <span className="header-btn-text">Associer Balise</span>
        </button>

        <div className="header-actions-divider" />

        <button
          onClick={onRefreshData}
          className="btn btn-secondary btn-icon header-refresh-btn"
          title="Actualiser les données"
        >
          <RefreshCw size={16} />
        </button>

        <button
          onClick={onNavigateToAlarms}
          className="btn btn-secondary btn-icon"
          title={`${alarmsCount} alertes actives`}
          style={{ position: 'relative' }}
        >
          <Bell size={16} />
          {alarmsCount > 0 && (
            <span className="header-alarm-count">{alarmsCount}</span>
          )}
        </button>

        <button
          onClick={onToggleTheme}
          className="btn btn-secondary btn-icon"
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#64748B" />}
        </button>
      </div>
    </header>
  );
};
