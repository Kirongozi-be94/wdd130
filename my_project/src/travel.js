import { AuthService } from './auth.js';
import { CITIES_DATABASE, TRANSPORT_SPEEDS, CONFIG } from './config.js';
AuthService.requireAuth();

document.addEventListener("DOMContentLoaded", () => {
    const selectChoice = document.getElementById("travel-choice");
    const selectStart = document.getElementById("city-start");
    const selectEnd = document.getElementById("city-end");
    const selectRoad = document.getElementById("road-condition-select");
    const selectTransport = document.getElementById("transport-mode-select");
    const btnCalculer = document.getElementById("btn-calculer-voyage");
    const resultatVoyage = document.getElementById("resultat-voyage");
    const btnGps = document.getElementById("btn-gps");

    // Injection propre des données de configuration (DRY Architecture)
    Object.keys(CITIES_DATABASE).forEach(key => {
        selectStart.options[selectStart.options.length] = new Option(CITIES_DATABASE[key].name, key);
        selectEnd.options[selectEnd.options.length] = new Option(CITIES_DATABASE[key].name, key);
    });

    selectChoice?.addEventListener("change", function() {
        if (this.value === "2") { selectStart.value = "kinshasa"; selectStart.disabled = true; } 
        else { selectStart.disabled = false; }
    });

    selectRoad?.addEventListener("change", function() {
        if (this.value === "bad") {
            alert("⚠️ Alerte infrastructure : Route critique. Changement automatique pour l'option aérienne.");
            if(selectTransport) selectTransport.value = "plane";
        }
    });

    // Moteur GPS
    btnGps?.addEventListener("click", () => {
        if (!navigator.geolocation) return;
        btnGps.textContent = "Acquisition des satellites... ⏳";
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude, lon = pos.coords.longitude;
            document.getElementById("gps-lat").textContent = lat.toFixed(4);
            document.getElementById("gps-lon").textContent = lon.toFixed(4);
            document.getElementById("affichage-gps").classList.remove("d-none");
            btnGps.textContent = "Position synchronisée ✅";
            
            // Calcul matriciel de la ville la plus proche
            let proche = "", minD = Infinity;
            Object.keys(CITIES_DATABASE).forEach(v => {
                let d = Math.sqrt((CITIES_DATABASE[v].coords[0]-lat)**2 + (CITIES_DATABASE[v].coords[1]-lon)**2) * 111;
                if(d < minD) { minD = d; proche = v; }
            });
            document.getElementById("gps-ville-proche").innerHTML = `📍 Station la plus proche : <strong>${CITIES_DATABASE[proche].name}</strong> (à env. ${minD.toFixed(0)} km)`;
            if(selectStart) selectStart.value = proche;
        }, () => { btnGps.textContent = "Échec d'acquisition 🛰️"; });
    });

    // Moteur de calcul d'itinéraire (Formule d'Haversine simplifiée pour performances)
    btnCalculer?.addEventListener("click", () => {
        const v1 = selectStart.value, v2 = selectEnd.value, r = selectRoad.value, t = selectTransport.value;
        if (v1 === v2) { alert("Erreur : Points de départ et d'arrivée identiques."); return; }
        
        const c1 = CITIES_DATABASE[v1].coords, c2 = CITIES_DATABASE[v2].coords;
        const dLat = (c2[0] - c1[0]) * Math.PI / 180, dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180) * Math.cos(c2[0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = CONFIG.RAYON_TERRE_KM * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        const temps = dist / TRANSPORT_SPEEDS[t][r];

        if(resultatVoyage) {
            resultatVoyage.innerHTML = `
                📏 <strong>Distance géodésique :</strong> ${dist.toFixed(2)} km<br>
                ⏳ <strong>Temps d'acheminement :</strong> ${temps.toFixed(1)} heures en vecteur (${t})
            `;
            resultatVoyage.classList.remove("d-none");
        }
    });
});