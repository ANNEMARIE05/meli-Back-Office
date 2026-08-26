import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  Car,
  Building,
  User,
  ChevronDown,
} from 'lucide-react';
import type { UserAccount, UserRole, UserStatus } from '../services/types';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { RowDetails, DetailField } from '../components/RowDetails';

interface UsersViewProps {
  users: UserAccount[];
  onAddUser: () => void;
  onEditUser: (user: UserAccount) => void;
  onDeleteUser: (userId: number) => void;
  onResetPassword: (user: UserAccount) => void;
  onViewUserVehicles: (userId: number) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onResetPassword,
  onViewUserVehicles,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [pageSize, setPageSize] = useState(5);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm) ||
        (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.assignedVehiclePlate && u.assignedVehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchRole = roleFilter === 'all' || u.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const { paginatedItems, page, setPage, totalPages, totalItems, from, to } = usePagination(
    filteredUsers,
    pageSize
  );

  const ownersCount = users.filter((u) => u.role === 'OWNER').length;
  const driversCount = users.filter((u) => u.role === 'DRIVER').length;

  return (
    <div>
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Gestion des Utilisateurs & Accès Meli</h1>
          <p className="page-subtitle">
            Administration des comptes <strong>Propriétaires de flotte (Clients)</strong> et des <strong>Chauffeurs assignés</strong>.
          </p>
        </div>
        <button onClick={onAddUser} className="btn btn-primary">
          <Plus size={16} />
          <span>Créer un compte</span>
        </button>
      </div>

      {/* Role Quick Selector Tabs */}
      <div className="quick-filter-tabs">
        <button
          onClick={() => setRoleFilter('all')}
          className="btn"
          style={{
            backgroundColor: roleFilter === 'all' ? 'var(--primary)' : 'var(--bg-card)',
            color: roleFilter === 'all' ? '#FFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.84rem',
            padding: '8px 16px',
            flexShrink: 0,
          }}
        >
          Tous ({users.length})
        </button>

        <button
          onClick={() => setRoleFilter('OWNER')}
          className="btn"
          style={{
            backgroundColor: roleFilter === 'OWNER' ? 'var(--primary)' : 'var(--bg-card)',
            color: roleFilter === 'OWNER' ? '#FFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.84rem',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <Building size={14} />
          <span>Propriétaires ({ownersCount})</span>
        </button>

        <button
          onClick={() => setRoleFilter('DRIVER')}
          className="btn"
          style={{
            backgroundColor: roleFilter === 'DRIVER' ? 'var(--primary)' : 'var(--bg-card)',
            color: roleFilter === 'DRIVER' ? '#FFF' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.84rem',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <Car size={14} />
          <span>Chauffeurs ({driversCount})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card filters-bar">
        <div className="grid-filters-2">
          {/* Search Box */}
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Nom, identifiant, téléphone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tous les statuts d'accès</option>
              <option value="active">Actifs (Accès valide)</option>
              <option value="suspended">Suspendus (Bloqués)</option>
              <option value="pending">En attente de validation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th className="col-optional">Rôle</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun compte trouvé.
                </td>
              </tr>
            ) : (
              paginatedItems.map((u) => {
                const isExpanded = expandedId === u.id;
                const roleLabel =
                  u.role === 'OWNER' ? 'Propriétaire' : u.role === 'DRIVER' ? 'Chauffeur' : 'Admin';
                return (
                  <React.Fragment key={u.id}>
                    <tr
                      className={`data-row ${isExpanded ? 'is-expanded' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : u.id)}
                    >
                      <td data-label="Utilisateur" className="card-title-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              backgroundColor:
                                u.role === 'OWNER'
                                  ? 'var(--primary-soft)'
                                  : u.role === 'DRIVER'
                                  ? 'var(--info-light)'
                                  : 'var(--bg-input)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: u.role === 'OWNER' ? 'var(--primary)' : 'var(--text-primary)',
                              flexShrink: 0,
                            }}
                          >
                            {u.role === 'OWNER' ? (
                              <Building size={18} />
                            ) : u.role === 'DRIVER' ? (
                              <Car size={18} />
                            ) : (
                              <User size={18} />
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="row-title">{u.name}</div>
                            <div className="row-subtitle">{roleLabel}</div>
                          </div>
                          <ChevronDown size={18} className="row-chevron" />
                        </div>
                      </td>

                      <td data-label="Rôle" className="col-optional">
                        {u.role === 'OWNER' ? (
                          <span className="badge badge-primary">Propriétaire</span>
                        ) : u.role === 'DRIVER' ? (
                          <span className="badge" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
                            Chauffeur
                          </span>
                        ) : (
                          <span className="badge badge-offline">Admin</span>
                        )}
                      </td>

                      <td data-label="Statut" className="col-status">
                        <span
                          className={`badge ${
                            u.status === 'active'
                              ? 'badge-success'
                              : u.status === 'suspended'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}
                        >
                          <span className="badge-dot" />
                          {u.status === 'active' ? 'Actif' : u.status === 'suspended' ? 'Suspendu' : 'En attente'}
                        </span>
                      </td>

                      <td data-label="Actions" style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="list-actions">
                          <button
                            onClick={() => onResetPassword(u)}
                            className="btn btn-secondary btn-icon"
                            title="Réinitialiser le mot de passe"
                            style={{ height: '36px', width: '36px' }}
                          >
                            <KeyRound size={15} color="var(--warning)" />
                          </button>
                          <button
                            onClick={() => onEditUser(u)}
                            className="btn btn-secondary btn-icon"
                            title="Modifier les informations"
                            style={{ height: '36px', width: '36px' }}
                          >
                            <Edit2 size={15} color="var(--primary)" />
                          </button>
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer le compte de ${u.name} ?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="btn btn-danger btn-icon"
                              title="Supprimer le compte"
                              style={{ height: '36px', width: '36px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <RowDetails colSpan={4}>
                        <DetailField label="Identifiant">{u.userName}</DetailField>
                        <DetailField label="Téléphone">{u.phone}</DetailField>
                        <DetailField label="Email">{u.email}</DetailField>
                        {u.role === 'OWNER' ? (
                          <DetailField label="Flotte">
                            <button
                              onClick={() => onViewUserVehicles(u.id)}
                              className="btn-ghost"
                              style={{
                                fontSize: '0.88rem',
                                padding: 0,
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--primary)',
                                fontWeight: 600,
                              }}
                            >
                              {u.assignedVehiclesCount} véhicule(s)
                            </button>
                          </DetailField>
                        ) : u.role === 'DRIVER' ? (
                          <>
                            <DetailField label="Véhicule">{u.assignedVehiclePlate || 'Non assigné'}</DetailField>
                            <DetailField label="Employeur">{u.employerName || u.company || 'N/A'}</DetailField>
                          </>
                        ) : (
                          <DetailField label="Rattachement">Système Meli</DetailField>
                        )}
                        <DetailField label="Créé le">
                          {new Date(u.createdAt).toLocaleDateString('fr-FR')}
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
