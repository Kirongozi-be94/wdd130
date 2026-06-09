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
        titreLogin: "Créer votre profil",
        placeholderNom: "Votre nom complet",
        placeholderEmail: "Votre adresse email",
        btnAcceder: "Accéder à l'application",
        btnChangerProfil: "Changer de profil 🔄",
        titreChrono: "Chronomètre",
        titreAgenda: "Rappel de Rendez-vous",
        placeholderObjet: "Objet du rendez-vous",
        btnAjouter: "Ajouter à l'agenda",
        btnDemarrer: "Démarrer",
        btnPause: "Pause",
        btnReprendre: "Reprendre",
        alerteRappel: "🔔 RAPPEL :",
        bulleModifier: "Modifier",
        bulleSupprimer: "Supprimer",
        btnAfficher: "Afficher mes rendez-vous 👁️",
        btnMasquer: "Masquer mes rendez-vous 🙈",
        langueCode: "fr-FR"
    },
    en: {
        titreLogin: "Create your profile",
        placeholderNom: "Your full name",
        placeholderEmail: "Your email address",
        btnAcceder: "Access the application",
        btnChangerProfil: "Change profile 🔄",
        titreChrono: "Stopwatch",
        titreAgenda: "Appointment Reminder",
        placeholderObjet: "Appointment subject",
        btnAjouter: "Add to agenda",
        btnDemarrer: "Start",
        btnPause: "Pause",
        btnReprendre: "Resume",
        alerteRappel: "🔔 REMINDER:",
        bulleModifier: "Edit",
        bulleSupprimer: "Delete",
        btnAfficher: "Show my appointments 👁️",
        btnMasquer: "Hide my appointments 🙈",
        langueCode: "en-US"
    }
};

let langueActuelle = "fr"; 

// ==========================================
// SÉLECTEURS & GLOBALS
// ==========================================
let millisecondes = 0; 
let chrono = null; 
let enCours = false; 
let base64Avatar = ""; 

const sonAlarme = new Audio('alarme.mp3');
const horlogeElement = document.getElementById("horloge-temps-reel");
const affichage = document.getElementById("affichage");
const btnPausePlay = document.getElementById("btn-plus"); 
const btnReset = document.getElementById("btn-moins"); 

const formRdv = document.getElementById("form-rdv");
const inputTitre = document.getElementById("titre-rdv");
const inputDate = document.getElementById("date-rdv");
const listElementsRdv = document.getElementById("liste-rdv");

// Système Utilisateur & Profil
const zoneConnexion = document.getElementById("zone-connexion");
const zoneProfilActif = document.getElementById("zone-profil-actif");
const contenuApplication = document.getElementById("contenu-application");
const formLogin = document.getElementById("form-login");
const inputLoginNom = document.getElementById("login-nom");
const inputLoginEmail = document.getElementById("login-email");
const inputAvatar = document.getElementById("input-avatar");
const btnChooseFile = document.getElementById("btn-choose-file");
const avatarPreview = document.getElementById("avatar-preview");
const affichageAvatar = document.getElementById("affichage-avatar");
const affichageNom = document.getElementById("affichage-nom");
const affichageEmail = document.getElementById("affichage-email");
const btnDeconnexion = document.getElementById("btn-deconnexion");

// Éléments textuels traduisibles
const txtTitreLogin = document.getElementById("txt-titre-login");
const btnLogin = document.getElementById("btn-login");
const txtTitreChrono = document.getElementById("txt-titre-chrono");
const txtTitreAgenda = document.getElementById("txt-titre-agenda");
const btnValiderAgenda = document.getElementById("btn-valider-agenda");
const btnFr = document.getElementById("btn-fr");
const btnEn = document.getElementById("btn-en");

// Système de masquage
const btnToggleAgenda = document.getElementById("btn-toggle-agenda");
const zoneListePrivee = document.getElementById("zone-liste-privee");

let rendezVousTableau = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

// Initialisation au démarrage
changerLangue("fr");
verifierUtilisateur();
setInterval(afficherDateEtHeureDuJour, 1000);
mettreAJourAffichageChrono();

