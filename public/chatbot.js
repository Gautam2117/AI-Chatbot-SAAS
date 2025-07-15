(function () {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Inter, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '24px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const brandName = scriptTag.getAttribute('data-brand') || 'Botify';
  const userLogo = scriptTag.getAttribute('data-logo') || 'https://ai-chatbot-saas-eight.vercel.app/chatbot_widget_logo.png';
  const showPoweredBy = scriptTag.getAttribute('data-poweredby') !== 'false';

  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';
  const positionStyles = position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : 'bottom: 20px; right: 20px;';
  let currentLang = 'en';

  const translations = {
    en: { welcome: 'Hello! How can I assist you today?', send: 'Send', typing: `${brandName} is typing...`, mic: '🎤', placeholder: 'Type a message... 😊' },
    hi: { welcome: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?', send: 'भेजें', typing: `${brandName} लिख रहा है...`, mic: '🎤', placeholder: 'संदेश लिखें... 😊' },
    es: { welcome: '¡Hola! ¿En qué puedo ayudarte hoy?', send: 'Enviar', typing: `${brandName} está escribiendo...`, mic: '🎤', placeholder: 'Escribe un mensaje... 😊' },
    fr: { welcome: 'Bonjour ! Comment puis-je vous aider ?', send: 'Envoyer', typing: `${brandName} est en train d'écrire...`, mic: '🎤', placeholder: 'Tapez un message... 😊' },
    zh: { welcome: '你好！我能为您做些什么？', send: '发送', typing: `${brandName} 正在输入...`, mic: '🎤', placeholder: '输入消息... 😊' },
    ar: { welcome: 'مرحبًا! كيف يمكنني مساعدتك؟', send: 'إرسال', typing: `${brandName} يكتب...`, mic: '🎤', placeholder: 'اكتب رسالة... 😊' }
  };

  const t = (key) => translations[currentLang][key] || key;

  const style = document.createElement('style');
  style.textContent = `
    .botify-btn {
      position: fixed; ${positionStyles}
      background: none; border: none; padding: 0; cursor: pointer; z-index: 9999;
    }
    .botify-btn img {
      width: 60px; height: 60px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: transform 0.3s ease;
    }
    .botify-btn img:hover { transform: scale(1.1); }

    .botify-container {
      position: fixed; ${positionStyles}
      width: 360px; max-height: 600px; border-radius: ${borderRadius}; font-family: ${fontFamily};
      box-shadow: 0 15px 45px rgba(0,0,0,0.3); display: flex; flex-direction: column; overflow: hidden;
      z-index: 9999; transform: translateY(40px); opacity: 0; animation: slideIn 0.4s forwards;
      background: #fff; color: #333;
    }
    .botify-container.dark { background: #2b2b2b; color: #fff; }
    @keyframes slideIn { to { transform: translateY(0); opacity: 1; } }

    .botify-header {
      background: linear-gradient(135deg, ${primaryColor}, #6c63ff); color: white;
      padding: 12px; display: flex; align-items: center; gap: 8px; font-size: 15px;
    }
    .botify-header img {
      width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
    }
    .botify-header span { flex: 1; font-weight: 600; }
    .botify-header select, .botify-header button {
      background: rgba(255,255,255,0.2); border: none; color: white; font-size: 14px;
      cursor: pointer; border-radius: 6px; padding: 4px 8px; transition: background 0.3s ease;
    }

    .botify-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; background: #f9f9f9; color: #333; }
    .botify-container.dark .botify-messages { background: #444; color: #fff; }

    .botify-msg { padding: 10px 14px; border-radius: 20px; max-width: 80%; line-height: 1.4; word-wrap: break-word; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .botify-msg.user { background: #d1e3ff; align-self: flex-end; }
    .botify-msg.bot { background: #fff; align-self: flex-start; }
    .botify-container.dark .botify-msg.bot { background: #555; }

    .botify-input { display: flex; align-items: center; padding: 8px; border-top: 1px solid #ddd; background: #fafafa; }
    .botify-container.dark .botify-input { background: #333; }
    .botify-input input { flex: 1; border: none; padding: 10px; font-size: 14px; outline: none; background: none; }
    .botify-input button { background: ${primaryColor}; color: white; border: none; padding: 8px 14px; border-radius: 50%; font-size: 16px; margin-left: 5px; cursor: pointer; }
    .botify-input button:hover { background: #5a54e8; }

    .botify-mic-btn { background: transparent; border: none; font-size: 18px; color: ${primaryColor}; margin-left: 5px; cursor: pointer; }
    .botify-footer { font-size: 10px; text-align: center; color: #aaa; padding: 6px 0; }
    .typing-bubble {
      display: flex;
      gap: 4px;
      justify-content: flex-start;
      align-items: center;
      padding: 4px 0;
    }

    .dot {
      width: 8px;
      height: 8px;
      background-color: ${primaryColor};
      border-radius: 50%;
      animation: typingDots 1.2s infinite ease-in-out;
    }

    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typingDots {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.3;
      }
      40% {
        transform: scale(1.2);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'botify-btn';
  button.innerHTML = `<img src="${userLogo}" alt="Chatbot">`;
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.className = 'botify-container';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', `${brandName} Chat Widget`);
  container.setAttribute('aria-live', 'polite');
  container.style.display = 'none';

  container.innerHTML = `
    <div class="botify-header">
      <img src="${userLogo}" alt="Brand Logo">
      <span>${brandName} Chat</span>
      <select id="botify-lang">${Object.keys(translations).map(l => `<option value="${l}" ${l === currentLang ? 'selected' : ''}>${l.toUpperCase()}</option>`).join('')}</select>
      <button id="theme-toggle">🌓</button>
    </div>
    <div class="botify-messages" id="botify-messages"></div>
    <div class="botify-input">
      <input type="text" placeholder="${t('placeholder')}" id="botify-input">
      <button id="botify-mic" class="botify-mic-btn">${t('mic')}</button>
      <button id="botify-send">➤</button>
    </div>
    ${showPoweredBy ? `<div class="botify-footer">Powered by <a href="https://botify-website.vercel.app/" target="_blank" style="color:${primaryColor};font-weight:600;">Botify</a></div>` : ''}
  `;
  document.body.appendChild(container);

  button.addEventListener('click', () => {
    const isOpening = container.style.display === 'none';
    container.style.display = isOpening ? 'flex' : 'none';
    if (isOpening) inputField.focus();
  });

  const sendBtn = container.querySelector('#botify-send');
  const inputField = container.querySelector('#botify-input');
  const micBtn = container.querySelector('#botify-mic');
  const messagesDiv = container.querySelector('#botify-messages');
  const themeToggle = container.querySelector('#theme-toggle');
  const langSelect = container.querySelector('#botify-lang');

  const appendMessage = (sender, text, isTyping = false) => {
    const msg = document.createElement('div');
    msg.className = `botify-msg ${sender === 'You' ? 'user' : 'bot'}`;

    if (isTyping) {
      msg.innerHTML = `
        <div class="typing-bubble">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div style="margin-top: 4px;">${t('typing')}</div>
      `;
    } else {
      msg.innerHTML = text;
    }

    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return msg;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim();
    if (!question) return;

    appendMessage('You', question);
    inputField.value = '';

    const typingMsg = appendMessage('Bot', '', true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          question,
          lang: currentLang,
          faqs: []
        })
      });

      if (res.status === 403) {
        const errorData = await res.json();
        messagesDiv.removeChild(typingMsg);

        appendMessage('Bot', `
          🙏 <strong>We're currently unavailable</strong><br>
          Thank you for reaching out. The support team using this chatbot has reached their daily usage limit.<br><br>
          Please try again later or contact the business directly for assistance.<br><br>
          We apologize for the inconvenience and appreciate your patience.
        `);

        // Disable input field and button
        inputField.disabled = true;
        sendBtn.disabled = true;
        sendBtn.style.cursor = 'not-allowed';
        inputField.placeholder = 'Support is currently unavailable.';

        // 🔽 This dims the entire chat UI and blocks further interaction
        container.style.opacity = '0.6';
        container.style.pointerEvents = 'none';

        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      typingMsg.innerHTML = ''; // Clear loader

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        typingMsg.textContent = accumulatedText;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      typingMsg.innerHTML = accumulatedText || '⚠️ No response';
    } catch (error) {
      messagesDiv.removeChild(typingMsg);
      appendMessage('Bot', '⚠️ Unable to connect to server.');
    }
  });

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });

  themeToggle.addEventListener('click', () => {
    container.classList.toggle('dark');
    themeToggle.textContent = container.classList.contains('dark') ? '☀️' : '🌙';
  });

  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    inputField.placeholder = t('placeholder');
  });

  // Optional: Speech-to-text
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    micBtn.addEventListener('click', () => {
      recog.start();
    });

    recog.onresult = (e) => {
      inputField.value += e.results[0][0].transcript + ' ';
    };

    recog.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
    };
  } else {
    micBtn.style.display = 'none';
  }

  // Welcome message on load
  appendMessage('Bot', t('welcome'));

  (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/usage-status`, {
        method: 'GET',
        headers: { 'x-user-id': userId }
      });
      const data = await res.json();

      if (data.blocked) {
        appendMessage('Bot', `
          🚫 <strong>Chat temporarily unavailable</strong><br>
          Our support team has reached its daily limit for today.<br><br>
          Please try again later or contact us directly.
        `);
        inputField.disabled = true;
        sendBtn.disabled = true;
        sendBtn.style.cursor = 'not-allowed';
        inputField.placeholder = 'Support is currently unavailable.';
        container.style.opacity = '0.6';
        container.style.pointerEvents = 'none';
      }
    } catch (err) {
      console.error("❌ Failed to check usage status:", err);
    }
  })();

})();
