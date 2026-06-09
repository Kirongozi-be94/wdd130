// Enregistrement du Service Worker pour la PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker configuré."))
    .catch(err => console.error("Erreur Service Worker :", err));
}

// ==========================================
// GLOBALS & SÉLECTEURS
// ==========================================
let millisecondes = 0; 
let chrono = null; 
let enCours = false; 

// Chargement du fichier audio d'alarme
const sonAlarme = new Audio('alarme.mp3');

const horlogeElement = document.getElementById("horloge-temps-reel");
const affichage = document.getElementById("affichage");
const btnPausePlay = document.getElementById("btn-plus"); 
const btnReset = document.getElementById("btn-moins"); 

const formRdv = document.getElementById("form-rdv");
const inputTitre = document.getElementById("titre-rdv");
const inputDate = document.getElementById("date-rdv");
const listElementsRdv = document.getElementById("liste-rdv");

// Base de données locale (LocalStorage)
let rendezVousTableau = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

// Initialisation au démarrage
afficherDateEtHeureDuJour(); 
setInterval(afficherDateEtHeureDuJour, 1000); // Horloge + Vérification des alarmes chaque seconde

mettreAJourAffichageChrono();
rendreAgenda();

// ==========================================
// 1. HORLOGE DU JOUR & VÉRIFICATION DES ALARMES
// ==========================================
function afficherDateEtHeureDuJour() {
    const maintenant = new Date();
    
    // Format standardisé français pour l'affichage
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateLisible = maintenant.toLocaleDateString('fr-FR', optionsDate);
    
    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const secondes = String(maintenant.getSeconds()).padStart(2, '0');
    
    horlogeElement.innerHTML = `📅 ${dateLisible} — 🕒 <strong>${heures}:${minutes}:${secondes}</strong>`;

    // --- LOGIQUE DE L'ALARME ---
    // On crée une chaîne de caractères à la minute près (ex: "2026-06-09T16:30")
    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
    const jour = String(maintenant.getDate()).padStart(2, '0');
    const minuteActuelleFormatee = `${annee}-${mois}-${jour}T${heures}:${minutes}`;

    // Si on est à la seconde "00", on vérifie s'il y a un RDV maintenant
    if (secondes === "00") {
        rendezVousTableau.forEach(function(rdv) {
            // Convertir la date du RDV stockée au même format de chaîne pour comparer
            const dateRdvObjet = new Date(rdv.date);
            const anneeR = dateRdvObjet.getFullYear();
            const moisR = String(dateRdvObjet.getMonth() + 1).padStart(2, '0');
            const jourR = String(dateRdvObjet.getDate()).padStart(2, '0');
            const heuresR = String(dateRdvObjet.getHours()).padStart(2, '0');
            const minutesR = String(dateRdvObjet.getMinutes()).padStart(2, '0');
            const dateRdvFormatee = `${anneeR}-${moisR}-${jourR}T${heuresR}:${minutesR}`;

            if (dateRdvFormatee === minuteActuelleFormatee) {
                sonAlarme.play(); // Déclenche le son !
                alert(`🔔 RAPPEL : ${rdv.titre}`); // Alerte visuelle à l'écran
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
    if (!enCours) {
        lancerChrono();
        btnPausePlay.textContent = "Pause";
        enCours = true;
    } else {
        clearInterval(chrono);
        btnPausePlay.textContent = "Reprendre";
        enCours = false;
    }
});

btnReset.addEventListener("click", function() {
    clearInterval(chrono);
    millisecondes = 0;
    mettreAJourAffichageChrono();
    btnPausePlay.textContent = "Démarrer";
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
        date: inputDate.value // Stockage direct de la chaîne brute saisie par l'input
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

    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));

    rendezVousTableau.forEach(function(rdv) {
        const li = document.createElement("li");
        const dateObjet = new Date(rdv.date);
        
        const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const dateLisible = dateObjet.toLocaleDateString('fr-FR', options);

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