// ==========================================
// GESTION DU TÉLÉVERSEMENT DE LA PHOTO (AVATAR)
// ==========================================
if (btnChooseFile) {
    btnChooseFile.addEventListener("click", () => inputAvatar.click());
}

if (inputAvatar) {
    inputAvatar.addEventListener("change", function() {
        const fichier = this.files[0];
        if (fichier) {
            const reader = new FileReader();
            reader.onload = function(e) {
                base64Avatar = e.target.result; 
                if (avatarPreview) avatarPreview.src = base64Avatar; 
            };
            reader.readAsDataURL(fichier);
        }
    });
}

// ==========================================
// LOGIQUE COMPTE UTILISATEUR (PIN OPTIONNEL)
// ==========================================
function verifierUtilisateur() {
    const utilisateurStocke = JSON.parse(localStorage.getItem("profilUtilisateur"));

    if (utilisateurStocke) {
        if(zoneConnexion) zoneConnexion.classList.add("d-none");
        if(zoneProfilActif) zoneProfilActif.classList.remove("d-none");
        if(contenuApplication) contenuApplication.classList.remove("d-none");

        if(affichageNom) affichageNom.textContent = utilisateurStocke.nom;
        if(affichageEmail) affichageEmail.innerHTML = `📩 <a href="mailto:${utilisateurStocke.email}">${utilisateurStocke.email}</a>`;
        
        if (affichageAvatar) {
            // CORRECTION : On vérifie si la chaîne de l'avatar n'est pas vide
            if (utilisateurStocke.avatar && utilisateurStocke.avatar.trim() !== "") {
                affichageAvatar.src = utilisateurStocke.avatar;
            } else {
                // Image par défaut si l'utilisateur n'a pas mis de photo
                affichageAvatar.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
            }
        }
    } else {
        if(zoneConnexion) zoneConnexion.classList.remove("d-none");
        if(zoneProfilActif) zoneProfilActif.classList.add("d-none");
        if(contenuApplication) contenuApplication.classList.add("d-none");
    }
}

if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const inputPin = document.getElementById("login-pin");
        let pinValeur = inputPin ? inputPin.value.trim() : "";
        
        if (pinValeur.length > 0 && pinValeur.length !== 4) {
            alert(langueActuelle === "fr" ? "❌ Le code PIN doit contenir exactement 4 chiffres." : "❌ The PIN code must contain exactly 4 digits.");
            return;
        }

        const infosUser = {
            nom: inputLoginNom.value,
            email: inputLoginEmail.value,
            avatar: base64Avatar, // Sera "" s'il n'y a pas de photo, bien géré maintenant
            pin: pinValeur 
        };

        localStorage.setItem("profilUtilisateur", JSON.stringify(infosUser));
        formLogin.reset();
        if (avatarPreview) avatarPreview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
        base64Avatar = ""; 
        verifierUtilisateur();
    });
}

if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", function() {
        if(confirm(langueActuelle === "fr" ? "Voulez-vous vous déconnecter et réinitialiser ce profil ?" : "Do you want to sign out and reset this profile?")) {
            localStorage.removeItem("profilUtilisateur");
            if(zoneListePrivee) zoneListePrivee.classList.add("d-none");
            verifierUtilisateur();
        }
    });
}

// ==========================================
// VERROU DE L'AGENDA INTELLIGENT (DYNAMIQUE)
// ==========================================
if (btnToggleAgenda && zoneListePrivee) {
    btnToggleAgenda.addEventListener("click", function() {
        const estCache = zoneListePrivee.classList.contains("d-none");
        const t = traductions[langueActuelle];
        
        const utilisateurActuel = JSON.parse(localStorage.getItem("profilUtilisateur"));
        if (!utilisateurActuel) return;

        if (estCache) {
            if (utilisateurActuel.pin && utilisateurActuel.pin.length === 4) {
                let messageDemande = (langueActuelle === "fr") 
                    ? "Entrez votre code PIN secret pour voir vos rendez-vous :" 
                    : "Enter your secret PIN to view appointments:";
                    
                let messageErreur = (langueActuelle === "fr")
                    ? "❌ Code PIN incorrect. Accès refusé."
                    : "❌ Incorrect PIN. Access denied.";

                let pinSaisi = prompt(messageDemande);

                if (pinSaisi === utilisateurActuel.pin) {
                    zoneListePrivee.classList.remove("d-none");
                    btnToggleAgenda.textContent = t.btnMasquer;
                } else if (pinSaisi !== null) { 
                    alert(messageErreur);
                }
            } else {
                zoneListePrivee.classList.remove("d-none");
                btnToggleAgenda.textContent = t.btnMasquer;
            }
        } else {
            zoneListePrivee.classList.add("d-none");
            btnToggleAgenda.textContent = t.btnAfficher;
        }
    });
}

