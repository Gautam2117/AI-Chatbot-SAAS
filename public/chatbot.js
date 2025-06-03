(function() {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Inter, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '24px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const icon = `<img src="/chatbot_widget_logo.png" style="width:32px;height:32px;border-radius:50%;" alt="Botify">`;
  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';
  const brandName = scriptTag.getAttribute('data-brand') || 'Botify';
  const positionStyles = position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : 'bottom: 20px; right: 20px;';
  let currentLang = 'en';

  const translations = {
    en: { welcome: 'Hello! How can I assist you today?', send: 'Send', typing: `${brandName} is typing...`, mic: '🎤', placeholder: 'Type a message... 😊' },
    hi: { welcome: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?', send: 'भेजें', typing: `${brandName} लिख रहा है...`, mic: '🎤', placeholder: 'संदेश लिखें... 😊' },
    es: { welcome: '¡Hola! ¿En qué puedo ayudarte hoy?', send: 'Enviar', typing: `${brandName} está escribiendo...`, mic: '🎤', placeholder: 'Escribe un mensaje... 😊' },
    fr: { welcome: 'Bonjour ! Comment puis-je vous aider ?', send: 'Envoyer', typing: `${brandName} est en train d\'écrire...`, mic: '🎤', placeholder: 'Tapez un message... 😊' },
    zh: { welcome: '你好！我能为您做些什么？', send: '发送', typing: `${brandName} 正在输入...`, mic: '🎤', placeholder: '输入消息... 😊' },
    ar: { welcome: 'مرحبًا! كيف يمكنني مساعدتك؟', send: 'إرسال', typing: `${brandName} يكتب...`, mic: '🎤', placeholder: 'اكتب رسالة... 😊' },
  };

  const t = (key) => translations[currentLang][key] || key;

  const style = document.createElement('style');
  style.textContent = `
    .botify-btn { position: fixed; ${positionStyles} background: linear-gradient(135deg, ${primaryColor}, #6c63ff); border: none; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.3); transition: all 0.3s ease; z-index: 9999; }
    .botify-btn:hover { transform: scale(1.1); }
    .botify-container { position: fixed; ${positionStyles} width: 360px; max-height: 600px; border-radius: ${borderRadius}; font-family: ${fontFamily}; box-shadow: 0 15px 45px rgba(0,0,0,0.3); display: flex; flex-direction: column; overflow: hidden; z-index: 9999; transform: translateY(40px); opacity: 0; animation: slideIn 0.4s forwards; background: #fff; color: #333; }
    @keyframes slideIn { to { transform: translateY(0); opacity: 1; } }
    .botify-header { background: linear-gradient(135deg, ${primaryColor}, #6c63ff); color: white; padding: 12px; display: flex; align-items: center; gap: 8px; font-size: 15px; }
    .botify-header img { width: 32px; height: 32px; border-radius: 50%; }
    .botify-header span { flex: 1; font-weight: 600; }
    .botify-header select { background: rgba(255,255,255,0.2); border: none; color: white; font-size: 14px; cursor: pointer; border-radius: 6px; padding: 4px 8px; }
    .botify-header select option { color: #333; background: #fff; }
    .botify-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; background: #f9f9f9; color: #333; }
    .botify-msg { padding: 10px 14px; border-radius: 20px; max-width: 80%; line-height: 1.4; word-wrap: break-word; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .botify-msg.user { background: #d1e3ff; align-self: flex-end; }
    .botify-msg.bot { background: #fff; align-self: flex-start; }
    .botify-input { display: flex; align-items: center; padding: 8px; border-top: 1px solid #ddd; background: #fafafa; }
    .botify-input input { flex: 1; border: none; padding: 10px; font-size: 14px; outline: none; background: none; }
    .botify-input button { background: ${primaryColor}; color: white; border: none; padding: 8px 14px; border-radius: 50%; font-size: 16px; margin-left: 5px; cursor: pointer; }
    .botify-input button:hover { background: #5a54e8; }
    .botify-mic-btn { background: transparent; border: none; font-size: 18px; color: ${primaryColor}; margin-left: 5px; cursor: pointer; }
    .botify-loader { border: 3px solid #f3f3f3; border-top: 3px solid ${primaryColor}; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'botify-btn'; button.innerHTML = icon;
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.className = 'botify-container';
  container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-header">
      ${icon}
      <span>${brandName} Chat</span>
      <select id="botify-lang">${Object.keys(translations).map(l => `<option value="${l}" ${l===currentLang?'selected':''}>${l.toUpperCase()}</option>`).join('')}</select>
    </div>
    <div class="botify-messages" id="botify-messages"></div>
    <div class="botify-input">
      <input type="text" placeholder="${t('placeholder')}" id="botify-input">
      <button id="botify-mic" class="botify-mic-btn">${t('mic')}</button>
      <button id="botify-send">➤</button>
    </div>
  `;
  document.body.appendChild(container);

  button.addEventListener('click', () => container.style.display = container.style.display === 'none' ? 'flex' : 'none');
  const sendBtn = container.querySelector('#botify-send');
  const inputField = container.querySelector('#botify-input');
  const micBtn = container.querySelector('#botify-mic');
  const messagesDiv = container.querySelector('#botify-messages');
  const langSelect = container.querySelector('#botify-lang');

  const appendMessage = (sender, text, loader = false) => {
    const msg = document.createElement('div');
    msg.className = `botify-msg ${sender === 'You' ? 'user' : 'bot'}`;
    msg.innerHTML = loader ? `<span class="botify-loader"></span> ${t('typing')}` : text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim(); if (!question) return;
    appendMessage('You', question); inputField.value = '';
    const typing = document.createElement('div'); typing.className = 'botify-msg'; typing.innerHTML = `<span class="botify-loader"></span> ${t('typing')}`;
    messagesDiv.appendChild(typing); messagesDiv.scrollTop = messagesDiv.scrollHeight;
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json','x-user-id': userId }, body: JSON.stringify({ question, lang: currentLang, faqs: [] }) });
      const data = await res.json();
      messagesDiv.removeChild(typing); appendMessage('Bot', data.reply || 'No response');
    } catch (err) { messagesDiv.removeChild(typing); appendMessage('Bot', 'Error connecting to server'); }
  });
  inputField.addEventListener('keypress', e => { if (e.key==='Enter') sendBtn.click(); });
  langSelect.addEventListener('change', e => { currentLang = e.target.value; inputField.placeholder = t('placeholder'); });

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; const recog = new SpeechRecognition();
    recog.lang = 'en-US'; recog.interimResults = false; recog.maxAlternatives = 1;
    micBtn.addEventListener('click', () => recog.start());
    recog.onresult = e => inputField.value += e.results[0][0].transcript + ' ';
    recog.onerror = e => console.error('Speech error:', e.error);
  } else { micBtn.style.display='none'; }
})();
