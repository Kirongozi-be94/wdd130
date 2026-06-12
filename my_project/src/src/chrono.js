/**
 * @file chrono.js
 * @description Gestion du Chronomètre et de l'Agenda (Sécurisé & Traduit)
 */

// 1. TOUT EN HAUT DU FICHIER : Les imports requis
import { AuthService } from './auth.js';
import { TRANSLATIONS } from './config.js';

// Vérification de sécurité obligatoire avant de charger le reste
AuthService.requireAuth();

document.addEventListener("DOMContentLoaded", () => {
    // 2. LES VARIABLES DU CHRONO ET DE L'AGENDA
    let millisecondes = 0, intervalRef = null, enCours = false;
    const affichage = document.getElementById("affichage");
    const btnPausePlay = document.getElementById("btn-plus");
    const btnReset = document.getElementById("btn-moins");
    const formRdv = document.getElementById("form-rdv");
    const listElementsRdv = document.getElementById("liste-rdv");
    const zoneListePrivee = document.getElementById("zone-liste-privee");
    const btnToggleAgenda = document.getElementById("btn-toggle-agenda");

    let rdvStorage = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

    // ==========================================================================
    // 3. ICI : LA FONCTION DE TRADUCTION EXACTE QUE TU AS DEMANDÉE
    // ==========================================================================
    function appliquerLangue(lang) {
        localStorage.setItem("langueSelectionnee", lang);
        document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
        document.getElementById("btn-en")?.classList.toggle("active", lang === "en");
        
        const t = TRANSLATIONS[lang];
        if (document.getElementById("link-retour-hub")) document.getElementById("link-retour-hub").textContent = t.retourHub;
        if (document.getElementById("txt-titre-chrono")) document.getElementById("txt-titre-chrono").textContent = t.titreChrono;
        if (document.getElementById("txt-titre-agenda")) document.getElementById("txt-titre-agenda").textContent = t.titreAgenda;
        if (document.getElementById("btn-add-agenda")) document.getElementById("btn-add-agenda").textContent = t.btnAddAgenda;
        
        if (btnToggleAgenda && zoneListePrivee) {
            btnToggleAgenda.textContent = zoneListePrivee.classList.contains("d-none") ? t.btnToggleAgendaShow : t.btnToggleAgendaHide;
        }
    }

    // Écouteurs de clics pour le changement dynamique de langue
    document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
    document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));
    // ==========================================================================

    // 4. LOGIQUE DU CHRONOMÈTRE
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
            btnPausePlay.textContent = localStorage.getItem("langueSelectionnee") === "en" ? "Resume" : "Reprendre"; 
            enCours = false; 
        }
    });

    btnReset?.addEventListener("click", () => { 
        clearInterval(intervalRef); 
        millisecondes = 0; 
        if(affichage) affichage.textContent = "00:00:00:00"; 
        if(btnPausePlay) btnPausePlay.textContent = localStorage.getItem("langueSelectionnee") === "en" ? "Start" : "Démarrer"; 
        enCours = false; 
    });

    // 5. GESTION DE L'AGENDA (AJOUT DE RENDEZ-VOUS)
    formRdv?.addEventListener("submit", (e) => {
        e.preventDefault();
        rdvStorage.push({ id: Date.now(), titre: document.getElementById("titre-rdv").value, date: document.getElementById("date-rdv").value });
        localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage)); 
        renderAgenda(); 
        formRdv.reset();
    });

    // 6. ACTION DU BOUTON (CORRIGÉE : Plus de blocage ! La liste s'affiche directement)
    btnToggleAgenda?.addEventListener("click", () => {
        const estCache = zoneListePrivee.classList.contains("d-none");
        const currentLang = localStorage.getItem("langueSelectionnee") || "fr";
        
        if (estCache) {
            // Débloqué : On affiche directement la zone sans forcer le prompt de code PIN
            zoneListePrivee.classList.remove("d-none"); 
            btnToggleAgenda.textContent = TRANSLATIONS[currentLang].btnToggleAgendaHide; 
        } else { 
            zoneListePrivee.classList.add("d-none"); 
            btnToggleAgenda.textContent = TRANSLATIONS[currentLang].btnToggleAgendaShow; 
        }
    });

    // 7. RENDU DE LA LISTE DES RENDEZ-VOUS A L'ÉCRAN
    function renderAgenda() {
        if (!listElementsRdv) return; 
        listElementsRdv.innerHTML = "";
        rdvStorage.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(rdv => {
            const li = document.createElement("li"); 
            li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${new Date(rdv.date).toLocaleString()}</span>`;
            
            const btnSup = document.createElement("span"); 
            btnSup.textContent = "❌"; 
            btnSup.style.cursor = "pointer";
            btnSup.onclick = () => { 
                if(confirm("Supprimer ce rendez-vous ?")) { 
                    rdvStorage = rdvStorage.filter(i => i.id !== rdv.id); 
                    localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage)); 
                    renderAgenda(); 
                } 
            };
            li.appendChild(btnSup); 
            listElementsRdv.appendChild(li);
        });
    }

    // 8. INITIALISATION AUTOMATIQUE DE LA LANGUE ET DE LA LISTE AU CHARGEMENT
    appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr"); 
    renderAgenda();
});