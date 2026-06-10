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
        titreAgenda: "Rappel de Rendez-vous",
        placeholderObjet: "Objet du rendez-vous",
        btnAjouter: "Ajouter à l'agenda",
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
        titreAgenda: "Appointment Reminder",
        placeholderObjet: "Appointment subject",
        btnAjouter: "Add to agenda",
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
let base64Avatar = ""; 

const sonAlarme = new Audio('alarme.mp3');
const horlogeElement = document.getElementById("horloge-temps-reel");

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
        
        if(affichageEmail) {
            affichageEmail.innerHTML = `📩 <a id="email-link" href=""></a>`;
            const link = document.getElementById("email-link");
            link.href = `mailto:${utilisateurStocke.email}`;
            link.textContent = utilisateurStocke.email;
        }
        
        if (affichageAvatar) {
            if (utilisateurStocke.avatar && utilisateurStocke.avatar.trim() !== "") {
                affichageAvatar.src = utilisateurStocke.avatar;
            } else {
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
            avatar: base64Avatar,
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
// VERROU DE L'AGENDA INTELLIGENT
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

    if(txtTitreAgenda) txtTitreAgenda.textContent = t.titreAgenda;
    if(inputTitre) inputTitre.placeholder = t.placeholderObjet;
    if(btnValiderAgenda) btnValiderAgenda.textContent = t.btnAjouter;

    if (langue === "fr") {
        if(btnFr) btnFr.classList.add("active");
        if(btnEn) btnEn.classList.remove("active");
    } else {
        if(btnEn) btnEn.classList.add("active");
        if(btnFr) btnFr.classList.remove("active");
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
                sonAlarme.play().catch(e => console.log("Audio bloqué par le navigateur"));
                alert(`${t.alerteRappel} ${rdv.titre}`);
            }
        });
    }
}

// ==========================================
// 2. LOGIQUE DE L'AGENDA
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

        const infoSpan = document.createElement("span");
        infoSpan.innerHTML = `📅 <strong></strong> - ${dateLisible}`;
        infoSpan.querySelector("strong").textContent = rdv.titre;
        li.appendChild(infoSpan);

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

// ==========================================
// 3. LOGIQUE DU CONGO TRAVEL PLANNER
// ==========================================
const cities = {
    "kinshasa": [-4.4419, 15.2663],
    "lubumbashi": [-11.6708, 27.4792],
    "kolwezi": [-10.7167, 25.4667],
    "kisangani": [0.5167, 25.1833],
    "inongo": [-5.3333, 21.4167],
    "bukavu": [-2.5, 28.3667],
    "goma": [-1.6833, 29.2167],
    "bunia": [0.6333, 25.2],
    "boende": [-1.0333, 23.6],
    "mbandaka": [-0.5167, 18.4333],
    "lisala": [-2.8, 23.4333],
    "kikwit": [-4.3, 20.35],
    "kenge": [-5.0333, 18.8833],
    "tshikapa": [-6.1333, 23.6],
    "kananga": [-5.35, 22.4167],
    "mbuji-mayi": [-7.05, 23.95],
    "kamina": [-10.7167, 25.7167],
    "isiro": [-8.2333, 24.7333],
    "buta": [3.3667, 25.9333],
    "gbadolite": [2.8, 27.4833],
    "gemena": [4.35, 21.0167],
    "kindu": [-3.3667, 29.3667]
};

const speeds = {
    car: { good: 80, average: 60, bad: 40 },
    plane: { good: 800, average: 800, bad: 800 },
    motorcycle: { good: 60, average: 40, bad: 20 },
    bike: { good: 20, average: 15, bad: 10 },
    walking: { good: 5, average: 4, bad: 3 }
};

const selectChoice = document.getElementById("travel-choice");
const selectStart = document.getElementById("city-start");
const selectEnd = document.getElementById("city-end");
const selectRoad = document.getElementById("road-condition-select");
const selectTransport = document.getElementById("transport-mode-select");
const btnCalculerVoyage = document.getElementById("btn-calculer-voyage");
const resultatVoyage = document.getElementById("resultat-voyage");

function initialiserVilles() {
    if (!selectStart || !selectEnd) return;
    selectStart.innerHTML = "";
    selectEnd.innerHTML = "";
    Object.keys(cities).forEach(city => {
        const nomFormate = city.charAt(0).toUpperCase() + city.slice(1);
        selectStart.options[selectStart.options.length] = new Option(nomFormate, city);
        selectEnd.options[selectEnd.options.length] = new Option(nomFormate, city);
    });
}
initialiserVilles();

if (selectChoice) {
    selectChoice.addEventListener("change", function() {
        if (this.value === "2") {
            selectStart.value = "kinshasa";
            selectStart.disabled = true;
        } else {
            selectStart.disabled = false;
        }
    });
}

if (selectRoad && selectTransport) {
    selectRoad.addEventListener("change", function() {
        if (this.value === "bad") {
            alert(langueActuelle === "fr" ? "⚠️ L'état de la route est mauvais, il est fortement recommandé de prendre l'avion." : "⚠️ Road conditions are bad, taking a plane is highly recommended.");
            selectTransport.value = "plane";
        }
    });
}

function calculerDistanceHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

if (btnCalculerVoyage) {
    btnCalculerVoyage.addEventListener("click", function() {
        const ville1 = selectStart.value;
        const ville2 = selectEnd.value;
        const etatRoute = selectRoad.value;
        const modeTransport = selectTransport.value;

        if (ville1 === ville2) {
            resultatVoyage.textContent = "❌ Veuillez choisir deux villes différentes.";
            resultatVoyage.classList.remove("d-none");
            return;
        }

        const coord1 = cities[ville1];
        const coord2 = cities[ville2];
        const distance = calculerDistanceHaversine(coord1[0], coord1[1], coord2[0], coord2[1]);
        
        const vitesse = speeds[modeTransport][etatRoute];
        const tempsHeures = distance / vitesse;

        const v1Nom = ville1.charAt(0).toUpperCase() + ville1.slice(1);
        const v2Nom = ville2.charAt(0).toUpperCase() + ville2.slice(1);

        resultatVoyage.innerHTML = `
            🏁 <strong>Itinéraire :</strong> ${v1Nom} ➔ ${v2Nom}<br>
            📏 <strong>Distance :</strong> ${distance.toFixed(2)} km<br>
            🚗 <strong>Mode :</strong> ${modeTransport} (Route : ${etatRoute})<br>
            ⏳ <strong>Temps de trajet estimé :</strong> ${tempsHeures.toFixed(2)} heures
        `;
        resultatVoyage.classList.remove("d-none");
    });
}