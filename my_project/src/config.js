/**
 * @file config.js
 * @description Constantes globales, bases de données logistiques et dictionnaires linguistiques.
 */

export const CONFIG = { RAYON_TERRE_KM: 6371 };

export const CITIES_DATABASE = {
    "kinshasa": { name: "Kinshasa", coords: [-4.4419, 15.2663] },
    "lubumbashi": { name: "Lubumbashi", coords: [-11.6708, 27.4792] },
    "kolwezi": { name: "Kolwezi", coords: [-10.7167, 25.4667] },
    "kisangani": { name: "Kisangani", coords: [0.5167, 25.1833] },
    "goma": { name: "Goma", coords: [-1.6833, 29.2167] },
    "bukavu": { name: "Bukavu", coords: [-2.5, 28.3667] }
};

export const TRANSPORT_SPEEDS = {
    car: { good: 80, average: 60, bad: 40 },
    plane: { good: 800, average: 800, bad: 800 },
    motorcycle: { good: 60, average: 40, bad: 20 }
};

export const TRANSLATIONS = {
    fr: {
        retourHub: "⬅️ Retour au Tableau de bord",
        titreLogin: "Créer votre profil",
        btnSubmitLogin: "Enregistrer et Déverrouiller",
        btnChronoLink: "⏱️ Module Chronomètre & Agenda",
        btnTravelLink: "🌍 Module Congo Travel Planner",
        btnLogout: "Changer de profil 🔄",
        titreChrono: "Chronomètre",
        titreAgenda: "Rappel de Rendez-vous",
        btnAddAgenda: "Ajouter à l'agenda",
        btnToggleAgendaShow: "Afficher mes rendez-vous 👁️",
        btnToggleAgendaHide: "Masquer les données 🙈",
        titreCapteurs: "🧭 Géolocalisation & Boussole",
        btnGps: "Activer mon GPS / GPRS 🛰️",
        posGeodesique: "Position Géodésique :",
        btnBoussole: "Activer la Boussole 🧭",
        titreTravel: "🌍 Congo Travel Planner",
        lblChoice: "Type de calcul de routage :",
        optChoice1: "Calculer la distance entre deux villes",
        optChoice2: "Calculer le vecteur depuis Kinshasa",
        lblDepart: "Ville Départ :",
        lblArrivee: "Ville Arrivée :",
        lblEtatRoute: "État de la route :",
        optRoad1: "Bon (Asphalte / Stable)",
        optRoad2: "Moyen (Piste praticable)",
        optRoad3: "Mauvais (Critique) ⚠️ Vecteur Air recommandé",
        lblTransport: "Vecteur de Transport :",
        optTrans1: "Véhicule (Car)",
        optTrans2: "Aéronef (Plane)",
        optTrans3: "Moto (Motorcycle)",
        btnCalculer: "Calculer la cinématique 🚀"
    },
    en: {
        retourHub: "⬅️ Back to Dashboard",
        titreLogin: "Create your profile",
        btnSubmitLogin: "Register and Unlock",
        btnChronoLink: "⏱️ Stopwatch & Schedule Module",
        btnTravelLink: "🌍 Congo Travel Planner Module",
        btnLogout: "Change profile 🔄",
        titreChrono: "Stopwatch",
        titreAgenda: "Appointment Reminder",
        btnAddAgenda: "Add to schedule",
        btnToggleAgendaShow: "Show my appointments 👁️",
        btnToggleAgendaHide: "Hide data 🙈",
        titreCapteurs: "🧭 Geolocation & Compass",
        btnGps: "Activate GPS / GPRS 🛰️",
        posGeodesique: "Geodetic Position:",
        btnBoussole: "Activate Compass 🧭",
        titreTravel: "🌍 Congo Travel Planner",
        lblChoice: "Routing calculation type:",
        optChoice1: "Calculate distance between two cities",
        optChoice2: "Calculate vector from Kinshasa",
        lblDepart: "Start City:",
        lblArrivee: "Destination City:",
        lblEtatRoute: "Road Status:",
        optRoad1: "Good (Asphalt / Stable)",
        optRoad2: "Average (Passable track)",
        optRoad3: "Bad (Critical) ⚠️ Air Vector Recommended",
        lblTransport: "Transport Vector:",
        optTrans1: "Vehicle (Car)",
        optTrans2: "Aircraft (Plane)",
        optTrans3: "Motorcycle",
        btnCalculer: "Calculate kinematics 🚀"
    }
};