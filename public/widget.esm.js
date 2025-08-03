// Minimal ES module that mounts the same widget programmatically
export function createBotifyWidget(opts = {}) {
  const s = document.createElement("script");
  s.src = opts.src || "/chatbot.js";
  s.defer = true;
  // map options as data-* so the main widget reads them
  const map = {
    "data-user-id": opts.userId,
    "data-brand": opts.brand,
    "data-color": opts.color,
    "data-position": opts.position,
    "data-font": opts.font,
    "data-border-radius": opts.radius,
    "data-poweredby": String(opts.poweredBy ?? true),
    "data-logo": opts.logo,
    "data-draggable": String(opts.draggable ?? true),
  };
  Object.entries(map).forEach(([k, v]) => { if (v != null) s.setAttribute(k, v); });
  document.body.appendChild(s);
  return s;
}
