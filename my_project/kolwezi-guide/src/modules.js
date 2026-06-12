/**
 * @file modules.js
 * @description Integrates Stopwatch metrics, Scheduled items database, and Congo Travel Planner calculations.
 */
import { AuthService } from './auth.js';

AuthService.requireAuth();

// STATIC SYSTEM STRUCTS
const CITIES_DATABASE = {
    "kinshasa": { name: "Kinshasa", coords: [-4.4419, 15.2663] },
    "lubumbashi": { name: "Lubumbashi", coords: [-11.6708, 27.4792] },
    "kolwezi": { name: "Kolwezi", coords: [-10.7167, 25.4667] },
    "kisangani": { name: "Kisangani", coords: [0.5167, 25.1833] },
    "goma": { name: "Goma", coords: [-1.6833, 29.2167] },
    "bukavu": { name: "Bukavu", coords: [-2.5, 28.3667] }
};

const TRANSPORT_SPEEDS = {
    car: { good: 80, average: 60, bad: 40 },
    plane: { good: 800, average: 800, bad: 800 },
    motorcycle: { good: 60, average: 40, bad: 20 }
};

document.addEventListener("DOMContentLoaded", () => {
    // --- PART A: CHRONOGRAPH ENGINE ---
    let millisecondes = 0, intervalRef = null, enCours = false;
    const affichage = document.getElementById("affichage");
    const btnPausePlay = document.getElementById("btn-plus");
    const btnReset = document.getElementById("btn-moins");

    btnPausePlay?.addEventListener("click", () => {
        if (!enCours) {
            intervalRef = setInterval(() => { 
                millisecondes++; 
                let hrs = Math.floor(millisecondes / 360000), 
                    min = Math.floor((millisecondes % 360000) / 6000), 
                    sec = Math.floor((millisecondes % 6000) / 100), 
                    t = millisecondes % 100; 
                if(affichage) affichage.textContent = `${String(hrs).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(t).padStart(2,'0')}`; 
            }, 10);
            btnPausePlay.textContent = "Pause"; 
            enCours = true;
        } else { 
            clearInterval(intervalRef); 
            btnPausePlay.textContent = "Resume"; 
            enCours = false; 
        }
    });

    btnReset?.addEventListener("click", () => { 
        clearInterval(intervalRef); 
        millisecondes = 0; 
        if(affichage) affichage.textContent = "00:00:00:00"; 
        if(btnPausePlay) btnPausePlay.textContent = "Start"; 
        enCours = false; 
    });

    // --- PART B: AGENDA MANAGEMENT ---
    const formRdv = document.getElementById("form-rdv");
    const titreRdvInput = document.getElementById("titre-rdv");
    const dateRdvInput = document.getElementById("date-rdv");
    const listElementsRdv = document.getElementById("liste-rdv");
    const zoneListePrivee = document.getElementById("zone-liste-privee");
    const btnToggleAgenda = document.getElementById("btn-toggle-agenda");

    let rdvStorage = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

    formRdv?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (titreRdvInput && dateRdvInput) {
            const nouveauRdv = { id: Date.now(), titre: titreRdvInput.value, date: dateRdvInput.value };
            rdvStorage.push(nouveauRdv);
            localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage)); 
            zoneListePrivee?.classList.remove("d-none");
            renderAgenda(); 
            formRdv.reset();
        }
    });

    btnToggleAgenda?.addEventListener("click", () => {
        if (!zoneListePrivee) return;
        const estCache = zoneListePrivee.classList.contains("d-none");
        if (estCache) {
            zoneListePrivee.classList.remove("d-none"); 
            btnToggleAgenda.textContent = "Hide Logged Schedules 🙈"; 
        } else { 
            zoneListePrivee.classList.add("d-none"); 
            btnToggleAgenda.textContent = "Show Logged Schedules 👁️"; 
        }
    });

    function renderAgenda() {
        if (!listElementsRdv) return; 
        listElementsRdv.innerHTML = "";
        
        if (rdvStorage.length === 0) {
            listElementsRdv.innerHTML = `<li style="font-style:italic; color:#888;">No scheduled items registered.</li>`;
            return;
        }

        rdvStorage.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(rdv => {
            const li = document.createElement("li"); 
            li.style.display = "flex"; li.style.justifyContent = "space-between"; li.style.margin = "8px 0";
            const dateAffichage = new Date(rdv.date).toLocaleString("en-US", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

            li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - <small>${dateAffichage}</small></span>`;
            
            const btnSup = document.createElement("span"); 
            btnSup.textContent = "❌"; btnSup.style.cursor = "pointer"; btnSup.style.marginLeft = "10px";
            btnSup.onclick = () => { 
                if(confirm("Permanently erase schedule record?")) { 
                    rdvStorage = rdvStorage.filter(i => i.id !== rdv.id); 
                    localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage)); 
                    renderAgenda(); 
                } 
            };
            li.appendChild(btnSup); 
            listElementsRdv.appendChild(li);
        });
    }
    renderAgenda();

    // --- PART C: CONGO TRAVEL METRIC EVALUATIONS ---
    const selectChoice = document.getElementById("travel-choice");
    const selectStart = document.getElementById("city-start");
    const selectEnd = document.getElementById("city-end");
    const selectRoad = document.getElementById("road-condition-select");
    const selectTransport = document.getElementById("transport-mode-select");
    const btnCalculer = document.getElementById("btn-calculer-voyage");
    const resultatVoyage = document.getElementById("resultat-voyage");

    if (selectStart && selectEnd) {
        Object.keys(CITIES_DATABASE).forEach(key => {
            selectStart.options[selectStart.options.length] = new Option(CITIES_DATABASE[key].name, key);
            selectEnd.options[selectEnd.options.length] = new Option(CITIES_DATABASE[key].name, key);
        });
        selectStart.value = "kolwezi";
        selectEnd.value = "lubumbashi";
    }

    selectChoice?.addEventListener("change", function() {
        if (this.value === "2" && selectStart) { selectStart.value = "kinshasa"; selectStart.disabled = true; } 
        else if (selectStart) { selectStart.disabled = false; }
    });

    selectRoad?.addEventListener("change", function() {
        if (this.value === "bad") {
            alert("⚠️ Logistics Warning: Degraded infrastructural route. System modified route deployment profile to Plane.");
            if(selectTransport) selectTransport.value = "plane";
        }
    });

    btnCalculer?.addEventListener("click", () => {
        if (!selectStart || !selectEnd || !selectRoad || !selectTransport || !resultatVoyage) return;
        const v1 = selectStart.value, v2 = selectEnd.value, r = selectRoad.value, t = selectTransport.value;
        if (v1 === v2) {
            resultatVoyage.textContent = "Error: Origins and destinations must match unique profiles.";
            resultatVoyage.classList.remove("d-none");
            return;
        }
        
        const c1 = CITIES_DATABASE[v1].coords, c2 = CITIES_DATABASE[v2].coords;
        const dLat = (c2[0] - c1[0]) * Math.PI / 180, dLon = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180) * Math.cos(c2[0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        const temps = dist / TRANSPORT_SPEEDS[t][r];

        resultatVoyage.innerHTML = `📏 <strong>Displacement Distance:</strong> ${dist.toFixed(2)} km<br>⏳ <strong>Estimated Transport Time Vector:</strong> ${temps.toFixed(1)} hrs (${t})`;
        resultatVoyage.classList.remove("d-none");
    });
});