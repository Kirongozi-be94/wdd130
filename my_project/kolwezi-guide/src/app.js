/**
 * @file app.js
 * @description Controls Weather simulations (Day/Night aware), Currency processing, and Directory mappings.
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. DYNAMIC DAY/NIGHT AWARE WEATHER DISPLAY ---
    const weatherDesc = document.getElementById("weather-desc");
    const weatherTemp = document.getElementById("weather-temp");

    if (weatherDesc && weatherTemp) {
        setTimeout(() => {
            // Get the current local hour from the device browser clock
            const currentHour = new Date().getHours();
            
            // Check if it is night time (between 6 PM / 18:00 and 6 AM / 06:00)
            const isNight = currentHour >= 18 || currentHour < 6;

            if (isNight) {
                // Night-time environment configuration
                weatherDesc.textContent = "🌙 Clear sky, refreshing breeze (Dry Season Night)";
                weatherTemp.textContent = "16°C"; // Temperatures naturally drop at night in Kolwezi's high altitude
            } else {
                // Day-time environment configuration
                weatherDesc.textContent = "☀️ Clear skies, moderate wind (Dry Season Day)";
                weatherTemp.textContent = "26°C";
            }
        }, 800);
    }

    // --- 2. FISCAL CURRENCY EXCHANGE CONVERTER ---
    const CONVERSION_RATE = 2800; 
    const btnConvert = document.getElementById("btn-convert");
    const amountInput = document.getElementById("currency-amount");
    const directionSelect = document.getElementById("currency-direction");
    const resultBox = document.getElementById("converter-result");

    btnConvert?.addEventListener("click", () => {
        if (!amountInput || !directionSelect || !resultBox) return;
        const value = parseFloat(amountInput.value);
        const direction = directionSelect.value;
        
        if (isNaN(value) || value <= 0) {
            resultBox.textContent = "Error: Input must be greater than zero.";
            resultBox.classList.remove("d-none");
            return;
        }

        if (direction === "USD_CDF") {
            const calculated = value * CONVERSION_RATE;
            resultBox.innerHTML = `💵 <strong>${value.toLocaleString()} USD</strong> = 🇨🇩 <strong>${calculated.toLocaleString()} CDF</strong>`;
        } else {
            const calculated = value / CONVERSION_RATE;
            resultBox.innerHTML = `🇨🇩 <strong>${value.toLocaleString()} CDF</strong> = 💵 <strong>${calculated.toFixed(2)} USD</strong>`;
        }
        resultBox.classList.remove("d-none");
    });

    // --- 3. DYNAMIC SCHEMATIC DIRECTORY SELECTOR ---
    const mapText = document.getElementById("map-text");
    const mapMarker = document.getElementById("map-marker");
    const placeButtons = document.querySelectorAll(".btn-place");

    placeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            placeButtons.forEach(b => b.classList.remove("btn-primary"));
            btn.classList.add("btn-primary");
            const latitude = btn.getAttribute("data-lat");
            const longitude = btn.getAttribute("data-lon");
            const description = btn.getAttribute("data-desc");

            if (mapText && mapMarker) {
                mapText.innerHTML = `<strong>${btn.textContent}</strong><br>${description}<br><small>GPS Frame: ${latitude}, ${longitude}</small>`;
                mapMarker.style.transform = "scale(1.5)";
                setTimeout(() => mapMarker.style.transform = "scale(1)", 300);
            }
        });
    });
});