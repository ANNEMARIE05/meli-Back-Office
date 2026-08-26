import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';
import type { AlarmItem, AlarmSeverity } from '../services/types';

interface AlarmsViewProps {
  alarms: AlarmItem[];
  onAcknowledgeAlarm: (id: number) => void;
}

export const AlarmsView: React.FC<AlarmsViewProps> = ({
  alarms,
  onAcknowledgeAlarm,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | AlarmSeverity>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const filteredAlarms = alarms.filter((a) => {
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchAck = showAcknowledged ? true : !a.acknowledged;
    return matchSeverity && matchAck;
  });

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Journal des Alertes & Sécurité</h1>
          <p className="page-subtitle">
            Consultez les événements de sécurité (excès de vitesse, coupures d'alimentation, sorties de zone).
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div className="quick-filter-tabs" style={{ marginBottom: 0 }}>
            {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className="btn"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  backgroundColor: severityFilter === sev ? 'var(--primary)' : 'var(--bg-input)',
                  color: severityFilter === sev ? '#FFF' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {sev === 'all'
                  ? 'Toutes les alertes'
                  : sev === 'critical'
                  ? '🚨 Critiques'
                  : sev === 'warning'
                  ? '⚠️ Avertissements'
                  : 'ℹ️ Informations'}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>Afficher également les alertes déjà traitées / acquittées</span>
          </label>
        </div>
      </div>

      {/* Alarms List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlarms.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <CheckCircle size={36} color="var(--success)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Aucune alerte active à traiter
            </h3>
            <p style={{ fontSize: '0.82rem' }}>
              Toutes les alertes de la flotte ont été acquittées ou aucun incident n'est survenu.
            </p>
          </div>
        ) : (
          filteredAlarms.map((alarm) => (
            <div
              key={alarm.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderLeft: `4px solid ${
                  alarm.severity === 'critical'
                    ? 'var(--danger)'
                    : alarm.severity === 'warning'
                    ? 'var(--warning)'
                    : 'var(--primary)'
                }`,
                opacity: alarm.acknowledged ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor:
                      alarm.severity === 'critical'
                        ? 'var(--danger-light)'
                        : alarm.severity === 'warning'
                        ? 'var(--warning-light)'
                        : 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color:
                      alarm.severity === 'critical'
                        ? 'var(--danger)'
                        : alarm.severity === 'warning'
                        ? 'var(--warning)'
                        : 'var(--primary)',
                  }}
                >
                  {alarm.severity === 'critical' ? (
                    <ShieldAlert size={20} />
                  ) : alarm.severity === 'warning' ? (
                    <AlertTriangle size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                      {alarm.title}
                    </h4>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      {alarm.vehiclePlate}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {alarm.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      <span>{alarm.ownerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{new Date(alarm.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {alarm.acknowledged ? (
                  <span className="badge badge-success">
                    <CheckCircle size={12} />
                    <span>Traitée</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledgeAlarm(alarm.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <CheckCircle size={14} color="var(--success)" />
                    <span>Acquitter l’alerte</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
