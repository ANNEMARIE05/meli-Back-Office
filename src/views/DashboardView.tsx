import React from 'react';
import {
  Users,
  Car,
  Bell,
  CheckCircle2,
  TrendingUp,
  Radio,
  ArrowUpRight,
  ShieldAlert,
  Building,
} from 'lucide-react';
import type { FleetStats, UserAccount, Vehicle, AlarmItem } from '../services/types';

interface DashboardViewProps {
  stats: FleetStats;
  users: UserAccount[];
  vehicles: Vehicle[];
  alarms: AlarmItem[];
  onNavigateToUsers: () => void;
  onNavigateToVehicles: () => void;
  onNavigateToLiveMap: () => void;
  onNavigateToAlarms: () => void;
  onSelectVehicleOnMap: (v: Vehicle) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  users,
  vehicles,
  alarms,
  onNavigateToUsers,
  onNavigateToVehicles,
  onNavigateToLiveMap,
  onNavigateToAlarms,
  onSelectVehicleOnMap,
}) => {
  return (
    <div>
      {/* Page Header */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Tableau de Bord & Supervision</h1>
          <p className="page-subtitle">
            Vue d'ensemble en temps réel des propriétaires, chauffeurs, de la flotte connectée et des alertes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onNavigateToLiveMap} className="btn btn-primary">
            <Radio size={16} />
            <span>Ouvrir Live Map</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-kpi">
        {/* Card 1: Propriétaires & Chauffeurs */}
        <div className="card" onClick={onNavigateToUsers} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              COMPTES UTILISATEURS
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.totalUsers}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
              {stats.totalOwners} Propriétaires • {stats.totalDrivers} Chauffeurs
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} color="var(--success)" />
            <span>Gérer les accès & créations</span>
          </div>
        </div>

        {/* Card 2: Véhicules & Balises */}
        <div className="card" onClick={onNavigateToVehicles} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              FLOTTE & BALISES GPS
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--success-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
              }}
            >
              <Car size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.totalVehicles}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>
              {stats.onlineVehicles} en mouvement
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {stats.stoppedVehicles} à l'arrêt • {stats.offlineVehicles} hors-ligne
          </div>
        </div>

        {/* Card 3: Alertes Flotte */}
        <div className="card" onClick={onNavigateToAlarms} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              ALERTES DU JOUR
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: stats.activeAlarmsCount > 0 ? 'var(--danger-light)' : 'var(--success-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stats.activeAlarmsCount > 0 ? 'var(--danger)' : 'var(--success)',
              }}
            >
              <Bell size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: stats.activeAlarmsCount > 0 ? 'var(--danger)' : 'var(--text-primary)',
              }}
            >
              {stats.activeAlarmsCount}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>non traitées</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {stats.activeAlarmsCount > 0 ? 'Action requise sur la flotte' : 'Aucune anomalie critique'}
          </div>
        </div>

        {/* Card 4: Passerelle WhatsGPS */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              SERVEUR GPS & PROTOCOLE
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              100%
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>
              WhatsGPS v1.4
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Tracking automatique 24/7
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid-split-2-1">
        {/* Left Column: Recent Fleet Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Télémétrie en Direct des Véhicules
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Données reçues en continu des balises GPS et des chauffeurs
              </p>
            </div>
            <button onClick={onNavigateToVehicles} className="btn-ghost" style={{ fontSize: '0.82rem', border: 'none', cursor: 'pointer' }}>
              <span>Voir toute la flotte</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Propriétaire</th>
                  <th>Chauffeur</th>
                  <th>Statut</th>
                  <th>Vitesse</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.slice(0, 5).map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{v.plate}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{v.name}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{v.ownerName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {v.driverName || 'Non assigné'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          v.status === 'online'
                            ? 'badge-success'
                            : v.status === 'stopped'
                            ? 'badge-warning'
                            : 'badge-offline'
                        }`}
                      >
                        <span className="badge-dot" />
                        {v.status === 'online'
                          ? 'En ligne'
                          : v.status === 'stopped'
                          ? 'À l’arrêt'
                          : 'Hors-ligne'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: v.speed > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {v.speed} km/h
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          onSelectVehicleOnMap(v);
                          onNavigateToLiveMap();
                        }}
                        className="btn btn-secondary btn-icon"
                        title="Localiser sur la carte"
                        style={{ height: '30px', width: '30px' }}
                      >
                        <Radio size={14} color="var(--primary)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Security Alerts Feed & New Users */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Security Alerts Widget */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="var(--danger)" />
                <h3 style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                  Dernières Alertes
                </h3>
              </div>
              <button onClick={onNavigateToAlarms} className="btn-ghost" style={{ fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}>
                Journal complet
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {alarms.slice(0, 3).map((alarm) => (
                <div
                  key={alarm.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-input)',
                    borderLeft: `3px solid ${
                      alarm.severity === 'critical'
                        ? 'var(--danger)'
                        : alarm.severity === 'warning'
                        ? 'var(--warning)'
                        : 'var(--primary)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {alarm.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {alarm.vehiclePlate}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {alarm.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Accounts Overview Widget */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                  Comptes Référencés
                </h3>
              </div>
              <button onClick={onNavigateToUsers} className="btn-ghost" style={{ fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}>
                Gérer
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {users.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {u.role === 'OWNER' ? '🏢 Propriétaire' : '🚗 Chauffeur'} • {u.company || 'Particulier'}
                    </div>
                  </div>
                  <div>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      {u.role === 'OWNER' ? `${u.assignedVehiclesCount} véh.` : u.assignedVehiclePlate || '1 véh.'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
