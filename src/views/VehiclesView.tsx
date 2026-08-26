import React, { useState, useMemo } from 'react';
import {
  Car,
  Search,
  Plus,
  Edit2,
  Trash2,
  Radio,
  Battery,
  Fuel,
  User,
  Clock,
} from 'lucide-react';
import type { Vehicle, VehicleStatus, UserAccount } from '../services/types';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  users: UserAccount[];
  initialOwnerFilter?: number | null;
  onAddVehicle: () => void;
  onEditVehicle: (v: Vehicle) => void;
  onDeleteVehicle: (vId: number) => void;
  onLocateOnMap: (v: Vehicle) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  users,
  initialOwnerFilter,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onLocateOnMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>(
    initialOwnerFilter ? String(initialOwnerFilter) : 'all'
  );

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.imei.includes(searchTerm) ||
        v.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchOwner = ownerFilter === 'all' || v.ownerId === Number(ownerFilter);

      return matchSearch && matchStatus && matchOwner;
    });
  }, [vehicles, searchTerm, statusFilter, ownerFilter]);

  return (
    <div>
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Gestion de la Flotte & Balises GPS</h1>
          <p className="page-subtitle">
            Supervisez les balises actives, associez des IMEI de traceurs et gérez l'attribution par client.
          </p>
        </div>
        <button onClick={onAddVehicle} className="btn btn-primary">
          <Plus size={16} />
          <span>Associer un véhicule</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="grid-filters-3">
          {/* Search */}
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher par immatriculation, IMEI balise, modèle ou client..."
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
              <option value="all">Tous les états ({vehicles.length})</option>
              <option value="online">En mouvement (En ligne)</option>
              <option value="stopped">À l’arrêt (Contact OFF)</option>
              <option value="offline">Hors-ligne (Non communicant)</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div>
            <select
              className="form-select"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="all">Tous les clients</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.assignedVehiclesCount} véh.)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Véhicule & Modèle</th>
              <th>Balise GPS (IMEI)</th>
              <th>Client Assigné</th>
              <th>Statut & Vitesse</th>
              <th>Capteurs (Batterie / Carburant)</th>
              <th>Dernière Position</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun véhicule trouvé correspondant aux critères.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr key={v.id}>
                  {/* Vehicle info */}
                  <td data-label="Véhicule" className="card-title-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                        }}
                      >
                        <Car size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                          {v.plate}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          {v.name} • {v.model}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* GPS Tracker IMEI */}
                  <td data-label="Balise GPS">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          backgroundColor: 'var(--bg-input)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {v.imei}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {v.deviceType}
                      </span>
                    </div>
                  </td>

                  {/* Owner / Client */}
                  <td data-label="Client">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {v.ownerName}
                      </span>
                    </div>
                  </td>

                  {/* Status & Speed */}
                  <td data-label="Statut">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                          ? `En ligne (${v.speed} km/h)`
                          : v.status === 'stopped'
                          ? 'À l’arrêt'
                          : 'Hors-ligne'}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Contact: {v.engineOn ? '🟢 ON' : '⚪ OFF'} • {v.mileage.toLocaleString()} km
                      </div>
                    </div>
                  </td>

                  {/* Telemetry Sensors */}
                  <td data-label="Capteurs">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                        <Battery size={14} color="var(--success)" />
                        <span>{v.batteryLevel ?? 100}%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                        <Fuel size={14} color="var(--warning)" />
                        <span>{v.fuelLevel ?? 80}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Last Position */}
                  <td data-label="Position">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '100%', minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {v.address}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        <span>{v.lastUpdate}</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => onLocateOnMap(v)}
                        className="btn btn-secondary btn-icon"
                        title="Afficher sur Live Map"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <Radio size={14} color="var(--primary)" />
                      </button>
                      <button
                        onClick={() => onEditVehicle(v)}
                        className="btn btn-secondary btn-icon"
                        title="Modifier le véhicule / balise"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer le véhicule ${v.plate} (${v.name}) ?`)) {
                            onDeleteVehicle(v.id);
                          }
                        }}
                        className="btn btn-danger btn-icon"
                        title="Dissocier / Supprimer"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <Trash2 size={14} />
                      </button>
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
