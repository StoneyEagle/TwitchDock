const { ipcRenderer } = require('electron');

// NOTE: don't load preload-twitch here - it overrides chrome.runtime
// which breaks FFZ's extension content script. Browser spoofing is
// only needed for the login window.

// Apply imported FFZ settings
ipcRenderer.invoke('get-ffz-settings').then((settings) => {
  if (!settings) return;
  for (const [k, v] of Object.entries(settings)) {
    localStorage.setItem('FFZ:setting:' + k, JSON.stringify(v));
  }
}).catch(() => {});

// --- Control bar overlay ---

function createSvg(pathD) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', pathD);
  svg.appendChild(p);
  return svg;
}

function createButton(cls, id, title, iconPath, label) {
  const btn = document.createElement('button');
  btn.className = cls;
  btn.id = id;
  btn.title = title;
  btn.appendChild(createSvg(iconPath));
  if (label) btn.appendChild(document.createTextNode(' ' + label));
  return btn;
}

function injectBar() {
  if (document.getElementById('overlay-bar')) return;

  const style = document.createElement('style');
  style.id = 'overlay-bar-style';
  style.textContent = `
    #overlay-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
      display: flex; align-items: center; justify-content: space-between;
      height: 32px; padding: 0 8px;
      background: #1f1f23; border-bottom: 1px solid #303035;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-app-region: drag; user-select: none;
    }
    #overlay-bar .channel { font-size: 13px; font-weight: 600; color: #bf94ff; }
    #overlay-bar .controls { display: flex; gap: 4px; -webkit-app-region: no-drag; }
    #overlay-bar .btn {
      display: flex; align-items: center; gap: 4px;
      padding: 3px 8px; border: 1px solid #3a3a3d; border-radius: 4px;
      background: transparent; color: #adadb8; font-size: 11px;
      font-family: inherit; cursor: pointer; transition: all 0.15s;
    }
    #overlay-bar .btn:hover { background: #2f2f35; color: #efeff1; }
    #overlay-bar .btn.active { background: #9147ff; border-color: #9147ff; color: #fff; }
    #overlay-bar .btn-close {
      display: flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; border: none; border-radius: 4px;
      background: transparent; color: #adadb8; cursor: pointer; transition: all 0.15s;
      margin-left: 4px;
    }
    #overlay-bar .btn-close:hover { background: #e04040; color: #fff; }
    #overlay-bar svg { width: 14px; height: 14px; fill: currentColor; }
    body { padding-top: 32px !important; }
  `;
  if (!document.getElementById('overlay-bar-style')) {
    document.head.appendChild(style);
  }

  const bar = document.createElement('div');
  bar.id = 'overlay-bar';

  const channelSpan = document.createElement('span');
  channelSpan.className = 'channel';
  const match = window.location.pathname.match(/\/popout\/([^/]+)\//);
  if (match) channelSpan.textContent = match[1];
  bar.appendChild(channelSpan);

  const controls = document.createElement('div');
  controls.className = 'controls';

  const lockPath = 'M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z';
  const pinPath = 'M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z';
  const closePath = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';

  const btnLock = createButton('btn', 'bar-lock', 'Lock position & size', lockPath, 'Lock');
  const btnAot = createButton('btn', 'bar-aot', 'Always on top', pinPath, 'Pin');
  const btnClose = createButton('btn-close', 'bar-close', 'Close', closePath);

  controls.appendChild(btnLock);
  controls.appendChild(btnAot);
  controls.appendChild(btnClose);
  bar.appendChild(controls);

  document.body.prepend(bar);

  ipcRenderer.invoke('get-state').then((state) => {
    if (state.locked) btnLock.classList.add('active');
    if (state.alwaysOnTop) btnAot.classList.add('active');
  }).catch(() => {});

  btnLock.addEventListener('click', async () => {
    const locked = await ipcRenderer.invoke('toggle-lock');
    btnLock.classList.toggle('active', locked);
  });

  btnAot.addEventListener('click', async () => {
    const aot = await ipcRenderer.invoke('toggle-always-on-top');
    btnAot.classList.toggle('active', aot);
  });

  btnClose.addEventListener('click', () => {
    window.close();
  });
}

// Inject bar when DOM is ready, and re-inject if Twitch's React app removes it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectBar);
} else {
  injectBar();
}

// Watch for React re-renders that might remove the bar
const barObserver = new MutationObserver(() => {
  if (!document.getElementById('overlay-bar') && document.body) {
    injectBar();
  }
});
const startObserving = () => {
  barObserver.observe(document.body, { childList: true });
};
if (document.body) startObserving();
else document.addEventListener('DOMContentLoaded', startObserving);
