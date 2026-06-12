/**
 * @file travel.js
 * @description Gestion des capteurs et du Congo Travel Planner (Traduction sécurisée)
 */
import { AuthService } from './auth.js';
import { CITIES_DATABASE, TRANSPORT_SPEEDS, CONFIG, TRANSLATIONS } from './config.js';

// Vérification de sécurité obligatoire avant de charger le module
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
    const btnBoussole = document.getElementById("btn-boussole");

    // Remplissage des sélecteurs de villes
    if (selectStart && selectEnd && selectStart.options.length === 0) {
        Object.keys(CITIES_DATABASE).forEach(key => {
            selectStart.options[selectStart.options.length] = new Option(CITIES_DATABASE[key].name, key);
            selectEnd.options[selectEnd.options.length] = new Option(CITIES_DATABASE[key].name, key);
        });
    }

    // --- FONCTION DE TRADUCTION SÉCURISÉE CORRIGÉE ---
    function appliquerLangue(lang) {
        localStorage.setItem("langueSelectionnee", lang);
        
        // Classes actives sur les boutons de drapeaux
        document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
        document.getElementById("btn-en")?.classList.toggle("active", lang === "en");

        const t = TRANSLATIONS[lang];
        if (!t) return;

        // Dictionnaire de traduction liant l'ID HTML à la clé dans config.js
        const elementsATraduire = {
            "link-retour-hub-travel": t.retourHub,
            "txt-titre-capteurs": t.titreCapteurs,
            "btn-gps": t.btnGps,
            "txt-pos-geodesique": t.posGeodesique,
            "btn-boussole": t.btnBoussole,
            "txt-titre-travel": t.titreTravel,
            "lbl-choice-route": t.lblChoice,
            "opt-choice-1": t.optChoice1,
            "opt-choice-2": t.optChoice2,
            "lbl-depart": t.lblDepart,
            "lbl-arrivee": t.lblArrivee,
            "lbl-etat-route": t.lblEtatRoute,
            "opt-road-1": t.optRoad1,
            "opt-road-2": t.optRoad2,
            "opt-road-3": t.optRoad3,
            "lbl-transport": t.lblTransport,
            "opt-trans-1": t.optTrans1,
            "opt-trans-2": t.optTrans2,
            "opt-trans-3": t.optTrans3,
            "btn-calculer-voyage": t.btnCalculer
        };

        // Application de la traduction élément par élément
        Object.keys(elementsATraduire).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = elementsATraduire[id];
            }
        });
    }

    // Écouteurs pour les boutons de langue
    document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
    document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

    // Gestion du choix de routage
    selectChoice?.addEventListener("change", function() {
        if (this.value === "2" && selectStart) { 
            selectStart.value = "kinshasa"; 
            selectStart.disabled = true; 
        } else if (selectStart) { 
            selectStart.disabled = false; 
        }
    });

    // Alerte sur l'état de la route
    selectRoad?.addEventListener("change", function() {
        if (this.value === "bad") {
            alert(localStorage.getItem("langueSelectionnee") === "en" ? "⚠️ Infrastructure Warning: Bad roads. Routing changed to plane." : "⚠️ Alerte infrastructure : Route critique. Changement automatique pour l'option aérienne.");
            if(selectTransport) selectTransport.value = "plane";
        }
    });

    // Gestion du GPS
    btnGps?.addEventListener("click", () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude, lon = pos.coords.longitude;
            const elLat = document.getElementById("gps-lat");
            const elLon = document.getElementById("gps-lon");
            if (elLat) elLat.textContent = lat.toFixed(4);
            if (elLon) elLon.textContent = lon.toFixed(4);
            document.getElementById("affichage-gps")?.classList.remove("d-none");
            
            let proche = "", minD = Infinity;
            Object.keys(CITIES_DATABASE).forEach(v => {
                let d = Math.sqrt((CITIES_DATABASE[v].coords[0]-lat)**2 + (CITIES_DATABASE[v].coords[1]-lon)**2) * 111;
                if(d < minD) { minD = d; proche = v; }
            });
            const elStation = document.getElementById("gps-ville-proche");
            if (elStation) elStation.innerHTML = `📍 Station : <strong>${CITIES_DATABASE[proche].name}</strong> (~ ${minD.toFixed(0)} km)`;
            if(selectStart) selectStart.value = proche;
        });
    });

    // Gestion de la boussole
    btnBoussole?.addEventListener("click", () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(state => { if (state === 'granted') écouterBoussole(); })
                .catch(console.error);
        } else {
            écouterBoussole();
        }
    });

    function écouterBoussole() {
        window.addEventListener("deviceorientation", (e) => {
            let deg = e.webkitCompassHeading || e.alpha;
            const elDeg = document.getElementById("boussole-degres");
            const elDisque = document.getElementById("boussole-disque");
            if(deg !== null && deg !== undefined) {
                if (elDeg) elDeg.textContent = `${Math.round(deg)}°`;
                if (elDisque) elDisque.style.transform = `rotate(${-deg}deg)`;
            }
        });
    }

    // Calcul de la cinématique de voyage
    btnCalculer?.addEventListener("click", () => {
        if (!selectStart || !selectEnd || !selectRoad || !selectTransport) return;
        const v1 = selectStart.value, v2 = selectEnd.value, r = selectRoad.value, t = selectTransport.value;
        if (v1 === v2) return;
        
        const c1 = CITIES_DATABASE[v1].coords, c2 = CITIES_DATABASE[v2].coords;
        const dLat = (c2[0] - c1[0]) * Math.PI / 180, dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180) * Math.cos(c2[0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = CONFIG.RAYON_TERRE_KM * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        const temps = dist / TRANSPORT_SPEEDS[t][r];

        if(resultatVoyage) {
            if (localStorage.getItem("langueSelectionnee") === "en") {
                resultatVoyage.innerHTML = `📏 <strong>Distance:</strong> ${dist.toFixed(2)} km<br>⏳ <strong>Vector:</strong> ${temps.toFixed(1)} hrs (${t})`;
            } else {
                resultatVoyage.innerHTML = `📏 <strong>Distance :</strong> ${dist.toFixed(2)} km<br>⏳ <strong>Vecteur :</strong> ${temps.toFixed(1)} hrs (${t})`;
            }
            resultatVoyage.classList.remove("d-none");
        }
    });

    // Initialisation immédiate de la langue enregistrée
    appliquerLangue(localStorage.getItem("langueSelectionnee") || "en");
});