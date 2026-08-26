import React, { useState, useMemo } from 'react';
import {
  Car,
  Search,
  Plus,
  Edit2,
  Trash2,
  Radio,
  ChevronDown,
} from 'lucide-react';
import type { Vehicle, VehicleStatus, UserAccount } from '../services/types';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { RowDetails, DetailField } from '../components/RowDetails';

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
  const [pageSize, setPageSize] = useState(5);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const { paginatedItems, page, setPage, totalPages, totalItems, from, to } = usePagination(
    filteredVehicles,
    pageSize
  );

  const owners = users.filter((u) => u.role === 'OWNER');

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
      <div className="card filters-bar">
        <div className="grid-filters-3">
          {/* Search */}
          <div className="input-with-icon">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Plaque, IMEI, modèle, client..."
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
              {owners.map((u) => (
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
              <th>Véhicule</th>
              <th className="col-optional">Client</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Aucun véhicule trouvé correspondant aux critères.
                </td>
              </tr>
            ) : (
              paginatedItems.map((v) => {
                const isExpanded = expandedId === v.id;
                const statusLabel =
                  v.status === 'online'
                    ? `En ligne · ${v.speed} km/h`
                    : v.status === 'stopped'
                    ? 'À l’arrêt'
                    : 'Hors-ligne';
                return (
                  <React.Fragment key={v.id}>
                    <tr
                      className={`data-row ${isExpanded ? 'is-expanded' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    >
                      <td data-label="Véhicule" className="card-title-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-input)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary)',
                              flexShrink: 0,
                            }}
                          >
                            <Car size={18} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="row-title">{v.plate}</div>
                            <div className="row-subtitle">
                              {v.name} · {v.ownerName}
                            </div>
                          </div>
                          <ChevronDown size={18} className="row-chevron" />
                        </div>
                      </td>

                      <td data-label="Client" className="col-optional">
                        {v.ownerName}
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
                          {statusLabel}
                        </span>
                      </td>

                      <td data-label="Actions" style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div className="list-actions">
                          <button
                            onClick={() => onLocateOnMap(v)}
                            className="btn btn-secondary btn-icon"
                            title="Afficher sur Live Map"
                            style={{ height: '36px', width: '36px' }}
                          >
                            <Radio size={15} color="var(--primary)" />
                          </button>
                          <button
                            onClick={() => onEditVehicle(v)}
                            className="btn btn-secondary btn-icon"
                            title="Modifier le véhicule / balise"
                            style={{ height: '36px', width: '36px' }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer le véhicule ${v.plate} (${v.name}) ?`)) {
                                onDeleteVehicle(v.id);
                              }
                            }}
                            className="btn btn-danger btn-icon"
                            title="Dissocier / Supprimer"
                            style={{ height: '36px', width: '36px' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <RowDetails colSpan={4}>
                        <DetailField label="Modèle">{v.model}</DetailField>
                        <DetailField label="Balise GPS">{v.imei}</DetailField>
                        <DetailField label="Type de traceur">{v.deviceType}</DetailField>
                        <DetailField label="Client">{v.ownerName}</DetailField>
                        {v.driverName && <DetailField label="Chauffeur">{v.driverName}</DetailField>}
                        <DetailField label="Contact moteur">{v.engineOn ? 'Allumé (ON)' : 'Coupé (OFF)'}</DetailField>
                        <DetailField label="Batterie">{v.batteryLevel ?? 100}%</DetailField>
                        <DetailField label="Carburant">{v.fuelLevel ?? 80}%</DetailField>
                        <DetailField label="Kilométrage">{v.mileage.toLocaleString()} km</DetailField>
                        <DetailField label="Dernière position">{v.address}</DetailField>
                        <DetailField label="Mise à jour">{v.lastUpdate}</DetailField>
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
