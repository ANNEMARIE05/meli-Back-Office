import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Crosshair,
  Search,
} from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import type { Vehicle } from '../services/types';

interface LiveMapViewProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (v: Vehicle | null) => void;
}

const TelemetryPanel: React.FC<{
  vehicle: Vehicle;
  onClose: () => void;
  inline?: boolean;
}> = ({ vehicle, onClose, inline = false }) => (
  <div className={`live-map-telemetry ${inline ? 'is-inline' : ''}`}>
    <div className="live-map-telemetry-head">
      <span>Télémétrie en direct</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="btn-ghost"
      >
        Fermer
      </button>
    </div>

    <div className="live-map-telemetry-grid">
      <div>
        <div className="detail-field-label">Contact moteur</div>
        <div style={{ fontWeight: 600, color: vehicle.engineOn ? 'var(--success)' : 'var(--danger)' }}>
          {vehicle.engineOn ? 'Allumé (ON)' : 'Coupé (OFF)'}
        </div>
      </div>

      <div>
        <div className="detail-field-label">Vitesse</div>
        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
          {vehicle.speed} km/h
        </div>
      </div>

      <div>
        <div className="detail-field-label">Batterie</div>
        <div style={{ fontWeight: 600 }}>{vehicle.batteryLevel ?? 100}%</div>
      </div>

      <div>
        <div className="detail-field-label">Carburant</div>
        <div style={{ fontWeight: 600 }}>{vehicle.fuelLevel ?? 80}%</div>
      </div>
    </div>
    <div className="live-map-telemetry-position">
      <div className="detail-field-label">Position</div>
      <div className="live-map-telemetry-address">{vehicle.address}</div>
      <div className="live-map-telemetry-update">{vehicle.lastUpdate}</div>
    </div>
  </div>
);

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const isMobile = useIsMobile();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: number]: L.Marker }>({});
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

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

    const onResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', onResize);
    const timer = window.setTimeout(onResize, 250);

    const observer =
      mapContainerRef.current && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(onResize)
        : null;
    if (observer && mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
      observer?.disconnect();
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

  useEffect(() => {
    if (!isMobile || !selectedVehicle) return;
    const frame = window.requestAnimationFrame(() => {
      const el = selectedItemRef.current;
      if (!el) return;
      const sidebar = el.closest('.live-map-sidebar');
      const header = sidebar?.querySelector('.live-map-sidebar-header');
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      el.style.scrollMarginTop = `${headerHeight + 6}px`;
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isMobile, selectedVehicle]);

  return (
    <div className="live-map-wrapper">
      {/* Left Sidebar: Vehicle List & Telemetry details */}
      <div className="card live-map-sidebar">
        <div className="live-map-sidebar-header">
          <div className="live-map-sidebar-title">
            <div>
              <h2>Flotte en direct</h2>
              <p>
                {vehicles.filter((v) => v.status === 'online').length} en mouvement sur {vehicles.length}
              </p>
            </div>
            <button
              onClick={handleCenterAll}
              className="btn btn-secondary btn-icon"
              title="Recadrer sur tous les véhicules"
            >
              <Crosshair size={16} color="var(--primary)" />
            </button>
          </div>

          <div className="input-with-icon live-map-search">
            <Search size={15} />
            <input
              type="text"
              className="form-input"
              placeholder="Filtrer par plaque ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="live-map-status-tabs">
            {(['all', 'online', 'stopped', 'offline'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`live-map-status-tab ${filterStatus === st ? 'is-active' : ''}`}
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
        </div>

        <div className="live-map-list">
          {filteredVehicles.map((v) => {
            const isSelected = selectedVehicle?.id === v.id;
            return (
              <div
                key={v.id}
                ref={isSelected ? selectedItemRef : undefined}
                className={`live-map-vehicle-block ${isSelected ? 'is-open' : ''}`}
              >
                <div
                  className={`live-map-vehicle-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectVehicle(isMobile && isSelected ? null : v)}
                >
                  <div className="live-map-vehicle-row">
                    <div style={{ minWidth: 0 }}>
                      <div className="row-title">{v.plate}</div>
                      <div className="row-subtitle">{v.name} · {v.ownerName}</div>
                    </div>
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
                      {v.status === 'online' ? `${v.speed} km/h` : v.status === 'stopped' ? 'Arrêt' : 'Hors-ligne'}
                    </span>
                  </div>
                </div>
                {isMobile && isSelected && selectedVehicle && (
                  <TelemetryPanel
                    vehicle={selectedVehicle}
                    onClose={() => onSelectVehicle(null)}
                    inline
                  />
                )}
              </div>
            );
          })}
        </div>

        {!isMobile && selectedVehicle && (
          <TelemetryPanel
            vehicle={selectedVehicle}
            onClose={() => onSelectVehicle(null)}
          />
        )}
      </div>

      {/* Right Map Canvas */}
      <div className="card live-map-canvas-container" style={{ padding: 0 }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};
