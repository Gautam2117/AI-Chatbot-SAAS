/* Botify Chat Widget — Premium UI + Drag/Swipe */
(function () {
  /* ------------------ Config ------------------ */
  const scriptTag     = document.currentScript;
  const userId        = scriptTag.getAttribute("data-user-id") || "guest-user";
  const brandName     = scriptTag.getAttribute("data-brand") || "Botify";
  const primaryColor  = scriptTag.getAttribute("data-color") || "#7C3AED";
  const fontFamily    = scriptTag.getAttribute("data-font") || "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  const borderRadius  = scriptTag.getAttribute("data-border-radius") || "22px";
  const positionAttr  = (scriptTag.getAttribute("data-position") || "bottom-right").toLowerCase();
  const draggable     = (scriptTag.getAttribute("data-draggable") || "true") !== "false";
  const userLogo      = scriptTag.getAttribute("data-logo") || "https://ai-chatbot-saas-eight.vercel.app/chatbot_widget_logo.png";
  const showPoweredBy = scriptTag.getAttribute("data-poweredby") !== "false";
  const BASE_URL      = "https://ai-chatbot-backend-h669.onrender.com";

  /* ------------------ i18n ------------------ */
  let currentLang = (localStorage.getItem("botify:lang") || "en");
  const translations = {
    en: { welcome:"Hello! How can I assist you today?", send:"Send", typing:`${brandName} is typing…`, mic:"🎤", placeholder:"Type a message…", online:"Online", offline:"Unavailable", help:"💡 Need help with something? Just ask!" },
    hi: { welcome:"नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?", send:"भेजें", typing:`${brandName} लिख रहा है…`, mic:"🎤", placeholder:"संदेश लिखें…", online:"ऑनलाइन", offline:"उपलब्ध नहीं", help:"💡 किसी मदद की ज़रूरत है? पूछिए!" },
    es: { welcome:"¡Hola! ¿En qué puedo ayudarte hoy?", send:"Enviar", typing:`${brandName} está escribiendo…`, mic:"🎤", placeholder:"Escribe un mensaje…", online:"En línea", offline:"No disponible", help:"💡 ¿Necesitas ayuda? ¡Pregunta!" },
    fr: { welcome:"Bonjour ! Comment puis-je vous aider ?", send:"Envoyer", typing:`${brandName} est en train d’écrire…`, mic:"🎤", placeholder:"Écrivez un message…", online:"En ligne", offline:"Indisponible", help:"💡 Besoin d’aide ? Demandez !" },
    zh: { welcome:"你好！我能为您做些什么？", send:"发送", typing:`${brandName} 正在输入…`, mic:"🎤", placeholder:"输入消息…", online:"在线", offline:"不可用", help:"💡 需要帮助吗？尽管问！" },
    ar: { welcome:"مرحبًا! كيف يمكنني مساعدتك؟", send:"إرسال", typing:`${brandName} يكتب…`, mic:"🎤", placeholder:"اكتب رسالة…", online:"متصل", offline:"غير متاح", help:"💡 هل تحتاج مساعدة؟ اسأل!" },
  };
  const t = (k) => (translations[currentLang] && translations[currentLang][k]) || translations.en[k] || k;

  /* ------------------ Styles ------------------ */
  const isLeft = positionAttr.includes("left");
  const posStyle = `bottom:20px; ${isLeft ? "left" : "right"}:20px;`;

  const style = document.createElement("style");
  style.textContent = `
  :root{--botify-primary:${primaryColor};--botify-font:${fontFamily};--botify-radius:${borderRadius};}
  .botify__launcher{position:fixed;${posStyle}width:64px;height:64px;border:0;background:transparent;cursor:pointer;z-index:9999}
  .botify__badge{position:absolute;top:-4px;${isLeft?"left":"right"}:-4px;min-width:20px;height:20px;padding:0 6px;font:700 11px/20px var(--botify-font);color:#fff;text-align:center;background:#EF4444;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.25);display:none}
  .botify__launcher-img{width:100%;height:100%;border-radius:50%;box-shadow:0 12px 28px rgba(0,0,0,.25);transition:transform .25s ease, box-shadow .25s ease}
  .botify__launcher:hover .botify__launcher-img{transform:scale(1.06);box-shadow:0 16px 36px rgba(0,0,0,.32)}
  .botify__pulse::after{content:"";position:absolute;inset:0;border-radius:999px;z-index:-1;box-shadow:0 0 0 0 var(--botify-primary);animation:botifyPulse 2s infinite}
  @keyframes botifyPulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.35)}70%{box-shadow:0 0 0 22px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}
  .botify__wrap{position:fixed;${posStyle}z-index:9999;display:none;width:360px;max-height:640px;overflow:hidden;border-radius:var(--botify-radius);background:rgba(255,255,255,.92);backdrop-filter:blur(14px);box-shadow:0 30px 60px rgba(0,0,0,.25);font-family:var(--botify-font);color:#0f172a;transform:translateY(30px);opacity:0;animation:botifyIn .35s ease forwards}
  @keyframes botifyIn{to{transform:translateY(0);opacity:1}}
  @media (max-width:480px){.botify__wrap{width:calc(100vw - 18px);height:calc(100vh - 18px);max-height:none;${isLeft?"left:9px":"right:9px"};bottom:9px;border-radius:18px}}
  .botify__header{display:flex;align-items:center;gap:10px;padding:12px;color:#fff;background:linear-gradient(135deg,var(--botify-primary),#EC4899);position:relative;cursor:grab;user-select:none}
  .botify__brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
  .botify__logo{width:38px;height:38px;border-radius:50%;object-fit:cover}
  .botify__title{font-weight:800;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .botify__status{font-size:11px;opacity:.85;display:flex;align-items:center;gap:6px}
  .botify__dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.2)}
  .botify__ctrls{display:flex;align-items:center;gap:8px}
  .botify__select,.botify__btn{appearance:none;border:0;border-radius:10px;padding:6px 10px;background:rgba(255,255,255,.22);color:#fff;font-size:12px;cursor:pointer;transition:background .2s ease}
  .botify__btn:hover,.botify__select:hover{background:rgba(255,255,255,.34)}
  .botify__messages{background:linear-gradient(180deg,#F8FAFC,#EEF2FF);padding:12px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;height:360px}
  .botify__row{display:flex;gap:8px}
  .botify__bubble{max-width:78%;padding:10px 14px;border-radius:18px;line-height:1.42;box-shadow:0 2px 10px rgba(2,6,23,.08)}
  .botify__bubble--bot{background:#fff;border-top-left-radius:6px}
  .botify__bubble--me{margin-left:auto;background:#E0EAFF;border-top-right-radius:6px}
  .botify__chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 12px 8px}
  .botify__chip{background:#fff;border:1px solid rgba(99,102,241,.2);color:#4f46e5;padding:6px 10px;border-radius:999px;font-size:12px;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}
  .botify__chip:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(79,70,229,.2)}
  .botify__input{display:flex;align-items:center;gap:6px;padding:8px;border-top:1px solid rgba(99,102,241,.18);background:rgba(255,255,255,.7)}
  .botify__field{flex:1;border:0;background:transparent;padding:12px;outline:none;font-size:14px}
  .botify__send,.botify__mic{border:0;cursor:pointer;border-radius:999px;width:38px;height:38px;display:grid;place-items:center;transition:transform .1s ease,box-shadow .2s ease,background .2s ease}
  .botify__send{background:var(--botify-primary);color:#fff;box-shadow:0 8px 20px rgba(79,70,229,.35)}
  .botify__mic{background:#EEF2FF;color:var(--botify-primary)}
  .botify__send:hover{transform:translateY(-1px)}
  .botify__mic:hover{background:#E0EAFF}
  .botify__footer{font-size:10px;color:#64748b;text-align:center;padding:6px 0 10px}
  .botify__footer a{color:var(--botify-primary);font-weight:700;text-decoration:none}
  .botify__typing{display:flex;align-items:center;gap:8px;color:#334155}
  .botify__dots{display:flex;gap:4px}
  .botify__dotpulse{width:8px;height:8px;background:var(--botify-primary);border-radius:50%;animation:dot 1.2s infinite ease-in-out;opacity:.7}
  .botify__dotpulse:nth-child(2){animation-delay:.15s}.botify__dotpulse:nth-child(3){animation-delay:.3s}
  @keyframes dot{0%,80%,100%{transform:scale(.75);opacity:.35}40%{transform:scale(1.15);opacity:1}}
  .botify--dark .botify__wrap{background:rgba(17,24,39,.9);color:#e5e7eb}
  .botify--dark .botify__messages{background:linear-gradient(180deg,#0f172a,#111827)}
  .botify--dark .botify__bubble--bot{background:#0B1020;color:#e5e7eb}
  .botify--dark .botify__bubble--me{background:#1E293B;color:#e5e7eb}
  .botify--dark .botify__input{background:rgba(17,24,39,.8);border-top-color:rgba(99,102,241,.2)}
  .botify--dark .botify__mic{background:#0B1020;color:#c7d2fe}
  `;
  document.head.appendChild(style);

  /* ------------------ DOM ------------------ */
  const launchBtn = document.createElement("button");
  launchBtn.className = "botify__launcher botify__pulse";
  launchBtn.setAttribute("aria-label","Open chat");
  launchBtn.innerHTML = `<span class="botify__badge" id="botifyBadge">1</span><img class="botify__launcher-img" src="${userLogo}" alt="${brandName} Chat" />`;
  document.body.appendChild(launchBtn);

  const wrap = document.createElement("div");
  wrap.className = "botify__wrap";
  wrap.setAttribute("role","dialog");
  wrap.setAttribute("aria-label",`${brandName} Chat`);
  wrap.setAttribute("aria-live","polite");
  wrap.style.display = "none";
  wrap.innerHTML = `
    <div class="botify__header" id="botifyHeader">
      <div class="botify__brand" title="${brandName}">
        <img class="botify__logo" src="${userLogo}" alt="${brandName}"/>
        <div style="min-width:0">
          <div class="botify__title">${brandName} Chat</div>
          <div class="botify__status"><span class="botify__dot" id="botifyStatusDot"></span><span id="botifyStatusText">Online</span></div>
        </div>
      </div>
      <div class="botify__ctrls">
        <select class="botify__select" id="botifyLang">${Object.keys(translations).map(l=>`<option value="${l}" ${l===currentLang?"selected":""}>${l.toUpperCase()}</option>`).join("")}</select>
        <button class="botify__btn" id="botifyTheme" title="Toggle theme">🌙</button>
        <button class="botify__btn" id="botifyClose" title="Close">✕</button>
      </div>
    </div>
    <div class="botify__messages" id="botifyMsgs"></div>
    <div class="botify__chips" id="botifyChips"></div>
    <div class="botify__input">
      <input class="botify__field" id="botifyField" type="text" placeholder="${t("placeholder")}" />
      <button class="botify__mic" id="botifyMic" title="Voice">🎤</button>
      <button class="botify__send" id="botifySend" title="${t("send")}">➤</button>
    </div>
    ${showPoweredBy ? `<div class="botify__footer">Powered by <a target="_blank" href="https://botify-website.vercel.app/">Botify</a></div>` : ""}
  `;
  document.body.appendChild(wrap);

  /* ------------------ Utils ------------------ */
  const $ = (id) => wrap.querySelector(`#${id}`);
  const msgs = $("botifyMsgs"), field = $("botifyField"), sendBtn = $("botifySend"), micBtn = $("botifyMic");
  const closeBtn = $("botifyClose"), themeBtn = $("botifyTheme"), langSelect = $("botifyLang");
  const header = document.getElementById("botifyHeader");
  const badge  = document.getElementById("botifyBadge");
  const statusDot = $("botifyStatusDot"), statusText = $("botifyStatusText");
  const chipsEl = $("botifyChips");
  const save = (k,v)=>localStorage.setItem(`botify:${k}`, String(v));
  const load = (k,d)=>localStorage.getItem(`botify:${k}`) ?? d;

  function setOnline(online){ statusDot.style.background = online ? "#22c55e" : "#ef4444"; statusText.textContent = online ? t("online") : t("offline"); }
  function setUnread(n){ if(!badge) return; if(n>0){badge.style.display="inline-block";badge.textContent=String(n);} else badge.style.display="none"; }

  let unread = Number(load("unread","1")); setUnread(unread);

  function openPanel(){ wrap.style.display="block"; setTimeout(()=>field.focus(),50); setUnread(0); save("unread","0"); }
  function closePanel(){ wrap.style.display="none"; }

  function bubble(text, me=false, html=false){
    const row = document.createElement("div"); row.className="botify__row";
    const b = document.createElement("div"); b.className=`botify__bubble ${me?"botify__bubble--me":"botify__bubble--bot"}`;
    if(html) b.innerHTML = text; else b.textContent = text;
    row.appendChild(b); msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight;
    if(!me && wrap.style.display==="none"){ unread += 1; setUnread(unread); save("unread", String(unread)); }
    return b;
  }
  function typingNode(){
    const row = document.createElement("div"); row.className="botify__row";
    const b = document.createElement("div"); b.className="botify__bubble botify__bubble--bot";
    b.innerHTML = `<div class="botify__typing"><div class="botify__dots"><span class="botify__dotpulse"></span><span class="botify__dotpulse"></span><span class="botify__dotpulse"></span></div><span>${t("typing")}</span></div>`;
    row.appendChild(b); msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight; return row;
  }

  /* suggestion chips */
  ["What can you do?","How do I integrate the widget?","Show pricing plans","Contact support"].forEach(label=>{
    const c=document.createElement("button"); c.className="botify__chip"; c.textContent=label;
    c.addEventListener("click",()=>{ field.value=label; sendBtn.click(); });
    chipsEl.appendChild(c);
  });

  /* ------------------ Events ------------------ */
  launchBtn.addEventListener("click", ()=> wrap.style.display==="none" ? openPanel() : closePanel());
  closeBtn.addEventListener("click", closePanel);
  field.addEventListener("keydown",(e)=>{ if(e.key==="Enter"){ e.preventDefault(); sendBtn.click(); }});
  langSelect.addEventListener("change",(e)=>{ currentLang=e.target.value; field.placeholder=t("placeholder"); save("lang",currentLang); });

  // theme
  const storedTheme = load("theme","light");
  if(storedTheme==="dark") document.body.classList.add("botify--dark");
  themeBtn.textContent = storedTheme==="dark" ? "☀️" : "🌙";
  themeBtn.addEventListener("click", ()=>{ const dark=document.body.classList.toggle("botify--dark"); themeBtn.textContent=dark?"☀️":"🌙"; save("theme",dark?"dark":"light"); });

  // speech
  if(!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)){ micBtn.style.display="none"; }
  else {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR(); recog.lang="en-US"; recog.interimResults=false; recog.maxAlternatives=1;
    micBtn.addEventListener("click", ()=>recog.start());
    recog.onresult = (e)=>{ field.value += e.results[0][0].transcript + " "; field.focus(); };
  }

  // drag on desktop
  if (draggable && window.matchMedia("(pointer:fine)").matches) {
    let dragging=false, sx=0, sy=0, startLeft=0, startTop=0;
    const onDown=(e)=>{ dragging=true; header.style.cursor="grabbing"; const r=wrap.getBoundingClientRect(); startLeft=r.left; startTop=r.top; sx=e.clientX; sy=e.clientY; document.addEventListener("mousemove",onMove); document.addEventListener("mouseup",onUp); };
    const onMove=(e)=>{ if(!dragging) return; const dx=e.clientX-sx, dy=e.clientY-sy; wrap.style.left=(startLeft+dx)+"px"; wrap.style.top=(startTop+dy)+"px"; wrap.style.right="auto"; wrap.style.bottom="auto"; };
    const onUp=()=>{ dragging=false; header.style.cursor="grab"; document.removeEventListener("mousemove",onMove); document.removeEventListener("mouseup",onUp); };
    header.addEventListener("mousedown", onDown);
  }

  // bottom-sheet swipe on touch
  (function addSwipeToClose(){
    let startY=null, moved=false;
    header.addEventListener("touchstart",(e)=>{ startY = e.touches[0].clientY; moved=false; }, {passive:true});
    header.addEventListener("touchmove",(e)=>{ if(startY==null) return; const dy=e.touches[0].clientY - startY; if(dy>10){ moved=true; wrap.style.transform=`translateY(${Math.min(dy,140)}px)`; wrap.style.opacity = String(Math.max(0.3, 1 - dy/300)); } }, {passive:true});
    header.addEventListener("touchend",()=>{ if(!moved){ startY=null; return; } const matrix = new WebKitCSSMatrix(getComputedStyle(wrap).transform); const dy = Math.abs(matrix.m42 || 0); if(dy>120) closePanel(); wrap.style.transform="translateY(0px)"; wrap.style.opacity="1"; startY=null; }, {passive:true});
  })();

  /* ------------------ Messaging ------------------ */
  async function send(question){
    bubble(question,true);
    field.value="";
    const typing=typingNode();
    try{
      const res = await fetch(`${BASE_URL}/api/chat`, { method:"POST", headers:{ "Content-Type":"application/json","x-user-id":userId }, body:JSON.stringify({ question, lang:currentLang, faqs:[] }) });
      if(res.status===403){
        typing.remove(); setOnline(false);
        bubble(`<strong>🙏 We're currently unavailable</strong><br/>The team reached its daily usage limit. Please try again later.`, false, true);
        disable(true); return;
      }
      setOnline(true);
      if(!res.body){ typing.remove(); bubble("⚠️ Streaming not supported by this browser."); return; }
      const reader=res.body.getReader(); const decoder=new TextDecoder("utf-8");
      typing.remove(); const live=bubble("",false);
      let acc=""; while(true){ const {value,done}=await reader.read(); if(done) break; const chunk=decoder.decode(value,{stream:true}); acc+=chunk; live.textContent=acc; msgs.scrollTop=msgs.scrollHeight; }
      if(!acc) live.textContent="⚠️ No response";
    }catch(_){ typing.remove(); setOnline(false); bubble("❌ Unable to connect. Please try again later."); }
  }
  sendBtn.addEventListener("click", ()=>{ const q=field.value.trim(); if(!q) return; send(q); });
  function disable(off=true){ field.disabled=off; sendBtn.disabled=off; micBtn.disabled=off; wrap.style.opacity=off?".65":"1"; field.placeholder = off ? "Support is currently unavailable." : t("placeholder"); }

  // initial messages + availability check
  bubble(t("welcome")); setTimeout(()=>bubble(t("help")), 12000);
  (async function check(){ try{ const r=await fetch(`${BASE_URL}/api/usage-status`,{headers:{'x-user-id':userId}}); const d=await r.json(); if(d.blocked){ setOnline(false); bubble(`🚫 <strong>Chat temporarily unavailable</strong><br/>Our support team reached its daily limit.`, false, true); disable(true);} else { setOnline(true); disable(false);} }catch(_){}})();
  setInterval(async ()=>{ try{ const r=await fetch(`${BASE_URL}/api/usage-status`,{headers:{'x-user-id':userId}}); const d=await r.json(); if(!d.blocked){ setOnline(true); disable(false);} }catch(_){ } }, 300000);
})();
