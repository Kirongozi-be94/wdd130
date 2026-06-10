if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log("Service Worker configuré."))
    .catch(err => console.error("Erreur Service Worker :", err));
}

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

let rendezVousTableau = JSON.parse(localStorage.getItem("mesRendezVous")) || [];

// Base de données géographiques du Congo Travel Planner
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

// Démarrage
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
            alert("❌ Le code PIN doit contenir 4 chiffres.");
            return;
        }
        localStorage.setItem("profilUtilisateur", JSON.stringify({ nom: inputLoginNom.value, email: inputLoginEmail.value, avatar: base64Avatar, pin: pinVal }));
        formLogin.reset();
        base64Avatar = "";
        verifierUtilisateur();
    });
}

if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", function() {
        if(confirm("Réinitialiser ce profil ?")) {
            localStorage.removeItem("profilUtilisateur");
            zoneListePrivee.classList.add("d-none");
            verifierUtilisateur();
        }
    });
}

if (btnToggleAgenda) {
    btnToggleAgenda.addEventListener("click", function() {
        const estCache = zoneListePrivee.classList.contains("d-none");
        const uti = JSON.parse(localStorage.getItem("profilUtilisateur"));
        if (estCache && uti && uti.pin) {
            let saisi = prompt("Entrez votre code PIN :");
            if (saisi === uti.pin) { zoneListePrivee.classList.remove("d-none"); this.textContent = traductions[langueActuelle].btnMasquer; }
            else if (saisi !== null) alert("❌ Code PIN incorrect.");
        } else {
            zoneListePrivee.classList.toggle("d-none");
            this.textContent = zoneListePrivee.classList.contains("d-none") ? traductions[langueActuelle].btnAfficher : traductions[langueActuelle].btnMasquer;
        }
    });
}

