import { TRANSLATIONS } from './config.js';

function appliquerLangue(lang) {
    localStorage.setItem("langueSelectionnee", lang);
    document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
    document.getElementById("btn-en")?.classList.toggle("active", lang === "en");

    const t = TRANSLATIONS[lang];
    if (document.getElementById("link-retour-hub-travel")) document.getElementById("link-retour-hub-travel").textContent = t.retourHub;
    if (document.getElementById("txt-titre-capteurs")) document.getElementById("txt-titre-capteurs").textContent = t.titreCapteurs;
    if (document.getElementById("btn-gps")) document.getElementById("btn-gps").textContent = t.btnGps;
    if (document.getElementById("txt-pos-geodesique")) document.getElementById("txt-pos-geodesique").textContent = t.posGeodesique;
    if (document.getElementById("btn-boussole")) document.getElementById("btn-boussole").textContent = t.btnBoussole;
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
    if (document.getElementById("btn-calculer-voyage")) document.getElementById("btn-calculer-voyage").textContent = t.btnCalculer;
}

document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr");