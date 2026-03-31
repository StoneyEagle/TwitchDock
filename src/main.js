const { app, BrowserWindow, ipcMain, session, Tray, Menu, nativeImage, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Simple JSON store since electron-store v8+ is ESM-only
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

let mainWindow;
let tray;
const chatWindows = new Map();
const rootDir = path.join(__dirname, '..');
const appIcon = nativeImage.createFromPath(path.join(rootDir, 'assets', 'icon.png'));
// In production, asarUnpack extracts to app.asar.unpacked/
const unpackedRoot = rootDir.replace('app.asar', 'app.asar.unpacked');
const ffzExtPath = path.join(unpackedRoot, 'assets', 'extensions', 'ffz');

function createTray() {
  tray = new Tray(appIcon);
  tray.setToolTip('TwitchDock');

  const contextMenu = Menu.buildFromTemplate([
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
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createMainWindow();
    }
  });
}

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

  // Hide to tray instead of closing
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createChatWindow(channel) {
  const key = channel.toLowerCase();

  // If already open for this channel, focus it instead
  if (chatWindows.has(key)) {
    const existing = chatWindows.get(key);
    if (!existing.isDestroyed()) {
      existing.focus();
      return;
    }
  }

  // Offset new windows so they don't stack exactly
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
      preload: path.join(__dirname, 'preloads', 'preload-chat.js'),
      contextIsolation: false,
      nodeIntegration: false,
      sandbox: false,
      partition: 'persist:twitch',
    },
  });

  chatWindows.set(key, chatWindow);
  chatWindow.setMenuBarVisibility(false);
  chatWindow.setOpacity(store.get('chatOpacity', 1));

  // Save position/size on move/resize
  const saveBounds = () => {
    if (!chatWindow.isDestroyed()) {
      store.set('chatBounds', chatWindow.getBounds());
    }
  };
  chatWindow.on('resize', saveBounds);
  chatWindow.on('move', saveBounds);

  const chatUrl = `https://www.twitch.tv/popout/${key}/chat?popout=`;
  chatWindow.loadURL(chatUrl);

  // Inject control bar
  chatWindow.webContents.on('dom-ready', () => {
    // Inject FFZ settings via chrome.storage.local
    const ffzSettings = store.get('ffzSettings', null);
    if (ffzSettings) {
      const storageData = {};
      for (const [k, v] of Object.entries(ffzSettings)) {
        storageData['FFZ:setting:' + k] = JSON.stringify(v);
      }
      const ffzInjectCode = fs.readFileSync(path.join(__dirname, 'ffz-inject.js'), 'utf8');
      chatWindow.webContents.executeJavaScript(`window.__TWITCHDOCK_FFZ_SETTINGS__ = ${JSON.stringify(storageData)};`)
        .then(() => chatWindow.webContents.executeJavaScript(ffzInjectCode))
        .catch(() => {});
    }

    // insertCSS injects as user-agent level - highest priority, can't be overridden
    const barCSS = fs.readFileSync(path.join(__dirname, 'bar.css'), 'utf8');
    chatWindow.webContents.insertCSS(barCSS);
    const opacity = store.get('chatOpacity', 1);
    const barCode = fs.readFileSync(path.join(__dirname, 'bar.js'), 'utf8');
    chatWindow.webContents.executeJavaScript(`window.__TWITCHDOCK_OPACITY__ = ${opacity};`)
      .then(() => chatWindow.webContents.executeJavaScript(barCode))
      .catch((e) => console.error('[Bar] Inject error:', e));

  });

  // Handle lock/pin/close via console message hack (no IPC needed)
  chatWindow.webContents.on('console-message', (event, level, msg) => {
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

// IPC handlers
ipcMain.handle('get-ffz-settings', () => {
  return store.get('ffzSettings', null);
});

ipcMain.on('get-ffz-settings-sync', (event) => {
  event.returnValue = store.get('ffzSettings', null);
});

ipcMain.handle('open-chat', (event, channel) => {
  store.set('lastChannel', channel);
  createChatWindow(channel);
  return true;
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

    // Store the FFZ settings so we can inject them into chat windows
    store.set('ffzSettings', data.values);

    return { ok: true, keys: Object.keys(data.values).length };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('quit-app', () => {
  app.isQuitting = true;
  app.quit();
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

    // Intercept Twitch's response and inject a script BEFORE their code runs
    // to override the browser support check
    loginWin.webContents.session.webRequest.onBeforeRequest(
      { urls: ['*://*.twitch.tv/*'] },
      (details, callback) => { callback({}); }
    );

    loginWin.webContents.on('did-finish-load', () => {
      loginWin.webContents.executeJavaScript(`
        // Override the browser check result in Twitch's state
        if (window.__twilight_store__) {
          try { window.__twilight_store__.getState().ui.browserNotSupported = false; } catch(e) {}
        }
      `).catch(() => {});
    });

    loginWin.loadURL('https://www.twitch.tv/login');

    loginWin.webContents.on('did-navigate', (event, url) => {
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

ipcMain.handle('is-logged-in', async () => {
  const twitchSession = session.fromPartition('persist:twitch');
  const cookies = await twitchSession.cookies.get({ domain: '.twitch.tv', name: 'auth-token' });
  if (!cookies.length) return { loggedIn: false };
  // Get the login name from the login cookie
  const loginCookies = await twitchSession.cookies.get({ domain: '.twitch.tv', name: 'login' });
  const name = loginCookies.length ? loginCookies[0].value : null;
  return { loggedIn: true, name };
});

ipcMain.handle('get-last-channel', () => {
  return store.get('lastChannel', '');
});

ipcMain.handle('get-state', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return {
    locked: win ? !win.isMovable() : false,
    alwaysOnTop: win ? win.isAlwaysOnTop() : false,
  };
});

ipcMain.handle('toggle-lock', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return false;
  const locked = win.isMovable();  // if currently movable, we're locking it
  win.setMovable(!locked);
  win.setResizable(!locked);
  return locked;
});

ipcMain.handle('toggle-always-on-top', (event) => {
  let win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    // Fallback: find the parent window of this webContents
    for (const bw of BrowserWindow.getAllWindows()) {
      if (bw.webContents === event.sender || bw.webContents.id === event.sender.id) {
        win = bw;
        break;
      }
    }
  }
  if (!win || win.isDestroyed()) return false;
  const aot = !win.isAlwaysOnTop();
  win.setAlwaysOnTop(aot);
  return aot;
});

// App events
app.on('ready', () => {
  store._load();

  const twitchSession = session.fromPartition('persist:twitch');
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

  // Set user agent at the app level so navigator.userAgent matches
  twitchSession.setUserAgent(userAgent);
  session.defaultSession.setUserAgent(userAgent);

  for (const ses of [session.defaultSession, twitchSession]) {
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['User-Agent'] = userAgent;
      callback({ requestHeaders: details.requestHeaders });
    });

    // Strip all CSP headers (case insensitive)
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

  // Load FrankerFaceZ Chrome extension
  twitchSession.loadExtension(ffzExtPath, { allowFileAccess: true })
    .then((ext) => console.log('[FFZ] Extension loaded:', ext.name, ext.version))
    .catch((err) => console.error('[FFZ] Failed to load extension:', err));

  createTray();
  createMainWindow();

  // Auto-open login if not already logged in
  twitchSession.cookies.get({ domain: '.twitch.tv', name: 'auth-token' }).then((cookies) => {
    if (!cookies.length) {
      console.log('[Auth] No auth cookie found, opening login...');
      ipcMain.emit('twitch-login');
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.executeJavaScript(`
            document.getElementById('twitch-login').click();
          `).catch(() => {});
        });
      }
    } else {
      console.log('[Auth] Already logged in');
    }
  });
});

app.on('window-all-closed', () => {
  // Don't quit - tray keeps app alive
});

app.on('activate', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
  }
});
