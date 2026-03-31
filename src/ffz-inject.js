// Injected into chat window to write FFZ settings to chrome.storage.local
// window.__TWITCHDOCK_FFZ_SETTINGS__ must be set before this runs
(function () {
  const settings = window.__TWITCHDOCK_FFZ_SETTINGS__;
  if (!settings || !chrome || !chrome.storage || !chrome.storage.local) return;

  chrome.storage.local.set(settings, () => {
    console.log('[FFZ] Settings written to chrome.storage.local');
  });
})();
