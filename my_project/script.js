if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker configuré."))
    .catch(err => console.error("Erreur Service Worker :", err));
}

// ==========================================
// DICTIONNAIRE DE TRADUCTION
// ==========================================
const traductions = {
    fr: {
        titreChrono: "Chronomètre",
        titreAgenda: "Rappel de Rendez-vous",
        placeholderObjet: "Objet du rendez-vous",
        btnAjouter: "Ajouter à l'agenda",
        btnDemarrer: "Démarrer",
        btnPause: "Pause",
        btnReprendre: "Reprendre",
        alerteRappel: "🔔 RAPPEL :",
        langueCode: "fr-FR"
    },
    en: {
        titreChrono: "Stopwatch",
        titreAgenda: "Appointment Reminder",
        placeholderObjet: "Appointment subject",
        btnAjouter: "Add to agenda",
        btnDemarrer: "Start",
        btnPause: "Pause",
        btnReprendre: "Resume",
        alerteRappel: "🔔 REMINDER:",
        langueCode: "en-US"
    }
};

let langueActuelle = "fr"; // Langue par défaut

// ==========================================
// GLOBALS & SÉLECTEURS
// ==========================================
let millisecondes = 0; 
let chrono = null; 
let enCours = false; 

const sonAlarme = new Audio('alarme.mp3');
const horlogeElement = document.getElementById("horloge-temps-reel");
const affichage = document.getElementById("affichage");
const btnPausePlay = document.getElementById("btn-plus"); 
const btnReset = document.getElementById("btn-moins"); 

const formRdv = document.getElementById("form-rdv");
const inputTitre = document.getElementById("titre-rdv");
const inputDate = document.getElementById("date-rdv");
const listElementsRdv = document.getElementById("liste-rdv");

// Sélecteurs pour la traduction
const txtTitreChrono = document.getElementById("txt-titre-chrono");
const txtTitreAgenda = document.getElementById("txt-titre-agenda");
const btnValiderAgenda = document.getElementById("btn-valider-agenda");
const btnFr = document.getElementById("btn-fr");
const btnEn = document.getElementById("btn-en");

let rendezVousTableau = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

// Initialisation au démarrage
changerLangue("fr");
setInterval(afficherDateEtHeureDuJour, 1000);
mettreAJourAffichageChrono();

// ==========================================
// GESTION DU CHANGEMENT DE LANGUE
// ==========================================
function changerLangue(langue) {
    langueActuelle = langue;
    const t = traductions[langue];

    // Traduction des textes fixes
    txtTitreChrono.textContent = t.titreChrono;
    txtTitreAgenda.textContent = t.titreAgenda;
    inputTitre.placeholder = t.placeholderObjet;
    btnValiderAgenda.textContent = t.btnAjouter;
    
    // Traduction du bouton Chrono selon son état
    if (!enCours && millisecondes === 0) {
        btnPausePlay.textContent = t.btnDemarrer;
    } else if (enCours) {
        btnPausePlay.textContent = t.btnPause;
    } else {
        btnPausePlay.textContent = t.btnReprendre;
    }

    // Activer le bon bouton visuellement
    if (langue === "fr") {
        btnFr.classList.add("active");
        btnEn.classList.remove("active");
    } else {
        btnEn.classList.add("active");
        btnFr.classList.remove("active");
    }

    // Rafraîchir la date et l'agenda avec le nouveau format de langue
    afficherDateEtHeureDuJour();
    rendreAgenda();
}

btnFr.addEventListener("click", () => changerLangue("fr"));
btnEn.addEventListener("click", () => changerLangue("en"));

// ==========================================
// 1. HORLOGE DU JOUR & ALARMES
// ==========================================
function afficherDateEtHeureDuJour() {
    const maintenant = new Date();
    const t = traductions[langueActuelle];
    
    // Utilise le code langue dynamic (fr-FR ou en-US)
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateLisible = maintenant.toLocaleDateString(t.langueCode, optionsDate);
    
    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const secondes = String(maintenant.getSeconds()).padStart(2, '0');
    
    horlogeElement.innerHTML = `📅 ${dateLisible} — 🕒 <strong>${heures}:${minutes}:${secondes}</strong>`;

    // Vérification alarme
    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
    const jour = String(maintenant.getDate()).padStart(2, '0');
    const minuteActuelleFormatee = `${annee}-${mois}-${jour}T${heures}:${minutes}`;

    if (secondes === "00") {
        rendezVousTableau.forEach(function(rdv) {
            const dateRdvObjet = new Date(rdv.date);
            const anneeR = dateRdvObjet.getFullYear();
            const moisR = String(dateRdvObjet.getMonth() + 1).padStart(2, '0');
            const jourR = String(dateRdvObjet.getDate()).padStart(2, '0');
            const heuresR = String(dateRdvObjet.getHours()).padStart(2, '0');
            const minutesR = String(dateRdvObjet.getMinutes()).padStart(2, '0');
            const dateRdvFormatee = `${anneeR}-${moisR}-${jourR}T${heuresR}:${minutesR}`;

            if (dateRdvFormatee === minuteActuelleFormatee) {
                sonAlarme.play();
                alert(`${t.alerteRappel} ${rdv.titre}`);
            }
        });
    }
}

