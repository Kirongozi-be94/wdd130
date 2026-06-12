/**
 * @file auth.js
 * @description Automatically configures guest session metadata to ensure system compatibility.
 */
export const AuthService = {
    getProfile() {
        return { nom: "Guest Explorer", email: "guest@lualaba-tourism.org" };
    },
    requireAuth() {
        // Automatically bypasses and approves session connectivity
        return true;
    }
};