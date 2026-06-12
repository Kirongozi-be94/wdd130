/**
 * @file gps.js
 * @description Manages dual-mode positioning telemetry (Satellite GPS and GPRS Cell Triangulation).
 */

document.addEventListener("DOMContentLoaded", () => {
    const btnGps = document.getElementById("btn-activate-gps");
    const btnGprs = document.getElementById("btn-activate-gprs");
    const gpsBox = document.getElementById("tourism-gps-box");
    
    const txtMode = document.getElementById("tracking-mode");
    const txtLat = document.getElementById("tourist-lat");
    const txtLon = document.getElementById("tourist-lon");
    const txtDist = document.getElementById("tourist-distance");
    const txtGprsMeta = document.getElementById("gprs-meta");

    // Reference Datum: Geographic city center anchor for Kolwezi
    const CENTER_KOLWEZI_LAT = -10.7167;
    const CENTER_KOLWEZI_LON = 25.4667;

    /**
     * Executes the mathematical Haversine equations to process spatial vectors
     */
    function calculateVectorDistance(lat, lon) {
        const EARTH_RADIUS_KM = 6371; 
        const deltaLatRad = (lat - CENTER_KOLWEZI_LAT) * Math.PI / 180;
        const deltaLonRad = (lon - CENTER_KOLWEZI_LON) * Math.PI / 180;
        
        const arcEquation = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                            Math.cos(CENTER_KOLWEZI_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
        
        const angularDistance = 2 * Math.atan2(Math.sqrt(arcEquation), Math.sqrt(1 - arcEquation));
        return EARTH_RADIUS_KM * angularDistance;
    }

    function renderDistanceUI(totalKilometers) {
        if (!txtDist) return;
        if (totalKilometers < 5) {
            txtDist.innerHTML = `📍 Status: Inside the Kolwezi Urban Core perimeter.`;
        } else {
            txtDist.innerHTML = `🚗 Vector: Approximately <strong>${totalKilometers.toFixed(1)} km</strong> from Kolwezi Center.`;
        }
    }

    // --- TRACKING MODE 1: SATELLITE GPS ACTIVE ---
    btnGps?.addEventListener("click", () => {
        if (!navigator.geolocation) {
            alert("Hardware Alert: Geolocation tracking engine missing from local architecture.");
            return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const currentLat = pos.coords.latitude;
            const currentLon = pos.coords.longitude;

            if (txtMode) txtMode.textContent = "🛰️ Satellite GPS (High Accuracy Mode)";
            if (txtLat) txtLat.textContent = currentLat.toFixed(4);
            if (txtLon) txtLon.textContent = currentLon.toFixed(4);
            if (txtGprsMeta) txtGprsMeta.classList.add("d-none"); // Hide GPRS cell data info

            const distance = calculateVectorDistance(currentLat, currentLon);
            renderDistanceUI(distance);
            
            gpsBox?.classList.remove("d-none");
        }, () => {
            alert("Telemetry Error: Unable to extract explicit overhead satellite coordinates.");
        });
    });

    // --- TRACKING MODE 2: GPRS CELL INTERPOLATION ACTIVE ---
    btnGprs?.addEventListener("click", () => {
        if (txtMode) txtMode.textContent = "📶 GPRS Cellular Triangulation (Industrial Fallback Mode)";
        
        // Simulates cellular node positioning vectors near industrial zones
        // Simulates slight margin variances due to base transceiver station ranges (+/- 0.0150)
        const simulatedGprsLat = -10.7210; 
        const simulatedGprsLon = 25.4735; 

        if (txtLat) txtLat.textContent = simulatedGprsLat.toFixed(4);
        if (txtLon) txtLon.textContent = simulatedGprsLon.toFixed(4);
        
        // Output standard telemetry identifiers used by GPRS modems
        if (txtGprsMeta) {
            txtGprsMeta.innerHTML = `[GPRS Sync Data] MCC: 630 (DRC) | MNC: 01 (Vodacom) | LAC: 4050 | CellID: 8821 | Accuracy: ~750m`;
            txtGprsMeta.classList.remove("d-none");
        }

        const distance = calculateVectorDistance(simulatedGprsLat, simulatedGprsLon);
        renderDistanceUI(distance);

        gpsBox?.classList.remove("d-none");
    });
});