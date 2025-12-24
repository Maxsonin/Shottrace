import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const SOCIAL_LINKS = [
  { name: 'Instagram', href: '#', icon: faInstagram, color: '#E1306C' },
  { name: 'X', href: '#', icon: faXTwitter, color: '#000000' },
  { name: 'Facebook', href: '#', icon: faFacebook, color: '#1877F2' },
  { name: 'YouTube', href: '#', icon: faYoutube, color: '#FF0000' },
];

const FOOTER_LINKS = [
  { name: 'About', href: '#' },
  { name: 'News', href: '#' },
  { name: 'Apps', href: '#' },
  { name: 'Help', href: '#' },
  { name: 'Terms', href: '#' },
  { name: 'API', href: '#' },
  { name: 'Contact', href: '#' },
];

export default function Footer() {
  return (
    <footer className="py-6 px-6 ">
      <div className="flex justify-between flex-col sm:items-center sm:flex-row gap-6 max-w-7xl mx-auto">
        <div className="text-center sm:text-left">
          <nav className="mb-2">
            <ul className="flex flex-wrap justify-center sm:justify-start gap-4">
              {FOOTER_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link href={href}>{name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <p>© Shottrace. Project made by Maxim Lesko. Film data from TMDB.</p>
        </div>

        <nav>
          <ul className="flex flex-wrap justify-center gap-4">
            {SOCIAL_LINKS.map(({ name, href, icon, color }) => (
              <li key={name}>
                <Link href={href}>
                  <FontAwesomeIcon icon={icon} size="xl" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
