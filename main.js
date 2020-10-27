const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  console.log('app_version',app.getVersion());
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  console.log('update-available')
  mainWindow.webContents.send('update_available');
});

/*New Update Available*/
autoUpdater.on("update-available", info => {
  console.log('update not available')
  mainWindow.webContents.send('update_not_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
