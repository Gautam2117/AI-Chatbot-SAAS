(function() {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Inter, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '20px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const icon = scriptTag.getAttribute('data-icon') || '💬';
  const initialTheme = scriptTag.getAttribute('data-theme') || 'light';
  const initialLang = scriptTag.getAttribute('data-lang') || 'en';
  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';

  const positionStyles = position === 'bottom-left' ? 'bottom: 24px; left: 24px;' : 'bottom: 24px; right: 24px;';
  let currentTheme = initialTheme, currentLang = initialLang;

  const translations = {
    en: { assistant: 'Botify Assistant', send: 'Send', typeMessage: 'Type your message...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'Bot is typing...', error: 'Connection error.' },
    hi: { assistant: 'बॉटिफाई सहायक', send: 'भेजें', typeMessage: 'अपना संदेश लिखें...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'बॉट टाइप कर रहा है...', error: 'सर्वर त्रुटि।' },
    zh: { assistant: 'Botify 助手', send: '发送', typeMessage: '输入您的消息...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: '机器人正在输入...', error: '连接错误。' },
    ar: { assistant: 'مساعد Botify', send: 'إرسال', typeMessage: 'اكتب رسالتك...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'البوت يكتب...', error: 'خطأ في الاتصال.' },
    pt: { assistant: 'Assistente Botify', send: 'Enviar', typeMessage: 'Digite sua mensagem...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'O bot está digitando...', error: 'Erro de conexão.' },
    bn: { assistant: 'Botify সহায়ক', send: 'পাঠান', typeMessage: 'আপনার বার্তা লিখুন...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'বট টাইপ করছে...', error: 'সংযোগ ত্রুটি।' },
    es: { assistant: 'Asistente Botify', send: 'Enviar', typeMessage: 'Escribe tu mensaje...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'El bot está escribiendo...', error: 'Error de conexión.' },
    fr: { assistant: 'Assistant Botify', send: 'Envoyer', typeMessage: 'Tapez votre message...', theme: { light: '🌙', dark: '☀️' }, selectLang: '🌐', typing: 'Le bot est en train d\'écrire...', error: 'Erreur de connexion.' }
  };

  const t = key => translations[currentLang][key] || key;

  const style = document.createElement('style');
  style.textContent = `
    .botify-btn { position: fixed; ${positionStyles} background: linear-gradient(135deg, ${primaryColor}, #6c63ff); color: white; border: none; border-radius: 50%; width: 70px; height: 70px; font-size: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.3); transition: all 0.3s ease; z-index: 9999; }
    .botify-btn:hover { transform: scale(1.1); }
    .botify-container { position: fixed; ${positionStyles} width: 380px; max-height: 600px; background: rgba(255,255,255,0.98); backdrop-filter: blur(15px); border-radius: ${borderRadius}; font-family: ${fontFamily}; box-shadow: 0 15px 45px rgba(0,0,0,0.4); display: flex; flex-direction: column; overflow: hidden; z-index: 9999; animation: slideIn 0.4s ease forwards; transform: translateY(30px); opacity: 0; }
    .botify-container.dark { background: rgba(34,34,34,0.98); color: white; }
    @keyframes slideIn { to { transform: translateY(0); opacity: 1; } }
    .botify-header { background: linear-gradient(135deg, ${primaryColor}, #6c63ff); color: white; padding: 14px; display: flex; justify-content: space-between; align-items: center; }
    .botify-header select, .botify-header button { background: transparent; border: none; color: white; cursor: pointer; font-size: 16px; }
    .botify-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .botify-msg { max-width: 75%; padding: 10px 14px; border-radius: 16px; line-height: 1.4; word-wrap: break-word; }
    .botify-msg.user { background: #d1e3ff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .botify-msg.bot { background: #f0f0f0; align-self: flex-start; border-bottom-left-radius: 4px; }
    .botify-container.dark .botify-msg.bot { background: #555; }
    .botify-input { display: flex; border-top: 1px solid #ddd; background: #fafafa; padding: 8px; align-items: center; }
    .botify-input input { flex: 1; border: none; padding: 10px; font-size: 14px; outline: none; background: none; }
    .botify-input button { background: ${primaryColor}; color: white; border: none; padding: 10px 16px; font-size: 16px; cursor: pointer; border-radius: 8px; }
    .botify-input button:hover { background: #5a54e8; }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'botify-btn'; button.innerHTML = icon;
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.className = `botify-container ${currentTheme}`; container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-header">
      <span id="botify-title">${t('assistant')}</span>
      <div>
        <select id="botify-lang">${Object.keys(translations).map(lang => `<option value="${lang}"${lang === currentLang ? ' selected' : ''}>${lang.toUpperCase()}</option>`)}</select>
        <button id="theme-toggle">${t('theme')[currentTheme]}</button>
      </div>
    </div>
    <div class="botify-messages" id="botify-messages"></div>
    <div class="botify-input">
      <input type="text" placeholder="${t('typeMessage')}" id="botify-input">
      <button id="botify-send">${t('send')}</button>
    </div>
  `;
  document.body.appendChild(container);

  const sendBtn = container.querySelector('#botify-send'), inputField = container.querySelector('#botify-input'),
        messagesDiv = container.querySelector('#botify-messages'), themeToggle = container.querySelector('#theme-toggle'),
        langSelect = container.querySelector('#botify-lang');

  const refreshTexts = () => {
    container.querySelector('#botify-title').textContent = t('assistant');
    inputField.placeholder = t('typeMessage');
    sendBtn.textContent = t('send');
    themeToggle.textContent = t('theme')[currentTheme];
  };
  langSelect.addEventListener('change', () => { currentLang = langSelect.value; refreshTexts(); });

  button.addEventListener('click', () => { container.style.display = container.style.display === 'none' ? 'flex' : 'none'; });
  themeToggle.addEventListener('click', () => { currentTheme = currentTheme === 'light' ? 'dark' : 'light'; container.classList.toggle('dark', currentTheme === 'dark'); themeToggle.textContent = t('theme')[currentTheme]; });

  const appendMessage = (sender, text) => {
    const msg = document.createElement('div'); msg.className = `botify-msg ${sender}`; msg.innerHTML = text;
    messagesDiv.appendChild(msg); messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim(); if (!question) return;
    appendMessage('user', question); inputField.value = '';
    const loader = document.createElement('div'); loader.className = 'botify-msg bot'; loader.innerHTML = `${t('typing')}`; messagesDiv.appendChild(loader);
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId }, body: JSON.stringify({ question, lang: currentLang, faqs: [] }) });
      const data = await res.json(); messagesDiv.removeChild(loader); appendMessage('bot', data.reply || t('error'));
    } catch { messagesDiv.removeChild(loader); appendMessage('bot', t('error')); }
  });
  inputField.addEventListener('keypress', e => { if (e.key === 'Enter') sendBtn.click(); });
})();
