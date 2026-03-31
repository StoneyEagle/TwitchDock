const { app, BrowserWindow, ipcMain, session, Tray, Menu, nativeImage, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Store ──────────────────────────────────────────────────────────────────────

let storePath;
const store = {
  _data: {},
  _load() {
    storePath = path.join(app.getPath('userData'), 'settings.json');
    try { this._data = JSON.parse(fs.readFileSync(storePath, 'utf8')); } catch { this._data = {}; }
  },
  get(key, def) { return this._data[key] !== undefined ? this._data[key] : def; },
  set(key, val) { this._data[key] = val; fs.writeFileSync(storePath, JSON.stringify(this._data, null, 2)); },
};

// ── Constants ──────────────────────────────────────────────────────────────────

let mainWindow;
let tray;
const chatWindows = new Map();
const rootDir = path.join(__dirname, '..');
const appIcon = nativeImage.createFromPath(path.join(rootDir, 'assets', 'icon.png'));
const unpackedRoot = rootDir.replace('app.asar', 'app.asar.unpacked');
const ffzExtPath = path.join(unpackedRoot, 'assets', 'extensions', 'ffz');

// Cache file reads so we don't hit disk on every dom-ready
const barCSS = fs.readFileSync(path.join(__dirname, 'bar.css'), 'utf8');
const barJS = fs.readFileSync(path.join(__dirname, 'bar.js'), 'utf8');
const ffzInjectJS = fs.readFileSync(path.join(__dirname, 'ffz-inject.js'), 'utf8');

// ── Tray ───────────────────────────────────────────────────────────────────────

function createTray() {
  tray = new Tray(appIcon);
  tray.setToolTip('TwitchDock');

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createMainWindow();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]));

  tray.on('double-click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createMainWindow();
    }
  });
}

// ── Main Window ────────────────────────────────────────────────────────────────

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 310,
    resizable: false,
    title: 'TwitchDock',
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, 'preloads', 'preload-main.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'pages', 'index.html'));

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

// ── Chat Window ────────────────────────────────────────────────────────────────

function createChatWindow(channel) {
  const key = channel.toLowerCase();

  if (chatWindows.has(key)) {
    const existing = chatWindows.get(key);
    if (!existing.isDestroyed()) {
      existing.focus();
      return;
    }
  }

  const offset = chatWindows.size * 30;
  const bounds = store.get('chatBounds', { width: 400, height: 750 });

  const chatWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x != null ? bounds.x + offset : undefined,
    y: bounds.y != null ? bounds.y + offset : undefined,
    minWidth: 300,
    minHeight: 200,
    title: `${channel} - Twitch Chat`,
    icon: appIcon,
    frame: false,
    transparent: false,
    alwaysOnTop: store.get('alwaysOnTop', false),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      sandbox: false,
      partition: 'persist:twitch',
    },
  });

  chatWindows.set(key, chatWindow);
  chatWindow.setMenuBarVisibility(false);
  chatWindow.setOpacity(store.get('chatOpacity', 1));

  const saveBounds = () => {
    if (!chatWindow.isDestroyed()) {
      store.set('chatBounds', chatWindow.getBounds());
    }
  };
  chatWindow.on('resize', saveBounds);
  chatWindow.on('move', saveBounds);

  chatWindow.loadURL(`https://www.twitch.tv/popout/${key}/chat?popout=`);

  // Inject FFZ settings and control bar on page load
  chatWindow.webContents.on('dom-ready', () => {
    // FFZ settings → chrome.storage.local
    const ffzSettings = store.get('ffzSettings', null);
    if (ffzSettings) {
      const storageData = {};
      for (const [k, v] of Object.entries(ffzSettings)) {
        storageData['FFZ:setting:' + k] = JSON.stringify(v);
      }
      chatWindow.webContents.executeJavaScript(`window.__TWITCHDOCK_FFZ_SETTINGS__ = ${JSON.stringify(storageData)};`)
        .then(() => chatWindow.webContents.executeJavaScript(ffzInjectJS))
        .catch(() => {});
    }

    // Control bar
    chatWindow.webContents.insertCSS(barCSS);
    const opacity = store.get('chatOpacity', 1);
    chatWindow.webContents.executeJavaScript(`window.__TWITCHDOCK_OPACITY__ = ${opacity};`)
      .then(() => chatWindow.webContents.executeJavaScript(barJS))
      .catch(() => {});
  });

  // Handle bar button actions via console messages
  chatWindow.webContents.on('console-message', (_e, _level, msg) => {
    if (msg === '__lock__') {
      const locked = chatWindow.isMovable();
      chatWindow.setMovable(!locked);
      chatWindow.setResizable(!locked);
      chatWindow.webContents.executeJavaScript(
        `document.querySelector('#overlay-bar .b').classList.toggle('on', ${locked})`
      ).catch(() => {});
    } else if (msg === '__pin__') {
      const aot = !chatWindow.isAlwaysOnTop();
      chatWindow.setAlwaysOnTop(aot);
      chatWindow.webContents.executeJavaScript(
        `document.querySelectorAll('#overlay-bar .b')[1].classList.toggle('on', ${aot})`
      ).catch(() => {});
    } else if (msg.startsWith('__opacity__')) {
      const val = parseFloat(msg.split('__opacity__')[1]);
      if (!isNaN(val)) {
        chatWindow.setOpacity(val);
        store.set('chatOpacity', val);
      }
    }
  });

  chatWindow.on('closed', () => {
    chatWindows.delete(key);
  });
}

