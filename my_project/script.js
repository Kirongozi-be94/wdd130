if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker configuré."))
    .catch(err => console.error("Erreur Service Worker :", err));
}

// DICTIONNAIRE GLOBAL DE TRADUCTION COMPLET
const traductions = {
    fr: {
        titreLogin: "Créer votre profil sécurisé",
        placeholderNom: "Votre nom complet",
        placeholderEmail: "Votre adresse email",
        btnAcceder: "Enregistrer et Déverrouiller",
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
        titreSensors: "🧭 Géolocalisation & Boussole",
        btnGpsInitial: "Activer mon GPS / GPRS 🛰️",
        btnGpsLoading: "Recherche du signal... ⏳",
        btnGpsSuccess: "Position synchronisée ✅",
        btnGpsError: "⚠️ Impossible d'accéder à votre position. Vérifiez vos autorisations GPS.",
        txtGpsActuel: "Votre position actuelle :",
        txtVilleProche: "Ville de RDC la plus proche :",
        btnBoussoleInitial: "Activer la Boussole 🧭",
        btnBoussoleActive: "Boussole Active ✅",
        btnBoussoleRefuse: "❌ Accès aux capteurs refusé.",
        titreTravel: "🌍 Congo Travel Planner",
        lblTravelChoice: "Que voulez-vous faire ?",
        optChoice1: "Calculer la distance entre deux villes",
        optChoice2: "Calculer la distance depuis Kinshasa",
        lblCityStart: "Ville de départ :",
        lblCityEnd: "Ville d'arrivée :",
        lblRoadCondition: "État de la route :",
        optRoad1: "Bon (Good)",
        optRoad2: "Moyen (Average)",
        optRoad3: "Mauvais (Bad) ⚠️ Avion recommandé",
        lblTransportMode: "Mode de transport :",
        optTrans1: "Voiture (Car)",
        optTrans2: "Avion (Plane)",
        optTrans3: "Moto (Motorcycle)",
        optTrans4: "Vélo (Bike)",
        optTrans5: "À pied (Walking)",
        btnCalculer: "Calculer l'itinéraire 🚀",
        errMemeVille: "❌ Veuillez choisir deux villes différentes.",
        txtItineraire: "Itinéraire",
        txtDistance: "Distance",
        txtMode: "Mode",
        txtRoute: "Route",
        txtTempsEstime: "Temps de trajet estimé",
        txtHeures: "heures",
        alertRouteMauvaise: "⚠️ L'état de la route est mauvais, il est fortement recommandé de prendre l'avion.",
        confirmDeconnexion: "Voulez-vous vraiment réinitialiser ce profil ?",
        confirmSupprimerRdv: "Supprimer ce rendez-vous ?",
        alertPinIncorrect: "❌ Code PIN incorrect.",
        alertPinLongueur: "❌ Le code PIN doit contenir 4 chiffres.",
        lblPinSecret: "Créer votre Code PIN Secret (Optionnel) :",
        placeholderPin: "Laisser vide si pas de code",
        btnChooseFile: "Choisir une photo",
        langueCode: "fr-FR"
    },
    en: {
        titreLogin: "Create your secure profile",
        placeholderNom: "Your full name",
        placeholderEmail: "Your email address",
        btnAcceder: "Register and Unlock",
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
        titreSensors: "🧭 Geolocation & Compass",
        btnGpsInitial: "Activate my GPS / GPRS 🛰️",
        btnGpsLoading: "Searching signal... ⏳",
        btnGpsSuccess: "Position synchronized ✅",
        btnGpsError: "⚠️ Unable to access your position. Check your GPS permissions.",
        txtGpsActuel: "Your current position:",
        txtVilleProche: "Closest DRC city:",
        btnBoussoleInitial: "Activate Compass 🧭",
        btnBoussoleActive: "Compass Active ✅",
        btnBoussoleRefuse: "❌ Sensor access denied.",
        titreTravel: "🌍 Congo Travel Planner",
        lblTravelChoice: "What do you want to do?",
        optChoice1: "Calculate distance between two cities",
        optChoice2: "Calculate distance from Kinshasa",
        lblCityStart: "Departure city:",
        lblCityEnd: "Arrival city:",
        lblRoadCondition: "Road condition:",
        optRoad1: "Good",
        optRoad2: "Average",
        optRoad3: "Bad ⚠️ Plane recommended",
        lblTransportMode: "Transportation mode:",
        optTrans1: "Car",
        optTrans2: "Plane",
        optTrans3: "Motorcycle",
        optTrans4: "Bike",
        optTrans5: "Walking",
        btnCalculer: "Calculate route 🚀",
        errMemeVille: "❌ Please choose two different cities.",
        txtItineraire: "Route",
        txtDistance: "Distance",
        txtMode: "Mode",
        txtRoute: "Road",
        txtTempsEstime: "Estimated travel time",
        txtHeures: "hours",
        alertRouteMauvaise: "⚠️ Road conditions are bad, taking a plane is highly recommended.",
        confirmDeconnexion: "Do you really want to reset this profile?",
        confirmSupprimerRdv: "Delete this appointment?",
        alertPinIncorrect: "❌ Incorrect PIN code.",
        alertPinLongueur: "❌ The PIN code must contain 4 digits.",
        lblPinSecret: "Create your Secret PIN Code (Optional):",
        placeholderPin: "Leave blank if no code",
        btnChooseFile: "Choose a photo",
        langueCode: "en-US"
    }
};

