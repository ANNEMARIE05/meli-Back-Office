import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  Phone,
  Mail,
  Car,
  Building,
  User,
} from 'lucide-react';
import type { UserAccount, UserRole, UserStatus } from '../services/types';

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
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="grid-filters-2">
          {/* Search Box */}
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher par nom, identifiant, téléphone, email, société ou véhicule..."
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
              <th>Identifiant</th>
              <th>Type de Rôle</th>
              <th>Contacts</th>
              <th>Rattachement / Véhicule</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun compte trouvé.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  {/* User Full Name & ID */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: u.role === 'OWNER' ? 'var(--primary-soft)' : u.role === 'DRIVER' ? 'var(--info-light)' : 'var(--bg-input)',
                          border: `1px solid ${u.role === 'OWNER' ? 'var(--primary)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: u.role === 'OWNER' ? 'var(--primary)' : 'var(--text-primary)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}
                      >
                        {u.role === 'OWNER' ? <Building size={16} /> : u.role === 'DRIVER' ? <Car size={16} /> : <User size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ID: #{u.id} • Créé le {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Username (login) */}
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--bg-input)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {u.userName}
                    </span>
                  </td>

                  {/* Role Badge */}
                  <td>
                    {u.role === 'OWNER' ? (
                      <span className="badge badge-primary">
                        <Building size={11} />
                        <span>Propriétaire Flotte</span>
                      </span>
                    ) : u.role === 'DRIVER' ? (
                      <span className="badge" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
                        <Car size={11} />
                        <span>Chauffeur</span>
                      </span>
                    ) : (
                      <span className="badge badge-offline">
                        <span>Admin</span>
                      </span>
                    )}
                  </td>

                  {/* Contacts */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                        <Phone size={12} color="var(--text-muted)" />
                        <span>{u.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                        <Mail size={12} color="var(--text-muted)" />
                        <span>{u.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Rattachement / Vehicles */}
                  <td>
                    {u.role === 'OWNER' ? (
                      <button
                        onClick={() => onViewUserVehicles(u.id)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.76rem', height: '28px' }}
                        title="Voir les véhicules de ce propriétaire"
                      >
                        <Car size={13} color="var(--primary)" />
                        <span>{u.assignedVehiclesCount} véhicule(s)</span>
                      </button>
                    ) : u.role === 'DRIVER' ? (
                      <div style={{ fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          Véhicule : {u.assignedVehiclePlate || 'Non assigné'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          Employeur : {u.employerName || u.company || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Système Meli</span>
                    )}
                  </td>

                  {/* Status */}
                  <td>
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

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => onResetPassword(u)}
                        className="btn btn-secondary btn-icon"
                        title="Réinitialiser le mot de passe"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <KeyRound size={14} color="var(--warning)" />
                      </button>
                      <button
                        onClick={() => onEditUser(u)}
                        className="btn btn-secondary btn-icon"
                        title="Modifier les informations"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <Edit2 size={14} color="var(--primary)" />
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
                          style={{ height: '32px', width: '32px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
