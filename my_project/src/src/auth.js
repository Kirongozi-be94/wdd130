/**
 * @file auth.js
 * @description Service d'authentification sécurisé et de gestion de session.
 */

/**
 * Hache une chaîne de caractères en SHA-256 pour sécuriser le stockage du PIN.
 * @param {string} string 
 * @returns {Promise<string>}
 */
async function hashPIN(string) {
    if (!string) return "";
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuthService = {
    async createProfile(nom, email, avatar, pin) {
        const hashedPin = pin ? await hashPIN(pin) : "";
        const profile = { nom, email, avatar, pin: hashedPin };
        localStorage.setItem("profilUtilisateur", JSON.stringify(profile));
        return profile;
    },

    getProfile() {
        return JSON.parse(localStorage.getItem("profilUtilisateur"));
    },

    async verifyPIN(saisi) {
        const profile = this.getProfile();
        if (!profile || !profile.pin) return true; 
        const hashedSaisi = await hashPIN(saisi);
        return profile.pin === hashedSaisi;
    },

    logout() {
        localStorage.removeItem("profilUtilisateur");
        window.location.href = "index.html";
    },

    requireAuth() {
        if (!this.getProfile()) {
            window.location.href = "index.html";
        }
    }
};