import React from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  Bell,
  History,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { MeliLogo } from './MeliLogo';

export type ActiveTab = 'dashboard' | 'users' | 'vehicles' | 'live-map' | 'alarms' | 'audit' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  alarmsCount: number;
  onlineVehiclesCount: number;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  alarmsCount,
  onlineVehiclesCount,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
    },
    {
      id: 'users' as ActiveTab,
      label: 'Utilisateurs',
      icon: Users,
    },
    {
      id: 'vehicles' as ActiveTab,
      label: 'Véhicules',
      icon: Car,
      badge: onlineVehiclesCount > 0 ? `${onlineVehiclesCount}` : undefined,
      badgeType: 'success' as const,
      badgeTitle: `${onlineVehiclesCount} véhicules en ligne`,
    },
    {
      id: 'live-map' as ActiveTab,
      label: 'Carte en direct',
      icon: MapPin,
    },
    {
      id: 'alarms' as ActiveTab,
      label: 'Alertes',
      icon: Bell,
      badge: alarmsCount > 0 ? `${alarmsCount}` : undefined,
      badgeType: 'danger' as const,
      badgeTitle: `${alarmsCount} alertes actives`,
    },
    {
      id: 'audit' as ActiveTab,
      label: 'Audit',
      icon: History,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Paramètres',
      icon: Settings,
    },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    onTabChange(tab);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onMobileClose} />
      )}

      <aside className={`sidebar-root ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header with Logo, Desktop Toggle & Mobile Close */}
        <div
          style={{
            padding: isCollapsed ? '20px 8px 16px' : '20px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            minHeight: '70px',
            position: 'relative',
          }}
        >
          {isCollapsed ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
              }}
            >
              <div title="Meli Back-Office" style={{ cursor: 'pointer' }} onClick={onToggleCollapse}>
                <MeliLogo size="sm" withText={false} />
              </div>
              <button
                onClick={onToggleCollapse}
                title="Agrandir la barre latérale"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <MeliLogo size="md" subtitle="Supervision Flotte" />
              </div>

              {/* Desktop collapse button */}
              <button
                onClick={onToggleCollapse}
                title="Réduire la barre latérale"
                className="desktop-only-btn"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                  marginLeft: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Mobile close button */}
              {onMobileClose && (
                <button
                  onClick={onMobileClose}
                  title="Fermer le menu"
                  className="mobile-close-btn"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-alt)',
                    border: '1px solid var(--border-color)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginLeft: '8px',
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation Links */}
        <div
          style={{
            flex: 1,
            padding: isCollapsed ? '16px 8px' : '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {!isCollapsed ? (
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                padding: '0 10px 6px',
                letterSpacing: '0.08em',
              }}
            >
              Menu
            </div>
          ) : (
            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--border-subtle)',
                margin: '0 6px 4px',
              }}
            />
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '12px 0' : '11px 14px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  letterSpacing: '-0.01em',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {isCollapsed ? (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
                    {item.badge && (
                      <span
                        title={item.badgeTitle}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-8px',
                          fontSize: '0.62rem',
                          minWidth: '16px',
                          height: '16px',
                          padding: '0 4px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor:
                            item.badgeType === 'danger'
                              ? 'var(--danger)'
                              : 'var(--success)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <Icon size={19} color={isActive ? 'var(--primary)' : 'currentColor'} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        title={item.badgeTitle}
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor:
                            item.badgeType === 'danger'
                              ? 'var(--danger-light)'
                              : 'var(--success-light)',
                          color: item.badgeType === 'danger' ? 'var(--danger)' : 'var(--success)',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Profile Footer */}
        <div
          style={{
            padding: isCollapsed ? '16px 8px' : '16px 16px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-alt)',
          }}
        >
          {isCollapsed ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                title="Admin Meli (Super Administrateur)"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-soft)',
                  border: '1.5px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={18} color="var(--primary)" />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success)',
                    border: '1.5px solid var(--bg-sidebar)',
                  }}
                />
              </div>

              <button
                onClick={onLogout}
                title="Se déconnecter"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                  e.currentTarget.style.color = 'var(--danger)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-soft)',
                    border: '1.5px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} color="var(--primary)" />
                </div>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Admin Meli
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--success)',
                        flexShrink: 0,
                      }}
                    />
                    <span>Super Admin</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Se déconnecter"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                  e.currentTarget.style.color = 'var(--danger)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
