(function() {
  const scriptTag = document.currentScript;
  const userId = scriptTag.getAttribute('data-user-id') || 'guest-user';
  const primaryColor = scriptTag.getAttribute('data-color') || '#4f46e5';
  const fontFamily = scriptTag.getAttribute('data-font') || 'Arial, sans-serif';
  const borderRadius = scriptTag.getAttribute('data-border-radius') || '20px';
  const position = scriptTag.getAttribute('data-position') || 'bottom-right';
  const icon = scriptTag.getAttribute('data-icon') || '💬';
  const initialTheme = scriptTag.getAttribute('data-theme') || 'light';

  const positionStyles = position === 'bottom-left'
    ? 'bottom: 24px; left: 24px;'
    : 'bottom: 24px; right: 24px;';

  let currentTheme = initialTheme;

  const style = document.createElement('style');
  style.textContent = `
    .botify-button {
      position: fixed; ${positionStyles}
      background: ${primaryColor};
      color: white; border: none; border-radius: 50%;
      width: 64px; height: 64px; font-size: 28px;
      cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      transition: all 0.3s ease; z-index: 9999;
    }
    .botify-button:hover { transform: scale(1.1); }

    .botify-container {
      position: fixed; ${positionStyles}
      width: 360px; height: 500px; background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px); border-radius: ${borderRadius};
      font-family: ${fontFamily}; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      display: flex; flex-direction: column; overflow: hidden;
      animation: fadeInUp 0.4s ease; z-index: 9999;
    }
    .botify-container.dark { background: rgba(30,30,30,0.95); color: white; }

    .botify-header {
      background: ${primaryColor}; color: white; padding: 10px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .botify-messages {
      flex: 1; padding: 10px; overflow-y: auto; scroll-behavior: smooth;
    }
    .botify-input {
      display: flex; border-top: 1px solid #ddd;
    }
    .botify-input input {
      flex: 1; padding: 10px; border: none; outline: none; font-size: 14px;
    }
    .botify-input button {
      background: ${primaryColor}; color: white; border: none; padding: 10px;
    }
    @keyframes fadeInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'botify-button';
  button.innerHTML = icon;
  document.body.appendChild(button);

  const container = document.createElement('div');
  container.className = `botify-container ${currentTheme}`;
  container.style.display = 'none';
  container.innerHTML = `
    <div class="botify-header">
      <span>Botify Assistant</span>
      <button id="botify-theme">${currentTheme === 'light' ? '🌙' : '☀️'}</button>
    </div>
    <div class="botify-messages" id="botify-msgs"></div>
    <div class="botify-input">
      <input type="text" id="botify-input" placeholder="Ask something...">
      <button id="botify-send">Send</button>
    </div>
  `;
  document.body.appendChild(container);

  button.onclick = () => container.style.display = container.style.display === 'none' ? 'flex' : 'none';
  const themeBtn = container.querySelector('#botify-theme');
  themeBtn.onclick = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    container.classList.toggle('dark', currentTheme === 'dark');
    themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  };

  const sendBtn = container.querySelector('#botify-send');
  const input = container.querySelector('#botify-input');
  const msgs = container.querySelector('#botify-msgs');
  const BASE_URL = 'https://ai-chatbot-backend-h669.onrender.com';

  const appendMsg = (sender, text) => {
    const m = document.createElement('div');
    m.style.margin = '5px 0'; m.innerHTML = `<strong>${sender}:</strong> ${text}`;
    msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight;
  };

  sendBtn.onclick = async () => {
    const q = input.value.trim(); if (!q) return;
    appendMsg('You', q); input.value = ''; appendMsg('Bot', 'Thinking...');
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ question: q, faqs: [] }) // 🔥 Replace with dynamic FAQs from backend
      });
      const data = await res.json();
      msgs.lastChild.textContent = `Bot: ${data.reply || 'No response'}`;
    } catch (e) {
      msgs.lastChild.textContent = 'Bot: Error connecting.';
      console.error(e);
    }
  };
  input.addEventListener('keypress', e => e.key === 'Enter' && sendBtn.click());
})();
