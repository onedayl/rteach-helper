import axios from 'axios'
import fs from 'fs'
import {app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import localhost from '@/localhost.js'
import proxy from '@/proxy.js'
import url from 'url'

// Init

let win
const isDevelopment = process.env.NODE_ENV !== 'production'
const proxyServer = proxy.createProxyServer()
const baseUrl = 'http://h5.rteach.com/services/citem/cfeedbackservice/queryfeedbackdetail'

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

const state = {
  ip: localhost.getIp(),
  connected: false,
  authorized: false,
  key: '',
  downlaodPath: '',
}


// Functions

function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 720,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
    icon: `${__static}/app.ico`
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}

// Listeners

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

proxyServer.on('request', req => {
  if (!state.connected) {
    state.connected = true
    win.webContents.send('connected')
  }

  if ( req.method === 'POST' && /rteach/.test(req.url)) {
    const { query, pathname } = url.parse(req.url)
    if (/querysummaryinfo/.test(pathname)) {
      const matches = /key\=([0-9a-z\-]+)/.exec(query)
      
      if (matches) {
        const key = matches[1]
        state.key = key
        win.webContents.send('authorized', { key })
        proxyServer.close(() => {
          win.webContents.send('disconnected')
        })
      }
    }
  }
})

ipcMain.once('mounted', evt => {
  proxyServer.listen(8888, () => {
    evt.sender.send('listening', { ip: state.ip })
  })
})

ipcMain.on('openDirectory', async evt => {
  const { filePaths } =  await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (filePaths.length !== 0) {
    state.downlaodPath = filePaths[0]
    evt.sender.send('confirmDirectory', { path: filePaths[0] })
  }
})

ipcMain.on('download', async (evt, msg) => {
  try {
    const url = `${baseUrl}?key=${state.key}`
    const res = await axios.post(url, {
      ver: '1.0',
      source_id: 'channel_wx',
      feedbackid: msg.fid,
      size: 75,
    })
    
    const photos = res.data.data
    if (photos !== undefined && photos.length !== 0) {
      console.log(`Downloading ${photos.length} photos of ${msg.date} | ${new Date()}`)
      for (let j = 0; j < photos.length; j++) {
        const photoData = await axios({
          method: 'get',
          url: photos[j].normalurl,
          responseType: 'stream'
        })
        photoData.data.pipe(fs.createWriteStream(`${state.downlaodPath}/${msg.date}-${j + 1 }.jpg`))
      }
    }
  } catch (error) {
    console.log(error)
  }
})