let langueActuelle = "fr"; 
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

const txtTitreLogin = document.getElementById("txt-titre-login");
const btnLogin = document.getElementById("btn-login");
const txtTitreChrono = document.getElementById("txt-titre-chrono");
const txtTitreAgenda = document.getElementById("txt-titre-agenda");
const btnValiderAgenda = document.getElementById("btn-valider-agenda");
const btnFr = document.getElementById("btn-fr");
const btnEn = document.getElementById("btn-en");

const btnToggleAgenda = document.getElementById("btn-toggle-agenda");
const zoneListePrivee = document.getElementById("zone-liste-privee");

// Capteurs DOM
const btnGps = document.getElementById("btn-gps");
const affichageGps = document.getElementById("affichage-gps");
const gpsLat = document.getElementById("gps-lat");
const gpsLon = document.getElementById("gps-lon");
const gpsVilleProche = document.getElementById("gps-ville-proche");
const boussoleDisque = document.getElementById("boussole-disque");
const boussoleDegres = document.getElementById("boussole-degres");
const btnBoussole = document.getElementById("btn-boussole");

let rendezVousTableau = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

// Base de données géographiques de la RDC
const cities = {
    "kinshasa": [-4.4419, 15.2663], "lubumbashi": [-11.6708, 27.4792], "kolwezi": [-10.7167, 25.4667],
    "kisangani": [0.5167, 25.1833], "inongo": [-5.3333, 21.4167], "bukavu": [-2.5, 28.3667],
    "goma": [-1.6833, 29.2167], "bunia": [0.6333, 25.2], "boende": [-1.0333, 23.6],
    "mbandaka": [-0.5167, 18.4333], "lisala": [-2.8, 23.4333], "kikwit": [-4.3, 20.35],
    "kenge": [-5.0333, 18.8833], "tshikapa": [-6.1333, 23.6], "kananga": [-5.35, 22.4167],
    "mbuji-mayi": [-7.05, 23.95], "kamina": [-10.7167, 25.7167], "isiro": [-8.2333, 24.7333],
    "buta": [3.3667, 25.9333], "gbadolite": [2.8, 27.4833], "gemena": [4.35, 21.0167], "kindu": [-3.3667, 29.3667]
};
const speeds = {
    car: { good: 80, average: 60, bad: 40 }, plane: { good: 800, average: 800, bad: 800 },
    motorcycle: { good: 60, average: 40, bad: 20 }, bike: { good: 20, average: 15, bad: 10 }, walking: { good: 5, average: 4, bad: 3 }
};

const selectChoice = document.getElementById("travel-choice");
const selectStart = document.getElementById("city-start");
const selectEnd = document.getElementById("city-end");
const selectRoad = document.getElementById("road-condition-select");
const selectTransport = document.getElementById("transport-mode-select");
const btnCalculerVoyage = document.getElementById("btn-calculer-voyage");
const resultatVoyage = document.getElementById("resultat-voyage");

