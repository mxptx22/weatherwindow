const { app, BrowserWindow, Menu } = require('electron')
let win = null
const isMac = process.platform === 'darwin'




const createWindow = () => {
     win = new BrowserWindow({
      titleBarStyle: 'hidden',
      width: 1200,
      height: 800,
      minHeight:760,
      minWidth:500,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
  
    win.loadFile('index.html')
  }

  app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
  })

  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { label: 'Configuration', click: () => { win.webContents.send('ping', 'whoooooooh!') }},
        { role: 'reload' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'Settings',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)