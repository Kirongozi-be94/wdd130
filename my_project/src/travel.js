import { AuthService } from './auth.js';
import { CITIES_DATABASE, TRANSPORT_SPEEDS, CONFIG, TRANSLATIONS } from './config.js';
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

    Object.keys(CITIES_DATABASE).forEach(key => {
        selectStart.options[selectStart.options.length] = new Option(CITIES_DATABASE[key].name, key);
        selectEnd.options[selectEnd.options.length] = new Option(CITIES_DATABASE[key].name, key);
    });

    function appliquerLangue(lang) {
        localStorage.setItem("langueSelectionnee", lang);
        document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
        document.getElementById("btn-en")?.classList.toggle("active", lang === "en");

        const t = TRANSLATIONS[lang];
        if (document.getElementById("link-retour-hub-travel")) document.getElementById("link-retour-hub-travel").textContent = t.retourHub;
        if (document.getElementById("txt-titre-capteurs")) document.getElementById("txt-titre-capteurs").textContent = t.titreCapteurs;
        if (btnGps) btnGps.textContent = t.btnGps;
        if (document.getElementById("txt-pos-geodesique")) document.getElementById("txt-pos-geodesique").textContent = t.posGeodesique;
        if (btnBoussole) btnBoussole.textContent = t.btnBoussole;
        if (document.getElementById("txt-titre-travel")) document.getElementById("txt-titre-travel").textContent = t.titreTravel;
        if (document.getElementById("lbl-choice-route")) document.getElementById("lbl-choice-route").textContent = t.lblChoice;
        if (document.getElementById("opt-choice-1")) document.getElementById("opt-choice-1").textContent = t.optChoice1;
        if (document.getElementById("opt-choice-2")) document.getElementById("opt-choice-2").textContent = t.optChoice2;
        if (document.getElementById("lbl-depart")) document.getElementById("lbl-depart").textContent = t.lblDepart;
        if (document.getElementById("lbl-arrivee")) document.getElementById("lbl-arrivee").textContent = t.lblArrivee;
        if (document.getElementById("lbl-etat-route")) document.getElementById("lbl-etat-route").textContent = t.lblEtatRoute;
        if (document.getElementById("opt-road-1")) document.getElementById("opt-road-1").textContent = t.optRoad1;
        if (document.getElementById("opt-road-2")) document.getElementById("opt-road-2").textContent = t.optRoad2;
        if (document.getElementById("opt-road-3")) document.getElementById("opt-road-3").textContent = t.optRoad3;
        if (document.getElementById("lbl-transport")) document.getElementById("lbl-transport").textContent = t.lblTransport;
        if (document.getElementById("opt-trans-1")) document.getElementById("opt-trans-1").textContent = t.optTrans1;
        if (document.getElementById("opt-trans-2")) document.getElementById("opt-trans-2").textContent = t.optTrans2;
        if (document.getElementById("opt-trans-3")) document.getElementById("opt-trans-3").textContent = t.optTrans3;
        if (btnCalculer) btnCalculer.textContent = t.btnCalculer;
    }

    document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
    document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

    selectChoice?.addEventListener("change", function() {
        if (this.value === "2") { selectStart.value = "kinshasa"; selectStart.disabled = true; } 
        else { selectStart.disabled = false; }
    });

    selectRoad?.addEventListener("change", function() {
        if (this.value === "bad") {
            alert(localStorage.getItem("langueSelectionnee") === "en" ? "⚠️ Infrastructure Warning: Bad roads. Routing changed to plane." : "⚠️ Alerte infrastructure : Route critique. Changement automatique pour l'option aérienne.");
            if(selectTransport) selectTransport.value = "plane";
        }
    });

    btnGps?.addEventListener("click", () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude, lon = pos.coords.longitude;
            document.getElementById("gps-lat").textContent = lat.toFixed(4);
            document.getElementById("gps-lon").textContent = lon.toFixed(4);
            document.getElementById("affichage-gps").classList.remove("d-none");
            
            let proche = "", minD = Infinity;
            Object.keys(CITIES_DATABASE).forEach(v => {
                let d = Math.sqrt((CITIES_DATABASE[v].coords[0]-lat)**2 + (CITIES_DATABASE[v].coords[1]-lon)**2) * 111;
                if(d < minD) { minD = d; proche = v; }
            });
            document.getElementById("gps-ville-proche").innerHTML = `📍 Station : <strong>${CITIES_DATABASE[proche].name}</strong> (~ ${minD.toFixed(0)} km)`;
            if(selectStart) selectStart.value = proche;
        });
    });

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
            if(deg !== null && deg !== undefined) {
                document.getElementById("boussole-degres").textContent = `${Math.round(deg)}°`;
                document.getElementById("boussole-disque").style.transform = `rotate(${-deg}deg)`;
            }
        });
    }

    btnCalculer?.addEventListener("click", () => {
        const v1 = selectStart.value, v2 = selectEnd.value, r = selectRoad.value, t = selectTransport.value;
        if (v1 === v2) return;
        
        const c1 = CITIES_DATABASE[v1].coords, c2 = CITIES_DATABASE[v2].coords;
        const dLat = (c2[0] - c1[0]) * Math.PI / 180, dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180) * Math.cos(c2[0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = CONFIG.RAYON_TERRE_KM * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        const temps = dist / TRANSPORT_SPEEDS[t][r];

        if(resultatVoyage) {
            resultatVoyage.innerHTML = `📏 <strong>Distance :</strong> ${dist.toFixed(2)} km<br>⏳ <strong>Vecteur :</strong> ${temps.toFixed(1)} hrs (${t})`;
            resultatVoyage.classList.remove("d-none");
        }
    });

    appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr");
});