// DÉMARRAGE SYNCHRONISÉ
changerLangue("fr");
verifierUtilisateur();
setInterval(afficherDateEtHeureDuJour, 1000);
mettreAJourAffichageChrono();
initialiserVilles();

if (btnChooseFile) btnChooseFile.addEventListener("click", () => inputAvatar.click());
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

function verifierUtilisateur() {
    const uti = JSON.parse(localStorage.getItem("profilUtilisateur"));
    if (uti) {
        zoneConnexion.classList.add("d-none");
        zoneProfilActif.classList.remove("d-none");
        contenuApplication.classList.remove("d-none");
        affichageNom.textContent = uti.nom;
        affichageEmail.innerHTML = `📩 <a href="mailto:${uti.email}">${uti.email}</a>`;
        if (affichageAvatar) {
            affichageAvatar.src = (uti.avatar && uti.avatar.trim() !== "") ? uti.avatar : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
        }
    } else {
        zoneConnexion.classList.remove("d-none");
        zoneProfilActif.classList.add("d-none");
        contenuApplication.classList.add("d-none");
    }
}

if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();
        const inputPin = document.getElementById("login-pin");
        let pinVal = inputPin ? inputPin.value.trim() : "";
        if (pinVal.length > 0 && pinVal.length !== 4) {
            alert(traductions[langueActuelle].alertPinLongueur);
            return;
        }
        localStorage.setItem("profilUtilisateur", JSON.stringify({ nom: inputLoginNom.value, email: inputLoginEmail.value, avatar: base64Avatar, pin: pinVal }));
        formLogin.reset();
        base64Avatar = "";
        if (avatarPreview) avatarPreview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
        verifierUtilisateur();
    });
}

if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", function() {
        if(confirm(traductions[langueActuelle].confirmDeconnexion)) {
            localStorage.removeItem("profilUtilisateur");
            zoneListePrivee.classList.add("d-none");
            if(btnToggleAgenda) btnToggleAgenda.textContent = traductions[langueActuelle].btnAfficher;
            verifierUtilisateur();
        }
    });
}

if (btnToggleAgenda) {
    btnToggleAgenda.addEventListener("click", function() {
        const estCache = zoneListePrivee.classList.contains("d-none");
        const uti = JSON.parse(localStorage.getItem("profilUtilisateur"));
        if (estCache && uti && uti.pin) {
            let saisi = prompt("PIN :");
            if (saisi === uti.pin) { zoneListePrivee.classList.remove("d-none"); this.textContent = traductions[langueActuelle].btnMasquer; }
            else if (saisi !== null) alert(traductions[langueActuelle].alertPinIncorrect);
        } else {
            zoneListePrivee.classList.toggle("d-none");
            this.textContent = zoneListePrivee.classList.contains("d-none") ? traductions[langueActuelle].btnAfficher : traductions[langueActuelle].btnMasquer;
        }
    });
}