// ==========================================
// GESTION DU CHANGEMENT DE LANGUE
// ==========================================
function changerLangue(langue) {
    langueActuelle = langue;
    const t = traductions[langue];

    if(txtTitreLogin) txtTitreLogin.textContent = t.titreLogin;
    if(inputLoginNom) inputLoginNom.placeholder = t.placeholderNom;
    if(inputLoginEmail) inputLoginEmail.placeholder = t.placeholderEmail;
    if(btnLogin) btnLogin.textContent = t.btnAcceder;
    if(btnDeconnexion) btnDeconnexion.textContent = t.btnChangerProfil;

    txtTitreChrono.textContent = t.titreChrono;
    txtTitreAgenda.textContent = t.titreAgenda;
    inputTitre.placeholder = t.placeholderObjet;
    btnValiderAgenda.textContent = t.btnAjouter;
    
    if (!enCours && millisecondes === 0) {
        btnPausePlay.textContent = t.btnDemarrer;
    } else if (enCours) {
        btnPausePlay.textContent = t.btnPause;
    } else {
        btnPausePlay.textContent = t.btnReprendre;
    }

    if (langue === "fr") {
        btnFr.classList.add("active");
        btnEn.classList.remove("active");
    } else {
        btnEn.classList.add("active");
        btnFr.classList.remove("active");
    }

    if (btnToggleAgenda && zoneListePrivee) {
        const estCache = zoneListePrivee.classList.contains("d-none");
        btnToggleAgenda.textContent = estCache ? t.btnAfficher : t.btnMasquer;
    }

    afficherDateEtHeureDuJour();
    rendreAgenda();
}

if (btnFr) btnFr.addEventListener("click", () => changerLangue("fr"));
if (btnEn) btnEn.addEventListener("click", () => changerLangue("en"));

// ==========================================
// 1. HORLOGE DU JOUR & ALARMES
// ==========================================
function afficherDateEtHeureDuJour() {
    if (!horlogeElement) return;
    const maintenant = new Date();
    const t = traductions[langueActuelle];
    
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateLisible = maintenant.toLocaleDateString(t.langueCode, optionsDate);
    
    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const secondes = String(maintenant.getSeconds()).padStart(2, '0');
    
    horlogeElement.innerHTML = `📅 ${dateLisible} — 🕒 <strong>${heures}:${minutes}:${secondes}</strong>`;

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
    if (!affichage) return;
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

if (btnPausePlay) {
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
}

if (btnReset) {
    btnReset.addEventListener("click", function() {
        const t = traductions[langueActuelle];
        clearInterval(chrono);
        millisecondes = 0;
        mettreAJourAffichageChrono();
        btnPausePlay.textContent = t.btnDemarrer;
        enCours = false;
    });
}

// ==========================================
// 3. LOGIQUE DE L'AGENDA
// ==========================================
if (formRdv) {
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
}

function sauvegarderDonnees() {
    localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau));
}

function rendreAgenda() {
    if (!listElementsRdv) return;
    listElementsRdv.innerHTML = ""; 
    const t = traductions[langueActuelle];
    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));

    rendezVousTableau.forEach(function(rdv) {
        const li = document.createElement("li");
        const dateObjet = new Date(rdv.date);
        
        const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const dateLisible = dateObjet.toLocaleDateString(t.langueCode, options);

        li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${dateLisible}</span>`;

        const zoneActions = document.createElement("div");
        zoneActions.className = "actions";

        const btnModifier = document.createElement("span");
        btnModifier.textContent = "✏️";
        btnModifier.title = t.bulleModifier;
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
        btnSuppr.title = t.bulleSupprimer;
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