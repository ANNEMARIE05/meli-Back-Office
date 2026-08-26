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
}) => {
  return (
    <header className="app-header">
      {/* Left side: Hamburger button (MOBILE ONLY) & Global Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="btn btn-secondary btn-icon mobile-menu-toggle"
            title="Ouvrir le menu"
            style={{ height: '38px', width: '38px', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          >
            <Menu size={19} />
          </button>
        )}

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

      {/* Action Controls */}
      <div className="header-actions">
        {/* Quick Add Buttons */}
        <button
          onClick={onOpenNewUser}
          className="btn btn-primary"
          title="Nouveau Client"
          style={{ height: '38px', fontSize: '0.82rem', padding: '0 12px' }}
        >
          <Plus size={16} />
          <span className="header-btn-text">Nouveau Client</span>
        </button>

        <button
          onClick={onOpenNewVehicle}
          className="btn btn-secondary"
          title="Associer Balise"
          style={{ height: '38px', fontSize: '0.82rem', padding: '0 12px' }}
        >
          <Plus size={16} />
          <span className="header-btn-text">Associer Balise</span>
        </button>

        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-color)', margin: '0 2px' }} />

        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          className="btn btn-secondary btn-icon"
          title="Actualiser les données"
          style={{ height: '38px', width: '38px', flexShrink: 0 }}
        >
          <RefreshCw size={16} />
        </button>

        {/* Notifications */}
        <button
          onClick={onNavigateToAlarms}
          className="btn btn-secondary btn-icon"
          title={`${alarmsCount} alertes actives`}
          style={{ position: 'relative', height: '38px', width: '38px', flexShrink: 0 }}
        >
          <Bell size={16} />
          {alarmsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--danger)',
                color: '#FFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-card)',
              }}
            >
              {alarmsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn btn-secondary btn-icon"
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          style={{ height: '38px', width: '38px', flexShrink: 0 }}
        >
          {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#64748B" />}
        </button>
      </div>
    </header>
  );
};
