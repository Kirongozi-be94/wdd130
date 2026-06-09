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

// Sélection de la zone de l'horloge ajoutée dans le HTML
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
setInterval(afficherDateEtHeureDuJour, 1000); // Relance la fonction toutes les secondes (1000ms)

mettreAJourAffichageChrono();
rendreAgenda();

// ==========================================
// 1. LOGIQUE DE L'HORLOGE DU JOUR
// ==========================================
function afficherDateEtHeureDuJour() {
    const maintenant = new Date();
    
    // Format standardisé français pour le jour et la date
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateLisible = maintenant.toLocaleDateString('fr-FR', optionsDate);
    
    // Extraction et formatage des heures, minutes et secondes
    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const secondes = String(maintenant.getSeconds()).padStart(2, '0');
    
    // Remplacement du contenu HTML de la zone dédiée
    horlogeElement.innerHTML = `📅 ${dateLisible} — 🕒 <strong>${heures}:${minutes}:${secondes}</strong>`;
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
        date: new Date(inputDate.value)
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
    listElementsRdv.innerHTML = ""; // Nettoyage de l'affichage précédent

    // Tri par ordre chronologique
    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));

    rendezVousTableau.forEach(function(rdv) {
        const li = document.createElement("li");
        const dateObjet = new Date(rdv.date);
        
        const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const dateLisible = dateObjet.toLocaleDateString('fr-FR', options);

        li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${dateLisible}</span>`;

        // Div conteneur pour regrouper les icônes d'action
        const zoneActions = document.createElement("div");
        zoneActions.className = "actions";

        // Action Modifier ✏️
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

        // Action Supprimer ❌
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
