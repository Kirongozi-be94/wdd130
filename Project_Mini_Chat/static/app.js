const username = prompt("Ton pseudo ?") || "Anonyme";

const ws = new WebSocket(`ws://${location.host}/ws`);

const chat = document.getElementById('chat');
const msgInput = document.getElementById('msg');
const typingDiv = document.getElementById('typing');
const fileInput = document.getElementById('file');
const micBtn = document.getElementById('micBtn');

// 👇 AJOUT DESTINATAIRE
const toUser = prompt("Envoyer à qui ? (all = tout le monde)") || "all";

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let typingTimeout;

// ================= WEB SOCKET =================

ws.onopen = () => {
  console.log("✅ WebSocket connecté");
};

ws.onerror = (err) => {
  console.log("❌ Erreur WebSocket", err);
};

ws.onclose = () => {
  console.log("❌ WebSocket fermé");
};

ws.onmessage = (event) => {

  const data = JSON.parse(event.data);

  if (data.type === 'message') {
    renderMessage(data);
  }

  else if (data.type === 'typing') {
    if (data.user !== username) {

      typingDiv.textContent = `${data.user} écrit...`;

      clearTimeout(typingTimeout);

      typingTimeout = setTimeout(() => {
        typingDiv.textContent = '';
      }, 2000);
    }
  }

  else if (data.type === 'read') {
    updateReadReceipt(data.msgId);
  }
};

// ================= ENVOYER MESSAGE =================

function sendMsg() {

  const text = msgInput.value.trim();
  if (!text) return;

  if (ws.readyState !== WebSocket.OPEN) {
    console.log("❌ WebSocket pas connecté");
    return;
  }

  ws.send(JSON.stringify({
    type: 'message',
    id: Date.now(),
    user: username,
    to: toUser,        // 👈 DESTINATAIRE AJOUTÉ
    content: text
  }));

  msgInput.value = '';
}

// ================= ENTER =================

msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMsg();
  }
});

// ================= TYPING =================

msgInput.addEventListener('input', () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'typing',
      user: username,
      to: toUser   // 👈 optionnel mais utile
    }));
  }
});