// INTERRUPTEUR DE TRADUCTION DYNAMIQUE GLOBAL
function changerLangue(langue) {
    langueActuelle = langue; const t = traductions[langue];
    
    if(txtTitreLogin) txtTitreLogin.textContent = t.titreLogin;
    if(inputLoginNom) inputLoginNom.placeholder = t.placeholderNom;
    if(inputLoginEmail) inputLoginEmail.placeholder = t.placeholderEmail;
    if(inputTitre) inputTitre.placeholder = t.placeholderObjet;
    if(btnLogin) btnLogin.textContent = t.btnAcceder;
    if(txtTitreChrono) txtTitreChrono.textContent = t.titreChrono; 
    if(txtTitreAgenda) txtTitreAgenda.textContent = t.titreAgenda;
    if(btnValiderAgenda) btnValiderAgenda.textContent = t.btnAjouter;
    if(btnChooseFile) btnChooseFile.textContent = t.btnChooseFile;
    
    const inputPin = document.getElementById("login-pin");
    if(inputPin) inputPin.placeholder = t.placeholderPin;

    if(btnPausePlay) btnPausePlay.textContent = !enCours && millisecondes === 0 ? t.btnDemarrer : enCours ? t.btnPause : t.btnReprendre;
    if(btnToggleAgenda) btnToggleAgenda.textContent = zoneListePrivee.classList.contains("d-none") ? t.btnAfficher : t.btnMasquer;

    const lblPin = document.getElementById("lbl-pin-secret");
    if (lblPin) lblPin.textContent = t.lblPinSecret;
    
    document.getElementById("txt-titre-sensors").textContent = t.titreSensors;
    document.getElementById("txt-gps-actuel").textContent = t.txtGpsActuel;
    if(btnGps && !btnGps.innerHTML.includes("✅")) btnGps.textContent = t.btnGpsInitial;
    if(btnBoussole && !btnBoussole.innerHTML.includes("✅")) btnBoussole.textContent = t.btnBoussoleInitial;

    document.getElementById("txt-titre-travel").textContent = t.titreTravel;
    document.getElementById("lbl-travel-choice").textContent = t.lblTravelChoice;
    document.getElementById("opt-choice-1").textContent = t.optChoice1;
    document.getElementById("opt-choice-2").textContent = t.optChoice2;
    document.getElementById("lbl-city-start").textContent = t.lblCityStart;
    document.getElementById("lbl-city-end").textContent = t.lblCityEnd;
    document.getElementById("lbl-road-condition").textContent = t.lblRoadCondition;
    document.getElementById("opt-road-1").textContent = t.optRoad1;
    document.getElementById("opt-road-2").textContent = t.optRoad2;
    document.getElementById("opt-road-3").textContent = t.optRoad3;
    document.getElementById("lbl-transport-mode").textContent = t.lblTransportMode;
    document.getElementById("opt-trans-1").textContent = t.optTrans1;
    document.getElementById("opt-trans-2").textContent = t.optTrans2;
    document.getElementById("opt-trans-3").textContent = t.optTrans3;
    document.getElementById("opt-trans-4").textContent = t.optTrans4;
    document.getElementById("opt-trans-5").textContent = t.optTrans5;
    document.getElementById("btn-calculer-voyage").textContent = t.btnCalculer;

    const txtFooter = document.getElementById("txt-footer");
    if (txtFooter) txtFooter.innerHTML = langue === "fr" ? `&copy; 2026 | Benjamin Kirongozi Mazuya | Développé pour WDD 131` : `&copy; 2026 | Benjamin Kirongozi Mazuya | Developed for WDD 131`;

    document.querySelectorAll(".btn-lang").forEach(b => b.classList.remove("active"));
    document.getElementById(`btn-${langue}`).classList.add("active");
    
    if (resultatVoyage && !resultatVoyage.classList.contains("d-none")) { resultatVoyage.classList.add("d-none"); }
    
    // Forcer la mise à jour de la ville la plus proche si affichée
    if (affichageGps && !affichageGps.classList.contains("d-none")) {
        const latActuelle = parseFloat(gpsLat.textContent);
        const lonActuelle = parseFloat(gpsLon.textContent);
        if(!isNaN(latActuelle) && !isNaN(lonActuelle)) trouverVilleRdcLaPlusProche(latActuelle, lonActuelle);
    }

    afficherDateEtHeureDuJour(); 
    rendreAgenda();
}
if (btnFr) btnFr.addEventListener("click", () => changerLangue("fr"));
if (btnEn) btnEn.addEventListener("click", () => changerLangue("en"));