// ── IPC Handlers ───────────────────────────────────────────────────────────────

ipcMain.handle('open-chat', (_e, channel) => {
  store.set('lastChannel', channel);
  createChatWindow(channel);
  return true;
});

ipcMain.handle('get-last-channel', () => store.get('lastChannel', ''));

ipcMain.handle('open-external', (_e, url) => shell.openExternal(url));

ipcMain.handle('quit-app', () => {
  app.isQuitting = true;
  app.quit();
});

ipcMain.handle('import-ffz-settings', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import FFZ Settings',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths.length) return false;

  try {
    const raw = fs.readFileSync(result.filePaths[0], 'utf8');
    const data = JSON.parse(raw);
    if (!data.values || data.type !== 'full') {
      return { error: 'Not a valid FFZ settings export' };
    }
    store.set('ffzSettings', data.values);
    return { ok: true, keys: Object.keys(data.values).length };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle('is-logged-in', async () => {
  const twitchSession = session.fromPartition('persist:twitch');
  const cookies = await twitchSession.cookies.get({ domain: '.twitch.tv', name: 'auth-token' });
  if (!cookies.length) return { loggedIn: false };
  const loginCookies = await twitchSession.cookies.get({ domain: '.twitch.tv', name: 'login' });
  return { loggedIn: true, name: loginCookies.length ? loginCookies[0].value : null };
});

ipcMain.handle('twitch-login', () => {
  return new Promise((resolve) => {
    const loginWin = new BrowserWindow({
      width: 480,
      height: 750,
      title: 'Twitch Login',
      icon: appIcon,
      webPreferences: {
        partition: 'persist:twitch',
        preload: path.join(__dirname, 'preloads', 'preload-twitch.js'),
        contextIsolation: false,
      },
    });
    loginWin.setMenuBarVisibility(false);
    loginWin.loadURL('https://www.twitch.tv/login');

    loginWin.webContents.on('did-navigate', (_e, url) => {
      if (url.includes('twitch.tv') && !url.includes('/login') && !url.includes('/passport-callback')) {
        setTimeout(() => {
          loginWin.close();
          resolve({ ok: true });
        }, 1000);
      }
    });
    loginWin.on('closed', () => resolve({ ok: false }));
  });
});

// ── App Events ─────────────────────────────────────────────────────────────────

app.on('ready', () => {
  store._load();

  const twitchSession = session.fromPartition('persist:twitch');
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

  twitchSession.setUserAgent(userAgent);
  session.defaultSession.setUserAgent(userAgent);

  for (const ses of [session.defaultSession, twitchSession]) {
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['User-Agent'] = userAgent;
      callback({ requestHeaders: details.requestHeaders });
    });

    ses.webRequest.onHeadersReceived((details, callback) => {
      const headers = {};
      for (const [key, val] of Object.entries(details.responseHeaders || {})) {
        if (!key.toLowerCase().startsWith('content-security-policy')) {
          headers[key] = val;
        }
      }
      callback({ responseHeaders: headers });
    });
  }

  twitchSession.loadExtension(ffzExtPath, { allowFileAccess: true })
    .then((ext) => console.log('[FFZ] Extension loaded:', ext.name, ext.version))
    .catch((err) => console.error('[FFZ] Failed to load extension:', err));

  createTray();
  createMainWindow();

  // Auto-open login if not authenticated
  twitchSession.cookies.get({ domain: '.twitch.tv', name: 'auth-token' }).then((cookies) => {
    if (!cookies.length) {
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(
          `document.getElementById('twitch-login').click();`
        ).catch(() => {});
      });
    }
  });
});

app.on('window-all-closed', () => {});

app.on('activate', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
  }
});