function changerLangue(langue) {
    langueActuelle = langue; const t = traductions[langue];
    if(txtTitreLogin) txtTitreLogin.textContent = t.titreLogin;
    if(inputLoginNom) inputLoginNom.placeholder = t.placeholderNom;
    if(btnLogin) btnLogin.textContent = t.btnAcceder;
    txtTitreChrono.textContent = t.titreChrono; txtTitreAgenda.textContent = t.titreAgenda;
    btnValiderAgenda.textContent = t.btnAjouter;
    btnPausePlay.textContent = !enCours && millisecondes === 0 ? t.btnDemarrer : enCours ? t.btnPause : t.btnReprendre;
    document.querySelectorAll(".btn-lang").forEach(b => b.classList.remove("active"));
    document.getElementById(`btn-${langue}`).classList.add("active");
    afficherDateEtHeureDuJour(); rendreAgenda();
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
    if (!listElementsRdv) return; 
    listElementsRdv.innerHTML = "";
    
    // Trier les rendez-vous du plus proche au plus lointain
    rendezVousTableau.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    rendezVousTableau.forEach(rdv => {
        const li = document.createElement("li");
        li.innerHTML = `<span>📅 <strong>${rdv.titre}</strong> - ${new Date(rdv.date).toLocaleDateString(traductions[langueActuelle].langueCode, {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</span>`;
        
        const divActions = document.createElement("div"); 
        divActions.className = "actions";
        divActions.style.display = "flex";
        divActions.style.gap = "10px";

        // 1. BOUTON MODIFIER (✍️)
        const btnModifier = document.createElement("span"); 
        btnModifier.textContent = "✍️"; 
        btnModifier.style.cursor = "pointer";
        btnModifier.title = traductions[langueActuelle].bulleModifier;
        btnModifier.addEventListener("click", () => {
            // On remet les valeurs dans le formulaire pour modification
            inputTitre.value = rdv.titre;
            inputDate.value = rdv.date;
            
            // On supprime l'ancienne version du tableau pour la remplacer au prochain clic sur "Ajouter"
            rendezVousTableau = rendezVousTableau.filter(i => i.id !== rdv.id);
            localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau));
            rendreAgenda();
            
            // Remonter l'écran vers le formulaire
            inputTitre.focus();
        });

        // 2. BOUTON SUPPRIMER (❌)
        const btnSupprimer = document.createElement("span"); 
        btnSupprimer.textContent = "❌"; 
        btnSupprimer.style.cursor = "pointer";
        btnSupprimer.title = traductions[langueActuelle].bulleSupprimer;
        btnSupprimer.addEventListener("click", () => {
            if(confirm(langueActuelle === "fr" ? "Supprimer ce rendez-vous ?" : "Delete this appointment?")) {
                rendezVousTableau = rendezVousTableau.filter(i => i.id !== rdv.id); 
                localStorage.setItem("mesRendezVous", JSON.stringify(rendezVousTableau)); 
                rendreAgenda(); 
            }
        });

        divActions.appendChild(btnModifier);
        divActions.appendChild(btnSupprimer); 
        li.appendChild(divActions); 
        listElementsRdv.appendChild(li);
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
if (selectChoice) { selectChoice.addEventListener("change", function() { if (this.value === "2") { selectStart.value = "kinshasa"; selectStart.disabled = true; } else selectStart.disabled = false; }); }
if (selectRoad) { selectRoad.addEventListener("change", function() { if (this.value === "bad") { alert("⚠️ Route mauvaise. Avion conseillé !"); selectTransport.value = "plane"; } }); }

if (btnCalculerVoyage) {
    btnCalculerVoyage.addEventListener("click", function() {
        const v1 = selectStart.value, v2 = selectEnd.value, r = selectRoad.value, t = selectTransport.value;
        if (v1 === v2) { resultatVoyage.textContent = "❌ Choisissez deux villes différentes."; resultatVoyage.classList.remove("d-none"); return; }
        
        const dLat = (cities[v2][0] - cities[v1][0]) * Math.PI / 180, dLon = (cities[v2][1] - cities[v1][1]) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(cities[v1][0]*Math.PI/180) * Math.cos(cities[v2][0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        
        resultatVoyage.innerHTML = `🏁 <strong>${v1.toUpperCase()} ➔ ${v2.toUpperCase()}</strong><br>📏 <strong>Distance :</strong> ${dist.toFixed(2)} km<br>⏳ <strong>Temps :</strong> ${(dist / speeds[t][r]).toFixed(2)} heures`;
        resultatVoyage.classList.remove("d-none");
    });
}

// ==========================================
// 5. GÉOLOCALISATION (GPS) & BOUSSOLE
// ==========================================

const btnGps = document.getElementById("btn-gps");
const affichageGps = document.getElementById("affichage-gps");
const gpsLat = document.getElementById("gps-lat");
const gpsLon = document.getElementById("gps-lon");
const gpsVilleProche = document.getElementById("gps-ville-proche");
const boussoleDisque = document.getElementById("boussole-disque");
const boussoleDegres = document.getElementById("boussole-degres");

// --- PARTIE A : LE GPS / GPRS ---
if (btnGps) {
    btnGps.addEventListener("click", function() {
        if (!navigator.geolocation) {
            alert("❌ La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        btnGps.textContent = "Recherche du signal... ⏳";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Affichage des coordonnées réelles
                gpsLat.textContent = lat.toFixed(4);
                gpsLon.textContent = lon.toFixed(4);
                affichageGps.classList.remove("d-none");
                btnGps.innerHTML = "Position synchronisée ✅";
                btnGps.className = "btn btn-primary";

                // Optionnel : Trouver la ville de RDC la plus proche de l'utilisateur !
                trouverVilleRdcLaPlusProche(lat, lon);
            },
            (erreur) => {
                console.error(erreur);
                alert("⚠️ Impossible d'accéder à votre position. Vérifiez vos autorisations GPS.");
                btnGps.textContent = "Réessayer l'activation GPS 🛰️";
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// Algorithme pour lier ta position GPS aux villes de ton Travel Planner
function trouverVilleRdcLaPlusProche(maLat, maLon) {
    let villeProche = "";
    let distanceMin = Infinity;

    // On utilise la fonction de calcul de distance que tu as déjà dans ton script !
    Object.keys(cities).forEach(nomVille => {
        const coordVille = cities[nomVille];
        // Appel de la formule Haversine déjà présente
        const dLat = (coordVille[0] - maLat) * Math.PI / 180;
        const dLon = (coordVille[1] - maLon) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(maLat*Math.PI/180) * Math.cos(coordVille[0]*Math.PI/180) * Math.sin(dLon/2)**2;
        const dist = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));

        if (dist < distanceMin) {
            distanceMin = dist;
            villeProche = nomVille;
        }
    });

    if (gpsVilleProche) {
        const nomFormate = villeProche.charAt(0).toUpperCase() + villeProche.slice(1);
        gpsVilleProche.innerHTML = `📍 Ville de RDC la plus proche : <strong>${nomFormate}</strong> (à env. ${distanceMin.toFixed(0)} km)`;
        
        // Bonus : Met automatiquement cette ville comme point de départ du planificateur !
        const selectStart = document.getElementById("city-start");
        if (selectStart) selectStart.value = villeProche;
    }
}

// --- PARTIE B : LA BOUSSOLE ---
// Écoute de l'orientation de l'appareil (Fonctionne surtout sur Smartphone)
window.addEventListener("deviceorientationabsolute", gererOrientation, true);
window.addEventListener("deviceorientation", gererOrientation, true);

function gererOrientation(event) {
    // Récupération des degrés par rapport au Nord magnétique (alpha ou webkitCompassHeading)
    let degres = event.alpha;
    
    if (event.webkitCompassHeading) {
        degres = event.webkitCompassHeading; // Spécifique pour iPhone/Safari
    }

    if (degres !== null && degres !== undefined) {
        const angleRationnel = Math.round(degres);
        boussoleDegres.textContent = `${angleRationnel}°`;

        // Fait tourner visuellement le disque CSS de la boussole
        if (boussoleDisque) {
            boussoleDisque.style.transform = `rotate(${-angleRationnel}deg)`;
        }
    }
}