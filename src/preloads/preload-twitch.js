// Spoof browser identity so Twitch accepts Electron as Chrome 130

// Remove Electron/webdriver indicators
try { delete Object.getPrototypeOf(navigator).webdriver; } catch {}

// Spoof navigator.userAgentData to match Chrome 130
Object.defineProperty(navigator, 'userAgentData', {
  configurable: true,
  get: () => ({
    brands: [
      { brand: 'Chromium', version: '130' },
      { brand: 'Google Chrome', version: '130' },
      { brand: 'Not?A_Brand', version: '99' },
    ],
    mobile: false,
    platform: 'Windows',
    getHighEntropyValues: (hints) => Promise.resolve({
      brands: [
        { brand: 'Chromium', version: '130.0.6723.191' },
        { brand: 'Google Chrome', version: '130.0.6723.191' },
        { brand: 'Not?A_Brand', version: '99.0.0.0' },
      ],
      mobile: false,
      platform: 'Windows',
      platformVersion: '10.0.0',
      architecture: 'x86',
      bitness: '64',
      model: '',
      uaFullVersion: '130.0.6723.191',
      fullVersionList: [
        { brand: 'Chromium', version: '130.0.6723.191' },
        { brand: 'Google Chrome', version: '130.0.6723.191' },
        { brand: 'Not?A_Brand', version: '99.0.0.0' },
      ],
    }),
  }),
});

// Spoof plugins (Electron has none, real Chrome has PDF viewer etc)
Object.defineProperty(navigator, 'plugins', {
  configurable: true,
  get: () => {
    const arr = [
      { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: '' },
      { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: '' },
    ];
    arr.length = 3;
    return arr;
  },
});

// Spoof languages
Object.defineProperty(navigator, 'languages', {
  configurable: true,
  get: () => ['en-US', 'en'],
});

// Ensure window.chrome looks like real Chrome
if (!window.chrome) window.chrome = {};
if (!window.chrome.runtime) {
  window.chrome.runtime = {
    connect: () => {},
    sendMessage: () => {},
  };
}
if (!window.chrome.csi) window.chrome.csi = () => ({});
if (!window.chrome.loadTimes) window.chrome.loadTimes = () => ({});

// Remove Electron-specific properties visible to page scripts
// Note: don't delete require/module/process in contextIsolation:false
// as they're needed by the preload itself
try {
  Object.defineProperty(window, 'process', { get: () => undefined, configurable: true });
  Object.defineProperty(window, 'Buffer', { get: () => undefined, configurable: true });
  Object.defineProperty(window, '__dirname', { get: () => undefined, configurable: true });
  Object.defineProperty(window, '__filename', { get: () => undefined, configurable: true });
} catch {}
