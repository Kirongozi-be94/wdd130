import { TRANSLATIONS } from './config.js';

function appliquerLangue(lang) {
    localStorage.setItem("langueSelectionnee", lang);
    document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
    document.getElementById("btn-en")?.classList.toggle("active", lang === "en");

    const t = TRANSLATIONS[lang];
    if (document.getElementById("txt-titre-login")) document.getElementById("txt-titre-login").textContent = t.titreLogin;
    if (document.getElementById("lbl-pin-secret")) document.getElementById("lbl-pin-secret").textContent = t.lblPin;
    if (document.getElementById("btn-submit-login")) document.getElementById("btn-submit-login").textContent = t.btnSubmitLogin;
    if (document.getElementById("link-chrono")) document.getElementById("link-chrono").textContent = t.btnChronoLink;
    if (document.getElementById("link-travel")) document.getElementById("link-travel").textContent = t.btnTravelLink;
    if (document.getElementById("btn-deconnexion")) document.getElementById("btn-deconnexion").textContent = t.btnLogout;
}

// Écouteurs pour les boutons de drapeaux
document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

// Exécuter à l'initialisation de la page
appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr");