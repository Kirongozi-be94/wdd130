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

    setInterval(() => {
        const maintenant = new Date();
        if (horlogeElement) horlogeElement.innerHTML = `📅 ${maintenant.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — 🕒 <strong>${maintenant.toLocaleTimeString('fr-FR')}</strong>`;
    }, 1000);

    if (btnChooseFile) btnChooseFile.addEventListener("click", () => inputAvatar.click());
    inputAvatar?.addEventListener("change", (e) => {
        const fichier = e.target.files[0];
        if (fichier) {
            const reader = new FileReader();
            reader.onload = (evt) => { base64Avatar = evt.target.result; avatarPreview.src = base64Avatar; };
            reader.readAsDataURL(fichier);
        }
    });

    function appliquerLangue(lang) {
        localStorage.setItem("langueSelectionnee", lang);
        document.getElementById("btn-fr")?.classList.toggle("active", lang === "fr");
        document.getElementById("btn-en")?.classList.toggle("active", lang === "en");

        const t = TRANSLATIONS[lang];
        if (document.getElementById("txt-titre-login")) document.getElementById("txt-titre-login").textContent = t.titreLogin;
        if (document.getElementById("btn-submit-login")) document.getElementById("btn-submit-login").textContent = t.btnSubmitLogin;
        if (document.getElementById("link-chrono")) document.getElementById("link-chrono").textContent = t.btnChronoLink;
        if (document.getElementById("link-travel")) document.getElementById("link-travel").textContent = t.btnTravelLink;
        if (document.getElementById("btn-deconnexion")) document.getElementById("btn-deconnexion").textContent = t.btnLogout;
    }

    document.getElementById("btn-fr")?.addEventListener("click", () => appliquerLangue("fr"));
    document.getElementById("btn-en")?.addEventListener("click", () => appliquerLangue("en"));

    function checkSession() {
        const user = AuthService.getProfile();
        if (user) {
            zoneConnexion.classList.add("d-none"); zoneProfilActif.classList.remove("d-none");
            document.getElementById("affichage-nom").textContent = user.nom;
            document.getElementById("affichage-email").textContent = user.email;
            document.getElementById("affichage-avatar").src = user.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
        } else {
            zoneConnexion.classList.remove("d-none"); zoneProfilActif.classList.add("d-none");
        }
    }

    formLogin?.addEventListener("submit", (e) => {
        e.preventDefault();
        AuthService.createProfile(document.getElementById("login-nom").value, document.getElementById("login-email").value, base64Avatar);
        formLogin.reset(); checkSession();
    });

    document.getElementById("btn-deconnexion")?.addEventListener("click", () => { if (confirm("Réinitialiser ?")) AuthService.logout(); });

    appliquerLangue(localStorage.getItem("langueSelectionnee") || "fr");
    checkSession();
});