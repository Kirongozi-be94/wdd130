/**
 * @file app.js
 * @description Gestion des utilitaires de Kolwezi (Météo, Monnaies, Carte)
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. MÉTÉO AUTOMATIQUE POUR KOLWEZI ---
    const weatherDesc = document.getElementById("weather-desc");
    const weatherTemp = document.getElementById("weather-temp");

    if (weatherDesc && weatherTemp) {
        // Simulation temps réel adaptée au climat tropical d'altitude de Kolwezi
        setTimeout(() => {
            weatherDesc.textContent = "☀️ Sunny with light breeze (Dry Season)";
            weatherTemp.textContent = "26°C";
        }, 800);
    }

    // --- 2. CONVERTISSEUR DE MONNAIE (TAUX 2026 : 1 USD = 2800 CDF) ---
    const RATE = 2800; 
    const btnConvert = document.getElementById("btn-convert");
    const amountInput = document.getElementById("currency-amount");
    const directionSelect = document.getElementById("currency-direction");
    const resultBox = document.getElementById("converter-result");

    btnConvert?.addEventListener("click", () => {
        if (!amountInput || !directionSelect || !resultBox) return;
        
        const val = parseFloat(amountInput.value);
        const dir = directionSelect.value;
        
        if (isNaN(val) || val <= 0) {
            resultBox.textContent = "Please enter a valid amount.";
            resultBox.classList.remove("d-none");
            return;
        }

        if (dir === "USD_CDF") {
            const res = val * RATE;
            resultBox.innerHTML = `💵 <strong>${val.toLocaleString()} USD</strong> = 🇨🇩 <strong>${res.toLocaleString()} CDF</strong>`;
        } else {
            const res = val / RATE;
            resultBox.innerHTML = `🇨🇩 <strong>${val.toLocaleString()} CDF</strong> = 💵 <strong>${res.toFixed(2)} USD</strong>`;
        }
        resultBox.classList.remove("d-none");
    });

    // --- 3. LOGIQUE DE LA CARTE INTERACTIVE SIMULÉE ---
    const mapText = document.getElementById("map-text");
    const mapMarker = document.getElementById("map-marker");
    const placeButtons = document.querySelectorAll(".btn-place");

    placeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Retirer l'état actif des autres boutons
            placeButtons.forEach(b => b.classList.remove("btn-primary"));
            btn.classList.add("btn-primary");

            const lat = btn.getAttribute("data-lat");
            const lon = btn.getAttribute("data-lon");
            const desc = btn.getAttribute("data-desc");

            if (mapText && mapMarker) {
                mapText.innerHTML = `<strong>${btn.textContent}</strong><br>${desc}<br><small>GPS: ${lat}, ${lon}</small>`;
                // Animation de ciblage visuel du marqueur
                mapMarker.style.transform = "scale(1.5)";
                setTimeout(() => mapMarker.style.transform = "scale(1)", 300);
            }
        });
    });
});