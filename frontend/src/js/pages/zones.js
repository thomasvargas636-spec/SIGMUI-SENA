class ZoneManager {
    constructor() {
        this.zonesData = [];
        this.filteredZones = [];
        this.selectedZone = null;
        this.isFilterActive = false;
        this.init();
    }

    async init() {
        await this.loadZones();
        this.bindEvents();
        this.updateUI();
        this.simulateRealTimeUpdates();
    }

    async loadZones() {
        try {
            const res = await fetch('/api/zones');
            const data = await res.json();
            
            // Re-format positions
            const formattedData = data.map(zone => ({
                ...zone,
                position: { top: zone.positionTop, left: zone.positionLeft }
            }));
            
            this.zonesData = formattedData;
            this.filteredZones = [...this.zonesData];
            
            if (this.selectedZone) {
                this.selectedZone = this.zonesData.find(z => z.id === this.selectedZone.id) || null;
            }
            this.updateUI();
        } catch (error) {
            console.error('Error fetching zones:', error);
        }
    }

    filterZones() {
        this.isFilterActive = !this.isFilterActive;
        this.applyFilters();
    }

    applyFilters() {
        const filterBtn = document.getElementById('filter-btn');
        if (this.isFilterActive) {
            this.filteredZones = this.zonesData.filter(zone => zone.availableSpots > 0);
            if (filterBtn) filterBtn.textContent = '✅ Mostrando disponibles';
        } else {
            this.filteredZones = [...this.zonesData];
            if (filterBtn) filterBtn.textContent = '🔍 Filtrar zonas';
        }

        if (this.selectedZone && !this.filteredZones.find(z => z.id === this.selectedZone.id)) {
            this.selectedZone = null;
        }
        this.updateUI();
    }

    simulateRealTimeUpdates() {
        setInterval(() => {
            this.zonesData.forEach(zone => {
                const change = Math.floor(Math.random() * 3) - 1;
                zone.availableSpots = Math.max(0, Math.min(zone.totalSpots, zone.availableSpots + change));
            });
            this.applyFilters();
        }, 5000);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const zoneItem = e.target.closest('.zone-item');
            if (zoneItem) this.selectZone(zoneItem.dataset.zoneId);
            
            const mapPin = e.target.closest('.map-pin');
            if (mapPin) this.selectZone(mapPin.dataset.zoneId);

            if (e.target.id === 'reserve-btn' && !e.target.disabled) {
                window.location.href = `/pagos?zoneId=${this.selectedZone.id}`;
            }

            if (e.target.id === 'filter-btn') {
                this.filterZones();
            }
        });
    }

    selectZone(zoneId) {
        this.selectedZone = this.zonesData.find(z => z.id === zoneId);
        this.updateUI();
    }

    updateUI() {
        this.renderMapPins();
        this.renderZonesList();
        this.updateDetailPanel();
        this.updateGlobalStatus();
    }

    updateGlobalStatus() {
        const statusText = document.querySelector('.zones-status-text');
        if (!statusText) return;
        const availableCount = this.zonesData.filter(z => z.availableSpots > 0).length;
        statusText.textContent = `${availableCount} disponibles · ${this.zonesData.length - availableCount} llenas`;
    }

    updateDetailPanel() {
        const detailContainer = document.querySelector('.zone-detail-card');
        if (!detailContainer) return;

        if (!this.selectedZone) {
            detailContainer.classList.add('hidden');
            return;
        }

        const isAvailable = this.selectedZone.availableSpots > 0;
        detailContainer.classList.remove('hidden');
        detailContainer.innerHTML = `
            <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
                <div class="font-heading text-sm font-extrabold text-gray-50">${this.selectedZone.name}</div>
                <button id="reserve-btn" class="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-br from-primary-500 to-secondary-500 border-none rounded-lg text-white text-xs font-medium cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed" ${!isAvailable ? 'disabled' : ''}>
                    ${isAvailable ? 'Reservar plaza →' : 'Sin disponibilidad'}
                </button>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-800 text-xs last:border-b-0">
                <span class="text-gray-400">Dirección</span>
                <span class="font-medium text-gray-50">${this.selectedZone.address}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-800 text-xs last:border-b-0">
                <span class="text-gray-400">Cupos disponibles</span>
                <span class="font-medium ${isAvailable ? 'text-secondary-400' : 'text-error'}">${this.selectedZone.availableSpots} de ${this.selectedZone.totalSpots}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-800 text-xs last:border-b-0">
                <span class="text-gray-400">Tarifa</span>
                <span class="font-medium text-gray-50">$${this.selectedZone.price.toLocaleString()} por hora</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-800 text-xs last:border-b-0">
                <span class="text-gray-400">Horario</span>
                <span class="font-medium text-gray-50">${this.selectedZone.schedule}</span>
            </div>
        `;
    }

    getZoneStatus(available) {
        if (available === 0) return { text: 'Sin cupos', class: 'bg-error bg-opacity-20 text-error border-error border-opacity-30' };
        if (available <= 5) return { text: 'Casi llena', class: 'bg-warning bg-opacity-20 text-warning border-warning border-opacity-30' };
        return { text: 'Disponible', class: 'bg-secondary-500 bg-opacity-20 text-secondary-400 border-secondary-500 border-opacity-30' };
    }

    renderMapPins() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (!mapPlaceholder) return;
        mapPlaceholder.querySelectorAll('.map-pin').forEach(pin => pin.remove());

        if (this.filteredZones.length === 0) {
            // Already handled by showing empty state in the list
            return;
        }

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const pinClass = isSelected ? 'pin-selected' : (zone.availableSpots === 0 ? 'pin-full' : (zone.availableSpots <= 5 ? 'pin-warning' : 'pin-available'));
            const textClass = isSelected ? 'text-primary-400' : (zone.availableSpots === 0 ? 'text-error' : (zone.availableSpots <= 5 ? 'text-warning' : 'text-secondary-400'));
            
            const pin = document.createElement('div');
            pin.className = `map-pin ${pinClass}`;
            pin.style.cssText = `top: ${zone.position.top}; left: ${zone.position.left};`;
            pin.dataset.zoneId = zone.id;
            pin.innerHTML = `<div class="map-pin-icon text-white"><span>📍</span></div><div class="map-pin-label ${textClass}">${zone.shortName}</div>`;
            mapPlaceholder.appendChild(pin);
        });
    }

    renderZonesList() {
        const listContainer = document.querySelector('.zones-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (this.filteredZones.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center p-8 bg-gray-900 text-gray-400">
                    <div class="text-3xl mb-2 opacity-50">⚠️</div>
                    <div class="font-medium text-gray-50 text-sm mb-1">No hay zonas disponibles</div>
                    <div class="text-xs">Intenta ajustar los filtros para ver más resultados.</div>
                </div>
            `;
            return;
        }

        this.filteredZones.forEach(zone => {
            const isSelected = this.selectedZone && this.selectedZone.id === zone.id;
            const status = this.getZoneStatus(zone.availableSpots);
            
            const zoneItem = document.createElement('div');
            zoneItem.className = `zone-item p-3.5 border-b border-gray-800 cursor-pointer bg-gray-900 ${isSelected ? 'selected' : ''}`;
            zoneItem.dataset.zoneId = zone.id;
            
            const fillClass = zone.availableSpots === 0 ? 'low' : (zone.availableSpots <= 5 ? 'medium' : 'high');
            const fillWidth = ((zone.totalSpots - zone.availableSpots) / zone.totalSpots) * 100;

            zoneItem.innerHTML = `
                <div class="flex items-center justify-between mb-1.5">
                    <div class="font-heading text-sm font-bold text-gray-50">${zone.name}</div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.class}">${status.text}</span>
                </div>
                <div class="text-[11px] text-gray-400 mb-2">📍 ${zone.address}</div>
                <div class="flex items-center gap-2.5">
                    <div class="text-xs font-semibold text-secondary-400 whitespace-nowrap">$${zone.price.toLocaleString()}/hr</div>
                    <div class="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div class="spots-fill ${fillClass} h-full rounded-full" style="width: ${fillWidth}%;"></div>
                    </div>
                    <div class="text-[11px] text-gray-400 whitespace-nowrap">${zone.availableSpots}/${zone.totalSpots} cupos</div>
                </div>
            `;
            listContainer.appendChild(zoneItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { window.zoneManager = new ZoneManager(); });
