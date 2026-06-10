import { AuthService } from './auth.js';
AuthService.requireAuth();

document.addEventListener("DOMContentLoaded", () => {
    let millisecondes = 0, intervalRef = null, enCours = false;
    const sonAlarme = new Audio('alarme.mp3');
    const affichage = document.getElementById("affichage");
    const btnPausePlay = document.getElementById("btn-plus");
    const btnReset = document.getElementById("btn-moins");
    const formRdv = document.getElementById("form-rdv");
    const listElementsRdv = document.getElementById("liste-rdv");
    const zoneListePrivee = document.getElementById("zone-liste-privee");

    let rdvStorage = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

    // Background Daemon pour l'alarme
    setInterval(() => {
        const maintenant = new Date();
        const formatActuel = `${maintenant.getFullYear()}-${String(maintenant.getMonth() + 1).padStart(2, '0')}-${String(maintenant.getDate()).padStart(2, '0')}T${String(maintenant.getHours()).padStart(2, '0')}:${String(maintenant.getMinutes()).padStart(2, '0')}`;
        rdvStorage.forEach(rdv => {
            if (rdv.date === formatActuel && maintenant.getSeconds() === 0) {
                sonAlarme.play().catch(() => {});
                alert(`🔔 RAPPEL PRO : ${rdv.titre}`);
            }
        });
    }, 1000);

    btnPausePlay?.addEventListener("click", () => {
        if (!enCours) {
            intervalRef = setInterval(() => { millisecondes++; renderChrono(); }, 10);
            btnPausePlay.textContent = "Pause";
            enCours = true;
        } else {
            clearInterval(intervalRef);
            btnPausePlay.textContent = "Reprendre";
            enCours = false;
        }
    });

    btnReset?.addEventListener("click", () => {
        clearInterval(intervalRef);
        millisecondes = 0;
        renderChrono();
        if(btnPausePlay) btnPausePlay.textContent = "Démarrer";
        enCours = false;
    });

    function renderChrono() {
        let hrs = Math.floor(millisecondes / 360000), min = Math.floor((millisecondes % 360000) / 6000), sec = Math.floor((millisecondes % 6000) / 100), t = millisecondes % 100;
        if(affichage) affichage.textContent = `${String(hrs).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(t).padStart(2,'0')}`;
    }

    formRdv?.addEventListener("submit", (e) => {
        e.preventDefault();
        rdvStorage.push({ id: Date.now(), titre: document.getElementById("titre-rdv").value, date: document.getElementById("date-rdv").value });
        localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage));
        renderAgenda();
        formRdv.reset();
    });

    document.getElementById("btn-toggle-agenda")?.addEventListener("click", async function() {
        const estCache = zoneListePrivee.classList.contains("d-none");
        if (estCache) {
            const saisi = prompt("Entrez votre code PIN secret :");
            if (saisi === null) return;
            const accessGranted = await AuthService.verifyPIN(saisi);
            if (accessGranted) {
                zoneListePrivee.classList.remove("d-none");
                this.textContent = "Masquer les données 🙈";
            } else {
                alert("❌ Accès refusé : Code PIN incorrect.");
            }
        } else {
            zoneListePrivee.classList.add("d-none");
            this.textContent = "Afficher mes rendez-vous 👁️";
        }
    });

    function renderAgenda() {
        if (!listElementsRdv) return;
        listElementsRdv.innerHTML = "";
        rdvStorage.sort((a, b) => new Date(a.date) - new Date(b.date));
        rdvStorage.forEach(rdv => {
            const li = document.createElement("li");
            li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${new Date(rdv.date).toLocaleString('fr-FR')}</span>`;
            
            const btnSup = document.createElement("span");
            btnSup.textContent = "❌"; btnSup.style.cursor = "pointer";
            btnSup.onclick = () => {
                if(confirm("Supprimer ?")) {
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
});