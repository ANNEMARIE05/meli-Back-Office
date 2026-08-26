import React, { useState, useMemo } from 'react';
import {
  Search,
  Shield,
  User,
  Car,
  Bell,
  Sliders,
  Clock,
  Laptop,
} from 'lucide-react';
import type { AuditLog } from '../services/types';

interface AuditViewProps {
  logs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditLog['category']>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'all' || log.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [logs, searchTerm, categoryFilter]);

  const getCategoryBadge = (category: AuditLog['category']) => {
    switch (category) {
      case 'SECURITY':
        return { label: 'Sécurité', color: 'var(--danger)', bg: 'var(--danger-light)', icon: Shield };
      case 'USER':
        return { label: 'Compte / Client', color: 'var(--primary)', bg: 'var(--primary-soft)', icon: User };
      case 'VEHICLE':
        return { label: 'Véhicule & Balise', color: 'var(--success)', bg: 'var(--success-light)', icon: Car };
      case 'ALARM':
        return { label: 'Alerte Flotte', color: 'var(--warning)', bg: 'var(--warning-light)', icon: Bell };
      default:
        return { label: 'Système', color: 'var(--text-secondary)', bg: 'var(--bg-input)', icon: Sliders };
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Piste d'Audit & Traçabilité</h1>
          <p className="page-subtitle">
            Journal complet et immuable de toutes les actions, créations de comptes, affectations et alertes du système.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="grid-filters-2">
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher dans l'historique (auteur, action, détails, IP)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="all">Toutes les catégories d'événements ({logs.length})</option>
              <option value="USER">Gestion des Utilisateurs</option>
              <option value="VEHICLE">Véhicules & Balises GPS</option>
              <option value="SECURITY">Sécurité & Mots de passe</option>
              <option value="ALARM">Alarmes & Événements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date & Heure</th>
              <th>Catégorie</th>
              <th>Action Réalisée</th>
              <th>Détails de l'événement</th>
              <th>Auteur</th>
              <th>Origine / IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun événement d'audit ne correspond à vos critères.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const cat = getCategoryBadge(log.category);
                const Icon = cat.icon;
                return (
                  <tr key={log.id}>
                    <td data-label="Date">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                        <Clock size={13} color="var(--text-muted)" />
                        <span>{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                    </td>

                    <td data-label="Catégorie">
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: cat.bg,
                          color: cat.color,
                          fontSize: '0.74rem',
                          fontWeight: 700,
                        }}
                      >
                        <Icon size={12} />
                        <span>{cat.label}</span>
                      </span>
                    </td>

                    <td data-label="Action">
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-input)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          wordBreak: 'break-all',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td data-label="Détails">
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        {log.details}
                      </div>
                    </td>

                    <td data-label="Auteur">
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {log.authorName}
                      </div>
                    </td>

                    <td data-label="Origine">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <Laptop size={12} />
                        <span>{log.ipAddress}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
