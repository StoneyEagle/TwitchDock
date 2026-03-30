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
const ffzExtPath = path.join(rootDir, 'assets', 'extensions', 'ffz');

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

  // Inject control bar from main process (preload can't reliably do this with contextIsolation:false)
  chatWindow.webContents.on('dom-ready', () => {
    chatWindow.webContents.executeJavaScript(`
      (function() {
        if (document.getElementById('overlay-bar')) return;
        var s = document.createElement('style');
        s.textContent = '#overlay-bar{position:fixed;top:0;left:0;right:0;z-index:999999;display:flex;align-items:center;justify-content:space-between;height:32px;padding:0 8px;background:#1f1f23;border-bottom:1px solid #303035;font-family:system-ui,sans-serif;-webkit-app-region:drag;user-select:none}#overlay-bar .ch{font-size:13px;font-weight:600;color:#bf94ff}#overlay-bar .ctrls{display:flex;gap:4px;-webkit-app-region:no-drag}#overlay-bar .b{display:flex;align-items:center;gap:4px;padding:3px 8px;border:1px solid #3a3a3d;border-radius:4px;background:0 0;color:#adadb8;font-size:11px;font-family:inherit;cursor:pointer;transition:.15s}#overlay-bar .b:hover{background:#2f2f35;color:#efeff1}#overlay-bar .b.on{background:#9147ff;border-color:#9147ff;color:#fff}#overlay-bar .x{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border:0;border-radius:4px;background:0 0;color:#adadb8;cursor:pointer;transition:.15s;margin-left:4px}#overlay-bar .x:hover{background:#e04040;color:#fff}#overlay-bar svg{width:14px;height:14px;fill:currentColor}html{margin-top:32px!important;height:calc(100% - 32px)!important}';
        document.head.appendChild(s);
        var bar = document.createElement('div');
        bar.id = 'overlay-bar';
        var ch = document.createElement('span');
        ch.className = 'ch';
        var m = location.pathname.match(/\\/popout\\/([^/]+)\\//);
        if (m) ch.textContent = m[1];
        bar.appendChild(ch);
        var c = document.createElement('div');
        c.className = 'ctrls';
        function mkSvg(d){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);s.appendChild(p);return s;}
        function mkBtn(cls,title,icon,label){var b=document.createElement('button');b.className=cls;b.title=title;b.appendChild(mkSvg(icon));if(label)b.appendChild(document.createTextNode(' '+label));return b;}
        var bLock=mkBtn('b','Lock position','M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z','Lock');
        var bPin=mkBtn('b','Always on top','M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z','Pin');
        var bX=mkBtn('x','Close','M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        var slider=document.createElement('input');slider.type='range';slider.min='0.2';slider.max='1';slider.step='0.05';slider.value='${store.get('chatOpacity', 1)}';slider.title='Opacity';slider.style.cssText='width:60px;cursor:pointer;accent-color:#9147ff;vertical-align:middle';
        slider.oninput=function(){console.log('__opacity__'+this.value);};
        c.appendChild(slider);c.appendChild(bLock);c.appendChild(bPin);c.appendChild(bX);bar.appendChild(c);
        document.body.prepend(bar);
        bLock.onclick=function(){console.log('__lock__');};
        bPin.onclick=function(){console.log('__pin__');};
        bX.onclick=function(){window.close();};
      })();
    `).catch((e) => console.error('Bar inject error:', e));

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
