/**
 * CV_Auto - Main Application Script
 * Developer: Benjamin K. Mazuya
 * Features: Multi-theme rendering, Bilingual support, OCR Scanner, and illicocash SaaS Paywall
 */

// Bilingual dictionary configuration
const dictionary = {
    fr: {
        app_title: "📝 Configuration du CV",
        lbl_lang: "Langue",
        lbl_theme: "Style / Couleur",
        lbl_photo: "Photo de profil",
        lbl_nom: "Nom complet",
        lbl_titre: "Titre du poste / Profil",
        lbl_contacts: "Contacts (Adresse, Tél)",
        lbl_liens: "Liens (Email, GitHub)",
        lbl_profil: "Accroche Professionnelle",
        sub_comp: "🛠️ Compétences",
        lbl_comp1: "Expertises Métier",
        lbl_comp2: "Technologies & Outils",
        sub_exp: "💼 Expérience",
        lbl_exp_titre: "Poste Occupé",
        lbl_exp_cie: "Entreprise & Ville",
        lbl_exp_dates: "Dates",
        lbl_exp_details: "Missions (Une par ligne)",
        sub_edu: "🎓 Éducation",
        lbl_edu_titre: "Diplôme obtenu ou visé",
        lbl_edu_dates: "Années",
        lbl_edu_details: "Établissement / Précisions",
        btn_print: "🖨️ Télécharger le CV en PDF",
        cv_photo_lbl: "PHOTO",
        cv_sec_profil: "Profil Professionnel",
        cv_sec_comp: "Matrice des Compétences",
        cv_sec_exp: "Expérience Professionnelle",
        cv_sec_edu: "Éducation & Formation",
        cv_lbl_comp1: "Expertises :",
        cv_lbl_comp2: "Technologies :",
        pw_title: "👑 Débloquez l'Espace Premium",
        pw_text: "Activez l'accès illimité à tous nos thèmes de design haute définition et supprimez définitivement le filigrane sur vos impressions PDF."
    },
    en: {
        app_title: "📝 CV Configuration",
        lbl_lang: "Language",
        lbl_theme: "Style / Color",
        lbl_photo: "Profile Picture",
        lbl_nom: "Full Name",
        lbl_titre: "Job Title / Professional Target",
        lbl_contacts: "Contacts (Address, Phone)",
        lbl_liens: "Links (Email, GitHub)",
        lbl_profil: "Professional Summary",
        sub_comp: "🛠️ Skills Matrix",
        lbl_comp1: "Core Competencies",
        lbl_comp2: "Technical Skills & Tools",
        sub_exp: "💼 Work Experience",
        lbl_exp_titre: "Job Title / Position",
        lbl_exp_cie: "Company & City",
        lbl_exp_dates: "Dates / Period",
        lbl_exp_details: "Key Responsibilities (One per line)",
        sub_edu: "🎓 Education",
        lbl_edu_titre: "Degree / Major",
        lbl_edu_dates: "Years",
        lbl_edu_details: "University / Institution",
        btn_print: "🖨️ Download CV as PDF",
        cv_photo_lbl: "PHOTO",
        cv_sec_profil: "Professional Summary",
        cv_sec_comp: "Skills Matrix",
        cv_sec_exp: "Professional Experience",
        cv_sec_edu: "Education & Background",
        cv_lbl_comp1: "Core Skills:",
        cv_lbl_comp2: "Technical:",
        pw_title: "👑 Unlock Premium Space",
        pw_text: "Activate unlimited access to all high-definition design themes and permanently remove the watermark on your PDF prints."
    }
};

// Global SaaS purchasing state variable
let userHasPaid = false; 

