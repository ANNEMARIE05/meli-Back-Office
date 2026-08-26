import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Clock,
  Crosshair,
  Search,
} from 'lucide-react';
import type { Vehicle } from '../services/types';

interface LiveMapViewProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (v: Vehicle | null) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: number]: L.Marker }>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'stopped' | 'offline'>('all');

  // Filter vehicles for list
  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    // Center on Abidjan by default
    const map = L.map(mapContainerRef.current, {
      center: [5.3484, -4.0197],
      zoom: 12,
      zoomControl: false,
    });

    // Add zoom control to top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap CartoDB Dark Matter / Positron or Standard OSM
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update vehicle markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    vehicles.forEach((vehicle) => {
      const isSelected = selectedVehicle?.id === vehicle.id;
      const markerColor =
        vehicle.status === 'online'
          ? '#10B981'
          : vehicle.status === 'stopped'
          ? '#F59E0B'
          : '#64748B';

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            <div style="
              background: ${isSelected ? '#FF6B00' : markerColor};
              color: #FFFFFF;
              font-family: Inter, sans-serif;
              font-weight: 800;
              font-size: 11px;
              padding: 2px 8px;
              border-radius: 6px;
              box-shadow: 0 3px 10px rgba(0,0,0,0.25);
              white-space: nowrap;
              border: 1.5px solid #FFFFFF;
              margin-bottom: 3px;
            ">
              ${vehicle.plate}
            </div>
            <div style="
              width: 34px;
              height: 34px;
              border-radius: 50%;
              background: #FFFFFF;
              border: 3px solid ${isSelected ? '#FF6B00' : markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.2);
              ${isSelected ? 'transform: scale(1.3); box-shadow: 0 0 20px rgba(255, 107, 0, 0.6);' : ''}
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#FF6B00' : markerColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 58],
        iconAnchor: [17, 58],
      });

      const marker = L.marker([vehicle.latitude, vehicle.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectVehicle(vehicle);
      });

      markersRef.current[vehicle.id] = marker;
    });
  }, [vehicles, selectedVehicle, onSelectVehicle]);

  // Center on selected vehicle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVehicle) return;

    map.flyTo([selectedVehicle.latitude, selectedVehicle.longitude], 15, {
      duration: 1.2,
    });
  }, [selectedVehicle]);

  const handleCenterAll = () => {
    const map = mapInstanceRef.current;
    if (!map || vehicles.length === 0) return;

    const bounds = L.latLngBounds(vehicles.map((v) => [v.latitude, v.longitude]));
    map.fitBounds(bounds, { padding: [60, 60] });
  };

  return (
    <div className="live-map-wrapper">
      {/* Left Sidebar: Vehicle List & Telemetry details */}
      <div className="card live-map-sidebar">
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Flotte en direct</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {vehicles.filter((v) => v.status === 'online').length} en mouvement sur {vehicles.length}
            </p>
          </div>
          <button
            onClick={handleCenterAll}
            className="btn btn-secondary btn-icon"
            title="Recadrer sur tous les véhicules"
            style={{ height: '34px', width: '34px' }}
          >
            <Crosshair size={16} color="var(--primary)" />
          </button>
        </div>

        {/* Search */}
        <div className="input-with-icon" style={{ marginBottom: '10px' }}>
          <Search size={15} />
          <input
            type="text"
            className="form-input"
            placeholder="Filtrer par plaque ou client..."
            style={{ height: '34px', fontSize: '0.82rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status quick tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {(['all', 'online', 'stopped', 'offline'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                flex: 1,
                padding: '5px 2px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filterStatus === st ? 'var(--primary)' : 'var(--bg-input)',
                color: filterStatus === st ? '#FFF' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {st === 'all'
                ? 'Tous'
                : st === 'online'
                ? 'En ligne'
                : st === 'stopped'
                ? 'À l’arrêt'
                : 'Hors-ligne'}
            </button>
          ))}
        </div>

        {/* Vehicle list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredVehicles.map((v) => {
            const isSelected = selectedVehicle?.id === v.id;
            return (
              <div
                key={v.id}
                onClick={() => onSelectVehicle(v)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {v.plate}
                  </span>
                  <span
                    className={`badge ${
                      v.status === 'online'
                        ? 'badge-success'
                        : v.status === 'stopped'
                        ? 'badge-warning'
                        : 'badge-offline'
                    }`}
                    style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                  >
                    <span className="badge-dot" />
                    {v.status === 'online' ? `${v.speed} km/h` : v.status === 'stopped' ? 'Arrêt' : 'Hors-ligne'}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {v.name} • {v.ownerName}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} />
                  <span>{v.address}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Details Drawer for Selected Vehicle */}
        {selectedVehicle && (
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                Télémétrie en direct
              </span>
              <button
                onClick={() => onSelectVehicle(null)}
                className="btn-ghost"
                style={{ fontSize: '0.7rem', padding: '2px 6px', border: 'none', cursor: 'pointer' }}
              >
                Fermer
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Contact Moteur</div>
                <div style={{ fontWeight: 600, color: selectedVehicle.engineOn ? 'var(--success)' : 'var(--danger)' }}>
                  {selectedVehicle.engineOn ? '🟢 Allumé (ON)' : '⚪ Coupé (OFF)'}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Vitesse réelle</div>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {selectedVehicle.speed} km/h
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Batterie Traceur</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedVehicle.batteryLevel ?? 100}%
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Réservoir</div>
                <div style={{ fontWeight: 600, color: 'var(--warning)' }}>
                  {selectedVehicle.fuelLevel ?? 80}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Map Canvas */}
      <div className="card live-map-canvas-container" style={{ padding: 0 }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};
