(function () {
  /* ------------------ Config ------------------ */
  var scriptTag         = document.currentScript;
  var userId            = scriptTag.getAttribute("data-user-id") || "guest-user";
  var brandName         = scriptTag.getAttribute("data-brand") || "Botify";
  var primaryColor      = scriptTag.getAttribute("data-color") || "#7C3AED";
  var fontFamily        = scriptTag.getAttribute("data-font") || "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  var borderRadius      = scriptTag.getAttribute("data-border-radius") || "22px";
  var positionAttr      = (scriptTag.getAttribute("data-position") || "bottom-right").toLowerCase();
  var draggable         = (scriptTag.getAttribute("data-draggable") || "true") !== "false";
  var userLogo          = scriptTag.getAttribute("data-logo") || "https://ai-chatbot-saas-eight.vercel.app/chatbot_widget_logo.png";
  var showPoweredBy     = scriptTag.getAttribute("data-poweredby") !== "false";
  var openOnLoad        = (scriptTag.getAttribute("data-open-on-load") || "false") === "true";
  var BASE_URL          = scriptTag.getAttribute("data-api") || "https://ai-chatbot-backend-h669.onrender.com";
  var hideMic           = (scriptTag.getAttribute("data-hide-mic") || "false") === "true";

  /* NEW: suggestions & FAQ config */
  var suggestionsMode   = (scriptTag.getAttribute("data-suggestions") || "auto").toLowerCase(); // auto | off | custom
  var customSuggestions = (scriptTag.getAttribute("data-suggestions-list") || "").split("|").map(function(s){return s.trim();}).filter(Boolean);
  var faqsUrl           = scriptTag.getAttribute("data-faqs-url") || ""; // if provided, we fetch FAQs for chips & pass to backend
  var customWelcome     = scriptTag.getAttribute("data-welcome") || "";

  // replace placeholder USER_ID if present
  var resolvedFaqsUrl   = faqsUrl ? faqsUrl.replace(/USER_ID/g, encodeURIComponent(userId)) : "";

  var storageKey = "botify:v3:" + userId;
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isLeft = positionAttr.indexOf("left") !== -1;
  var posStyle = "bottom:24px;" + (isLeft ? "left" : "right") + ":24px;";

  /* ------------------ i18n ------------------ */
  var currentLang = (function(){ try{return localStorage.getItem("botify:lang")||"en";}catch(e){return "en";} })();
  var translations = {
    en: { welcome:(customWelcome || ("Hello! How can I help you today?")), send:"Send", typing: brandName + " is typing…", mic:"🎤", placeholder:"Type a message…", online:"Online", offline:"Unavailable", help:"" },
    hi: { welcome:(customWelcome || "नमस्ते! मैं आपकी किस तरह मदद कर सकता/सकती हूँ?"), send:"भेजें", typing: brandName + " लिख रहा है…", mic:"🎤", placeholder:"संदेश लिखें…", online:"ऑनलाइन", offline:"उपलब्ध नहीं", help:"" },
    es: { welcome:(customWelcome || "¡Hola! ¿En qué puedo ayudarte hoy?"), send:"Enviar", typing: brandName + " está escribiendo…", mic:"🎤", placeholder:"Escribe un mensaje…", online:"En línea", offline:"No disponible", help:"" },
    fr: { welcome:(customWelcome || "Bonjour ! Comment puis-je vous aider aujourd’hui ?"), send:"Envoyer", typing: brandName + " est en train d’écrire…", mic:"🎤", placeholder:"Écrivez un message…", online:"En ligne", offline:"Indisponible", help:"" }
  };
  function t(k){ return (translations[currentLang] && translations[currentLang][k]) || translations.en[k] || k; }

  /* ------------------ Styles ------------------ */
  var style = document.createElement("style");
  style.textContent =
  ":root{--botify-primary:"+primaryColor+";--botify-font:"+fontFamily+";--botify-radius:"+borderRadius+";}" +
  ".botify__wrap,.botify__wrap *{box-sizing:border-box}" +
  /* Launcher */
  ".botify__launcher{position:fixed;"+posStyle+"width:68px;height:68px;border:0;background:transparent;cursor:pointer;z-index:999999;transition:transform .18s ease}" +
  ".botify__launcher[aria-expanded='true']{display:none}" +
  ".botify__launcher:active{transform:scale(.98)}" +
  ".botify__badge{position:absolute;top:-4px;"+(isLeft?"left":"right")+":-4px;min-width:20px;height:20px;padding:0 6px;font:700 11px/20px var(--botify-font);color:#fff;text-align:center;background:#EF4444;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.25);display:none}" +
  ".botify__launcher-img{width:100%;height:100%;border-radius:50%;object-fit:cover;aspect-ratio:1/1;box-shadow:0 14px 30px rgba(0,0,0,.28)}" +
  (prefersReduced ? "" : ".botify__launcher::after{content:\"\";position:absolute;inset:-2px;border-radius:999px;box-shadow:0 0 0 0 rgba(124,58,237,.35);animation:botifyPulse 2.2s infinite;z-index:-1}") +
  "@keyframes botifyPulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.35)}70%{box-shadow:0 0 0 22px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}" +
  /* Panel */
  ".botify__wrap{position:fixed;"+posStyle+"z-index:999998;display:none;width:420px;max-width:calc(100vw - 18px);max-height:min(76vh,720px);overflow:hidden;border-radius:var(--botify-radius);background:transparent;font-family:var(--botify-font);transform:translateY(14px);opacity:0}" +
  (prefersReduced ? "" : ".botify__wrap.botify--in{animation:botifyIn .28s ease forwards}") +
  "@keyframes botifyIn{to{transform:translateY(0);opacity:1}}" +
  "@media (max-width:480px){.botify__wrap{width:calc(100vw - 18px);height:calc(100vh - 18px);max-height:none;"+(isLeft?"left:9px":"right:9px")+";bottom:9px;border-radius:18px}}" +
  ".botify__shell{height:100%;padding:1.6px;border-radius:inherit;background:linear-gradient(135deg,rgba(244,114,182,.65),rgba(99,102,241,.65));box-shadow:0 34px 70px rgba(0,0,0,.28)}" +
  ".botify__panel{height:100%;display:flex;flex-direction:column;border-radius:inherit;background:rgba(255,255,255,.85);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.6)}" +
  /* Header */
  ".botify__header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px 12px 14px;color:#fff;border-top-left-radius:inherit;border-top-right-radius:inherit;background:linear-gradient(90deg,var(--botify-primary),#EC4899,#06B6D4)}" +
  ".botify__brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1}" +
  ".botify__logo{width:40px;height:40px;border-radius:50%;object-fit:cover;aspect-ratio:1/1;box-shadow:0 2px 8px rgba(0,0,0,.25)}" +
  ".botify__title{font-weight:800;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
  ".botify__status{font-size:11px;opacity:.95;display:flex;align-items:center;gap:6px}" +
  ".botify__dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.25)}" +
  ".botify__ctrls{display:flex;align-items:center;gap:8px}" +
  ".botify__select{appearance:none;border:0;border-radius:10px;padding:6px 10px;background:#ffffff;color:#1f2937;font-size:12px;cursor:pointer;transition:background .2s ease}" +
  ".botify__select:hover{background:#f3f4f6}" +
  ".botify__btn{border:0;border-radius:10px;padding:6px 10px;background:rgba(255,255,255,.22);color:#fff;font-size:12px;cursor:pointer;transition:background .2s ease}" +
  ".botify__btn:hover{background:rgba(255,255,255,.34)}" +
  /* Messages */
  ".botify__messages{position:relative;background:linear-gradient(180deg,#F8FAFC,#EEF2FF);padding:12px;display:flex;flex-direction:column;gap:10px;overflow:auto;flex:1;min-height:0;scroll-behavior:smooth}" +
  ".botify__fade-top{pointer-events:none;position:sticky;top:0;height:12px;background:linear-gradient(#ffffff00,#ffffff00)}" +
  ".botify__fade-bot{pointer-events:none;position:sticky;bottom:0;height:24px;background:linear-gradient(to top,rgba(255,255,255,.85),rgba(255,255,255,0))}" +
  ".botify__row{display:flex;gap:8px;align-items:flex-end}" +
  ".botify__avatar{width:28px;height:28px;border-radius:50%;flex:0 0 auto;object-fit:cover;aspect-ratio:1/1;box-shadow:0 2px 8px rgba(0,0,0,.12)}" +
  ".botify__bubble{max-width:78%;padding:12px 14px;border-radius:18px;line-height:1.45;box-shadow:0 2px 10px rgba(2,6,23,.08);word-wrap:break-word;white-space:pre-wrap}" +
  ".botify__bubble--bot{background:#fff;border-top-left-radius:8px;border:1px solid rgba(15,23,42,.06)}" +
  ".botify__bubble--me{margin-left:auto;background:#E0EAFF;border-top-right-radius:8px;border:1px solid rgba(99,102,241,.25)}" +
  ".botify__time{font-size:10px;color:#6b7280;margin-top:4px}" +
  /* Chips */
  ".botify__chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 12px 10px}" +
  ".botify__chip{background:#fff;border:1px solid rgba(99,102,241,.22);color:#4f46e5;padding:6px 10px;border-radius:999px;font-size:12px;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}" +
  ".botify__chip:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(79,70,229,.18)}" +
  /* Input */
  ".botify__input{position:relative;display:flex;align-items:center;gap:8px;padding:10px;border-top:1px solid rgba(99,102,241,.18);background:rgba(255,255,255,.72);padding-bottom:calc(10px + env(safe-area-inset-bottom))}" +
  ".botify__ta{flex:1;border:0;background:transparent;padding:12px;outline:none;font-size:14px;resize:none;max-height:132px;min-height:44px}" +
  ".botify__send,.botify__mic{border:0;cursor:pointer;border-radius:999px;width:42px;height:42px;display:grid;place-items:center;transition:transform .1s ease,box-shadow .2s ease,background .2s ease}" +
  ".botify__send{background:var(--botify-primary);color:#fff;box-shadow:0 10px 22px rgba(79,70,229,.35)}" +
  ".botify__send:hover{transform:translateY(-1px)}" +
  ".botify__send:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}" +
  ".botify__mic{background:#EEF2FF;color:var(--botify-primary)}" +
  ".botify__mic:hover{background:#E0EAFF}" +
  ".botify__footer{font-size:10px;color:#64748b;text-align:center;padding:6px 0 10px}" +
  ".botify__footer a{color:var(--botify-primary);font-weight:700;text-decoration:none}" +
  /* Typing */
  ".botify__typing{display:flex;align-items:center;gap:8px;color:#334155}" +
  ".botify__dots{display:flex;gap:4px}" +
  ".botify__dotpulse{width:8px;height:8px;background:var(--botify-primary);border-radius:50%;animation:dot 1.1s infinite ease-in-out;opacity:.7}" +
  ".botify__dotpulse:nth-child(2){animation-delay:.12s}.botify__dotpulse:nth-child(3){animation-delay:.24s}" +
  "@keyframes dot{0%,80%,100%{transform:scale(.75);opacity:.35}40%{transform:scale(1.12);opacity:1}}" +
  /* Scroll to bottom (kept above input) */
  ".botify__scrolldn{position:absolute;right:14px;bottom:calc(96px + env(safe-area-inset-bottom));background:#fff;border:1px solid rgba(2,6,23,.08);border-radius:999px;box-shadow:0 8px 18px rgba(0,0,0,.15);height:34px;width:34px;display:none;place-items:center;color:#334155}" +
  /* Dark */
  ".botify--dark .botify__panel{background:rgba(17,24,39,.90);color:#e5e7eb;border-color:rgba(255,255,255,.12)}" +
  ".botify--dark .botify__messages{background:linear-gradient(180deg,#0f172a,#111827)}" +
  ".botify--dark .botify__bubble--bot{background:#0B1020;color:#e5e7eb;border-color:#1f2937}" +
  ".botify--dark .botify__bubble--me{background:#1E293B;color:#e5e7eb;border-color:#334155}" +
  ".botify--dark .botify__input{background:rgba(17,24,39,.82);border-top-color:#1f2937}" +
  ".botify--dark .botify__mic{background:#0B1020;color:#c7d2fe}" +
  ".botify--dark .botify__scrolldn{background:#0B1020;border-color:#1f2937;color:#cbd5e1}";
  document.head.appendChild(style);

  /* ------------------ DOM ------------------ */
  // prevent duplicate mounts
  try { document.querySelectorAll(".botify__launcher, .botify__wrap").forEach(function(n){ n.remove(); }); } catch(e){}

  var launchBtn = document.createElement("button");
  launchBtn.className = "botify__launcher";
  launchBtn.setAttribute("aria-label","Open chat");
  launchBtn.setAttribute("aria-expanded","false");
  launchBtn.innerHTML = '<span class="botify__badge" id="botifyBadge"></span><img class="botify__launcher-img" src="'+userLogo+'" alt="'+brandName+' Chat" />';
  document.body.appendChild(launchBtn);

  var wrap = document.createElement("div");
  wrap.className = "botify__wrap";
  wrap.id = "botify-dialog";
  wrap.setAttribute("role","dialog");
  wrap.setAttribute("aria-label", brandName+" Chat");
  wrap.setAttribute("aria-live","polite");
  wrap.setAttribute("tabindex","-1");
  wrap.style.display = "none";
  wrap.innerHTML =
    '<div class="botify__shell">'+
      '<div class="botify__panel">'+
        '<div class="botify__header" id="botifyHeader">'+
          '<div class="botify__brand" title="'+brandName+'">'+
            '<img class="botify__logo" src="'+userLogo+'" alt="'+brandName+'"/>'+
            '<div style="min-width:0">'+
              '<div class="botify__title">'+brandName+' Assistant</div>'+
              '<div class="botify__status"><span class="botify__dot" id="botifyStatusDot"></span><span id="botifyStatusText">Online</span></div>'+
            '</div>'+
          '</div>'+
          '<div class="botify__ctrls">'+
            '<select class="botify__select" id="botifyLang">'+["en","hi","es","fr"].map(function(l){ return '<option value="'+l+'" '+(l===currentLang?'selected':'')+'>'+l.toUpperCase()+'</option>';}).join("")+'</select>'+
            '<button class="botify__btn" id="botifyTheme" title="Toggle theme">🌙</button>'+
            '<button class="botify__btn" id="botifyClose" title="Close">✕</button>'+
          '</div>'+
        '</div>'+
        '<div class="botify__messages" id="botifyMsgs">'+
          '<div class="botify__fade-top"></div>'+
          '<div class="botify__fade-bot"></div>'+
        '</div>'+
        '<button class="botify__scrolldn" id="botifyDown" aria-label="Scroll to latest">↓</button>'+
        '<div class="botify__chips" id="botifyChips"></div>'+
        '<div class="botify__input">'+
          '<button class="botify__mic" id="botifyMic" title="Voice">🎤</button>'+
          '<textarea class="botify__ta" id="botifyField" rows="1" placeholder="'+t("placeholder")+'" aria-label="Message input"></textarea>'+
          '<button class="botify__send" id="botifySend" title="'+t("send")+'">➤</button>'+
        '</div>'+
        (showPoweredBy ? '<div class="botify__footer">Powered by <a target="_blank" rel="noopener" href="https://botify-website.vercel.app/">Botify</a></div>' : "")+
      '</div>'+
    '</div>';
  document.body.appendChild(wrap);

  launchBtn.setAttribute("aria-controls","botify-dialog");

  /* ------------------ Utils & State ------------------ */
  function $(sel){ return wrap.querySelector(sel); }
  var msgs = $("#botifyMsgs");
  var field = $("#botifyField");
  var sendBtn = $("#botifySend");
  var micBtn = $("#botifyMic");
  var closeBtn = $("#botifyClose");
  var themeBtn = $("#botifyTheme");
  var langSelect = $("#botifyLang");
  var header = $("#botifyHeader");
  var badge  = document.getElementById("botifyBadge");
  var statusDot = $("#botifyStatusDot");
  var statusText = $("#botifyStatusText");
  var chipsEl = $("#botifyChips");
  var downBtn = $("#botifyDown");

  // image fallback + perfect circle
  function applyImgFallback(img){
    try{
      img.addEventListener("error", function(){ img.src = "https://ai-chatbot-saas-eight.vercel.app/chatbot_widget_logo.png"; });
      img.style.borderRadius = "50%";
      img.style.objectFit = "cover";
      img.style.aspectRatio = "1 / 1";
    }catch(e){}
  }
  applyImgFallback(launchBtn.querySelector(".botify__launcher-img"));
  applyImgFallback(wrap.querySelector(".botify__logo"));

  function save(k,v){ try{ localStorage.setItem("botify:"+k, String(v)); }catch(e){} }
  function load(k,d){ try{ var v=localStorage.getItem("botify:"+k); return v===null?d:v; }catch(e){ return d; } }

  function formatTime(d){ var h=d.getHours(), m=d.getMinutes(); var ap = h>=12?"PM":"AM"; h = h%12 || 12; return h+":"+(m<10?"0"+m:m)+" "+ap; }
  function setOnline(online){ statusDot.style.background = online ? "#22c55e" : "#ef4444"; statusText.textContent = online ? t("online") : t("offline"); }
  function setUnread(n){ if(!badge) return; if(n>0){badge.style.display="inline-block";badge.textContent=String(n);} else badge.style.display="none"; }
  function bumpUnread(){ var n = Number(load("unread","0")) + 1; save("unread", String(n)); setUnread(n); }
  function autogrow() {
    const MIN = 44;   // matches your CSS min-height
    const MAX = 132;
    field.style.height = "auto";
    const h = Math.max(field.scrollHeight || 0, MIN);
    field.style.height = Math.min(h, MAX) + "px";
  }
  function updateSendState(){ sendBtn.disabled = !(field.value.trim()); }

  var unread = Number(load("unread","0")); setUnread(unread);

  // security: escape + linkify
  function escapeHTML(s){
    return String(s||"").replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
  }
  function linkifySafe(text){
    var safe = escapeHTML(String(text || ""));
    return safe.replace(/(https?:\/\/[^\s]+)/g, function(u){
      var url = u.replace(/["<>]/g, "");
      return '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+url+'</a>';
    });
  }

  function linkify(text){ // kept for me-bubbles; they are plain text anyway
    return String(text||"").replace(/(https?:\/\/[^\s]+)/g, function(u){ return '<a href="'+u+'" target="_blank" rel="noopener">'+u+'</a>'; });
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
      var spacer = document.createElement("div");
      spacer.style.width = "28px";
      spacer.style.height = "28px";
      row.appendChild(spacer);
    }

    var b = document.createElement("div");
    b.className = "botify__bubble " + (isMe ? "botify__bubble--me" : "botify__bubble--bot");
    b.innerHTML = textHtml;
    row.appendChild(b);

    var tEl = document.createElement("div");
    tEl.className = "botify__time";
    tEl.textContent = formatTime(ts || new Date());
    row.appendChild(tEl);

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
    cp.style.marginLeft = "8px";
    cp.style.fontSize = "11px";
    cp.style.color = "#94a3b8";
    cp.style.cursor = "pointer";
    cp.textContent = "Copy";
    cp.addEventListener("click", function(){
      try{ navigator.clipboard.writeText(el.textContent || ""); cp.textContent = "Copied!"; setTimeout(function(){cp.textContent="Copy";},1400);}catch(e){}
    });
    el.parentElement && el.parentElement.appendChild(cp);
  }

  /* --------- Suggestions / FAQs (dynamic) ---------- */
  var faqsPayload = [];         // full JSON of FAQs (if fetched)
  var suggestions = [];         // strings for chips

  function normalizeFaqQuestions(json){
    if(!json) return [];
    try{
      if(Array.isArray(json)){
        return json.map(function(x){
          if (typeof x === "string") return x;
          if (x && typeof x === "object"){
            return x.question || x.q || x.title || "";
          }
          return "";
        }).filter(Boolean);
      }
      return [];
    }catch(e){ return []; }
  }

  function makeHelpFromSuggestions(arr){
    if(!arr || !arr.length) return "";
    var top = arr.slice(0,3).join(" • ");
    return "Try: " + top;
  }

  function addChips(arr){
    chipsEl.innerHTML = "";
    (arr || []).slice(0,6).forEach(function(label){
      var c = document.createElement("button");
      c.className = "botify__chip";
      c.type = "button";
      c.textContent = label;
      c.addEventListener("click", function(){
        field.value = label;
        autogrow();
        updateSendState();
        sendBtn.click();
        field.focus();      // keep input visible/ready
      });
      c.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); c.click(); }});
      chipsEl.appendChild(c);
    });
  }

  function openPanel(){
    launchBtn.setAttribute("aria-expanded","true");
    launchBtn.style.display = "none";
    wrap.style.display = "block";
    wrap.classList.add("botify--in");
    setTimeout(function(){ wrap.focus(); field.focus(); autogrow(); msgs.scrollTop = msgs.scrollHeight; }, 50);
    setUnread(0); save("unread","0");
    save("minimized","0");
  }
  function closePanel(){
    wrap.style.display = "none";
    wrap.classList.remove("botify--in");
    launchBtn.style.display = "inline-block";
    launchBtn.setAttribute("aria-expanded","false");
    save("minimized","1");
    // abort any in-flight stream
    if (currentChatController) try{ currentChatController.abort(); }catch(e){}
  }

  // history
  function loadHistory(){
    try{
      var raw = localStorage.getItem(storageKey);
      if(!raw) return [];
      var h = JSON.parse(raw);
      return Array.isArray(h)? h.slice(-80) : [];
    }catch(e){ return []; }
  }
  function saveHistory(list){
    try{ localStorage.setItem(storageKey, JSON.stringify(list.slice(-80))); }catch(e){}
  }
  var history = loadHistory();

  function renderHistory(){
    msgs.innerHTML = '<div class="botify__fade-top"></div><div class="botify__fade-bot"></div>';
    history.forEach(function(m){
      var html = m.role === "bot" ? linkifySafe(m.text) : linkify(m.text);
      var bubbleEl = appendRow(m.role, html, new Date(m.ts));
      if (m.role === "bot") copyable(bubbleEl);
    });
    if (history.length) msgs.scrollTop = msgs.scrollHeight;
  }

  /* ------------------ Events ------------------ */
  launchBtn.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", function(e){ if(wrap.style.display!=="none" && e.key==="Escape"){ e.preventDefault(); closePanel(); }});

  field.addEventListener("input", function(){ autogrow(); updateSendState(); });
  field.addEventListener("keydown", function(e){
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendBtn.click();
    }
  });

  // focus trap
  wrap.addEventListener("keydown", function(e){
    if (wrap.style.display === "none" || e.key !== "Tab") return;
    var focusables = wrap.querySelectorAll('button, [href], select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });

  langSelect.addEventListener("change", function(e){
    currentLang = e.target.value;
    field.placeholder = t("placeholder");
    save("lang", currentLang);
    if (recog) { recog.lang = langMap[currentLang] || "en-US"; }
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

  // speech (optional, locale-aware)
  var recog = null;
  var langMap = { en:"en-US", hi:"hi-IN", es:"es-ES", fr:"fr-FR" };
  if(hideMic){ micBtn.style.display = "none"; }
  else if(!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)){ micBtn.style.display="none"; }
  else {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recog = new SR(); 
    recog.lang = langMap[currentLang] || "en-US"; 
    recog.interimResults = false; 
    recog.maxAlternatives = 1;
    micBtn.addEventListener("click", function(){ try{ recog.start(); }catch(e){} });
    recog.onresult = function(e){ field.value += (e.results[0][0].transcript || "") + " "; field.focus(); autogrow(); updateSendState(); };
  }

  // scroll-to-bottom visibility
  function updateDownBtn(){
    var nearBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 120;
    downBtn.style.display = nearBottom ? "none" : "grid";
  }
  msgs.addEventListener("scroll", updateDownBtn);
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
      dragging=false; header.style.cursor="";
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

  window.addEventListener("resize", function(){ msgs.scrollTop = msgs.scrollHeight; });

  /* ------------------ Networking helpers ------------------ */
  function fetchWithTimeout(url, opts, ms){
    var ctl = new AbortController();
    var t = setTimeout(function(){ try{ ctl.abort(); }catch(e){} }, ms||8000);
    return fetch(url, Object.assign({}, opts || {}, { signal: ctl.signal }))
      .finally(function(){ clearTimeout(t); });
  }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

  /* ------------------ Messaging ------------------ */
  var currentChatController = null;

  function pushHistory(role, text){
    history.push({ role: role, text: text, ts: Date.now() });
    saveHistory(history);
  }

  function disable(off){
    field.disabled = !!off; sendBtn.disabled = !!off || !(field.value.trim()); micBtn.disabled = !!off;
    field.placeholder = off ? "Support is currently unavailable." : t("placeholder");
  }

  function send(question){
    if(!question) return;
    var safe = question.replace(/\r\n|\r/g,"\n");
    pushHistory("me", safe);
    var meHtml = linkify(safe);
    appendRow("me", meHtml, new Date());

    field.value = "";
    autogrow();
    updateSendState();

    // abort any prior in-flight request
    if (currentChatController) { try{ currentChatController.abort(); }catch(e){} }
    currentChatController = new AbortController();

    var typing = typingNode();
    (function chat(){
      var body = { question: safe, lang: currentLang, faqs: faqsPayload || [] };
      fetch(BASE_URL + "/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-user-id": userId },
        body: JSON.stringify(body),
        signal: currentChatController.signal
      }).then(function(res){
        if(res.status === 403){
          typing.remove(); setOnline(false);
          var msgHtml = "<strong>We’re currently unavailable</strong><br>The team reached its daily usage limit. Please try again later.";
          pushHistory("bot", msgHtml.replace(/<[^>]+>/g,""));
          var b = appendRow("bot", msgHtml, new Date());
          copyable(b);
          disable(true);
          currentChatController = null;
          return null;
        }
        setOnline(true);
        if(!res.body){ typing.remove(); var warn = "Streaming not supported by this browser."; pushHistory("bot", warn); appendRow("bot", warn, new Date()); currentChatController = null; return null; }
        var reader = res.body.getReader();
        var decoder = new TextDecoder("utf-8");
        typing.remove();
        var live = appendRow("bot", "", new Date());
        var acc = "";
        function pump(){
          return reader.read().then(function(result){
            if(result.done){
              var finalText = acc || "No response";
              live.innerHTML = linkifySafe(finalText);
              copyable(live);
              pushHistory("bot", finalText);
              updateDownBtn();
              if (wrap.style.display === "none") bumpUnread();
              currentChatController = null;
              return;
            }
            var chunk = decoder.decode(result.value, {stream:true});
            acc += chunk;
            // safe during stream: render as textContent to avoid partial tags
            live.textContent = acc;
            msgs.scrollTop = msgs.scrollHeight;
            updateDownBtn();
            return pump();
          });
        }
        return pump();
      }).catch(function(){
        typing.remove(); setOnline(false);
        var err = "Unable to connect. Please try again later.";
        pushHistory("bot", err);
        appendRow("bot", err, new Date());
        updateDownBtn();
        currentChatController = null;
      });
    })();
  }

  sendBtn.addEventListener("click", function(){
    var q = (field.value || "").trim();
    if(!q) return;
    send(q);
  });

  /* ------------------ Boot ------------------ */
  function ensureWarmWelcome(helpText){
    if(history.length === 0){
      var welcome = t("welcome");
      pushHistory("bot", welcome);
      appendRow("bot", linkifySafe(welcome), new Date());
      if(helpText){
        setTimeout(function(){
          var spoke = history.some(function(m){ return m.role === "me"; });
          if(!spoke){ pushHistory("bot", helpText); appendRow("bot", linkifySafe(helpText), new Date()); }
        }, 900);
      }
    } else {
      renderHistory();
    }
    updateDownBtn();
  }

  function checkAvailability(){
    return fetch(BASE_URL + "/api/usage-status", { headers: { "x-user-id": userId }})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d && d.blocked){ setOnline(false); disable(true); }
        else { setOnline(true); disable(false); }
      }).catch(function(){ /* ignore */ });
  }

  async function fetchFaqsIfNeeded(){
    if(!resolvedFaqsUrl) return {suggestions:[], payload:[]};
    for (var i=0;i<2;i++){
      try{
        var r = await fetchWithTimeout(resolvedFaqsUrl, { headers: { "x-user-id": userId } }, 8000);
        if (r.status === 304) { return { suggestions:[], payload: faqsPayload }; }
        var json = await r.json();
        var qs = normalizeFaqQuestions(json);
        return { suggestions: qs.slice(0,6), payload: Array.isArray(json)? json : [] };
      }catch(e){ if(i===0) await sleep(400); }
    }
    return {suggestions:[], payload:[]};
  }

  // periodic availability refresh
  setInterval(function(){ checkAvailability(); }, 300000);

  // start
  var wasMin = load("minimized","1") === "1";
  Promise.all([ checkAvailability(), fetchFaqsIfNeeded() ]).then(function(results){
    var faqRes = results[1] || {suggestions:[], payload:[]};
    faqsPayload = faqRes.payload;

    if (suggestionsMode === "off") {
      suggestions = [];
    } else if (suggestionsMode === "custom" && customSuggestions.length) {
      suggestions = customSuggestions.slice(0,6);
    } else {
      suggestions = faqRes.suggestions || [];
    }

    addChips(suggestions);
    var helpText = makeHelpFromSuggestions(suggestions);
    ensureWarmWelcome(helpText);

    if(openOnLoad || !wasMin){ openPanel(); }

    // init send button state, hide mic if configured
    updateSendState();
    if (hideMic) micBtn.style.display = "none";
  });

})();