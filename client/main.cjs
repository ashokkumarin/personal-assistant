const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Try dev server first; if it fails, load built files
  const devUrl = 'http://localhost:5173'
  const prodIndex = path.join(__dirname, 'dist-electron', 'renderer', 'index.html')

  win.webContents.once('did-fail-load', () => {
    win.loadFile(prodIndex)
  })

  win.loadURL(devUrl)
}

app.whenReady().then(() => {
  createWindow()
})