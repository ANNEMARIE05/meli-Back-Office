import React, { useState, useEffect } from 'react';
import { X, Car, Save } from 'lucide-react';
import type { Vehicle, VehicleStatus, UserAccount } from '../services/types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: any) => void;
  vehicleToEdit?: Vehicle | null;
  usersList: UserAccount[];
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicleToEdit,
  usersList,
}) => {
  const isEditing = !!vehicleToEdit;

  const [formData, setFormData] = useState({
    plate: '',
    name: '',
    model: '',
    imei: '',
    deviceType: 'WhatsGPS GT06N',
    ownerId: usersList[0]?.id || 0,
    status: 'online' as VehicleStatus,
    speed: 0,
    fuelLevel: 80,
    batteryLevel: 95,
    engineOn: false,
    latitude: 5.3484,
    longitude: -4.0197,
    address: 'Abidjan, Côte d’Ivoire',
    mileage: 10000,
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        plate: vehicleToEdit.plate,
        name: vehicleToEdit.name,
        model: vehicleToEdit.model,
        imei: vehicleToEdit.imei,
        deviceType: vehicleToEdit.deviceType,
        ownerId: vehicleToEdit.ownerId,
        status: vehicleToEdit.status,
        speed: vehicleToEdit.speed,
        fuelLevel: vehicleToEdit.fuelLevel ?? 80,
        batteryLevel: vehicleToEdit.batteryLevel ?? 95,
        engineOn: vehicleToEdit.engineOn,
        latitude: vehicleToEdit.latitude,
        longitude: vehicleToEdit.longitude,
        address: vehicleToEdit.address,
        mileage: vehicleToEdit.mileage,
      });
    } else {
      setFormData({
        plate: '',
        name: '',
        model: '',
        imei: '864201048' + Math.floor(100000 + Math.random() * 900000),
        deviceType: 'WhatsGPS GT06N',
        ownerId: usersList.find((u) => u.role === 'OWNER')?.id || usersList[0]?.id || 0,
        status: 'stopped',
        speed: 0,
        fuelLevel: 85,
        batteryLevel: 100,
        engineOn: false,
        latitude: 5.3548,
        longitude: -3.9875,
        address: 'Cocody Deux-Plateaux, Abidjan',
        mileage: 25000,
      });
    }
  }, [vehicleToEdit, isOpen, usersList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = usersList.find((u) => u.id === Number(formData.ownerId));
    onSave({
      ...formData,
      ownerId: Number(formData.ownerId),
      ownerName: selectedUser ? selectedUser.name : 'Client Non Assigné',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--success-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                flexShrink: 0,
              }}
            >
              <Car size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3>
                {isEditing ? 'Modifier le véhicule / balise' : 'Enregistrer un nouveau véhicule'}
              </h3>
              <p>
                Affectez un traceur GPS et assignez le véhicule à un client
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon" style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Numéro d’immatriculation *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ex: 1234-AB-01"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom d’affichage *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ex: Toyota Hilux #1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Marque & Modèle *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ex: Toyota Hilux 4x4 D4D"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client / Propriétaire assigné *</label>
                <select
                  className="form-select"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: Number(e.target.value) })}
                >
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.userName}) - {u.company || 'Particulier'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Numéro IMEI de la balise GPS *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="15 chiffres (ex: 864201048...)"
                  value={formData.imei}
                  onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type / Modèle de boîtier</label>
                <select
                  className="form-select"
                  value={formData.deviceType}
                  onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                >
                  <option value="WhatsGPS GT06N">WhatsGPS GT06N (Standard)</option>
                  <option value="WhatsGPS TK103">WhatsGPS TK103 (Poids lourd)</option>
                  <option value="WhatsGPS OBD-II">WhatsGPS Plug & Play OBD-II</option>
                  <option value="WhatsGPS AT4">WhatsGPS AT4 (Autonome magnétique)</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Kilométrage initial (km)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statut de la balise</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                >
                  <option value="online">En ligne (Véhicule en mouvement)</option>
                  <option value="stopped">À l'arrêt (Contact coupé)</option>
                  <option value="offline">Hors-ligne (Non communicant)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{isEditing ? 'Mettre à jour' : 'Associer et Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
