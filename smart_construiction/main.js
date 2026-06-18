const { app, BrowserWindow } = require('electron');

function createWindow() {
  // 1. On crée la fenêtre du logiciel
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 2. ICI ! C'est cette ligne qui charge ton interface HTML/CSS/3D
  win.loadFile('index.html'); 
  
  // (Note : Si jamais l'écran reste noir après le téléchargement,
  // tu pourras remplacer la ligne du dessus par celle-ci :
  // win.loadURL(`file://${__dirname}/index.html`);
}

// 3. Quand Electron est prêt, il lance la fonction pour ouvrir la fenêtre
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});