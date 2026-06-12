/**
 * @file auth.js
 * @description Gestion simplifiée de la session utilisateur (Sans aucun code PIN).
 */

export const AuthService = {
    createProfile(nom, email, avatar) {
        const profile = { nom, email, avatar };
        localStorage.setItem("profilUtilisateur", JSON.stringify(profile));
        return profile;
    },
    getProfile() { 
        try {
            return JSON.parse(localStorage.getItem("profilUtilisateur")); 
        } catch (e) {
            return null;
        }
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