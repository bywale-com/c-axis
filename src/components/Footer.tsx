import "./Footer.css";
import { CONTACT_MAILTO_HREF } from "../constants/contact";
import { FooterLogo } from "./Logo";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "About.", href: "/about" },
  { label: "Portfolio.", href: "/portfolio" },
  { label: "Team.", href: "/team" },
  { label: "News.", href: "/news" },
  { label: "LP Portal.", href: "/portal" },
];

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Social targets — update Instagram when a public profile exists */
const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/healthquest-capital/", Icon: LinkedInIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: InstagramIcon,
  },
] as const;

export function Footer() {
  return (
    <footer className="hq-site-footer">
      <div className="hq-footer-shell">
        <div className="hq-footer-cta-grid">
          <div>
            <div className="hq-footer-cta-logo">
              <FooterLogo />
            </div>
            <h2>The practices that grow on architecture, not ads, win.</h2>
            <p>
              We work with legal, immigration, and financial practices that are ready to stop depending on
              referrals and start building systems that compound. If that is you, start with a conversation.
            </p>
          </div>
          <div className="hq-footer-cta-action">
            <a className="hq-footer-cta-btn" href={CONTACT_MAILTO_HREF}>
              <span className="hq-footer-cta-btn__text">Get in touch</span>
              <span className="hq-footer-cta-btn__icon" aria-hidden>
                ↗
              </span>
            </a>
          </div>
        </div>

        <hr />

        <div className="hq-footer-links-grid">
          <div>
            <p className="hq-footer-label">About Apex</p>
            <p className="hq-footer-copy">
              Growth consulting for legal, immigration, and financial practices. We build the offers,
              pipelines, and systems that compound your existing clients into new revenue.
            </p>
            <p className="hq-footer-label">Email</p>
            <a className="hq-footer-link" href={CONTACT_MAILTO_HREF}>
              wale@apexintro.com
            </a>
            <p className="hq-footer-label" style={{ marginTop: "1.25rem" }}>
              Connect
            </p>
            <div className="hq-footer-connect-icons">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a key={label} href={href} className="hq-social-btn" aria-label={label} target="_blank" rel="noreferrer">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="hq-footer-label">Navigation</p>
            {NAV_ITEMS.map((item) => (
              <a key={item.label} className="hq-footer-link" href={item.href}>
                {item.label.replace(/\.$/, "")}
              </a>
            ))}
          </div>

          <div>
            <p className="hq-footer-label">Company</p>
            <a className="hq-footer-link" href="/about">
              About
            </a>
            <a className="hq-footer-link" href="/team">
              Team
            </a>
            <a className="hq-footer-link" href="/news">
              News
            </a>
            <a className="hq-footer-link" href={CONTACT_MAILTO_HREF}>
              Contact
            </a>
          </div>

          <div>
            <p className="hq-footer-label">Legal</p>
            <a className="hq-footer-link" href="/privacy">
              Privacy Policy
            </a>
            <a className="hq-footer-link" href="/terms">
              Terms of Use
            </a>
            <a className="hq-footer-link" href="/portal">
              LP Portal
            </a>
          </div>
        </div>

        <div className="hq-footer-bottom">
          <span>© {new Date().getFullYear()} Apex Consulting. All rights reserved.</span>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
