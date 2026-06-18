const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#020c1b', // Évite le flash blanc au démarrage
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Utilisation du chemin absolu pour être sûr à 100% qu'Electron trouve le fichier
  win.loadURL(`file://${__dirname}/index.html`);

  // SÉCURITÉ : Ouvre les outils de développement en cas d'erreur cachée
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log(`Erreur de chargement: ${errorDescription} (${errorCode})`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});