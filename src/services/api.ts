import { INITIAL_USERS, INITIAL_VEHICLES, INITIAL_ALARMS, INITIAL_AUDIT_LOGS } from './mockData';
import type { UserAccount, Vehicle, AlarmItem, AuditLog, FleetStats } from './types';

const USERS_KEY = 'meli_bo_users_v2';
const VEHICLES_KEY = 'meli_bo_vehicles_v2';
const ALARMS_KEY = 'meli_bo_alarms_v2';
const AUDIT_KEY = 'meli_bo_audit_v2';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read from localStorage ${key}`, e);
  }
  return fallback;
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to write to localStorage ${key}`, e);
  }
}

export const apiService = {
  // --- AUDIT TRAIL LOGGING ---
  getAuditLogs(): AuditLog[] {
    return load<AuditLog[]>(AUDIT_KEY, INITIAL_AUDIT_LOGS);
  },

  logAction(action: string, category: AuditLog['category'], details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      authorName: 'Admin Meli',
      action,
      category,
      details,
      ipAddress: '160.154.138.42 (Abidjan, CI)',
    };
    logs.unshift(newLog);
    save(AUDIT_KEY, logs);
  },

  // --- USERS MANAGEMENT ---
  getUsers(): UserAccount[] {
    return load<UserAccount[]>(USERS_KEY, INITIAL_USERS);
  },

  getUserById(id: number): UserAccount | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  createUser(userData: Omit<UserAccount, 'id' | 'createdAt' | 'assignedVehiclesCount'>): UserAccount {
    const users = this.getUsers();
    const newUser: UserAccount = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      assignedVehiclesCount: userData.role === 'DRIVER' ? 1 : 0,
    };
    users.unshift(newUser);
    save(USERS_KEY, users);

    this.logAction(
      'CREATION_COMPTE',
      'USER',
      `Création du compte ${userData.role === 'OWNER' ? 'Propriétaire' : 'Chauffeur'} "${newUser.name}" (${newUser.userName})`
    );

    return newUser;
  },

  updateUser(id: number, updates: Partial<UserAccount>): UserAccount {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Utilisateur non trouvé');

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    save(USERS_KEY, users);

    this.logAction(
      'MODIFICATION_COMPTE',
      'USER',
      `Mise à jour des informations du compte "${updated.name}" (${updated.userName})`
    );

    return updated;
  },

  deleteUser(id: number): void {
    const users = this.getUsers();
    const user = users.find((u) => u.id === id);
    const filtered = users.filter((u) => u.id !== id);
    save(USERS_KEY, filtered);

    if (user) {
      this.logAction(
        'SUPPRESSION_COMPTE',
        'USER',
        `Suppression du compte "${user.name}" (${user.userName})`
      );
    }
  },

  resetUserPassword(id: number): string {
    const user = this.getUserById(id);
    const newPass = 'Meli@' + Math.floor(1000 + Math.random() * 9000);
    this.logAction(
      'REINITIALISATION_MDP',
      'SECURITY',
      `Réinitialisation du mot de passe pour le compte "${user?.userName || id}"`
    );
    return newPass;
  },

  // --- VEHICLES MANAGEMENT ---
  getVehicles(): Vehicle[] {
    return load<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
  },

  getVehicleById(id: number): Vehicle | undefined {
    return this.getVehicles().find((v) => v.id === id);
  },

  createVehicle(vehicleData: Omit<Vehicle, 'id' | 'lastUpdate'>): Vehicle {
    const vehicles = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now(),
      lastUpdate: 'À l’instant',
    };
    vehicles.unshift(newVehicle);
    save(VEHICLES_KEY, vehicles);

    this.recomputeUserVehicleCounts();
    this.logAction(
      'AFFECTATION_VEHICULE',
      'VEHICLE',
      `Ajout du véhicule ${newVehicle.plate} (Balise IMEI ${newVehicle.imei}) assigné à ${newVehicle.ownerName}`
    );

    return newVehicle;
  },

  updateVehicle(id: number, updates: Partial<Vehicle>): Vehicle {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Véhicule non trouvé');

    const updated = { ...vehicles[index], ...updates };
    vehicles[index] = updated;
    save(VEHICLES_KEY, vehicles);

    this.recomputeUserVehicleCounts();
    this.logAction(
      'MODIFICATION_VEHICULE',
      'VEHICLE',
      `Mise à jour du véhicule ${updated.plate}`
    );

    return updated;
  },

  deleteVehicle(id: number): void {
    const vehicles = this.getVehicles();
    const veh = vehicles.find((v) => v.id === id);
    const filtered = vehicles.filter((v) => v.id !== id);
    save(VEHICLES_KEY, filtered);
    this.recomputeUserVehicleCounts();

    if (veh) {
      this.logAction(
        'SUPPRESSION_VEHICULE',
        'VEHICLE',
        `Dissociation/Suppression du véhicule ${veh.plate} (IMEI ${veh.imei})`
      );
    }
  },

  recomputeUserVehicleCounts(): void {
    const users = this.getUsers();
    const vehicles = this.getVehicles();

    const counts: Record<number, number> = {};
    vehicles.forEach((v) => {
      counts[v.ownerId] = (counts[v.ownerId] || 0) + 1;
    });

    const updatedUsers = users.map((u) => ({
      ...u,
      assignedVehiclesCount: u.role === 'DRIVER' ? 1 : counts[u.id] || 0,
    }));

    save(USERS_KEY, updatedUsers);
  },

  // --- ALARMS ---
  getAlarms(): AlarmItem[] {
    return load<AlarmItem[]>(ALARMS_KEY, INITIAL_ALARMS);
  },

  acknowledgeAlarm(id: number): void {
    const alarms = this.getAlarms().map((a) => (a.id === id ? { ...a, acknowledged: true } : a));
    save(ALARMS_KEY, alarms);
    this.logAction(
      'ACQUITTEMENT_ALARME',
      'ALARM',
      `Acquittement de l'alerte #${id}`
    );
  },

  // --- STATS ---
  getFleetStats(): FleetStats {
    const users = this.getUsers();
    const vehicles = this.getVehicles();
    const alarms = this.getAlarms();

    return {
      totalUsers: users.length,
      totalOwners: users.filter((u) => u.role === 'OWNER').length,
      totalDrivers: users.filter((u) => u.role === 'DRIVER').length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      totalVehicles: vehicles.length,
      onlineVehicles: vehicles.filter((v) => v.status === 'online').length,
      stoppedVehicles: vehicles.filter((v) => v.status === 'stopped').length,
      offlineVehicles: vehicles.filter((v) => v.status === 'offline').length,
      activeAlarmsCount: alarms.filter((a) => !a.acknowledged).length,
    };
  },

  resetDemoData(): void {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(VEHICLES_KEY);
    localStorage.removeItem(ALARMS_KEY);
    localStorage.removeItem(AUDIT_KEY);
  },
};
