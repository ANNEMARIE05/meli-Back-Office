import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, type ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { UserModal } from './components/UserModal';
import { VehicleModal } from './components/VehicleModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';

import { DashboardView } from './views/DashboardView';
import { UsersView } from './views/UsersView';
import { VehiclesView } from './views/VehiclesView';
import { LiveMapView } from './views/LiveMapView';
import { AlarmsView } from './views/AlarmsView';
import { AuditView } from './views/AuditView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';

import { apiService } from './services/api';
import type { UserAccount, Vehicle, AlarmItem, AuditLog, FleetStats } from './services/types';

export const App: React.FC = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('meli_admin_auth') === 'true';
  });

  // --- THEME STATE (DEFAULT LIGHT) ---
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // --- SIDEBAR STATES ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('meli_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // --- NAVIGATION TAB ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // --- DATA STATES ---
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<FleetStats>({
    totalUsers: 0,
    totalOwners: 0,
    totalDrivers: 0,
    activeUsers: 0,
    totalVehicles: 0,
    onlineVehicles: 0,
    stoppedVehicles: 0,
    offlineVehicles: 0,
    activeAlarmsCount: 0,
  });

  // --- INTERACTION STATES ---
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [userVehiclesFilter, setUserVehiclesFilter] = useState<number | null>(null);

  // --- MODAL STATES ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserAccount | null>(null);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  const [resetPwInfo, setResetPwInfo] = useState<{ userName: string; password: string } | null>(null);

  // Apply Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load Data from API Service
  const loadData = useCallback(() => {
    const u = apiService.getUsers();
    const v = apiService.getVehicles();
    const a = apiService.getAlarms();
    const logs = apiService.getAuditLogs();
    const s = apiService.getFleetStats();

    setUsers(u);
    setVehicles(v);
    setAlarms(a);
    setAuditLogs(logs);
    setStats(s);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Live Telemetry Simulation Pulse
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((veh) => {
          if (veh.status === 'online') {
            const latDelta = (Math.random() - 0.5) * 0.0003;
            const lngDelta = (Math.random() - 0.5) * 0.0003;
            const speedJitter = Math.max(25, Math.min(95, veh.speed + Math.floor((Math.random() - 0.5) * 6)));

            return {
              ...veh,
              latitude: veh.latitude + latDelta,
              longitude: veh.longitude + lngDelta,
              speed: speedJitter,
              lastUpdate: 'À l’instant',
            };
          }
          return veh;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // --- AUTH HANDLERS ---
  const handleLogin = () => {
    localStorage.setItem('meli_admin_auth', 'true');
    setIsAuthenticated(true);
    apiService.logAction('CONNEXION_ADMIN', 'SECURITY', 'Connexion au Back-Office');
    loadData();
  };

  const handleLogout = () => {
    apiService.logAction('DECONNEXION_ADMIN', 'SECURITY', 'Déconnexion du Back-Office');
    localStorage.removeItem('meli_admin_auth');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('meli_sidebar_collapsed', String(next));
      return next;
    });
  };

  // --- USER HANDLERS ---
  const handleSaveUser = (userData: any) => {
    if (userToEdit) {
      apiService.updateUser(userToEdit.id, userData);
    } else {
      apiService.createUser(userData);
    }
    setIsUserModalOpen(false);
    setUserToEdit(null);
    loadData();
  };

  const handleDeleteUser = (userId: number) => {
    apiService.deleteUser(userId);
    loadData();
  };

  const handleResetPassword = (user: UserAccount) => {
    const newPass = apiService.resetUserPassword(user.id);
    setResetPwInfo({ userName: user.userName, password: newPass });
    loadData();
  };

  const handleViewUserVehicles = (userId: number) => {
    setUserVehiclesFilter(userId);
    setActiveTab('vehicles');
  };

  // --- VEHICLE HANDLERS ---
  const handleSaveVehicle = (vehicleData: any) => {
    if (vehicleToEdit) {
      apiService.updateVehicle(vehicleToEdit.id, vehicleData);
    } else {
      apiService.createVehicle(vehicleData);
    }
    setIsVehicleModalOpen(false);
    setVehicleToEdit(null);
    loadData();
  };

  const handleDeleteVehicle = (vehicleId: number) => {
    apiService.deleteVehicle(vehicleId);
    loadData();
  };

  const handleLocateOnMap = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveTab('live-map');
  };

  // --- ALARM HANDLERS ---
  const handleAcknowledgeAlarm = (id: number) => {
    apiService.acknowledgeAlarm(id);
    loadData();
  };

  // --- RESET DEMO ---
  const handleResetDemoData = () => {
    apiService.resetDemoData();
    loadData();
    alert('Les données ont été réinitialisées.');
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  const existingOwners = users.filter((u) => u.role === 'OWNER');

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Left Sidebar (Desktop Fixed & Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'vehicles') {
            setUserVehiclesFilter(null);
          }
        }}
        alarmsCount={stats.activeAlarmsCount}
        onlineVehiclesCount={stats.onlineVehicles}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Header */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onRefreshData={loadData}
          onOpenNewUser={() => {
            setUserToEdit(null);
            setIsUserModalOpen(true);
          }}
          onOpenNewVehicle={() => {
            setVehicleToEdit(null);
            setIsVehicleModalOpen(true);
          }}
          alarmsCount={stats.activeAlarmsCount}
          onNavigateToAlarms={() => setActiveTab('alarms')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Views */}
        <main className="page-wrapper">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              users={users}
              vehicles={vehicles}
              alarms={alarms}
              onNavigateToUsers={() => setActiveTab('users')}
              onNavigateToVehicles={() => {
                setUserVehiclesFilter(null);
                setActiveTab('vehicles');
              }}
              onNavigateToLiveMap={() => setActiveTab('live-map')}
              onNavigateToAlarms={() => setActiveTab('alarms')}
              onSelectVehicleOnMap={handleLocateOnMap}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              users={users}
              onAddUser={() => {
                setUserToEdit(null);
                setIsUserModalOpen(true);
              }}
              onEditUser={(u) => {
                setUserToEdit(u);
                setIsUserModalOpen(true);
              }}
              onDeleteUser={handleDeleteUser}
              onResetPassword={handleResetPassword}
              onViewUserVehicles={handleViewUserVehicles}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              users={users}
              initialOwnerFilter={userVehiclesFilter}
              onAddVehicle={() => {
                setVehicleToEdit(null);
                setIsVehicleModalOpen(true);
              }}
              onEditVehicle={(v) => {
                setVehicleToEdit(v);
                setIsVehicleModalOpen(true);
              }}
              onDeleteVehicle={handleDeleteVehicle}
              onLocateOnMap={handleLocateOnMap}
            />
          )}

          {activeTab === 'live-map' && (
            <LiveMapView
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={setSelectedVehicle}
            />
          )}

          {activeTab === 'alarms' && (
            <AlarmsView alarms={alarms} onAcknowledgeAlarm={handleAcknowledgeAlarm} />
          )}

          {activeTab === 'audit' && (
            <AuditView logs={auditLogs} />
          )}

          {activeTab === 'settings' && (
            <SettingsView onResetDemo={handleResetDemoData} />
          )}
        </main>
      </div>

      {/* --- POPUP MODALS --- */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
        existingOwners={existingOwners}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setVehicleToEdit(null);
        }}
        onSave={handleSaveVehicle}
        vehicleToEdit={vehicleToEdit}
        usersList={users}
      />

      <ResetPasswordModal
        isOpen={!!resetPwInfo}
        onClose={() => setResetPwInfo(null)}
        userName={resetPwInfo?.userName || ''}
        generatedPassword={resetPwInfo?.password || ''}
      />
    </div>
  );
};

export default App;
