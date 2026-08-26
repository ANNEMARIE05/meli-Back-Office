import React, { useState, useMemo } from 'react';
import {
  Search,
  Shield,
  User,
  Car,
  Bell,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import type { AuditLog } from '../services/types';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { RowDetails, DetailField } from '../components/RowDetails';

interface AuditViewProps {
  logs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AuditLog['category']>('all');
  const [pageSize, setPageSize] = useState(5);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const { paginatedItems, page, setPage, totalPages, totalItems, from, to } = usePagination(
    filteredLogs,
    pageSize
  );

  const getCategoryBadge = (category: AuditLog['category']) => {
    switch (category) {
      case 'SECURITY':
        return { label: 'Sécurité', color: 'var(--danger)', icon: Shield };
      case 'USER':
        return { label: 'Compte / Client', color: 'var(--primary)', icon: User };
      case 'VEHICLE':
        return { label: 'Véhicule & Balise', color: 'var(--success)', icon: Car };
      case 'ALARM':
        return { label: 'Alerte Flotte', color: 'var(--warning)', icon: Bell };
      default:
        return { label: 'Système', color: 'var(--text-secondary)', icon: Sliders };
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
      <div className="card filters-bar">
        <div className="grid-filters-2">
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Auteur, action, détails, IP..."
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
              <th>Événement</th>
              <th>Auteur</th>
              <th>Catégorie</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun événement d'audit ne correspond à vos critères.
                </td>
              </tr>
            ) : (
              paginatedItems.map((log) => {
                const cat = getCategoryBadge(log.category);
                const Icon = cat.icon;
                const isExpanded = expandedId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      className={`data-row ${isExpanded ? 'is-expanded' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    >
                      <td data-label="Événement" className="card-title-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="row-title">{log.action}</div>
                            <div className="row-subtitle">
                              {new Date(log.timestamp).toLocaleString('fr-FR')}
                            </div>
                          </div>
                          <ChevronDown size={18} className="row-chevron" />
                        </div>
                      </td>

                      <td data-label="Auteur">{log.authorName}</td>

                      <td data-label="Catégorie" className="col-status">
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: cat.color,
                            fontSize: '0.82rem',
                            fontWeight: 600,
                          }}
                        >
                          <Icon size={14} />
                          <span>{cat.label}</span>
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <RowDetails colSpan={3}>
                        <DetailField label="Détails">{log.details}</DetailField>
                        <DetailField label="Auteur">{log.authorName}</DetailField>
                        <DetailField label="Catégorie">{cat.label}</DetailField>
                        <DetailField label="Origine / IP">{log.ipAddress}</DetailField>
                        <DetailField label="Date">
                          {new Date(log.timestamp).toLocaleString('fr-FR')}
                        </DetailField>
                      </RowDetails>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
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