function afficherDateEtHeureDuJour() {
    if (!horlogeElement) return;
    const maintenant = new Date();
    const dateLisible = maintenant.toLocaleDateString(traductions[langueActuelle].langueCode, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const heures = String(maintenant.getHours()).padStart(2, '0'), minutes = String(maintenant.getMinutes()).padStart(2, '0'), secondes = String(maintenant.getSeconds()).padStart(2, '0');
    horlogeElement.innerHTML = `📅 ${dateLisible} — 🕒 <strong>${heures}:${minutes}:${secondes}</strong>`;
    
    if (secondes === "00") {
        const formatActuel = `${maintenant.getFullYear()}-${String(maintenant.getMonth() + 1).padStart(2, '0')}-${String(maintenant.getDate()).padStart(2, '0')}T${heures}:${minutes}`;
        rendezVousTableau.forEach(rdv => {
            if (rdv.date === formatActuel) { sonAlarme.play(); alert(`${traductions[langueActuelle].alerteRappel} ${rdv.titre}`); }
        });
    }
}

function mettreAJourAffichageChrono() {
    let hrs = Math.floor(millisecondes / 360000), min = Math.floor((millisecondes % 360000) / 6000), sec = Math.floor((millisecondes % 6000) / 100), t = millisecondes % 100;
    affichage.textContent = `${String(hrs).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(t).padStart(2,'0')}`;
}
if (btnPausePlay) {
    btnPausePlay.addEventListener("click", function() {
        if (!enCours) { chrono = setInterval(() => { millisecondes++; mettreAJourAffichageChrono(); }, 10); this.textContent = traductions[langueActuelle].btnPause; enCours = true; }
        else { clearInterval(chrono); this.textContent = traductions[langueActuelle].btnReprendre; enCours = false; }
    });
}
if (btnReset) {
    btnReset.addEventListener("click", function() { clearInterval(chrono); millisecondes = 0; mettreAJourAffichageChrono(); btnPausePlay.textContent = traductions[langueActuelle].btnDemarrer; enCours = false; });
}

if (formRdv) {
    formRdv.addEventListener("submit", function(e) {
        e.preventDefault();
        rendezVousTableau.push({ id: Date.now(), titre: inputTitre.value, date: inputDate.value });
        localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau));
        rendreAgenda(); formRdv.reset();
    });
}