document.addEventListener("DOMContentLoaded", () => {
    
    const selectLang = document.getElementById("select-lang");
    const selectTheme = document.getElementById("select-theme");
    const cvTarget = document.getElementById("cv-target");

    // 1. Language switcher logic
    function applyLanguage(language) {
        const txt = dictionary[language];
        
        document.getElementById("ui-app-title").textContent = txt.app_title;
        document.getElementById("ui-lbl-lang").textContent = txt.lbl_lang;
        document.getElementById("ui-lbl-theme").textContent = txt.lbl_theme;
        document.getElementById("ui-lbl-photo").textContent = txt.lbl_photo;
        document.getElementById("ui-lbl-nom").textContent = txt.lbl_nom;
        document.getElementById("ui-lbl-titre").textContent = txt.lbl_titre;
        document.getElementById("ui-lbl-contacts").textContent = txt.lbl_contacts;
        document.getElementById("ui-lbl-liens").textContent = txt.lbl_liens;
        document.getElementById("ui-lbl-profil").textContent = txt.lbl_profil;
        document.getElementById("ui-sub-comp").textContent = txt.sub_comp;
        document.getElementById("ui-lbl-comp1").textContent = txt.lbl_comp1;
        document.getElementById("ui-lbl-comp2").textContent = txt.lbl_comp2;
        document.getElementById("ui-sub-exp").textContent = txt.sub_exp;
        document.getElementById("ui-lbl-exp-titre").textContent = txt.lbl_exp_titre;
        document.getElementById("ui-lbl-exp-cie").textContent = txt.lbl_exp_cie;
        document.getElementById("ui-lbl-exp-dates").textContent = txt.lbl_exp_dates;
        document.getElementById("ui-lbl-exp-details").textContent = txt.lbl_exp_details;
        document.getElementById("ui-sub-edu").textContent = txt.sub_edu;
        document.getElementById("ui-lbl-edu-titre").textContent = txt.lbl_edu_titre;
        document.getElementById("ui-lbl-edu-dates").textContent = txt.lbl_edu_dates;
        document.getElementById("ui-lbl-edu-details").textContent = txt.lbl_edu_details;
        document.getElementById("ui-btn-print").textContent = txt.btn_print;

        document.getElementById("ui-cv-photo-lbl").textContent = txt.cv_photo_lbl;
        document.getElementById("cv-sec-profil").textContent = txt.cv_sec_profil;
        document.getElementById("cv-sec-comp").textContent = txt.cv_sec_comp;
        document.getElementById("cv-sec-exp").textContent = txt.cv_sec_exp;
        document.getElementById("cv-sec-edu").textContent = txt.cv_sec_edu;
        document.getElementById("cv-lbl-comp1").textContent = txt.cv_lbl_comp1;
        document.getElementById("cv-lbl-comp2").textContent = txt.cv_lbl_comp2;
        
        document.getElementById("pw-title").textContent = txt.pw_title;
        document.getElementById("pw-text").textContent = txt.pw_text;
    }

    // 2. Input data synchronization with the A4 Document Template
    function updatePreview() {
        document.getElementById("cv-nom").textContent = document.getElementById("in-nom").value.toUpperCase();
        document.getElementById("cv-titre").textContent = document.getElementById("in-titre").value.toUpperCase();
        document.getElementById("cv-contacts").textContent = document.getElementById("in-contacts").value;
        document.getElementById("cv-liens").textContent = document.getElementById("in-liens").value;
        document.getElementById("cv-profil").textContent = document.getElementById("in-profil").value;
        document.getElementById("cv-comp1").textContent = document.getElementById("in-comp1").value;
        document.getElementById("cv-comp2").textContent = document.getElementById("in-comp2").value;
        
        document.getElementById("cv-exp-titre").textContent = document.getElementById("in-exp-titre").value;
        document.getElementById("cv-exp-cie").textContent = document.getElementById("in-exp-cie").value;
        document.getElementById("cv-exp-dates").textContent = document.getElementById("in-exp-dates").value;
        
        // Handles multi-line work responsibilities into bullet points
        const missionLines = document.getElementById("in-exp-details").value.split('\n');
        const ulMissions = document.getElementById("cv-exp-details");
        ulMissions.innerHTML = "";
        missionLines.forEach(line => {
            if(line.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = line;
                ulMissions.appendChild(li);
            }
        });

        document.getElementById("cv-edu-titre").textContent = document.getElementById("in-edu-titre").value;
        document.getElementById("cv-edu-dates").textContent = document.getElementById("in-edu-dates").value;
        document.getElementById("cv-edu-details").textContent = document.getElementById("in-edu-details").value;
    }

    // 3. Theme selector listener + Premium Paywall enforcement
    selectTheme.addEventListener("change", (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const isPremium = selectedOption.getAttribute("data-premium") === "true";

        if (isPremium && !userHasPaid) {
            ouvrirPaywall();
            // Instantly force back to a free basic layout template
            selectTheme.value = "theme-navy";
            cvTarget.className = "cv-container theme-navy";
        } else {
            cvTarget.className = "cv-container " + e.target.value;
        }
    });

    selectLang.addEventListener("change", (e) => {
        applyLanguage(e.target.value);
    });

    // 4. Profile Picture Processing (FileReader)
    const inputPhoto = document.getElementById("input-photo");
    inputPhoto.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function() {
                const imgElement = document.getElementById("cv-photo");
                const placeholder = document.getElementById("photo-placeholder");
                imgElement.src = this.result;
                imgElement.style.display = "block";
                placeholder.style.display = "none";
            });
            reader.readAsDataURL(file);
        }
    });

    // 5. Intelligent Bilingual OCR Engine Integration (Tesseract.js)
    const inputOcr = document.getElementById("input-ocr");
    const ocrStatus = document.getElementById("ocr-status");
    const ocrResult = document.getElementById("ocr-result");

    inputOcr.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            ocrStatus.textContent = "⏳ The system is analyzing your document...";
            ocrStatus.style.color = "#fbbf24";
            ocrResult.value = "";

            Tesseract.recognize(
                file,
                'fra+eng',
                { 
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            ocrStatus.textContent = `⏳ Scanning in progress: ${Math.round(m.progress * 100)}%`;
                        }
                    } 
                }
            ).then(({ data: { text } }) => {
                ocrStatus.textContent = "✅ Scan successful! Extracted text is displayed below.";
                ocrStatus.style.color = "#34d399";
                ocrResult.value = text;
            }).catch(err => {
                ocrStatus.textContent = "❌ Failed to read the document.";
                ocrStatus.style.color = "#f87171";
                console.error(err);
            });
        }
    });

    // Listen to real-time keystroke updates to instantly sync form to template view
    const allInputs = document.querySelectorAll(".editor-panel input, .editor-panel textarea");
    allInputs.forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    // Initialize application default language and sync state
    applyLanguage("fr");
    updatePreview();
});

