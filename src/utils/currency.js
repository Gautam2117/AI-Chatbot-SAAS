// src/utils/currency.js

/** Heuristic: IN users → INR, others → USD */
export function detectCurrency() {
  // Prefer server-provided hint (CF, Vercel, Nginx…)
  const hinted = sessionStorage.getItem("geo_country");
  if (hinted === "IN") return "INR";

  // Fallbacks: language/locale
  const lang = navigator.language || "";
  if (/-IN\b/i.test(lang)) return "INR";

  // last-resort: timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Kolkata")) return "INR";
  } catch (e) {
    // ignore
  }

  return "USD";
}

export function fmt(amt, cur) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: cur
  }).format(amt);
}
