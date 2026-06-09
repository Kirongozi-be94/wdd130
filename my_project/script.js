if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker Enregistré avec succès !"))
    .catch(err => console.log("Erreur d'enregistrement :", err));
}

// ==========================================
// 1. CONFIGURATION DU VRAI CHRONOMÈTRE
// ==========================================
let millisecondes = 0; 
let chrono = null; 
let enCours = false; 

const affichage = document.getElementById("affichage");
const btnPausePlay = document.getElementById("btn-plus"); 
const btnReset = document.getElementById("btn-moins"); 

// Recyclage visuel des boutons existants
btnPausePlay.textContent = "Démarrer";
btnReset.textContent = "Reset";

function formater(nombre) {
    return nombre < 10 ? "0" + nombre : nombre;
}

function mettreAJourAffichage() {
    let hrs = Math.floor(millisecondes / 360000);
    let min = Math.floor((millisecondes % 360000) / 6000);
    let sec = Math.floor((millisecondes % 6000) / 100);
    let tierces = millisecondes % 100;

    // On affiche sous le format Heures:Minutes:Secondes:Tierces
    affichage.textContent = 
        formater(hrs) + ":" + 
        formater(min) + ":" + 
        formater(sec) + ":" + 
        formater(tierces);
}

function lancerChrono() {
    chrono = setInterval(function() {
        millisecondes++;
        mettreAJourAffichage();
    }, 10); // 10 ms = 1 tierce (centième de seconde)
}

btnPausePlay.addEventListener("click", function() {
    if (enCours === false) {
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
    mettreAJourAffichage();
    btnPausePlay.textContent = "Démarrer";
    enCours = false;
});


// ==========================================
// 2. CRÉATION DYNAMIQUE DE L'AGENDA (HTML Interdit)
// ==========================================

// On récupère la carte existante pour se positionner
const card = document.querySelector(".card");

// Création du conteneur principal de l'agenda
const agendaContainer = document.createElement("div");
agendaContainer.style.marginTop = "30px";
agendaContainer.style.borderTop = "1px solid #ccc";
agendaContainer.style.paddingTop = "20px";

// Création du titre
const titreAgenda = document.createElement("h3");
titreAgenda.textContent = "Rappel de Rendez-vous";
agendaContainer.appendChild(titreAgenda);

// Création du formulaire
const formRdv = document.createElement("form");
formRdv.style.display = "flex";
formRdv.style.flexDirection = "column";
formRdv.style.gap = "10px";

// Champ Texte pour le titre du RDV
const inputTitre = document.createElement("input");
inputTitre.type = "text";
inputTitre.placeholder = "Objet du rendez-vous";
inputTitre.required = true;
inputTitre.style.padding = "8px";

// Champ Date et Heure
const inputDate = document.createElement("input");
inputDate.type = "datetime-local";
inputDate.required = true;
inputDate.style.padding = "8px";

// Bouton d'ajout
const btnAjouter = document.createElement("button");
btnAjouter.type = "submit";
btnAjouter.textContent = "Ajouter à l'agenda";
btnAjouter.style.padding = "8px";
btnAjouter.style.cursor = "pointer";

// Zone pour la liste des rendez-vous
const listeRdv = document.createElement("ul");
listeRdv.style.listStyle = "none";
listeRdv.style.padding = "0";
listeRdv.style.marginTop = "15px";
listeRdv.style.textAlign = "left";

// Assemblage du formulaire
formRdv.appendChild(inputTitre);
formRdv.appendChild(inputDate);
formRdv.appendChild(btnAjouter);

// Assemblage global dans la carte
agendaContainer.appendChild(formRdv);
agendaContainer.appendChild(listeRdv);
card.appendChild(agendaContainer); // On injecte le tout au bas de la classe .card


// ==========================================
// 3. LOGIQUE DE L'AGENDA AVEC SAUVEGARDE
// ==========================================

// CHARGEMENT AUTOMATIQUE : On récupère les données enregistrées ou un tableau vide
let rendezVousTableau = JSON.parse(localStorage.getItem("mesRendezVous")) || [];
rendreAgenda(); // Affiche directement les rendez-vous existants au chargement

formRdv.addEventListener("submit", function(evenement) {
    evenement.preventDefault();

    const nouveauRdv = {
        id: Date.now(),
        titre: inputTitre.value,
        date: new Date(inputDate.value)
    };

    rendezVousTableau.push(nouveauRdv);
    sauvegarderDonnees(); // Enregistrement
    rendreAgenda();
    formRdv.reset();
});

// Fonction pour sauvegarder dans le stockage local du navigateur
function sauvegarderDonnees() {
    localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau));
}

function rendreAgenda() {
    listeRdv.innerHTML = ""; // Nettoyage de la liste

    // Tri par ordre chronologique
    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));

    rendezVousTableau.forEach(function(rdv) {
        const li = document.createElement("li");
        li.style.padding = "8px";
        li.style.borderBottom = "1px dashed #eee";
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        
        // Sécurité pour s'assurer que la date redevienne un objet Date après chargement du stockage
        const dateObjet = new Date(rdv.date);

        const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const dateLisible = dateObjet.toLocaleDateString('fr-FR', options);

        const texteContenu = document.createElement("span");
        texteContenu.innerHTML = `📅 <strong>${rdv.titre}</strong> - ${dateLisible}`;
        li.appendChild(texteContenu);

        // Conteneur pour nos boutons d'actions (Modifier et Supprimer)
        const zoneActions = document.createElement("div");

        // 1. Bouton MODIFIER (✏️)
        const btnModifier = document.createElement("span");
        btnModifier.textContent = " ✏️ ";
        btnModifier.style.cursor = "pointer";
        btnModifier.style.marginRight = "15px";

        btnModifier.addEventListener("click", function() {
            // Remonter les informations actuelles dans le formulaire
            inputTitre.value = rdv.titre;
            
            // Formatage spécial nécessaire pour réinjecter la date dans l'input HTML
            const annee = dateObjet.getFullYear();
            const mois = String(dateObjet.getMonth() + 1).padStart(2, '0');
            const jour = String(dateObjet.getDate()).padStart(2, '0');
            const heures = String(dateObjet.getHours()).padStart(2, '0');
            const minutes = String(dateObjet.getMinutes()).padStart(2, '0');
            inputDate.value = `${annee}-${mois}-${jour}T${heures}:${minutes}`;

            // Enlever ce rendez-vous du tableau le temps de la modification
            rendezVousTableau = rendezVousTableau.filter(item => item.id !== rdv.id);
            
            sauvegarderDonnees();
            rendreAgenda();
        });

        // 2. Bouton SUPPRIMER (❌)
        const btnSuppr = document.createElement("span");
        btnSuppr.textContent = "❌";
        btnSuppr.style.cursor = "pointer";
        btnSuppr.addEventListener("click", function() {
            rendezVousTableau = rendezVousTableau.filter(item => item.id !== rdv.id);
            sauvegarderDonnees(); // Enregistrer après suppression
            rendreAgenda();
        });

        // Assemblage final des boutons d'action
        zoneActions.appendChild(btnModifier);
        zoneActions.appendChild(btnSuppr);
        
        li.appendChild(zoneActions);
        listeRdv.appendChild(li);
    });
}