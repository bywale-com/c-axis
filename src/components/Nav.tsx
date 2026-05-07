import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT_MAILTO_HREF } from "../constants/contact";
import { HeaderLogo } from "./Logo";

const HEADER_SCROLL_HIDE_AFTER_PX = 100;

/** Primary nav links (`mailto` entries render as `<a>`) */
const NAV_LINKS = [
  { label: "Home", href: "/", router: true },
  { label: "Team", href: "/team", router: true },
  { label: "Our Approach", href: "/approach", router: true },
  { label: "About Us", href: "/about", router: true },
  { label: "Contact Us", href: CONTACT_MAILTO_HREF, router: false },
] as const;

const APEX_BRAND_STYLE: React.CSSProperties = {
  fontFamily: "'Instrument Sans',sans-serif",
  fontSize: "1.1rem",
  fontWeight: 500,
  letterSpacing: "0.04em",
  color: "inherit",
  textDecoration: "none",
};

/**
 * Apex `c-site-header` bar (Apex Consulting + blur “Menu” button) +
 * full-screen HealthQuest menu panel from the previous standalone home.
 */
export const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (open) setHidden(false);
      else if (y > lastY.current && y > HEADER_SCROLL_HIDE_AFTER_PX) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <style>{NAV_STYLES}</style>

      <header
        ref={headerRef}
        className="c-site-header hq-nav-apex"
        data-component="site-menu"
        style={{
          // Use `top` instead of `transform` so global CSS can't override the hide/show behavior.
          top: hidden && !open ? "-120px" : "0px",
        }}
      >
        <div className="c-site-header__container o-container">
          <div className="c-site-header__brand">
            <Link
              to="/"
              aria-label="Home"
              style={APEX_BRAND_STYLE}
              className="hq-nav-apexBrandLogo"
            >
              <HeaderLogo />
            </Link>
          </div>

          <div className="c-site-header__nav">
            <button
              type="button"
              className="o-button o-button--blur c-site-header__menu-toggle"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              data-ref="site-menu.toggle"
              onClick={() => setOpen((v) => !v)}
            >
              Menu{" "}
              <span className="o-icon o-icon--burger" aria-hidden>
                <svg className="o-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={`hq-menu${open ? " hq-menu--open" : ""}`} aria-hidden={!open}>
        <nav className="hq-menu__nav">
          {NAV_LINKS.map((item, i) =>
            item.router ? (
              <Link
                key={item.label}
                to={item.href}
                className="hq-menu__link"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="hq-menu__link"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
              </a>
            ),
          )}
        </nav>
        <div className="hq-menu__footer">
          <p className="hq-menu__footer-label">Capabilities</p>
          <div className="hq-menu__footer-links">
            <a href="/capabilities/offer-design" onClick={() => setOpen(false)}>
              Offer Design
            </a>
            <a href="/capabilities/pipeline" onClick={() => setOpen(false)}>
              Pipeline Development
            </a>
            <a href="/capabilities/revenue" onClick={() => setOpen(false)}>
              Revenue Architecture
            </a>
          </div>
          <div className="hq-menu__ctas">
            <a href="/work" className="hq-menu__cta" onClick={() => setOpen(false)}>
              Case studies <span>&#8599;</span>
            </a>
            <a href={CONTACT_MAILTO_HREF} className="hq-menu__cta" onClick={() => setOpen(false)}>
              Work with us <span>&#8599;</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const NAV_STYLES = `
/* Sit above full-screen HealthQuest menu */
.hq-nav-apex.c-site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  transition: top 0.4s ease-in-out;
  background: #fff;
  color: var(--grey-darkest);
  border-bottom: 1px solid rgba(15, 17, 24, 0.12);
}

.hq-nav-apex .c-site-header__container {
  background: #fff !important;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.hq-nav-apex .c-site-header__brand,
.hq-nav-apex .c-site-header__nav {
  position: static !important;
  display: flex;
  align-items: center;
}

.hq-nav-apexBrandLogo img {
  height: 29px;
  width: auto;
}

.o-button--blur.c-site-header__menu-toggle {
  position: static !important;
  background: #fff;
  color: var(--grey-darkest);
  border: 1px solid rgba(15, 17, 24, 0.14);
  box-shadow: 0 6px 18px rgba(15, 17, 24, 0.08);
}

/* Full-screen menu — HealthQuest (standalone home) */
.hq-menu {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--grey-darkest);
  display: flex;
  flex-direction: column;
  padding: 6rem 2.5rem 3rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}
.hq-menu--open {
  opacity: 1;
  pointer-events: all;
}

.hq-menu__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}
.hq-menu__link {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.15;
  transition: color 0.2s;
  display: block;
  padding: 0.25rem 0;
}
.hq-menu--open .hq-menu__link {
  animation: hqMenuSlideIn 0.45s ease both;
}
@keyframes hqMenuSlideIn {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.hq-menu__link:hover {
  color: var(--green-light);
}

.hq-menu__footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 3rem;
  align-items: flex-start;
}
.hq-menu__footer-label {
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.hq-menu__footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.hq-menu__footer-links a {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.875rem;
  transition: color 0.2s;
}
.hq-menu__footer-links a:hover {
  color: #fff;
}
.hq-menu__ctas {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: auto;
}
.hq-menu__cta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.04em;
  transition: color 0.2s;
}
.hq-menu__cta span {
  font-size: 1rem;
}
.hq-menu__cta:hover {
  color: var(--green-light);
}

@media (max-width: 959px) {
  .hq-menu__ctas {
    margin-left: 0;
  }
}
`;
