/**
 * @file main.js
 * @description Gestion de la page d'accueil, de l'horloge et du profil (Sans PIN).
 */
import { AuthService } from './auth.js';
import { TRANSLATIONS } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    const horlogeElement = document.getElementById("horloge-temps-reel");
    const zoneConnexion = document.getElementById("zone-connexion");
    const zoneProfilActif = document.getElementById("zone-profil-actif");
    const formLogin = document.getElementById("form-login");
    const inputAvatar = document.getElementById("input-avatar");
    const btnChooseFile = document.getElementById("btn-choose-file");
    const avatarPreview = document.getElementById("avatar-preview");
    
    let base64Avatar = "";

    // Horloge en temps réel
    setInterval(() => {
        const maintenant = new Date();
        if (horlogeElement) {
            horlogeElement.innerHTML = `📅 ${maintenant.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — 🕒 <strong>${maintenant.toLocaleTimeString('fr-FR')}</strong>`;
        }
    }, 1000);

    // Gestion de la photo de profil
    if (btnChooseFile) {
        btnChooseFile.addEventListener("click", () => inputAvatar.click());
    }
    
    inputAvatar?.addEventListener("change", (e) => {
        const fichier = e.target.files[0];
        if (fichier) {
            const reader = new FileReader();
            reader.onload = (evt) => { 
                base64Avatar = evt.target.result; 
                if (avatarPreview) avatarPreview.src = base64Avatar; 
            };
            reader.readAsDataURL(fichier);
        }
    });

    // Application dynamique de la langue (Sécurisée contre les éléments manquants)
    function appliquerLangue(lang) {
        localStorage.setItem("langueSelectionnee", lang);
        
        // Classes actives sur les boutons de drapeaux
        document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
        document.getElementById("btn-en")?.classList.toggle("active", lang === "en");

        const t = TRANSLATIONS[lang];
        if (!t) return;

        // Traduction des éléments présents (sans planter si l'un d'eux est absent)
        const elementsALadoucir = {
            "txt-titre-login": t.titreLogin,
            "btn-submit-login": t.btnSubmitLogin,
            "link-chrono": t.btnChronoLink,
            "link-travel": t.btnTravelLink,
            "btn-deconnexion": t.btnLogout
        };

        Object.keys(elementsALadoucir).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elementsALadoucir[id];
        });
    }

    // Écouteurs de clics pour les langues
    document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
    document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

    // Vérification et affichage de l'état de la session
    function checkSession() {
        const user = AuthService.getProfile();
        if (user) {
            if (zoneConnexion) zoneConnexion.classList.add("d-none"); 
            if (zoneProfilActif) zoneProfilActif.classList.remove("d-none");
            
            const txtNom = document.getElementById("affichage-nom");
            const txtEmail = document.getElementById("affichage-email");
            const imgAvatar = document.getElementById("affichage-avatar");

            if (txtNom) txtNom.textContent = user.nom;
            if (txtEmail) txtEmail.textContent = user.email;
            if (imgAvatar) {
                imgAvatar.src = user.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
            }
        } else {
            if (zoneConnexion) zoneConnexion.classList.remove("d-none"); 
            if (zoneProfilActif) zoneProfilActif.classList.add("d-none");
        }
    }

    // Soumission du formulaire d'enregistrement de profil
    formLogin?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nomInput = document.getElementById("login-nom");
        const emailInput = document.getElementById("login-email");
        
        if (nomInput && emailInput) {
            AuthService.createProfile(nomInput.value, emailInput.value, base64Avatar);
            formLogin.reset(); 
            checkSession();
            appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr");
        }
    });

    // Bouton de déconnexion / Changement de profil
    document.getElementById("btn-deconnexion")?.addEventListener("click", () => { 
        if (confirm("Changer de profil et réinitialiser la session ?")) {
            AuthService.logout(); 
        } 
    });

    // Initialisation au chargement
appliquerLangue(localStorage.getItem("langueSelectionnee") || "en"); // 👈 Changé "fr" par "en"
checkSession();
});