// Número de WhatsApp que figura en la guía de marca. Verifica que esté vigente antes de publicar.
export const WHATSAPP_NUMBER = '50498857431';
export const INSTAGRAM_URL = 'https://www.instagram.com/printyxhn/';
export const FACEBOOK_URL =
  'https://www.facebook.com/profile.php?id=61595589443365';
export const TIKTOK_URL = 'https://www.tiktok.com/@printyxhn';
export const DELIVERY_TEXT = 'Envíos a todo Honduras';

// Clave PÚBLICA (site key) de Cloudflare Turnstile, NO la secret key.
export const TURNSTILE_SITE_KEY = '';
if (typeof window !== 'undefined')
  window.PRINTYX_TURNSTILE = { siteKey: TURNSTILE_SITE_KEY };
