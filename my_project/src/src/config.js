/**
 * @file config.js
 * @description Centralisation des constantes et configurations de l'application.
 */

export const CONFIG = {
    LANGUE_DEFAUT: 'fr-FR',
    RAYON_TERRE_KM: 6371
};

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