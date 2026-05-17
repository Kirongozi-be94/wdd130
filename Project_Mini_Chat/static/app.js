const username =
  prompt("Ton pseudo ?") || "Anonyme";

const ws =
  new WebSocket(`ws://${location.host}/ws`);

const chat =
  document.getElementById('chat');

const msgInput =
  document.getElementById('msg');

const typingDiv =
  document.getElementById('typing');

const fileInput =
  document.getElementById('file');

const micBtn =
  document.getElementById('micBtn');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let typingTimeout;

// ================= WEBSOCKET =================

ws.onmessage = (event) => {

  const data =
    JSON.parse(event.data);

  // Nouveau message
  if (data.type === 'message') {
    renderMessage(data);
  }

  // Utilisateur écrit
  else if (data.type === 'typing') {

    if (data.user !== username) {

      typingDiv.textContent =
        `${data.user} écrit...`;

      clearTimeout(typingTimeout);

      typingTimeout = setTimeout(() => {
        typingDiv.textContent = '';
      }, 2000);
    }
  }

  // Message lu
  else if (data.type === 'read') {
    updateReadReceipt(data.msgId);
  }
};

// ================= AFFICHER MESSAGE =================

function renderMessage(data) {

  const isMe =
    data.user === username;

  const div =
    document.createElement('div');

  div.className =
    `msg ${isMe ? 'me' : 'other'}`;

  let content =
    `<strong>${data.user}</strong><br>`;

  // Image
  if (data.content.startsWith('[img]')) {

    const url =
      data.content.split(' ')[1];

    content += `
      <img src="${url}">
    `;
  }

  // Audio
  else if (data.content.startsWith('[audio]')) {

    const url =
      data.content.split(' ')[1];

    content += `
      <audio controls src="${url}"></audio>
    `;
  }

  // Texte
  else {
    content += data.content;
  }

  // Vu
  content += `
    <div class="meta">
      ${isMe
        ? `<span id="read-${data.id}">✓</span>`
        : ''
      }
    </div>
  `;

  div.innerHTML = content;

  chat.appendChild(div);

  chat.scrollTop =
    chat.scrollHeight;

  // Envoyer confirmation lecture
  if (!isMe) {

    ws.send(JSON.stringify({
      type: 'read',
      user: username,
      msgId: data.id
    }));
  }
}

// ================= MESSAGE LU =================

function updateReadReceipt(msgId) {

  const el =
    document.getElementById(`read-${msgId}`);

  if (el) {
    el.textContent = '✓✓';
  }
}

// ================= ENVOYER MESSAGE =================

function sendMsg() {

  const text =
    msgInput.value.trim();

  if (!text) return;

  ws.send(JSON.stringify({

    type: 'message',

    id: Date.now(),

    user: username,

    content: text

  }));

  msgInput.value = '';
}

// ================= UTILISATEUR ECRIT =================

msgInput.addEventListener('input', () => {

  ws.send(JSON.stringify({

    type: 'typing',

    user: username

  }));
});

// ================= TOUCHE ENTER =================

msgInput.addEventListener('keypress', (e) => {

  if (e.key === 'Enter') {
    sendMsg();
  }
});

// ================= UPLOAD FICHIER =================

async function uploadFile(file) {

  const formData =
    new FormData();

  formData.append('file', file);

  const response =
    await fetch('/upload', {

      method: 'POST',

      body: formData
    });

  return await response.json();
}

// ================= IMAGE / AUDIO =================

fileInput.onchange = async () => {

  const file =
    fileInput.files[0];

  if (!file) return;

  const data =
    await uploadFile(file);

  const content =
    file.type.startsWith('image')
      ? `[img] ${data.url}`
      : `[audio] ${data.url}`;

  ws.send(JSON.stringify({

    type: 'message',

    id: Date.now(),

    user: username,

    content

  }));
};

// ================= ENREGISTREMENT AUDIO =================

async function toggleRecord() {

  if (!isRecording) {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    mediaRecorder =
      new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {

      const blob =
        new Blob(audioChunks, {
          type: 'audio/webm'
        });

      const file =
        new File(
          [blob],
          `audio_${Date.now()}.webm`,
          { type: 'audio/webm' }
        );

      const data =
        await uploadFile(file);

      ws.send(JSON.stringify({

        type: 'message',

        id: Date.now(),

        user: username,

        content: `[audio] ${data.url}`
      }));

      stream.getTracks()
        .forEach(track => track.stop());
    };

    mediaRecorder.start();

    isRecording = true;

    micBtn.classList.add('recording');

    micBtn.textContent = '⏹️';
  }

  else {

    mediaRecorder.stop();

    isRecording = false;

    micBtn.classList.remove('recording');

    micBtn.textContent = '🎤';
  }
}