// ==========================================
// 2. LOGIQUE DU CHRONOMÈTRE
// ==========================================
function formaterChiffre(nombre) {
    return nombre < 10 ? "0" + nombre : nombre;
}

function mettreAJourAffichageChrono() {
    let hrs = Math.floor(millisecondes / 360000);
    let min = Math.floor((millisecondes % 360000) / 6000);
    let sec = Math.floor((millisecondes % 6000) / 100);
    let tierces = millisecondes % 100;

    affichage.textContent = 
        formaterChiffre(hrs) + ":" + 
        formaterChiffre(min) + ":" + 
        formaterChiffre(sec) + ":" + 
        formaterChiffre(tierces);
}

function lancerChrono() {
    chrono = setInterval(function() {
        millisecondes++;
        mettreAJourAffichageChrono();
    }, 10);
}

btnPausePlay.addEventListener("click", function() {
    const t = traductions[langueActuelle];
    if (!enCours) {
        lancerChrono();
        btnPausePlay.textContent = t.btnPause;
        enCours = true;
    } else {
        clearInterval(chrono);
        btnPausePlay.textContent = t.btnReprendre;
        enCours = false;
    }
});

btnReset.addEventListener("click", function() {
    const t = traductions[langueActuelle];
    clearInterval(chrono);
    millisecondes = 0;
    mettreAJourAffichageChrono();
    btnPausePlay.textContent = t.btnDemarrer;
    enCours = false;
});

// ==========================================
// 3. LOGIQUE DE L'AGENDA (LocalStorage)
// ==========================================
formRdv.addEventListener("submit", function(evenement) {
    evenement.preventDefault();
    const nouveauRdv = {
        id: Date.now(),
        titre: inputTitre.value,
        date: inputDate.value
    };
    rendezVousTableau.push(nouveauRdv);
    sauvegarderDonnees();
    rendreAgenda();
    formRdv.reset();
});

function sauvegarderDonnees() {
    localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau));
}

function rendreAgenda() {
    listElementsRdv.innerHTML = ""; 
    const t = traductions[langueActuelle];
    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));

    rendezVousTableau.forEach(function(rdv) {
        const li = document.createElement("li");
        const dateObjet = new Date(rdv.date);
        
        // Formatage de la date de la liste selon la langue
        const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const dateLisible = dateObjet.toLocaleDateString(t.langueCode, options);

        li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${dateLisible}</span>`;

        const zoneActions = document.createElement("div");
        zoneActions.className = "actions";

        const btnModifier = document.createElement("span");
        btnModifier.textContent = "✏️";
        btnModifier.style.cursor = "pointer";
        btnModifier.addEventListener("click", function() {
            inputTitre.value = rdv.titre;
            const annee = dateObjet.getFullYear();
            const mois = String(dateObjet.getMonth() + 1).padStart(2, '0');
            const jour = String(dateObjet.getDate()).padStart(2, '0');
            const heures = String(dateObjet.getHours()).padStart(2, '0');
            const minutes = String(dateObjet.getMinutes()).padStart(2, '0');
            inputDate.value = `${annee}-${mois}-${jour}T${heures}:${minutes}`;

            rendezVousTableau = rendezVousTableau.filter(item => item.id !== rdv.id);
            sauvegarderDonnees();
            rendreAgenda();
        });

        const btnSuppr = document.createElement("span");
        btnSuppr.textContent = "❌";
        btnSuppr.style.cursor = "pointer";
        btnSuppr.addEventListener("click", function() {
            rendezVousTableau = rendezVousTableau.filter(item => item.id !== rdv.id);
            sauvegarderDonnees();
            rendreAgenda();
        });

        zoneActions.appendChild(btnModifier);
        zoneActions.appendChild(btnSuppr);
        li.appendChild(zoneActions);
        listElementsRdv.appendChild(li);
    });
}
