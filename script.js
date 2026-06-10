const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const focusBtn = document.getElementById('focusBtn');
const chatBtn = document.getElementById('chatBtn');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const createAccountBtn = document.getElementById('createAccountBtn');
const signOutBtn = document.getElementById('signOutBtn');
const authMessage = document.getElementById('authMessage');
const accountStatus = document.getElementById('accountStatus');
const accountMeta = document.getElementById('accountMeta');

const ACCOUNTS_KEY = 'karim_ai_accounts';
const CURRENT_USER_KEY = 'karim_ai_current_user';

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function ensureDemoAccount() {
  const accounts = readAccounts();
  if (!accounts.some((entry) => entry.email.toLowerCase() === 'demo@karim.ai')) {
    accounts.push({ email: 'demo@karim.ai', password: 'karim123', name: 'Demo User' });
    writeAccounts(accounts);
  }
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function updateAccountPanel() {
  const user = currentUser();
  if (user) {
    accountStatus.textContent = `Signed in as ${user.name || user.email}`;
    accountMeta.textContent = `Email: ${user.email}`;
    authMessage.textContent = `Welcome back, ${user.name || user.email}.`;
  } else {
    accountStatus.textContent = 'Not signed in yet.';
    accountMeta.textContent = 'Use the demo account: demo@karim.ai / karim123';
    authMessage.textContent = 'Sign in to use your Karim AI account on this website.';
  }
}

function appendBubble(text, who = 'assistant') {
  const el = document.createElement('article');
  el.className = `bubble ${who}`;
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getReply(input) {
  const text = input.toLowerCase();
  const user = currentUser();
  const greeting = user ? `Hello ${user.name || user.email.split('@')[0]}!` : 'Hello there';
  if (text.includes('karim necir')) return 'Max Focus activated. I'm at full power, Karim Necir. What do you need?';
  if (text.includes('hello') || text.includes('hi')) return `${greeting} — I'm Karim AI. I can help with ideas, planning, writing, and focused support.`;
  if (text.includes('voice')) return 'Voice mode is ready in this website version. I can simulate a warm, spoken-style response for your companion experience.';
  if (text.includes('language') || text.includes('arabic') || text.includes('french')) return 'I can adapt tone and phrasing across languages, keeping the interaction natural and respectful.';
  return 'I'm Karim AI, and I'm ready to help. This site version is designed to showcase the personality, focus mode, and assistant flow you asked for.';
}

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;

  ensureDemoAccount();

  const accounts = readAccounts();
  const account = accounts.find((entry) => entry.email.toLowerCase() === email);

  if (!account || account.password !== password) {
    authMessage.textContent = 'Sign-in failed. Try demo@karim.ai / karim123 or create a new account.';
    return;
  }

  saveCurrentUser({ email: account.email, name: account.name || account.email.split('@')[0] });
  authEmail.value = '';
  authPassword.value = '';
  updateAccountPanel();
  authMessage.textContent = `Signed in successfully as ${account.name || account.email}.`;
});

createAccountBtn.addEventListener('click', () => {
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;

  if (!email || !password) {
    authMessage.textContent = 'Please enter an email and password to create an account.';
    return;
  }

  const accounts = readAccounts();
  if (accounts.some((entry) => entry.email.toLowerCase() === email)) {
    authMessage.textContent = 'That account already exists. Try signing in instead.';
    return;
  }

  accounts.push({ email, password, name: email.split('@')[0] });
  writeAccounts(accounts);
  saveCurrentUser({ email, name: email.split('@')[0] });
  authEmail.value = '';
  authPassword.value = '';
  updateAccountPanel();
  authMessage.textContent = 'Account created successfully. You are now signed in.';
});

signOutBtn.addEventListener('click', () => {
  clearCurrentUser();
  updateAccountPanel();
  authMessage.textContent = 'You have signed out.';
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  appendBubble(text, 'user');
  chatInput.value = '';

  const response = getReply(text);

  setTimeout(() => appendBubble(response), 350);
});

focusBtn.addEventListener('click', () => {
  appendBubble('Max Focus activated. I'm at full power, Karim Necir. What do you need?', 'assistant');
});

ensureDemoAccount();
updateAccountPanel();

chatBtn.addEventListener('click', () => {
  chatInput.focus();
});