// ==========================================================================
// SAAS PAYWALL INTERFACE & ILLICOCASH GATEWAY WORKFLOW (RAWBANK RDC)
// ==========================================================================
function ouvrirPaywall() {
    document.getElementById("paywall-modal").style.display = "flex";
}

function fermerPaywall() {
    document.getElementById("paywall-modal").style.display = "none";
}

/**
 * Executes a simulated secure transactional request to Rawbank's illicocash API Gateway
 */
function declencherPaiement() {
    // 1. Request the customer's linked illicocash phone identity number
    const phoneNumber = prompt("Enter your illicocash registered mobile number (e.g., +24397 32 92 227):");
    
    if (!phoneNumber || phoneNumber.trim() === "") {
        alert("❌ A valid mobile phone number is strictly required to process an illicocash gateway request.");
        return;
    }

    const btnPay = document.getElementById("btn-pay-now");
    btnPay.textContent = `⏳ Sending illicocash Push Notification to ${phoneNumber}...`;
    btnPay.disabled = true;

    /* PRODUCTION SERVER BACKEND LOGIC OUTLINE:
       1. Frontend posts the mobile identifier and fee ($4.99 USD) to our application server.
       2. Server safely executes an authenticated handshake with Rawbank's Gateway (https://api.illicocash.com/v1/payment).
       3. Rawbank securely triggers a Push/SMS asking the client for their cryptographic wallet PIN code.
       4. Upon authorization, Rawbank returns a secure verification token back to our application.
    */

    // Simulating transactional network latency and customer authorization delay (3.5 seconds)
    setTimeout(() => {
        // Mocking a successful response packet from Rawbank API
        const transactionIllicocashSuccessful = true; 

        if (transactionIllicocashSuccessful) {
            userHasPaid = true; // Elevate customer session authorization level to Premium
            
            // 1. Instantly remove UI Watermark overlay layer
            document.getElementById("cv-watermark").style.display = "none";
            
            // 2. Override stylesheet parameters to ensure clean, high-definition PDF prints without a watermark
            const stylePrintCleanup = document.createElement('style');
            stylePrintCleanup.innerHTML = "@media print { .watermark-premium { display: none !important; } }";
            document.head.appendChild(stylePrintCleanup);

            // 3. Close the checkout modal element safely
            fermerPaywall();
            
            alert(`🎉 Success! Payment of $4.99 verified via illicocash wallet (${phoneNumber}). Your Premium features are permanently activated. You can now select all premium templates and download your clean PDF CV without watermarks!`);
        } else {
            // Error handling fallback block (e.g., transaction timeout, client cancelled, or insufficient funds)
            btnPay.textContent = "💳 Activate now via Mobile Money / Card";
            btnPay.disabled = false;
            alert("❌ Transaction rejected. Please ensure your illicocash account has sufficient funds.");
        }
    }, 3500); 
}
