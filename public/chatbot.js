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
  const positionStyles = position === 'bottom-left' ? 'bottom: 24px; left: 24px;' : 'bottom: 24px; right: 24px;';
  let currentTheme = initialTheme;

  const style = document.createElement('style');
  style.textContent = `
    .botify-btn {
      position: fixed; ${positionStyles}
      background: linear-gradient(135deg, ${primaryColor}, #6c63ff);
      color: white; border: none; border-radius: 50%;
      width: 70px; height: 70px; font-size: 34px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      transition: all 0.3s ease; z-index: 9999;
      backdrop-filter: blur(6px);
    }
    .botify-btn:hover { transform: scale(1.1); }

    .botify-container {
      position: fixed; ${positionStyles}
      width: 380px; max-height: 600px;
      background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px);
      border-radius: ${borderRadius}; font-family: ${fontFamily};
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      display: flex; flex-direction: column; overflow: hidden;
      z-index: 9999; animation: fadeIn 0.4s ease forwards; transform: translateY(30px); opacity: 0;
    }
    .botify-container.dark {
      background: rgba(34,34,34,0.95); color: white;
    }
    @keyframes fadeIn { to { transform: translateY(0); opacity: 1; } }

    .botify-header {
      background: linear-gradient(135deg, ${primaryColor}, #6c63ff);
      color: white; padding: 12px; font-weight: bold;
      display: flex; justify-content: space-between; align-items: center;
    }
    .botify-header button {
      background: transparent; border: none; color: white; cursor: pointer; font-size: 20px;
    }
    .botify-messages {
      flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;
    }
    .botify-msg {
      max-width: 75%; padding: 10px 14px; border-radius: 16px;
    }
    .botify-msg.user { background: #e0e7ff; align-self: flex-end; }
    .botify-msg.bot { background: #f3f4f6; align-self: flex-start; }
    .botify-container.dark .botify-msg.bot { background: #555; }
    .botify-input {
      display: flex; border-top: 1px solid #ddd; background: #fafafa;
    }
    .botify-input input {
      flex: 1; border: none; padding: 12px; font-size: 14px; outline: none; background: none;
    }
    .botify-input button {
      background: ${primaryColor}; color: white; border: none; padding: 12px 18px; font-size: 16px; cursor: pointer;
      transition: background 0.3s ease;
    }
    .botify-input button:hover { background: #5a54e8; }

    .botify-loader {
      border: 3px solid #f3f3f3; border-top: 3px solid ${primaryColor}; border-radius: 50%;
      width: 16px; height: 16px; animation: spin 1s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'botify-btn'; button.innerHTML = icon;
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.className = `botify-container ${currentTheme}`; container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-header">
      <span>🤖 Botify Assistant</span>
      <button id="theme-toggle">${currentTheme === 'light' ? '🌙' : '☀️'}</button>
    </div>
    <div class="botify-messages" id="botify-messages"></div>
    <div class="botify-input">
      <input type="text" placeholder="Type your message..." id="botify-input" />
      <button id="botify-send">➡️</button>
    </div>
  `;
  document.body.appendChild(container);

  button.addEventListener('click', () => {
    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
  });

  const sendBtn = container.querySelector('#botify-send');
  const inputField = container.querySelector('#botify-input');
  const messagesDiv = container.querySelector('#botify-messages');
  const themeToggle = container.querySelector('#theme-toggle');

  const appendMessage = (sender, text, loader = false) => {
    const msg = document.createElement('div');
    msg.className = `botify-msg ${sender === 'You' ? 'user' : 'bot'}`;
    msg.innerHTML = loader ? `<span class="botify-loader"></span>` : `${text}`;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim();
    if (!question) return;
    appendMessage('You', question);
    inputField.value = '';
    appendMessage('Bot', '', true);
    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ question, faqs: [] }),
      });
      const data = await response.json();
      messagesDiv.lastChild.innerHTML = `${data.reply || 'No response'}`;
    } catch (err) {
      messagesDiv.lastChild.innerHTML = 'Bot: Error connecting to server.';
      console.error(err);
    }
  });

  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    container.classList.toggle('dark', currentTheme === 'dark');
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  });
})();
