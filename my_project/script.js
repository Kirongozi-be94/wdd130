let secondes = 0;
let chrono = null; // Cette variable va stocker notre minuteur
let enCours = false; // Permet de savoir si le chrono tourne ou est en pause

// Sélection des éléments HTML
const affichage = document.getElementById("affichage");
const btnPausePlay = document.getElementById("btn-plus");  // On recycle le bouton "Plus"
const btnReset = document.getElementById("btn-moins");    // On recycle le bouton "Moins"

// On change le texte des boutons pour que ce soit plus clair
btnPausePlay.textContent = "Démarrer";
btnReset.textContent = "Reset";

// 1. Fonction qui fait avancer le chrono
function lancerChrono() {
    chrono = setInterval(function() {
        secondes = secondes + 1;
        affichage.textContent = secondes;
    }, 1000);
}

// 2. Gestion du bouton Démarrer / Pause
btnPausePlay.addEventListener("click", function() {
    if (enCours === false) {
        // Si le chrono est arrêté, on le lance
        lancerChrono();
        btnPausePlay.textContent = "Pause";
        enCours = true;
    } else {
        // S'il tourne, on l'arrête (on efface le setInterval)
        clearInterval(chrono);
        btnPausePlay.textContent = "Reprendre";
        enCours = false;
    }
});

// 3. Gestion du bouton Reset
btnReset.addEventListener("click", function() {
    clearInterval(chrono); // On arrête le compte à rebours
    secondes = 0;          // On remet le compteur à zéro
    affichage.textContent = secondes; // On met à jour l'écran
    btnPausePlay.textContent = "Démarrer";
    enCours = false;
});