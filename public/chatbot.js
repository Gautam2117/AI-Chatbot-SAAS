(function() {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Arial, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '16px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const icon = scriptTag.getAttribute('data-icon') || '💬';
  const initialTheme = scriptTag.getAttribute('data-theme') || 'light';

  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';
  const positionStyles = position === 'bottom-left'
    ? 'bottom: 24px; left: 24px;'
    : 'bottom: 24px; right: 24px;';

  let currentTheme = initialTheme;

  const style = document.createElement('style');
  style.textContent = `
    .botify-widget-button {
      position: fixed; ${positionStyles}
      background-color: ${primaryColor};
      color: white; border: none; border-radius: 50%;
      width: 70px; height: 70px; font-size: 34px;
      cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: transform 0.3s ease; z-index: 9999;
    }
    .botify-widget-button:hover { transform: scale(1.1); }

    .botify-widget-container {
      position: fixed; ${positionStyles}
      width: 400px; max-height: 600px;
      background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
      border-radius: ${borderRadius}; font-family: ${fontFamily};
      box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      display: flex; flex-direction: column; overflow: hidden;
      z-index: 9999; animation: fadeInUp 0.4s ease;
    }
    .botify-widget-container.dark {
      background: rgba(34,34,34,0.95); color: white;
    }
    .botify-widget-header {
      background-color: ${primaryColor}; color: white;
      padding: 12px; font-weight: bold; text-align: center;
      display: flex; justify-content: space-between; align-items: center;
    }
    .botify-widget-header button {
      background: transparent; border: none; color: white; cursor: pointer; font-size: 18px;
    }
    .botify-widget-messages {
      flex: 1; padding: 10px; overflow-y: auto; font-size: 14px;
    }
    .botify-widget-input {
      display: flex; border-top: 1px solid #ddd;
    }
    .botify-widget-input input {
      flex: 1; border: none; padding: 12px; font-size: 14px; outline: none;
    }
    .botify-widget-input button {
      background-color: ${primaryColor}; color: white; border: none; padding: 12px 18px; cursor: pointer;
    }
    @keyframes fadeInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .botify-loader { border: 3px solid #f3f3f3; border-top: 3px solid ${primaryColor}; border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'botify-widget-button'; button.innerHTML = icon;
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.className = `botify-widget-container ${currentTheme}`; container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-widget-header">
      <span>Botify Assistant</span>
      <button id="theme-toggle">${currentTheme === 'light' ? '🌙' : '☀️'}</button>
    </div>
    <div class="botify-widget-messages" id="botify-messages"></div>
    <div class="botify-widget-input">
      <input type="text" placeholder="Type your message..." id="botify-input" />
      <button id="botify-send">Send</button>
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
    msg.style.margin = '8px 0';
    msg.innerHTML = loader ? `<strong>${sender}:</strong> <span class="botify-loader"></span>` : `<strong>${sender}:</strong> ${text}`;
    messagesDiv.appendChild(msg); messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim(); if (!question) return;
    appendMessage('You', question); inputField.value = ''; appendMessage('Bot', '', true);
    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ question, faqs: [] }),
      });
      const data = await response.json();
      messagesDiv.lastChild.innerHTML = `<strong>Bot:</strong> ${data.reply || 'No response'}`;
    } catch (err) {
      messagesDiv.lastChild.innerHTML = 'Bot: Error connecting to server.'; console.error(err);
    }
  });
  inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn.click(); });
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light'; container.classList.toggle('dark', currentTheme === 'dark');
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  });
})();