function rendreAgenda() {
    if (!listElementsRdv) return; listElementsRdv.innerHTML = "";
    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));
    rendezVousTableau.forEach(rdv => {
        const li = document.createElement("li");
        li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${new Date(rdv.date).toLocaleDateString(traductions[langueActuelle].langueCode, {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</span>`;
        
        const divActions = document.createElement("div"); 
        divActions.className = "actions"; divActions.style.display = "flex"; divActions.style.gap = "10px";

        const btnModifier = document.createElement("span"); 
        btnModifier.textContent = "✍️"; btnModifier.style.cursor = "pointer"; btnModifier.title = traductions[langueActuelle].bulleModifier;
        btnModifier.addEventListener("click", () => {
            inputTitre.value = rdv.titre; inputDate.value = rdv.date;
            rendezVousTableau = rendezVousTableau.filter(i => i.id !== rdv.id);
            localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau));
            rendreAgenda(); inputTitre.focus();
        });

        const btnSupprimer = document.createElement("span"); 
        btnSupprimer.textContent = "❌"; btnSupprimer.style.cursor = "pointer"; btnSupprimer.title = traductions[langueActuelle].bulleSupprimer;
        btnSupprimer.addEventListener("click", () => {
            if(confirm(traductions[langueActuelle].confirmSupprimerRdv)) {
                rendezVousTableau = rendezVousTableau.filter(i => i.id !== rdv.id); 
                localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau)); 
                rendreAgenda(); 
            }
        });

        divActions.appendChild(btnModifier); divActions.appendChild(btnSupprimer); 
        li.appendChild(divActions); listElementsRdv.appendChild(li);
    });
}

function initialiserVilles() {
    if (!selectStart || !selectEnd) return;
    Object.keys(cities).forEach(c => {
        const f = c.charAt(0).toUpperCase() + c.slice(1);
        selectStart.options[selectStart.options.length] = new Option(f, c);
        selectEnd.options[selectEnd.options.length] = new Option(f, c);
    });
}
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
            alert(traductions[langueActuelle].alertRouteMauvaise);
            selectTransport.value = "plane";
        }
    });
}

// GEOLOCALISATION GPS
if (btnGps) {
    btnGps.addEventListener("click", function() {
        if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
        btnGps.textContent = traductions[langueActuelle].btnGpsLoading;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude; const lon = position.coords.longitude;
                gpsLat.textContent = lat.toFixed(4); gpsLon.textContent = lon.toFixed(4);
                affichageGps.classList.remove("d-none");
                btnGps.textContent = traductions[langueActuelle].btnGpsSuccess;
                btnGps.className = "btn btn-primary";
                trouverVilleRdcLaPlusProche(lat, lon);
            },
            (erreur) => {
                alert(traductions[langueActuelle].btnGpsError);
                btnGps.textContent = traductions[langueActuelle].btnGpsInitial;
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

function trouverVilleRdcLaPlusProche(maLat, maLon) {
    let villeProche = ""; let distanceMin = Infinity;
    Object.keys(cities).forEach(nomVille => {
        const coordVille = cities[nomVille];
        const dLat = (coordVille[0] - maLat) * Math.PI / 180;
        const dLon = (coordVille[1] - maLon) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(maLat*Math.PI/180) * Math.cos(coordVille[0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        if (dist < distanceMin) { distanceMin = dist; villeProche = nomVille; }
    });
    if (gpsVilleProche) {
        const nomFormate = villeProche.charAt(0).toUpperCase() + villeProche.slice(1);
        const trad = traductions[langueActuelle];
        gpsVilleProche.innerHTML = `📍 ${trad.txtVilleProche} <strong>${nomFormate}</strong> (à env. ${distanceMin.toFixed(0)} km)`;
        if (selectStart) selectStart.value = villeProche;
    }
}

// BOUSSOLE / GYROSCOPE
if (btnBoussole) {
    btnBoussole.addEventListener("click", function() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response === 'granted') activerEcouteBoussole();
                else alert(traductions[langueActuelle].btnBoussoleRefuse);
            }).catch(console.error);
        } else { activerEcouteBoussole(); }
    });
}
function activerEcouteBoussole() {
    window.addEventListener("deviceorientationabsolute", gererOrientation, true);
    window.addEventListener("deviceorientation", gererOrientation, true);
    if (btnBoussole) { btnBoussole.textContent = traductions[langueActuelle].btnBoussoleActive; btnBoussole.className = "btn btn-primary"; }
}
function gererOrientation(event) {
    let degres = event.alpha; if (event.webkitCompassHeading) degres = event.webkitCompassHeading;
    if (degres !== null && degres !== undefined) {
        const angleRationnel = Math.round(degres);
        if (boussoleDegres) boussoleDegres.textContent = `${angleRationnel}°`;
        if (boussoleDisque) boussoleDisque.style.transform = `rotate(${-angleRationnel}deg)`;
    }
}

// CONGO TRAVEL PLANNER LOGIC
if (btnCalculerVoyage) {
    btnCalculerVoyage.addEventListener("click", function() {
        const v1 = selectStart.value, v2 = selectEnd.value, r = selectRoad.value, t = selectTransport.value;
        const trad = traductions[langueActuelle];
        if (v1 === v2) { resultatVoyage.textContent = trad.errMemeVille; resultatVoyage.classList.remove("d-none"); return; }
        
        const dLat = (cities[v2][0] - cities[v1][0]) * Math.PI / 180, dLon = (cities[v2][1] - cities[v1][1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(cities[v1][0]*Math.PI/180) * Math.cos(cities[v2][0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        const temps = dist / speeds[t][r];
        
        // Traduction stricte de l'affichage du mode et de la route
        const labelModeTraduit = langueActuelle === "fr" ? document.getElementById(`opt-trans-${["car","plane","motorcycle","bike","walking"].indexOf(t)+1}`).textContent.split(" (")[0] : t.charAt(0).toUpperCase() + t.slice(1);
        const labelRouteTraduite = langueActuelle === "fr" ? (r === "good" ? "Bon" : r === "average" ? "Moyen" : "Mauvais") : (r === "good" ? "Good" : r === "average" ? "Average" : "Bad");

        resultatVoyage.innerHTML = `
            🏁 <strong>${trad.txtItineraire} :</strong> ${v1.toUpperCase()} ➔ ${v2.toUpperCase()}<br>
            📏 <strong>${trad.txtDistance} :</strong> ${dist.toFixed(2)} km<br>
            🚗 <strong>${trad.txtMode} :</strong> ${labelModeTraduit} (${trad.txtRoute} : ${labelRouteTraduite})<br>
            ⏳ <strong>${trad.txtTempsEstime} :</strong> ${temps.toFixed(2)} ${trad.txtHeures}
        `;
        resultatVoyage.classList.remove("d-none");
    });
}