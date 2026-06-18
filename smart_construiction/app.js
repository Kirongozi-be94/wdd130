const THREE = require('three');
// Outil officiel pour contrôler la caméra à la souris
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js');

// --- 1. CONFIGURATION DU MOTEUR 3D ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a); // Fond sombre style logiciel d'ingénieur

// Caméra
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(15, 10, 15); // Position de départ en hauteur

// Moteur de rendu
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Contrôles de la caméra (Souris : Clic gauche pour tourner, Clic droit pour glisser, Molette pour zoomer)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Rend les mouvements fluides

// --- 2. LUMIÈRES ET SOL ---
const light = new THREE.AmbientLight(0xffffff, 0.7); // Lumière ambiante
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // Lumière du soleil
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Le Sol (Terrain de construction)
const gridHelper = new THREE.GridHelper(30, 30, 0x0078d4, 0x444444); // Grille bleue d'ingénieur
scene.add(gridHelper);

// --- 3. CRÉATION DE LA MAISON (ÉLÉMENTS 3D) ---
// Matériaux de base
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x990000, roughness: 0.5 }); // Toiture propre rouge

// Groupe pour rassembler la maison
const houseGroup = new THREE.Group();
scene.add(houseGroup);

let wallsMesh, roofMesh;

function genererMaison3D(longueur, largeur) {
    // Supprimer l'ancienne maison si elle existe
    if (wallsMesh) houseGroup.remove(wallsMesh);
    if (roofMesh) houseGroup.remove(roofMesh);

    const hauteurMurs = 3;

    // Murs (Une boîte pour l'instant)
    const wallGeometry = new THREE.BoxGeometry(longueur, hauteurMurs, largeur);
    wallsMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallsMesh.position.y = hauteurMurs / 2; // Poser les murs sur le sol
    houseGroup.add(wallsMesh);

    // Toiture Propre (Une pyramide / cône à 4 faces)
    const roofGeometry = new THREE.ConeGeometry(Math.max(longueur, largeur) * 0.8, 2, 4);
    roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.y = hauteurMurs + 1; // Poser le toit au-dessus des murs
    roofMesh.rotation.y = Math.PI / 4; // Aligner les coins du toit avec les murs
    houseGroup.add(roofMesh);
}

// --- 4. ALGORITHME DE PRÉCISION INGÉNIEUR ---
function calculerNormes() {
    const L = parseFloat(document.getElementById('length').value);
    const l = parseFloat(document.getElementById('width').value);
    const couleurPeinture = document.getElementById('wallColor').value;

    // Appliquer la couleur choisie en direct sur la 3D
    wallMaterial.color.set(couleurPeinture);

    // Mettre à jour la taille de la maison en 3D
    genererMaison3D(L, l);

    // Calculs de précision (Normes Standards)
    const surfaceSol = L * l;
    const perimetre = (L + l) * 2;
    const surfaceMurs = perimetre * 3; // Hauteur fixe de 3m
    const volumeBetonFondation = surfaceSol * 0.20; // Dalle standard de 20cm d'épaisseur
    const litresPeinture = Math.ceil(surfaceMurs / 6); // 1 Litre couvre environ 6m² en 2 couches

    // Affichage des résultats
    document.getElementById('resultats').innerHTML = `
        <hr>
        <p><strong>📊 Calculs d'Ingénierie :</strong></p>
        <p>📐 Surface au sol : ${surfaceSol.toFixed(2)} m²</p>
        <p>🧱 Béton Fondation (20cm) : ${volumeBetonFondation.toFixed(2)} m³</p>
        <p>🎨 Surface Peinture : ${surfaceMurs.toFixed(2)} m²</p>
        <p>🪣 Peinture requise : ${litresPeinture} Litres</p>
    `;
}

// Événement sur le bouton de calcul
document.getElementById('btnCalculer').addEventListener('click', calculerNormes);

// Générer la maison par défaut au démarrage
genererMaison3D(10, 8);
calculerNormes();

// --- 5. BOUCLE DE RENDU (ANIMATION DU JEU) ---
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Met à jour la caméra selon les mouvements de la souris
    renderer.render(scene, camera);
}
animate();

// Ajuster la taille si la fenêtre change
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});