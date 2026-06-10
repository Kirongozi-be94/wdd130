import { TRANSLATIONS } from './config.js';

function appliquerLangue(lang) {
    localStorage.setItem("langueSelectionnee", lang);
    document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
    document.getElementById("btn-en")?.classList.toggle("active", lang === "en");
    
    const t = TRANSLATIONS[lang];
    if (document.getElementById("link-retour-hub")) document.getElementById("link-retour-hub").textContent = t.retourHub;
    if (document.getElementById("txt-titre-chrono")) document.getElementById("txt-titre-chrono").textContent = t.titreChrono;
    if (document.getElementById("txt-titre-agenda")) document.getElementById("txt-titre-agenda").textContent = t.titreAgenda;
    if (document.getElementById("btn-add-agenda")) document.getElementById("btn-add-agenda").textContent = t.btnAddAgenda;
    
    const btnToggleAgenda = document.getElementById("btn-toggle-agenda");
    const zoneListePrivee = document.getElementById("zone-liste-privee");
    if (btnToggleAgenda && zoneListePrivee) {
        btnToggleAgenda.textContent = zoneListePrivee.classList.contains("d-none") ? t.btnToggleAgendaShow : t.btnToggleAgendaHide;
    }
}

document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr");