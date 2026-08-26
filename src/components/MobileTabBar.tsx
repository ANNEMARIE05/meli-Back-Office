import React from 'react';
import { LayoutDashboard, Car, MapPin, Bell, Menu } from 'lucide-react';
import type { ActiveTab } from './Sidebar';

interface MobileTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenMenu: () => void;
  alarmsCount: number;
}

const PRIMARY_TABS: ActiveTab[] = ['dashboard', 'vehicles', 'live-map', 'alarms'];

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onTabChange,
  onOpenMenu,
  alarmsCount,
}) => {
  const isMoreActive = !PRIMARY_TABS.includes(activeTab);

  const items = [
    { id: 'dashboard' as const, label: 'Accueil', icon: LayoutDashboard },
    { id: 'vehicles' as const, label: 'Flotte', icon: Car },
    { id: 'live-map' as const, label: 'Carte', icon: MapPin },
    { id: 'alarms' as const, label: 'Alertes', icon: Bell, badge: alarmsCount },
  ];

  return (
    <nav className="mobile-tabbar" aria-label="Navigation principale">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-tabbar-item ${isActive ? 'is-active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="mobile-tabbar-icon">
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {item.badge && item.badge > 0 ? (
                <span className="mobile-tabbar-badge">{item.badge > 9 ? '9+' : item.badge}</span>
              ) : null}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        className={`mobile-tabbar-item ${isMoreActive ? 'is-active' : ''}`}
        onClick={onOpenMenu}
      >
        <span className="mobile-tabbar-icon">
          <Menu size={20} strokeWidth={isMoreActive ? 2.4 : 2} />
        </span>
        <span>Menu</span>
      </button>
    </nav>
  );
};
