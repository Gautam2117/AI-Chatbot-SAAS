(function() {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Arial, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '16px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const icon = scriptTag.getAttribute('data-icon') || '💬'; // Customizable icon
  const initialTheme = scriptTag.getAttribute('data-theme') || 'light'; // dark/light mode

  const positionStyles = position === 'bottom-left'
    ? 'bottom: 24px; left: 24px;'
    : 'bottom: 24px; right: 24px;';

  let currentTheme = initialTheme;

  // Inject Styles
  const style = document.createElement('style');
  style.textContent = `
    .botify-widget-button {
      position: fixed;
      ${positionStyles}
      background-color: ${primaryColor};
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 30px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.3s ease;
      z-index: 9999;
    }
    .botify-widget-button:hover { transform: scale(1.1); }
    .botify-widget-container {
      position: fixed;
      ${positionStyles}
      width: 300px;
      max-height: 500px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: ${borderRadius};
      font-family: ${fontFamily};
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      animation: fadeInUp 0.3s ease;
    }
    .botify-widget-container.dark {
      background: rgba(34, 34, 34, 0.95);
      color: white;
    }
    .botify-widget-header {
      background-color: ${primaryColor};
      color: white;
      padding: 10px;
      font-weight: bold;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .botify-widget-header button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }
    .botify-widget-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
    .botify-widget-input {
      display: flex;
      border-top: 1px solid #ddd;
    }
    .botify-widget-input input {
      flex: 1;
      border: none;
      padding: 10px;
      outline: none;
    }
    .botify-widget-input button {
      background-color: ${primaryColor};
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
    }
    @keyframes fadeInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Create Floating Button
  const button = document.createElement('button');
  button.className = 'botify-widget-button';
  button.innerHTML = icon; // Custom icon support
  document.body.appendChild(button);

  // Create Chat Container
  const container = document.createElement('div');
  container.className = `botify-widget-container ${currentTheme}`;
  container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-widget-header">
      <span>Botify Assistant</span>
      <button id="theme-toggle">${currentTheme === 'light' ? '🌙' : '☀️'}</button>
    </div>
    <div class="botify-widget-messages" id="botify-messages"></div>
    <div class="botify-widget-input">
      <input type="text" placeholder="Type a message..." id="botify-input" />
      <button id="botify-send">Send</button>
    </div>
  `;
  document.body.appendChild(container);

  // Toggle Widget Visibility
  button.addEventListener('click', () => {
    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
  });

  const sendBtn = container.querySelector('#botify-send');
  const inputField = container.querySelector('#botify-input');
  const messagesDiv = container.querySelector('#botify-messages');
  const themeToggle = container.querySelector('#theme-toggle');

  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';

  const appendMessage = (sender, text) => {
    const msg = document.createElement('div');
    msg.style.margin = '5px 0';
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener('click', async () => {
    const question = inputField.value.trim();
    if (!question) return;
    appendMessage('You', question);
    inputField.value = '';
    appendMessage('Bot', 'Thinking...');
    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ question, faqs: [] }),
      });
      const data = await response.json();
      messagesDiv.lastChild.textContent = `Bot: ${data.reply || 'No response'}`;
    } catch (err) {
      messagesDiv.lastChild.textContent = 'Bot: Error connecting to server.';
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
