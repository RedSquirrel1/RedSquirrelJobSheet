const { app, BrowserWindow, session, shell } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
let win;
function createWindow(){
  win = new BrowserWindow({
    width: 1280, height: 900, minWidth: 1024, minHeight: 700,
    backgroundColor: '#ffffff', show: false, autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  session.defaultSession.setPermissionRequestHandler((webContents, permission, cb) => {
    if (permission === 'media') return cb(true); cb(false);
  });
  if (isDev){ win.loadURL('http://localhost:3000'); win.webContents.openDevTools({mode:'detach'}); }
  else { win.loadFile(path.join(__dirname, '../build/index.html')); }
  win.once('ready-to-show', ()=> win.show());
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', ()=> { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', ()=> { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
