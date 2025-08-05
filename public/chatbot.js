/* Botify Chat Widget — Deluxe v2 (no external deps) */
(function () {
  /* ------------------ Config ------------------ */
  var scriptTag     = document.currentScript;
  var userId        = scriptTag.getAttribute("data-user-id") || "guest-user";
  var brandName     = scriptTag.getAttribute("data-brand") || "Botify";
  var primaryColor  = scriptTag.getAttribute("data-color") || "#7C3AED";
  var fontFamily    = scriptTag.getAttribute("data-font") || "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  var borderRadius  = scriptTag.getAttribute("data-border-radius") || "22px";
  var positionAttr  = (scriptTag.getAttribute("data-position") || "bottom-right").toLowerCase();
  var draggable     = (scriptTag.getAttribute("data-draggable") || "true") !== "false";
  var userLogo      = scriptTag.getAttribute("data-logo") || "https://ai-chatbot-saas-eight.vercel.app/chatbot_widget_logo.png";
  var showPoweredBy = scriptTag.getAttribute("data-poweredby") !== "false";
  var BASE_URL      = "https://ai-chatbot-backend-h669.onrender.com";

  var storageKey = "botify:v2:" + userId;
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------ i18n ------------------ */
  var currentLang = localStorage.getItem("botify:lang") || "en";
  var translations = {
    en: { welcome:"Hello! How can I help today?", send:"Send", typing: brandName + " is typing...", mic:"🎤", placeholder:"Type a message...", online:"Online", offline:"Unavailable", help:"Need help comparing plans?" },
    hi: { welcome:"नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?", send:"भेजें", typing: brandName + " लिख रहा है...", mic:"🎤", placeholder:"संदेश लिखें...", online:"ऑनलाइन", offline:"उपलब्ध नहीं", help:"योजनाओं की तुलना चाहिए?" },
    es: { welcome:"¡Hola! ¿En qué puedo ayudarte hoy?", send:"Enviar", typing: brandName + " está escribiendo...", mic:"🎤", placeholder:"Escribe un mensaje...", online:"En línea", offline:"No disponible", help:"¿Necesitas comparar planes?" },
    fr: { welcome:"Bonjour ! Comment puis-je vous aider aujourd’hui ?", send:"Envoyer", typing: brandName + " est en train d’écrire...", mic:"🎤", placeholder:"Écrivez un message...", online:"En ligne", offline:"Indisponible", help:"Besoin de comparer les offres ?" },
    zh: { welcome:"你好！我今天能帮你做什么？", send:"发送", typing: brandName + " 正在输入...", mic:"🎤", placeholder:"输入消息...", online:"在线", offline:"不可用", help:"需要对比套餐吗？" },
    ar: { welcome:"مرحبًا! كيف أستطيع مساعدتك اليوم؟", send:"إرسال", typing: "…"+brandName+" يكتب", mic:"🎤", placeholder:"اكتب رسالة...", online:"متصل", offline:"غير متاح", help:"هل تريد مقارنة الخطط؟" }
  };
  function t(k){ return (translations[currentLang] && translations[currentLang][k]) || translations.en[k] || k; }

  /* ------------------ Styles ------------------ */
  var isLeft = positionAttr.indexOf("left") !== -1;
  var posStyle = "bottom:24px;" + (isLeft ? "left" : "right") + ":24px;";

  var style = document.createElement("style");
  style.textContent =
  ":root{--botify-primary:"+primaryColor+";--botify-font:"+fontFamily+";--botify-radius:"+borderRadius+";}" +
  ".botify__launcher{position:fixed;"+posStyle+"width:68px;height:68px;border:0;background:transparent;cursor:pointer;z-index:999999}" +
  ".botify__badge{position:absolute;top:-4px;"+(isLeft?"left":"right")+":-4px;min-width:20px;height:20px;padding:0 6px;font:700 11px/20px var(--botify-font);color:#fff;text-align:center;background:#EF4444;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.25);display:none}" +
  ".botify__launcher-img{width:100%;height:100%;border-radius:50%;box-shadow:0 14px 30px rgba(0,0,0,.28);transition:transform .2s ease, box-shadow .2s ease}" +
  ".botify__launcher:hover .botify__launcher-img{transform:scale(1.06);box-shadow:0 18px 40px rgba(0,0,0,.35)}" +
  (prefersReduced ? "" : ".botify__pulse::after{content:\"\";position:absolute;inset:0;border-radius:999px;z-index:-1;box-shadow:0 0 0 0 var(--botify-primary);animation:botifyPulse 2s infinite}") +
  "@keyframes botifyPulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.35)}70%{box-shadow:0 0 0 26px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}" +
  ".botify__wrap{position:fixed;"+posStyle+"z-index:999998;display:none;width:400px;max-height:700px;overflow:hidden;border-radius:var(--botify-radius);background:rgba(255,255,255,.94);backdrop-filter:blur(16px);box-shadow:0 34px 70px rgba(0,0,0,.28);font-family:var(--botify-font);color:#0f172a;transform:translateY(24px);opacity:0;}" +
  (prefersReduced ? "" : ".botify__wrap.botify--in{animation:botifyIn .28s ease forwards}") +
  "@keyframes botifyIn{to{transform:translateY(0);opacity:1}}" +
  "@media (max-width:480px){.botify__wrap{width:calc(100vw - 18px);height:calc(100vh - 18px);max-height:none;"+(isLeft?"left:9px":"right:9px")+";bottom:9px;border-radius:18px}}" +
  ".botify__header{display:flex;align-items:center;gap:10px;padding:12px;color:#fff;background:linear-gradient(135deg,var(--botify-primary),#EC4899);position:relative;cursor:grab;user-select:none}" +
  ".botify__brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1}" +
  ".botify__logo{width:40px;height:40px;border-radius:50%;object-fit:cover}" +
  ".botify__title{font-weight:800;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
  ".botify__status{font-size:11px;opacity:.9;display:flex;align-items:center;gap:6px}" +
  ".botify__dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.2)}" +
  ".botify__ctrls{display:flex;align-items:center;gap:8px}" +
  ".botify__select{appearance:none;border:0;border-radius:10px;padding:6px 10px;background:#ffffff;color:#1f2937;font-size:12px;cursor:pointer;transition:background .2s ease}" +
  ".botify__select:hover{background:#f3f4f6}" +
  ".botify__select option{color:#1f2937;background:#ffffff}" +
  ".botify__btn{border:0;border-radius:10px;padding:6px 10px;background:rgba(255,255,255,.22);color:#fff;font-size:12px;cursor:pointer;transition:background .2s ease}" +
  ".botify__btn:hover{background:rgba(255,255,255,.34)}" +
  ".botify__messages{background:linear-gradient(180deg,#F8FAFC,#EEF2FF);padding:14px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;height:460px;scroll-behavior:smooth}" +
  ".botify__row{display:flex;gap:8px;align-items:flex-end}" +
  ".botify__avatar{width:28px;height:28px;border-radius:50%;flex:0 0 auto;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,.12)}" +
  ".botify__bubble{max-width:78%;padding:12px 14px;border-radius:18px;line-height:1.45;box-shadow:0 2px 10px rgba(2,6,23,.08);word-wrap:break-word;white-space:pre-wrap}" +
  ".botify__bubble--bot{background:#fff;border-top-left-radius:8px}" +
  ".botify__bubble--me{margin-left:auto;background:#E0EAFF;border-top-right-radius:8px}" +
  ".botify__time{font-size:10px;color:#6b7280;margin-top:4px}" +
  ".botify__chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 12px 10px}" +
  ".botify__chip{background:#fff;border:1px solid rgba(99,102,241,.2);color:#4f46e5;padding:6px 10px;border-radius:999px;font-size:12px;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}" +
  ".botify__chip:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(79,70,229,.2)}" +
  ".botify__input{display:flex;align-items:flex-end;gap:6px;padding:10px;border-top:1px solid rgba(99,102,241,.18);background:rgba(255,255,255,.75)}" +
  ".botify__ta{flex:1;border:0;background:transparent;padding:12px;outline:none;font-size:14px;resize:none;max-height:132px;min-height:44px}" +
  ".botify__send,.botify__mic{border:0;cursor:pointer;border-radius:999px;width:40px;height:40px;display:grid;place-items:center;transition:transform .1s ease,box-shadow .2s ease,background .2s ease}" +
  ".botify__send{background:var(--botify-primary);color:#fff;box-shadow:0 10px 22px rgba(79,70,229,.35)}" +
  ".botify__send:hover{transform:translateY(-1px)}" +
  ".botify__mic{background:#EEF2FF;color:var(--botify-primary)}" +
  ".botify__mic:hover{background:#E0EAFF}" +
  ".botify__footer{font-size:10px;color:#64748b;text-align:center;padding:6px 0 10px}" +
  ".botify__footer a{color:var(--botify-primary);font-weight:700;text-decoration:none}" +
  ".botify__typing{display:flex;align-items:center;gap:8px;color:#334155}" +
  ".botify__dots{display:flex;gap:4px}" +
  ".botify__dotpulse{width:8px;height:8px;background:var(--botify-primary);border-radius:50%;animation:dot 1.1s infinite ease-in-out;opacity:.7}" +
  ".botify__dotpulse:nth-child(2){animation-delay:.12s}.botify__dotpulse:nth-child(3){animation-delay:.24s}" +
  "@keyframes dot{0%,80%,100%{transform:scale(.75);opacity:.35}40%{transform:scale(1.12);opacity:1}}" +
  ".botify--dark .botify__wrap{background:rgba(17,24,39,.92);color:#e5e7eb}" +
  ".botify--dark .botify__messages{background:linear-gradient(180deg,#0f172a,#111827)}" +
  ".botify--dark .botify__bubble--bot{background:#0B1020;color:#e5e7eb}" +
  ".botify--dark .botify__bubble--me{background:#1E293B;color:#e5e7eb}" +
  ".botify--dark .botify__input{background:rgba(17,24,39,.88);border-top-color:rgba(99,102,241,.2)}" +
  ".botify--dark .botify__mic{background:#0B1020;color:#c7d2fe}" +
  ".botify__scrolldn{position:absolute;right:14px;bottom:94px;background:#fff;border:1px solid rgba(2,6,23,.08);border-radius:999px;box-shadow:0 8px 18px rgba(0,0,0,.15);height:34px;width:34px;display:none;place-items:center;color:#334155}" +
  ".botify--dark .botify__scrolldn{background:#0B1020;border-color:#1f2937;color:#cbd5e1}" +
  ".botify__copy{margin-left:8px;font-size:11px;color:#94a3b8;cursor:pointer}" +
  ".botify__copy:hover{text-decoration:underline}"
  ;
  document.head.appendChild(style);

  /* ------------------ DOM ------------------ */
  var launchBtn = document.createElement("button");
  launchBtn.className = "botify__launcher botify__pulse";
  launchBtn.setAttribute("aria-label","Open chat");
  launchBtn.innerHTML = '<span class="botify__badge" id="botifyBadge">1</span><img class="botify__launcher-img" src="'+userLogo+'" alt="'+brandName+' Chat" />';
  document.body.appendChild(launchBtn);

  var wrap = document.createElement("div");
  wrap.className = "botify__wrap";
  wrap.setAttribute("role","dialog");
  wrap.setAttribute("aria-label", brandName+" Chat");
  wrap.setAttribute("aria-live","polite");
  wrap.style.display = "none";
  wrap.innerHTML =
    '<div class="botify__header" id="botifyHeader">'+
      '<div class="botify__brand" title="'+brandName+'">'+
        '<img class="botify__logo" src="'+userLogo+'" alt="'+brandName+'"/>'+
        '<div style="min-width:0">'+
          '<div class="botify__title">'+brandName+' Chat</div>'+
          '<div class="botify__status"><span class="botify__dot" id="botifyStatusDot"></span><span id="botifyStatusText">Online</span></div>'+
        '</div>'+
      '</div>'+
      '<div class="botify__ctrls">'+
        '<select class="botify__select" id="botifyLang">'+Object.keys(translations).map(function(l){ return '<option value="'+l+'" '+(l===currentLang?'selected':'')+'>'+l.toUpperCase()+'</option>';}).join("")+'</select>'+
        '<button class="botify__btn" id="botifyTheme" title="Toggle theme">🌙</button>'+
        '<button class="botify__btn" id="botifyClose" title="Close">✕</button>'+
      '</div>'+
    '</div>'+
    '<div class="botify__messages" id="botifyMsgs"></div>'+
    '<button class="botify__scrolldn" id="botifyDown" aria-label="Scroll to latest">↓</button>'+
    '<div class="botify__chips" id="botifyChips"></div>'+
    '<div class="botify__input">'+
      '<textarea class="botify__ta" id="botifyField" rows="1" placeholder="'+t("placeholder")+'" aria-label="Message input"></textarea>'+
      '<button class="botify__mic" id="botifyMic" title="Voice">🎤</button>'+
      '<button class="botify__send" id="botifySend" title="'+t("send")+'">➤</button>'+
    '</div>'+
    (showPoweredBy ? '<div class="botify__footer">Powered by <a target="_blank" rel="noopener" href="https://botify-website.vercel.app/">Botify</a></div>' : "")
  ;
  document.body.appendChild(wrap);

  /* ------------------ Utils & State ------------------ */
  function $(id){ return wrap.querySelector("#"+id); }
  var msgs = $("botifyMsgs");
  var field = $("botifyField");
  var sendBtn = $("botifySend");
  var micBtn = $("botifyMic");
  var closeBtn = $("botifyClose");
  var themeBtn = $("botifyTheme");
  var langSelect = $("botifyLang");
  var header = document.getElementById("botifyHeader");
  var badge  = document.getElementById("botifyBadge");
  var statusDot = $("botifyStatusDot");
  var statusText = $("botifyStatusText");
  var chipsEl = $("botifyChips");
  var downBtn = $("botifyDown");

  function save(k,v){ try{ localStorage.setItem("botify:"+k, String(v)); }catch(e){} }
  function load(k,d){ try{ var v=localStorage.getItem("botify:"+k); return v===null?d:v; }catch(e){ return d; } }

  function formatTime(d){ var h=d.getHours(), m=d.getMinutes(); var ap = h>=12?"PM":"AM"; h = h%12 || 12; return h+":"+(m<10?"0"+m:m)+" "+ap; }
  function setOnline(online){ statusDot.style.background = online ? "#22c55e" : "#ef4444"; statusText.textContent = online ? t("online") : t("offline"); }
  function setUnread(n){ if(!badge) return; if(n>0){badge.style.display="inline-block";badge.textContent=String(n);} else badge.style.display="none"; }
  function autogrow(){ field.style.height="auto"; field.style.height = Math.min(field.scrollHeight, 132) + "px"; }

  var unread = Number(load("unread","1")); setUnread(unread);

  function linkify(text){
    // very small URL matcher; no markdown parser
    var re = /(https?:\/\/[^\s]+)/g;
    return text.replace(re, function(u){ return '<a href="'+u+'" target="_blank" rel="noopener">'+u+'</a>'; });
  }

  function appendRow(role, textHtml, ts){
    var row = document.createElement("div");
    row.className = "botify__row";

    var isMe = role === "me";

    if(!isMe){
      var av = document.createElement("img");
      av.className = "botify__avatar";
      av.src = userLogo;
      av.alt = brandName;
      row.appendChild(av);
    } else {
      // keep spacing for alignment
      var spacer = document.createElement("div");
      spacer.style.width = "28px";
      spacer.style.height = "28px";
      row.appendChild(spacer);
    }

    var b = document.createElement("div");
    b.className = "botify__bubble " + (isMe ? "botify__bubble--me" : "botify__bubble--bot");
    b.innerHTML = textHtml;
    row.appendChild(b);

    var t = document.createElement("div");
    t.className = "botify__time";
    t.textContent = formatTime(ts || new Date());
    row.appendChild(t);

    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return b;
  }

  function typingNode(){
    var row = document.createElement("div");
    row.className = "botify__row";
    var spacer = document.createElement("div");
    spacer.className = "botify__avatar";
    spacer.style.visibility = "hidden";
    row.appendChild(spacer);

    var b = document.createElement("div");
    b.className = "botify__bubble botify__bubble--bot";
    b.innerHTML = '<div class="botify__typing"><div class="botify__dots"><span class="botify__dotpulse"></span><span class="botify__dotpulse"></span><span class="botify__dotpulse"></span></div><span>'+t("typing")+'</span></div>';
    row.appendChild(b);

    var tm = document.createElement("div");
    tm.className = "botify__time";
    tm.textContent = "";
    row.appendChild(tm);

    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return row;
  }

  function copyable(el){
    var cp = document.createElement("span");
    cp.className = "botify__copy";
    cp.textContent = "Copy";
    cp.addEventListener("click", function(){
      try{ navigator.clipboard.writeText(el.textContent || ""); cp.textContent = "Copied!"; setTimeout(function(){cp.textContent="Copy";},1400);}catch(e){}
    });
    el.parentElement && el.parentElement.appendChild(cp);
  }

  // suggestion chips
  ["What can you do?","How do I integrate the widget?","Show pricing plans","Contact support"].forEach(function(label){
    var c = document.createElement("button");
    c.className = "botify__chip";
    c.textContent = label;
    c.addEventListener("click", function(){ field.value = label; autogrow(); sendBtn.click(); });
    chipsEl.appendChild(c);
  });

  function openPanel(){
    wrap.style.display = "block";
    wrap.classList.add("botify--in");
    setTimeout(function(){ field.focus(); autogrow(); }, 30);
    setUnread(0); save("unread","0");
    save("minimized","0");
  }
  function closePanel(){
    wrap.style.display = "none";
    wrap.classList.remove("botify--in");
    save("minimized","1");
  }

  // history
  function loadHistory(){
    try{
      var raw = localStorage.getItem(storageKey);
      if(!raw) return [];
      var h = JSON.parse(raw);
      return Array.isArray(h)? h.slice(-50) : [];
    }catch(e){ return []; }
  }
  function saveHistory(list){
    try{ localStorage.setItem(storageKey, JSON.stringify(list.slice(-50))); }catch(e){}
  }
  var history = loadHistory();

  function renderHistory(){
    msgs.innerHTML = "";
    history.forEach(function(m){
      var html = linkify(m.text);
      var bubbleEl = appendRow(m.role, html, new Date(m.ts));
      if (m.role === "bot") copyable(bubbleEl);
    });
    if (history.length) msgs.scrollTop = msgs.scrollHeight;
  }

  /* ------------------ Events ------------------ */
  launchBtn.addEventListener("click", function(){ wrap.style.display==="none" ? openPanel() : closePanel(); });
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", function(e){ if(wrap.style.display!=="none" && e.key==="Escape"){ e.preventDefault(); closePanel(); }});

  field.addEventListener("input", autogrow);
  field.addEventListener("keydown", function(e){
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  langSelect.addEventListener("change", function(e){
    currentLang = e.target.value;
    field.placeholder = t("placeholder");
    save("lang", currentLang);
  });

  // theme
  var storedTheme = load("theme", "light");
  if (storedTheme === "dark") document.body.classList.add("botify--dark");
  themeBtn.textContent = storedTheme === "dark" ? "☀️" : "🌙";
  themeBtn.addEventListener("click", function(){
    var dark = document.body.classList.toggle("botify--dark");
    themeBtn.textContent = dark ? "☀️" : "🌙";
    save("theme", dark ? "dark" : "light");
  });

  // speech (optional)
  if(!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)){ micBtn.style.display="none"; }
  else {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recog = new SR(); recog.lang = "en-US"; recog.interimResults = false; recog.maxAlternatives = 1;
    micBtn.addEventListener("click", function(){ try{ recog.start(); }catch(e){} });
    recog.onresult = function(e){ field.value += (e.results[0][0].transcript || "") + " "; field.focus(); autogrow(); };
  }

  // scroll to bottom visibility
  msgs.addEventListener("scroll", function(){
    var nearBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 120;
    downBtn.style.display = nearBottom ? "none" : "grid";
  });
  downBtn.addEventListener("click", function(){ msgs.scrollTop = msgs.scrollHeight; });

  // drag (desktop)
  if (draggable && window.matchMedia("(pointer:fine)").matches) {
    var dragging=false, sx=0, sy=0, startLeft=0, startTop=0;
    function onDown(e){
      dragging=true; header.style.cursor="grabbing";
      var r=wrap.getBoundingClientRect(); startLeft=r.left; startTop=r.top; sx=e.clientX; sy=e.clientY;
      document.addEventListener("mousemove",onMove); document.addEventListener("mouseup",onUp);
    }
    function onMove(e){
      if(!dragging) return;
      var dx=e.clientX-sx, dy=e.clientY-sy;
      wrap.style.left=(startLeft+dx)+"px"; wrap.style.top=(startTop+dy)+"px";
      wrap.style.right="auto"; wrap.style.bottom="auto";
    }
    function onUp(){
      dragging=false; header.style.cursor="grab";
      // snap to viewport edges lightly
      var r=wrap.getBoundingClientRect();
      var vw=window.innerWidth, vh=window.innerHeight;
      var snap=16;
      if(r.left < snap){ wrap.style.left=snap+"px"; }
      if(vw - (r.left + r.width) < snap){ wrap.style.left = (vw - r.width - snap) + "px"; }
      if(r.top < snap){ wrap.style.top=snap+"px"; }
      if(vh - (r.top + r.height) < snap){ wrap.style.top = (vh - r.height - snap) + "px"; }
      document.removeEventListener("mousemove",onMove); document.removeEventListener("mouseup",onUp);
    }
    header.addEventListener("mousedown", onDown);
  }

  // bottom-sheet swipe on touch
  (function addSwipeToClose(){
    var startY=null, moved=false;
    header.addEventListener("touchstart", function(e){ startY = e.touches[0].clientY; moved=false; }, {passive:true});
    header.addEventListener("touchmove", function(e){
      if(startY==null) return;
      var dy = e.touches[0].clientY - startY;
      if(dy>10){
        moved=true;
        wrap.style.transform = "translateY(" + Math.min(dy, 140) + "px)";
        wrap.style.opacity = String(Math.max(0.35, 1 - dy/250));
      }
    }, {passive:true});
    header.addEventListener("touchend", function(){
      if(!moved){ startY=null; return; }
      var m = getComputedStyle(wrap).transform;
      var dy = 0;
      if (m && m !== "none") {
        var parts = m.replace("matrix(", "").replace(")", "").split(",");
        if (parts.length >= 6) dy = Math.abs(parseFloat(parts[5]) || 0);
      }
      if(dy>110) closePanel();
      wrap.style.transform = "translateY(0px)";
      wrap.style.opacity = "1";
      startY=null;
    }, {passive:true});
  })();

  /* ------------------ Messaging ------------------ */
  function pushHistory(role, text){
    history.push({ role: role, text: text, ts: Date.now() });
    saveHistory(history);
  }

  function send(question){
    if(!question) return;
    var safe = question.replace(/\r\n|\r/g,"\n");
    pushHistory("me", safe);
    var meHtml = linkify(safe);
    appendRow("me", meHtml, new Date());

    field.value = "";
    autogrow();

    var typing = typingNode();
    (function chat(){
      fetch(BASE_URL + "/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-user-id": userId },
        body: JSON.stringify({ question: safe, lang: currentLang, faqs: [] })
      }).then(function(res){
        if(res.status === 403){
          typing.remove(); setOnline(false);
          var msgHtml = "<strong>We’re currently unavailable</strong><br>The team reached its daily usage limit. Please try again later.";
          pushHistory("bot", msgHtml.replace(/<[^>]+>/g,""));
          var b = appendRow("bot", msgHtml, new Date());
          copyable(b);
          disable(true);
          return null;
        }
        setOnline(true);
        if(!res.body){ typing.remove(); var warn = "Streaming not supported by this browser."; pushHistory("bot", warn); appendRow("bot", warn, new Date()); return null; }
        var reader = res.body.getReader();
        var decoder = new TextDecoder("utf-8");
        typing.remove();
        var live = appendRow("bot", "", new Date());
        var acc = "";
        function pump(){
          return reader.read().then(function(result){
            if(result.done){
              var finalText = acc || "No response";
              live.innerHTML = linkify(finalText);
              copyable(live);
              pushHistory("bot", finalText);
              return;
            }
            var chunk = decoder.decode(result.value, {stream:true});
            acc += chunk;
            live.textContent = acc; // no HTML until finalized; avoids half tags
            msgs.scrollTop = msgs.scrollHeight;
            return pump();
          });
        }
        return pump();
      }).catch(function(){
        typing.remove(); setOnline(false);
        var err = "Unable to connect. Please try again later.";
        pushHistory("bot", err);
        appendRow("bot", err, new Date());
      });
    })();
  }

  sendBtn.addEventListener("click", function(){
    var q = (field.value || "").trim();
    if(!q) return;
    send(q);
  });

  function disable(off){
    field.disabled = !!off; sendBtn.disabled = !!off; micBtn.disabled = !!off;
    wrap.style.opacity = off ? ".70" : "1";
    field.placeholder = off ? "Support is currently unavailable." : t("placeholder");
  }

  // initial messages + availability check
  function ensureWarmWelcome(){
    if(history.length === 0){
      var welcome = t("welcome");
      var help = t("help");
      pushHistory("bot", welcome);
      appendRow("bot", linkify(welcome), new Date());
      setTimeout(function(){
        // only send second nudge if user still hasn’t spoken
        var spoke = history.some(function(m){ return m.role === "me"; });
        if(!spoke){ pushHistory("bot", help); appendRow("bot", linkify(help), new Date()); }
      }, 12000);
    } else {
      renderHistory();
    }
  }

  (function checkAvailability(){
    fetch(BASE_URL + "/api/usage-status", { headers: { "x-user-id": userId }})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d && d.blocked){ setOnline(false); disable(true); }
        else { setOnline(true); disable(false); }
      }).catch(function(){ /* ignore */ });
  })();

  setInterval(function(){
    fetch(BASE_URL + "/api/usage-status", { headers: { "x-user-id": userId }})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d && !d.blocked){ setOnline(true); disable(false); }
      }).catch(function(){});
  }, 300000);

  // restore minimized state
  var wasMin = load("minimized","0") === "1";
  if(!wasMin){ openPanel(); } // open by default on first load (optional)
  ensureWarmWelcome();

})();
