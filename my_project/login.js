let base64Avatar = ""; 

const horlogeElement = document.getElementById("horloge-temps-reel");
const zoneConnexion = document.getElementById("zone-connexion");
const zoneProfilActif = document.getElementById("zone-profil-actif");
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

// Horloge de la page d'accueil
setInterval(() => {
    const maintenant = new Date();
    horlogeElement.innerHTML = `📅 ${maintenant.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — 🕒 <strong>${String(maintenant.getHours()).padStart(2, '0')}:${String(maintenant.getMinutes()).padStart(2, '0')}:${String(maintenant.getSeconds()).padStart(2, '0')}</strong>`;
}, 1000);

// Gestion de la photo de profil
if (btnChooseFile) btnChooseFile.addEventListener("click", () => inputAvatar.click());
if (inputAvatar) {
    inputAvatar.addEventListener("change", function() {
        const fichier = this.files[0];
        if (fichier) {
            const reader = new FileReader();
            reader.onload = (e) => { base64Avatar = e.target.result; avatarPreview.src = base64Avatar; };
            reader.readAsDataURL(fichier);
        }
    });
}

// Vérification de l'état de connexion
function verifierUtilisateur() {
    const uti = JSON.parse(localStorage.getItem("profilUtilisateur"));
    if (uti) {
        zoneConnexion.classList.add("d-none");
        zoneProfilActif.classList.remove("d-none");
        affichageNom.textContent = uti.nom;
        affichageEmail.innerHTML = `📩 <a href="mailto:${uti.email}">${uti.email}</a>`;
        affichageAvatar.src = uti.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
    } else {
        zoneConnexion.classList.remove("d-none");
        zoneProfilActif.classList.add("d-none");
    }
}

// Soumission du formulaire
formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    const pinVal = document.getElementById("login-pin").value.trim();
    if (pinVal.length > 0 && pinVal.length !== 4) {
        alert("❌ Le code PIN doit contenir exactement 4 chiffres.");
        return;
    }
    localStorage.setItem("profilUtilisateur", JSON.stringify({ nom: inputLoginNom.value, email: inputLoginEmail.value, avatar: base64Avatar, pin: pinVal }));
    formLogin.reset();
    base64Avatar = "";
    avatarPreview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z'/></svg>";
    verifierUtilisateur();
});

// Déconnexion
btnDeconnexion.addEventListener("click", function() {
    if(confirm("Voulez-vous vraiment réinitialiser ce profil ?")) {
        localStorage.removeItem("profilUtilisateur");
        verifierUtilisateur();
    }
});

verifierUtilisateur();