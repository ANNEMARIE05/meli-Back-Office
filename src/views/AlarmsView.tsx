import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle,
  Clock,
  User,
  Search,
  ChevronDown,
} from 'lucide-react';
import type { AlarmItem, AlarmSeverity } from '../services/types';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

interface AlarmsViewProps {
  alarms: AlarmItem[];
  onAcknowledgeAlarm: (id: number) => void;
}

export const AlarmsView: React.FC<AlarmsViewProps> = ({
  alarms,
  onAcknowledgeAlarm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlarmSeverity>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredAlarms = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return alarms.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term) ||
        a.vehiclePlate.toLowerCase().includes(term) ||
        a.ownerName.toLowerCase().includes(term);
      const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
      const matchAck = showAcknowledged ? true : !a.acknowledged;
      return matchSearch && matchSeverity && matchAck;
    });
  }, [alarms, searchTerm, severityFilter, showAcknowledged]);

  const { paginatedItems, page, setPage, totalPages, totalItems, from, to } = usePagination(
    filteredAlarms,
    pageSize
  );

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
      <div className="card filters-bar">
        <div className="alarms-filters">
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Titre, plaque, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="quick-filter-tabs" style={{ marginBottom: 0 }}>
            {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className="btn"
                style={{
                  backgroundColor: severityFilter === sev ? 'var(--primary)' : 'var(--bg-input)',
                  color: severityFilter === sev ? '#FFF' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {sev === 'all'
                  ? 'Toutes'
                  : sev === 'critical'
                  ? 'Critiques'
                  : sev === 'warning'
                  ? 'Avertissements'
                  : 'Infos'}
              </button>
            ))}
          </div>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>Inclure les traitées</span>
          </label>
        </div>
      </div>

      {/* Alarms List */}
      <div className="alarm-list">
        {paginatedItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)' }}>
            <CheckCircle size={36} color="var(--success)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Aucune alerte active à traiter
            </h3>
            <p style={{ fontSize: '0.82rem' }}>
              Toutes les alertes de la flotte ont été acquittées ou aucun incident n'est survenu.
            </p>
          </div>
        ) : (
          paginatedItems.map((alarm) => {
            const isExpanded = expandedId === alarm.id;
            return (
            <div
              key={alarm.id}
              className="card alarm-item"
              onClick={() => setExpandedId(isExpanded ? null : alarm.id)}
              style={{
                borderLeft: `4px solid ${
                  alarm.severity === 'critical'
                    ? 'var(--danger)'
                    : alarm.severity === 'warning'
                    ? 'var(--warning)'
                    : 'var(--primary)'
                }`,
                opacity: alarm.acknowledged ? 0.7 : 1,
                cursor: 'pointer',
              }}
            >
              <div className="alarm-item-main">
                <div
                  className="alarm-icon"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor:
                      alarm.severity === 'critical'
                        ? 'var(--danger-light)'
                        : alarm.severity === 'warning'
                        ? 'var(--warning-light)'
                        : 'var(--primary-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color:
                      alarm.severity === 'critical'
                        ? 'var(--danger)'
                        : alarm.severity === 'warning'
                        ? 'var(--warning)'
                        : 'var(--primary)',
                    flexShrink: 0,
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

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="row-title" style={{ marginBottom: '4px' }}>
                    {alarm.title}
                  </div>
                  <div className="row-subtitle">
                    {alarm.vehiclePlate} · {new Date(alarm.timestamp).toLocaleString('fr-FR')}
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '10px' }}>
                        {alarm.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={13} />
                          <span>{alarm.ownerName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={13} />
                          <span>{new Date(alarm.timestamp).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className="row-chevron"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : undefined }}
                />
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                {alarm.acknowledged ? (
                  <span className="badge badge-success">
                    <CheckCircle size={12} />
                    <span>Traitée</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledgeAlarm(alarm.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <CheckCircle size={14} color="var(--success)" />
                    <span>Acquitter</span>
                  </button>
                )}
              </div>
            </div>
            );
          })
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        from={from}
        to={to}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};
