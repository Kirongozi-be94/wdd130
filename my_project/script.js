// ==========================================
// SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registration = await navigator.serviceWorker.register("./service-worker.js");
            console.log("✅ Service Worker enregistré :", registration.scope);
        } catch (error) {
            console.error("❌ Erreur Service Worker :", error);
        }
    });
}

// ==========================================
// VARIABLES GLOBALES
// ==========================================

let base64Avatar = "";

const inputAvatar = document.getElementById("input-avatar");
const btnChooseFile = document.getElementById("btn-choose-file");
const avatarPreview = document.getElementById("avatar-preview");

const formLogin = document.getElementById("form-login");
const inputLoginNom = document.getElementById("login-nom");
const inputLoginEmail = document.getElementById("login-email");
const inputLoginPin = document.getElementById("login-pin");

const affichageAvatar = document.getElementById("affichage-avatar");
const affichageNom = document.getElementById("affichage-nom");
const affichageEmail = document.getElementById("affichage-email");

const zoneConnexion = document.getElementById("zone-connexion");
const zoneProfilActif = document.getElementById("zone-profil-actif");
const contenuApplication = document.getElementById("contenu-application");

console.log("✅ Script chargé");

// ==========================================
// CHOIX DE LA PHOTO
// ==========================================

if (btnChooseFile && inputAvatar) {
    btnChooseFile.addEventListener("click", () => {
        inputAvatar.click();
    });
}

// ==========================================
// CHARGEMENT DE LA PHOTO
// ==========================================

if (inputAvatar) {
    inputAvatar.addEventListener("change", (event) => {

        const fichier = event.target.files[0];

        if (!fichier) return;

        // Limite 500 Ko
        if (fichier.size > 500000) {
            alert("❌ Image trop grande (maximum 500 Ko).");
            return;
        }

        if (!fichier.type.startsWith("image/")) {
            alert("❌ Veuillez sélectionner une image valide.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            base64Avatar = e.target.result;

            if (avatarPreview) {
                avatarPreview.src = base64Avatar;
            }

            console.log("✅ Image chargée");
        };

        reader.onerror = () => {
            alert("❌ Impossible de lire l'image.");
        };

        reader.readAsDataURL(fichier);
    });
}

// ==========================================
// ENREGISTREMENT DU PROFIL
// ==========================================

if (formLogin) {
    formLogin.addEventListener("submit", (e) => {

        e.preventDefault();

        const nom = inputLoginNom.value.trim();
        const email = inputLoginEmail.value.trim();
        const pin = inputLoginPin.value.trim();

        if (!nom || !email) {
            alert("❌ Tous les champs obligatoires doivent être remplis.");
            return;
        }

        if (pin && pin.length !== 4) {
            alert("❌ Le PIN doit contenir exactement 4 chiffres.");
            return;
        }

        const utilisateur = {
            nom,
            email,
            pin,
            avatar: base64Avatar
        };

        try {
            localStorage.setItem(
                "profilUtilisateur",
                JSON.stringify(utilisateur)
            );

            console.log("✅ Profil enregistré");

            afficherProfil();

        } catch (error) {

            console.error(error);

            alert(
                "❌ Impossible d'enregistrer le profil. L'image est probablement trop volumineuse."
            );
        }
    });
}

// ==========================================
// AFFICHAGE DU PROFIL
// ==========================================

function afficherProfil() {

    const utilisateur = JSON.parse(
        localStorage.getItem("profilUtilisateur")
    );

    if (!utilisateur) {

        zoneConnexion.classList.remove("d-none");
        zoneProfilActif.classList.add("d-none");
        contenuApplication.classList.add("d-none");

        return;
    }

    zoneConnexion.classList.add("d-none");
    zoneProfilActif.classList.remove("d-none");
    contenuApplication.classList.remove("d-none");

    affichageNom.textContent = utilisateur.nom;

    affichageEmail.innerHTML =
        `<a href="mailto:${utilisateur.email}">
            ${utilisateur.email}
        </a>`;

    if (
        utilisateur.avatar &&
        utilisateur.avatar.startsWith("data:image")
    ) {
        affichageAvatar.src = utilisateur.avatar;
    } else {
        affichageAvatar.src = "icon-192.png";
    }
}

// ==========================================
// DÉMARRAGE DE L'APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    afficherProfil();
});