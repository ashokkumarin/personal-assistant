import { app, BrowserWindow } from 'electron'
import * as path from 'path'


function createWindow() {
const win = new BrowserWindow({
width: 900,
height: 700,
webPreferences: {
preload: path.join(__dirname, 'preload.js'),
contextIsolation: true,
nodeIntegration: false
}
})


// during dev, vite serves on 5173
if (process.env.NODE_ENV === 'development') {
win.loadURL('http://localhost:5173')
} else {
win.loadFile(path.join(__dirname, '../renderer/index.html'))
}
}


app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
if (process.platform !== 'darwin') app.quit()
})