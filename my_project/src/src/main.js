import { AuthService } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
    const horlogeElement = document.getElementById("horloge-temps-reel");
    const zoneConnexion = document.getElementById("zone-connexion");
    const zoneProfilActif = document.getElementById("zone-profil-actif");
    const formLogin = document.getElementById("form-login");
    const inputAvatar = document.getElementById("input-avatar");
    const btnChooseFile = document.getElementById("btn-choose-file");
    const avatarPreview = document.getElementById("avatar-preview");
    
    let base64Avatar = "";

    // Horloge système découplée
    setInterval(() => {
        const maintenant = new Date();
        if (horlogeElement) {
            horlogeElement.innerHTML = `📅 ${maintenant.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — 🕒 <strong>${maintenant.toLocaleTimeString('fr-FR')}</strong>`;
        }
    }, 1000);

    // Upload d'image optimisé
    if (btnChooseFile) btnChooseFile.addEventListener("click", () => inputAvatar.click());
    if (inputAvatar) {
        inputAvatar.addEventListener("change", (e) => {
            const fichier = e.target.files[0];
            if (fichier) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    base64Avatar = evt.target.result;
                    avatarPreview.src = base64Avatar;
                };
                reader.readAsDataURL(fichier);
            }
        });
    }

    function UI_CheckSession() {
        const user = AuthService.getProfile();
        if (user) {
            zoneConnexion.classList.add("d-none");
            zoneProfilActif.classList.remove("d-none");
            document.getElementById("affichage-nom").textContent = user.nom;
            document.getElementById("affichage-email").textContent = user.email;
            document.getElementById("affichage-avatar").src = user.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
        } else {
            zoneConnexion.classList.remove("d-none");
            zoneProfilActif.classList.add("d-none");
        }
    }

    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nom = document.getElementById("login-nom").value;
            const email = document.getElementById("login-email").value;
            const pin = document.getElementById("login-pin").value.trim();

            if (pin.length > 0 && pin.length !== 4) {
                alert("❌ Le code PIN doit comporter 4 chiffres.");
                return;
            }

            await AuthService.createProfile(nom, email, base64Avatar, pin);
            formLogin.reset();
            avatarPreview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
            UI_CheckSession();
        });
    }

    document.getElementById("btn-deconnexion")?.addEventListener("click", () => {
        if (confirm("Voulez-vous réinitialiser ce profil ?")) AuthService.logout();
    });

    UI_CheckSession();
});