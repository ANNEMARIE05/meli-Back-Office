import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, User, Building, Car } from 'lucide-react';
import type { UserAccount, UserRole, UserStatus } from '../services/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  userToEdit?: UserAccount | null;
  existingOwners?: UserAccount[];
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
  existingOwners = [],
}) => {
  const isEditing = !!userToEdit;

  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'OWNER' as UserRole,
    status: 'active' as UserStatus,
    password: '',
    employerOwnerId: 0,
    assignedVehiclePlate: '',
    notes: '',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        userName: userToEdit.userName,
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        company: userToEdit.company || '',
        role: userToEdit.role,
        status: userToEdit.status,
        password: '',
        employerOwnerId: userToEdit.employerOwnerId || 0,
        assignedVehiclePlate: userToEdit.assignedVehiclePlate || '',
        notes: userToEdit.notes || '',
      });
    } else {
      setFormData({
        userName: '',
        name: '',
        email: '',
        phone: '+225 ',
        company: '',
        role: 'OWNER',
        status: 'active',
        password: 'Password@2026',
        employerOwnerId: existingOwners[0]?.id || 0,
        assignedVehiclePlate: '',
        notes: '',
      });
    }
  }, [userToEdit, isOpen, existingOwners]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employer = existingOwners.find((o) => o.id === Number(formData.employerOwnerId));
    onSave({
      ...formData,
      employerOwnerId: formData.role === 'DRIVER' ? Number(formData.employerOwnerId) : undefined,
      employerName: formData.role === 'DRIVER' && employer ? employer.name : undefined,
      company: formData.role === 'DRIVER' && employer ? employer.company : formData.company,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
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
              {isEditing ? <User size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                {isEditing ? 'Modifier le compte' : 'Créer un nouveau compte utilisateur'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {isEditing
                  ? `Identifiant de connexion : ${userToEdit.userName}`
                  : 'Sélectionnez le type de compte (Propriétaire ou Chauffeur)'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon" style={{ border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* ROLE SELECTOR CARDS */}
            {!isEditing && (
              <div style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  TYPE DE COMPTE À CRÉER *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* Card 1: Owner */}
                  <div
                    onClick={() => setFormData({ ...formData, role: 'OWNER' })}
                    style={{
                      border: `1.5px solid ${formData.role === 'OWNER' ? 'var(--primary)' : 'var(--border-color)'}`,
                      backgroundColor: formData.role === 'OWNER' ? 'var(--primary-soft)' : 'var(--bg-input)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <Building size={16} color={formData.role === 'OWNER' ? 'var(--primary)' : 'var(--text-secondary)'} />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: formData.role === 'OWNER' ? 'var(--primary)' : 'var(--text-primary)' }}>
                        Propriétaire / Client
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      Possède la flotte, consulte tous ses véhicules et suit ses chauffeurs sur Meli-App.
                    </p>
                  </div>

                  {/* Card 2: Driver */}
                  <div
                    onClick={() => setFormData({ ...formData, role: 'DRIVER' })}
                    style={{
                      border: `1.5px solid ${formData.role === 'DRIVER' ? 'var(--primary)' : 'var(--border-color)'}`,
                      backgroundColor: formData.role === 'DRIVER' ? 'var(--primary-soft)' : 'var(--bg-input)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <Car size={16} color={formData.role === 'DRIVER' ? 'var(--primary)' : 'var(--text-secondary)'} />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: formData.role === 'DRIVER' ? 'var(--primary)' : 'var(--text-primary)' }}>
                        Chauffeur Assigné
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      Conduit un véhicule spécifique, visualise ses trajets sur l'espace Chauffeur Meli-App.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General Info */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ex: Kouamé Koffi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Identifiant de connexion (login) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ex: k.koffi"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value.toLowerCase().trim() })}
                  disabled={isEditing}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Téléphone portable *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="+225 07..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adresse Email *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="utilisateur@domaine.ci"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Conditional Driver vs Owner Fields */}
            {formData.role === 'DRIVER' ? (
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Propriétaire / Employeur de rattachement</label>
                  <select
                    className="form-select"
                    value={formData.employerOwnerId}
                    onChange={(e) => setFormData({ ...formData, employerOwnerId: Number(e.target.value) })}
                  >
                    {existingOwners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.company || 'Particulier'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Immatriculation du véhicule assigné</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ex: 8492-HH-01"
                    value={formData.assignedVehiclePlate}
                    onChange={(e) => setFormData({ ...formData, assignedVehiclePlate: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
            ) : (
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Entreprise / Société</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ex: Ivoire Express Logistics"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Statut du compte</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  >
                    <option value="active">Actif (Accès autorisé)</option>
                    <option value="suspended">Suspendu / Bloqué</option>
                    <option value="pending">En attente de validation</option>
                  </select>
                </div>
              </div>
            )}

            {!isEditing && (
              <div className="form-group">
                <label className="form-label">Mot de passe temporaire initial *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes internes</label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="Remarques, contact d'urgence, informations diverses..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{isEditing ? 'Mettre à jour' : 'Enregistrer le compte'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
