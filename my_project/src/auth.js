/**
 * @file auth.js
 * @description Gestion simplifiée de la session utilisateur sans code PIN.
 */

export const AuthService = {
    createProfile(nom, email, avatar) {
        const profile = { nom, email, avatar };
        localStorage.setItem("profilUtilisateur", JSON.stringify(profile));
        return profile;
    },
    getProfile() { 
        return JSON.parse(localStorage.getItem("profilUtilisateur")); 
    },
    logout() { 
        localStorage.removeItem("profilUtilisateur"); 
        window.location.href = "index.html"; 
    },
    requireAuth() { 
        if (!this.getProfile()) window.location.href = "index.html"; 
    }
};