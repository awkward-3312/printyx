// Número de WhatsApp que figura en la guía de marca. Verifica que esté vigente antes de publicar.
export const WHATSAPP_NUMBER = '50498857431';
export const INSTAGRAM_URL = 'https://www.instagram.com/printyxhn/';
export const DELIVERY_TEXT = 'Envíos a todo Honduras';

// Clave PÚBLICA (site key) de Cloudflare Turnstile, NO la secret key.
export const TURNSTILE_SITE_KEY = '0x4AAAAAAFxoWtOYUVrMudLb';
if (typeof window !== 'undefined') window.PRINTYX_TURNSTILE = { siteKey: TURNSTILE_SITE_KEY };
