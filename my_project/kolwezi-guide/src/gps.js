/**
 * @file gps.js
 * @description Calcul de la distance géodésique entre le touriste et le centre de Kolwezi
 */

document.addEventListener("DOMContentLoaded", () => {
    const btnGps = document.getElementById("btn-activate-gps");
    const gpsBox = document.getElementById("tourism-gps-box");
    const txtLat = document.getElementById("tourist-lat");
    const txtLon = document.getElementById("tourist-lon");
    const txtDist = document.getElementById("tourist-distance");

    // Coordonnées du centre de Kolwezi
    const KOLWEZI_LAT = -10.7167;
    const KOLWEZI_LON = 25.4667;

    btnGps?.addEventListener("click", () => {
        if (!navigator.geolocation) {
            alert("Your browser does not support GPS Geolocation.");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            if (txtLat) txtLat.textContent = lat.toFixed(4);
            if (txtLon) txtLon.textContent = lon.toFixed(4);

            // Calcul de la distance réelle avec la formule de Haversine
            const R = 6371; // Rayon de la Terre en km
            const dLat = (lat - KOLWEZI_LAT) * Math.PI / 180;
            const dLon = (lon - KOLWEZI_LON) * Math.PI / 180;
            
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(KOLWEZI_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c; // Distance en km

            if (txtDist) {
                if (distance < 5) {
                    txtDist.innerHTML = `📍 You are currently inside Kolwezi city center!`;
                } else {
                    txtDist.innerHTML = `🚗 You are approximately <strong>${distance.toFixed(1)} km</strong> away from Kolwezi center.`;
                }
            }

            gpsBox?.classList.remove("d-none");
        }, (error) => {
            alert("Error accessing GPS. Please enable Location Services on your device.");
        });
    });
});