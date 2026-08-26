// Types pour le Back-office Meli Fleet

export type UserRole = 'OWNER' | 'DRIVER' | 'ADMIN';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface UserAccount {
  id: number;
  userName: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  company?: string;
  assignedVehiclesCount: number;
  assignedVehiclePlate?: string; // For Drivers
  employerOwnerId?: number; // For Drivers (owner they work for)
  employerName?: string;
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

export type VehicleStatus = 'online' | 'stopped' | 'offline' | 'alarm';

export interface Vehicle {
  id: number;
  plate: string;
  name: string;
  model: string;
  imei: string;
  deviceType: string;
  ownerId: number;
  ownerName: string;
  driverName?: string;
  status: VehicleStatus;
  speed: number; // km/h
  fuelLevel?: number; // %
  batteryLevel?: number; // %
  engineOn: boolean;
  latitude: number;
  longitude: number;
  address: string;
  lastUpdate: string;
  mileage: number; // km
}

export type AlarmSeverity = 'critical' | 'warning' | 'info';

export interface AlarmItem {
  id: number;
  vehicleId: number;
  vehiclePlate: string;
  ownerName: string;
  type: string;
  title: string;
  description: string;
  severity: AlarmSeverity;
  latitude: number;
  longitude: number;
  timestamp: string;
  acknowledged: boolean;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  authorName: string;
  action: string;
  category: 'USER' | 'VEHICLE' | 'ALARM' | 'SYSTEM' | 'SECURITY';
  details: string;
  ipAddress: string;
}

export interface FleetStats {
  totalUsers: number;
  totalOwners: number;
  totalDrivers: number;
  activeUsers: number;
  totalVehicles: number;
  onlineVehicles: number;
  stoppedVehicles: number;
  offlineVehicles: number;
  activeAlarmsCount: number;
}
