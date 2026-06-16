document.addEventListener("DOMContentLoaded", () => {
    
    // Fonction globale de mise à jour de l'aperçu
    function updatePreview() {
        // Textes simples
        document.getElementById("cv-nom").textContent = document.getElementById("in-nom").value.toUpperCase();
        document.getElementById("cv-titre").textContent = document.getElementById("in-titre").value.toUpperCase();
        document.getElementById("cv-contacts").textContent = document.getElementById("in-contacts").value;
        document.getElementById("cv-liens").textContent = document.getElementById("in-liens").value;
        document.getElementById("cv-profil").textContent = document.getElementById("in-profil").value;
        document.getElementById("cv-comp1").textContent = document.getElementById("in-comp1").value;
        document.getElementById("cv-comp2").textContent = document.getElementById("in-comp2").value;
        
        // Bloc Expérience
        document.getElementById("cv-exp-titre").textContent = document.getElementById("in-exp-titre").value;
        document.getElementById("cv-exp-cie").textContent = document.getElementById("in-exp-cie").value;
        document.getElementById("cv-exp-dates").textContent = document.getElementById("in-exp-dates").value;
        
        // Traitement des puces (Missions brisées par ligne)
        const lignesMission = document.getElementById("in-exp-details").value.split('\n');
        const ulMissions = document.getElementById("cv-exp-details");
        ulMissions.innerHTML = "";
        lignesMission.forEach(ligne => {
            if(ligne.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = ligne;
                ulMissions.appendChild(li);
            }
        });

        // Bloc Éducation
        document.getElementById("cv-edu-titre").textContent = document.getElementById("in-edu-titre").value;
        document.getElementById("cv-edu-dates").textContent = document.getElementById("in-edu-dates").value;
        document.getElementById("cv-edu-details").textContent = document.getElementById("in-edu-details").value;
    }

    // Gestion de l'upload d'image en local (FileReader)
    const inputPhoto = document.getElementById("input-photo");
    inputPhoto.addEventListener("change", function() {
        const fichier = this.files[0];
        if (fichier) {
            const lecteur = new FileReader();
            lecteur.addEventListener("load", function() {
                const imgElement = document.getElementById("cv-photo");
                const placeholder = document.getElementById("photo-placeholder");
                
                imgElement.src = this.result;
                imgElement.style.display = "block";
                placeholder.style.display = "none";
            });
            lecteur.readAsDataURL(fichier);
        }
    });

    // Liaison de tous les inputs du formulaire au moteur de rendu
    const allInputs = document.querySelectorAll(".editor-panel input, .editor-panel textarea");
    allInputs.forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    // Initialisation au démarrage avec les valeurs par défaut
    updatePreview();
});