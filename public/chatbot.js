(function() {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Inter, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '20px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const icon = scriptTag.getAttribute('data-icon') || '💬';
  const initialTheme = scriptTag.getAttribute('data-theme') || 'light';
  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';

  const positionStyles = position === 'bottom-left'
    ? 'bottom: 24px; left: 24px;'
    : 'bottom: 24px; right: 24px;';

  let currentTheme = initialTheme;

  // Custom styles
  const style = document.createElement('style');
  style.textContent = `
    .botify-btn {
      position: fixed; ${positionStyles}
      background: linear-gradient(135deg, ${primaryColor}, #6c63ff);
      color: white; border: none; border-radius: 50%;
      width: 70px; height: 70px; font-size: 34px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.3);
      transition: all 0.3s ease; z-index: 9999; backdrop-filter: blur(8px);
    }
    .botify-btn:hover { transform: scale(1.1); }

    .botify-container {
      position: fixed; ${positionStyles}
      width: 380px; max-height: 600px;
      background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(15px);
      border-radius: ${borderRadius}; font-family: ${fontFamily};
      box-shadow: 0 15px 45px rgba(0,0,0,0.4);
      display: flex; flex-direction: column; overflow: hidden;
      z-index: 9999; animation: slideIn 0.4s ease forwards; transform: translateY(30px); opacity: 0;
    }
    .botify-container.dark { background: rgba(40,40,40,0.98); color: white; }
    @keyframes slideIn { to { transform: translateY(0); opacity: 1; } }

    .botify-header {
      background: linear-gradient(135deg, ${primaryColor}, #6c63ff);
      color: white; padding: 14px; font-weight: bold;
      display: flex; justify-content: space-between; align-items: center; font-size: 16px;
    }
    .botify-header button { background: transparent; border: none; color: white; cursor: pointer; font-size: 20px; }

    .botify-messages {
      flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
    }
    .botify-msg { max-width: 80%; padding: 10px 14px; border-radius: 18px; line-height: 1.4; word-wrap: break-word; }
    .botify-msg.user { background: #d1e3ff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .botify-msg.bot { background: #f0f0f0; align-self: flex-start; border-bottom-left-radius: 4px; }
    .botify-container.dark .botify-msg.bot { background: #555; }
    .botify-msg.typing { font-style: italic; color: #999; display: flex; align-items: center; gap: 5px; }

    .botify-input {
      display: flex; border-top: 1px solid #ddd; background: #fafafa; padding: 8px; align-items: center;
    }
    .botify-input input {
      flex: 1; border: none; padding: 10px; font-size: 14px; outline: none; background: none;
    }
    .botify-input button {
      background: ${primaryColor}; color: white; border: none; padding: 10px 16px; font-size: 16px; cursor: pointer;
      border-radius: 8px; transition: background 0.3s ease;
    }
    .botify-input button:hover { background: #5a54e8; }
    .botify-mic-btn { background: transparent; border: none; font-size: 18px; margin-left: 6px; cursor: pointer; color: ${primaryColor}; }

    .botify-loader {
      border: 3px solid #f3f3f3; border-top: 3px solid ${primaryColor}; border-radius: 50%;
      width: 16px; height: 16px; animation: spin 1s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  // Floating Button
  const button = document.createElement('button');
  button.className = 'botify-btn'; button.innerHTML = icon;
  document.body.appendChild(button);

  // Chat Container
  const container = document.createElement('div');
  container.className = `botify-container ${currentTheme}`; container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-header">
      <span>🤖 Botify Assistant</span>
      <button id="theme-toggle">${currentTheme === 'light' ? '🌙' : '☀️'}</button>
    </div>
    <div class="botify-messages" id="botify-messages"></div>
    <div class="botify-input">
      <input type="text" placeholder="Type your message with emojis... 😊" id="botify-input" />
      <button id="botify-mic" class="botify-mic-btn">🎤</button>
      <button id="botify-send">➤</button>
    </div>
  `;
  document.body.appendChild(container);

  button.addEventListener('click', () => {
    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
  });

  const sendBtn = container.querySelector('#botify-send');
  const inputField = container.querySelector('#botify-input');
  const micBtn = container.querySelector('#botify-mic');
  const messagesDiv = container.querySelector('#botify-messages');
  const themeToggle = container.querySelector('#theme-toggle');

  const appendMessage = (sender, text, loader = false) => {
    const msg = document.createElement('div');
    msg.className = `botify-msg ${sender === 'You' ? 'user' : 'bot'}`;
    msg.innerHTML = loader ? `<span class="botify-loader"></span> Bot is typing...` : text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim();
    if (!question) return;
    appendMessage('You', question);
    inputField.value = '';

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'botify-msg typing';
    typingIndicator.innerHTML = '<span class="botify-loader"></span> Bot is typing...';
    messagesDiv.appendChild(typingIndicator);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ question, faqs: [] }),
      });
      const data = await response.json();
      messagesDiv.removeChild(typingIndicator);
      appendMessage('Bot', data.reply || 'No response 😕');
    } catch (err) {
      messagesDiv.removeChild(typingIndicator);
      appendMessage('Bot', 'Error connecting to server. ❌');
      console.error(err);
    }
  });

  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    container.classList.toggle('dark', currentTheme === 'dark');
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  });

  // Speech-to-text functionality
  let recognition;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener('click', () => {
      recognition.start();
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputField.value += transcript + ' ';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  } else {
    micBtn.style.display = 'none'; // Hide mic if not supported
  }
})();
