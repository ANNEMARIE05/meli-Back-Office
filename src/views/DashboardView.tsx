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
        <div className="card kpi-card" onClick={onNavigateToUsers} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '6px' }}>
            <span className="kpi-label" style={{ color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Comptes
            </span>
            <div
              className="kpi-icon"
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
              <Users size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span className="kpi-value">
              {stats.totalUsers}
            </span>
            <span className="kpi-sub" style={{ color: 'var(--primary)' }}>
              {stats.totalOwners} prop. • {stats.totalDrivers} chauff.
            </span>
          </div>
          <div className="kpi-hint" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} color="var(--success)" />
            <span>Gérer les accès</span>
          </div>
        </div>

        {/* Card 2: Véhicules & Balises */}
        <div className="card kpi-card" onClick={onNavigateToVehicles} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '6px' }}>
            <span className="kpi-label" style={{ color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Flotte GPS
            </span>
            <div
              className="kpi-icon"
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
              <Car size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span className="kpi-value">
              {stats.totalVehicles}
            </span>
            <span className="kpi-sub" style={{ color: 'var(--success)' }}>
              {stats.onlineVehicles} en ligne
            </span>
          </div>
          <div className="kpi-hint" style={{ color: 'var(--text-muted)' }}>
            {stats.stoppedVehicles} arrêt • {stats.offlineVehicles} hors-ligne
          </div>
        </div>

        {/* Card 3: Alertes Flotte */}
        <div className="card kpi-card" onClick={onNavigateToAlarms} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '6px' }}>
            <span className="kpi-label" style={{ color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Alertes
            </span>
            <div
              className="kpi-icon"
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
              <Bell size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span
              className="kpi-value"
              style={{
                color: stats.activeAlarmsCount > 0 ? 'var(--danger)' : 'var(--text-primary)',
              }}
            >
              {stats.activeAlarmsCount}
            </span>
            <span className="kpi-sub" style={{ color: 'var(--text-secondary)' }}>non traitées</span>
          </div>
          <div className="kpi-hint" style={{ color: 'var(--text-muted)' }}>
            {stats.activeAlarmsCount > 0 ? 'Action requise' : 'Aucune anomalie'}
          </div>
        </div>

        {/* Card 4: Passerelle WhatsGPS */}
        <div className="card kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '6px' }}>
            <span className="kpi-label" style={{ color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Serveur GPS
            </span>
            <div
              className="kpi-icon"
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
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span className="kpi-value">
              100%
            </span>
            <span className="kpi-sub" style={{ color: 'var(--success)' }}>
              WhatsGPS
            </span>
          </div>
          <div className="kpi-hint" style={{ color: 'var(--text-muted)' }}>
            Tracking 24/7
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid-split-2-1">
        {/* Left Column: Recent Fleet Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '8px', flexWrap: 'wrap' }}>
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
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.slice(0, 5).map((v) => (
                  <tr key={v.id}>
                    <td data-label="Véhicule" className="card-title-cell">
                      <div className="row-title">{v.plate}</div>
                      <div className="row-subtitle">{v.name} · {v.ownerName}</div>
                    </td>
                    <td data-label="Statut" className="col-status">
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
                          ? `${v.speed} km/h`
                          : v.status === 'stopped'
                          ? 'À l’arrêt'
                          : 'Hors-ligne'}
                      </span>
                    </td>
                    <td data-label="Action" style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          onSelectVehicleOnMap(v);
                          onNavigateToLiveMap();
                        }}
                        className="btn btn-secondary btn-icon"
                        title="Localiser sur la carte"
                        style={{ height: '36px', width: '36px' }}
                      >
                        <Radio size={15} color="var(--primary)" />
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alarms.slice(0, 3).map((alarm) => (
                <div
                  key={alarm.id}
                  style={{
                    padding: '12px 4px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="row-title" style={{ fontSize: '0.88rem' }}>
                    {alarm.title}
                  </div>
                  <div className="row-subtitle">
                    {alarm.vehiclePlate}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {users.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div className="row-title" style={{ fontSize: '0.88rem' }}>
                      {u.name}
                    </div>
                    <div className="row-subtitle">
                      {u.role === 'OWNER' ? 'Propriétaire' : 'Chauffeur'}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {u.role === 'OWNER' ? `${u.assignedVehiclesCount} véh.` : u.assignedVehiclePlate || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
