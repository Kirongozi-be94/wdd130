/**
 * @file chrono.js
 * @description Gestion du Chronomètre et de l'Agenda (Entièrement sécurisé, sans PIN)
 */

import { AuthService } from './auth.js';
import { TRANSLATIONS } from './config.js';

// Vérification de sécurité obligatoire avant de charger la page
AuthService.requireAuth();

document.addEventListener("DOMContentLoaded", () => {
    // --- VARIABLES DU CHRONOMÈTRE ---
    let millisecondes = 0, intervalRef = null, enCours = false;
    const affichage = document.getElementById("affichage");
    const btnPausePlay = document.getElementById("btn-plus");
    const btnReset = document.getElementById("btn-moins");

    // --- VARIABLES DE L'AGENDA ---
    const formRdv = document.getElementById("form-rdv");
    const titreRdvInput = document.getElementById("titre-rdv");
    const dateRdvInput = document.getElementById("date-rdv");
    const listElementsRdv = document.getElementById("liste-rdv");
    const zoneListePrivee = document.getElementById("zone-liste-privee");
    const btnToggleAgenda = document.getElementById("btn-toggle-agenda");

    // Récupération des données sauvegardées
    let rdvStorage = [];
    try {
        rdvStorage = JSON.parse(localStorage.getItem("mesRendezVous")) || [];
    } catch (e) {
        rdvStorage = [];
    }

    // --- FONCTION DE TRADUCTION ---
    function appliquerLangue(lang) {
        localStorage.setItem("langueSelectionnee", lang);
        document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
        document.getElementById("btn-en")?.classList.toggle("active", lang === "en");
        
        const t = TRANSLATIONS[lang];
        if (!t) return;

        if (document.getElementById("link-retour-hub")) document.getElementById("link-retour-hub").textContent = t.retourHub;
        if (document.getElementById("txt-titre-chrono")) document.getElementById("txt-titre-chrono").textContent = t.titreChrono;
        if (document.getElementById("txt-titre-agenda")) document.getElementById("txt-titre-agenda").textContent = t.titreAgenda;
        if (document.getElementById("btn-add-agenda")) document.getElementById("btn-add-agenda").textContent = t.btnAddAgenda;
        
        if (btnToggleAgenda && zoneListePrivee) {
            btnToggleAgenda.textContent = zoneListePrivee.classList.contains("d-none") ? t.btnToggleAgendaShow : t.btnToggleAgendaHide;
        }
    }

    document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
    document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

    // --- LOGIQUE DU CHRONOMÈTRE ---
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

    // --- LOGIQUE DE L'AGENDA (CORRIGÉE) ---
    formRdv?.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Vérification que les champs de saisie existent et ont une valeur
        if (titreRdvInput && dateRdvInput) {
            const nouveauRdv = {
                id: Date.now(),
                titre: titreRdvInput.value,
                date: dateRdvInput.value
            };
            
            rdvStorage.push(nouveauRdv);
            localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage)); 
            
            // Forcer l'affichage de la zone pour voir immédiatement le rendez-vous ajouté
            if (zoneListePrivee) zoneListePrivee.classList.remove("d-none");
            
            renderAgenda(); 
            formRdv.reset();
        }
    });

    btnToggleAgenda?.addEventListener("click", () => {
        if (!zoneListePrivee) return;
        
        const estCache = zoneListePrivee.classList.contains("d-none");
        const currentLang = localStorage.getItem("langueSelectionnee") || "fr";
        
        if (estCache) {
            zoneListePrivee.classList.remove("d-none"); 
            if (btnToggleAgenda) btnToggleAgenda.textContent = TRANSLATIONS[currentLang].btnToggleAgendaHide; 
        } else { 
            zoneListePrivee.classList.add("d-none"); 
            if (btnToggleAgenda) btnToggleAgenda.textContent = TRANSLATIONS[currentLang].btnToggleAgendaShow; 
        }
    });

    function renderAgenda() {
        if (!listElementsRdv) return; 
        listElementsRdv.innerHTML = "";
        
        if (rdvStorage.length === 0) {
            const liVide = document.createElement("li");
            liVide.style.fontStyle = "italic";
            liVide.style.color = "#888";
            liVide.textContent = localStorage.getItem("langueSelectionnee") === "en" ? "No appointments scheduled" : "Aucun rendez-vous planifié";
            listElementsRdv.appendChild(liVide);
            return;
        }

        rdvStorage.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(rdv => {
            const li = document.createElement("li"); 
            li.style.display = "flex";
            li.style.justifyContent = "between";
            li.style.alignItems = "center";
            li.style.marginHeight = "8px";
            
            // Formatage de la date lisible
            const dateOption = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
            const dateAffichage = new Date(rdv.date).toLocaleString(localStorage.getItem("langueSelectionnee") === "en" ? "en-US" : "fr-FR", dateOption);

            li.innerHTML = `<span style="flex-grow: 1;">📅 <strong>${rdv.titre}</strong> - <small>${dateAffichage}</small></span>`;
            
            const btnSup = document.createElement("span"); 
            btnSup.textContent = "❌"; 
            btnSup.style.cursor = "pointer";
            btnSup.style.marginLeft = "10px";
            btnSup.onclick = () => { 
                if(confirm(localStorage.getItem("langueSelectionnee") === "en" ? "Delete this appointment?" : "Supprimer ce rendez-vous ?")) { 
                    rdvStorage = rdvStorage.filter(i => i.id !== rdv.id); 
                    localStorage.setItem("mesRendezVous", JSON.stringify(rdvStorage)); 
                    renderAgenda(); 
                } 
            };
            li.appendChild(btnSup); 
            listElementsRdv.appendChild(li);
        });
        
        // Mettre à jour le texte du bouton principal après le rendu
        const currentLang = localStorage.getItem("langueSelectionnee") || "fr";
        if (btnToggleAgenda && zoneListePrivee) {
            btnToggleAgenda.textContent = zoneListePrivee.classList.contains("d-none") ? TRANSLATIONS[currentLang].btnToggleAgendaShow : TRANSLATIONS[currentLang].btnToggleAgendaHide;
        }
    }

    // --- INITIALISATION AUTOMATIQUE ---
    appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr"); 
    renderAgenda();
});