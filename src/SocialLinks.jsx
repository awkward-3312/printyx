import { Facebook, Instagram } from 'lucide-react';
import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL } from './config';

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.14v-3.5a6.34 6.34 0 0 0-5.68 10.8 6.34 6.34 0 0 0 10.89-4.54V8.69a8.28 8.28 0 0 0 4.84 1.55V6.82c-.28 0-.55-.05-.82-.13Z" />
    </svg>
  );
}

const socialLinks = [
  { name: 'Instagram', href: INSTAGRAM_URL, Icon: Instagram },
  { name: 'Facebook', href: FACEBOOK_URL, Icon: Facebook },
  { name: 'TikTok', href: TIKTOK_URL, Icon: TikTokIcon },
];

export function SocialLinks({ variant = 'contact' }) {
  return (
    <ul
      className={`social-links social-links--${variant}`}
      aria-label="Redes sociales de Printyx"
    >
      {socialLinks.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            className="social-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Printyx en ${name} (se abre en una nueva pestaña)`}
          >
            <Icon width={20} height={20} aria-hidden="true" focusable="false" />
            <span>{name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
