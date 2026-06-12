/**
 * @file gps.js
 * @description Compiles telemetry vectors against center mass city reference datums.
 */
document.addEventListener("DOMContentLoaded", () => {
    const btnGps = document.getElementById("btn-activate-gps");
    const gpsBox = document.getElementById("tourism-gps-box");
    const txtLat = document.getElementById("tourist-lat");
    const txtLon = document.getElementById("tourist-lon");
    const txtDist = document.getElementById("tourist-distance");

    const CENTER_KOLWEZI_LAT = -10.7167;
    const CENTER_KOLWEZI_LON = 25.4667;

    btnGps?.addEventListener("click", () => {
        if (!navigator.geolocation) {
            alert("Hardware Alert: Geolocation tracking engine missing from local architecture.");
            return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const currentLat = pos.coords.latitude;
            const currentLon = pos.coords.longitude;

            if (txtLat) txtLat.textContent = currentLat.toFixed(4);
            if (txtLon) txtLon.textContent = currentLon.toFixed(4);

            const EARTH_RADIUS_KM = 6371; 
            const deltaLatRad = (currentLat - CENTER_KOLWEZI_LAT) * Math.PI / 180;
            const deltaLonRad = (currentLon - CENTER_KOLWEZI_LON) * Math.PI / 180;
            
            const arcEquation = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                                Math.cos(CENTER_KOLWEZI_LAT * Math.PI / 180) * Math.cos(currentLat * Math.PI / 180) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
            
            const angularDistance = 2 * Math.atan2(Math.sqrt(arcEquation), Math.sqrt(1 - arcEquation));
            const totalKilometers = EARTH_RADIUS_KM * angularDistance;

            if (txtDist) {
                if (totalKilometers < 5) {
                    txtDist.innerHTML = `📍 Status: You are successfully located within the Kolwezi Urban Core.`;
                } else {
                    txtDist.innerHTML = `🚗 Vector: You are currently approximately <strong>${totalKilometers.toFixed(1)} km</strong> from Kolwezi Center.`;
                }
            }
            gpsBox?.classList.remove("d-none");
        }, () => {
            alert("Telemetry Error: Unable to extract location coordinates.");
        });
    });
});