const form = document.getElementById('form');
const channelInput = document.getElementById('channel');
const loginBtn = document.getElementById('twitch-login');

// Restore last channel
window.api.getLastChannel().then((ch) => {
  if (ch) channelInput.value = ch;
});

// Open chat
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const channel = channelInput.value.trim();
  if (!channel) return;
  await window.api.openChat(channel);
});

// Login state
async function updateLoginState() {
  const state = await window.api.isLoggedIn();
  if (state.loggedIn) {
    loginBtn.textContent = state.name || 'Logged in';
    loginBtn.classList.add('logged-in');
  } else {
    loginBtn.textContent = 'Twitch Login';
    loginBtn.classList.remove('logged-in');
  }
}
updateLoginState();

loginBtn.addEventListener('click', async () => {
  loginBtn.textContent = 'Logging in...';
  const result = await window.api.twitchLogin();
  if (result && result.ok) {
    await updateLoginState();
  } else {
    loginBtn.textContent = 'Failed';
    setTimeout(updateLoginState, 3000);
  }
});

// FFZ import
document.getElementById('ffz-import').addEventListener('click', async () => {
  const btn = document.getElementById('ffz-import');
  const result = await window.api.importFFZSettings();
  if (!result) return;
  if (result.error) {
    btn.textContent = result.error;
  } else {
    btn.textContent = 'Imported ' + result.keys + ' settings';
  }
  setTimeout(() => { btn.textContent = 'Import FFZ'; }, 3000);
});

// Shutdown
document.getElementById('quit').addEventListener('click', () => {
  window.api.quit();
});

// Open external links in default browser
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (link && link.href.startsWith('http')) {
    e.preventDefault();
    window.api.openExternal(link.href);
  }
});
