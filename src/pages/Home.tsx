/**
 * HealthQuest Capital — Homepage
 * React + TypeScript
 *
 * Scroll math:
 *   Total travel  = 2400vh (8 transitions × 300vh each)
 *   scrub: true   = pure 1:1 pixel mapping
 *   ONE ScrollTrigger drives both pin and timeline
 *
 * Frame-by-frame (everything moves LEFT):
 *
 * FRAME 0 (load):
 *   img1   left:0    width:50%  height:100%  opacity:1
 *   img2   right:0   width:0%   height:65%   opacity:0  vis:hidden
 *   img3   bottom:0  width:100% height:0%    opacity:0
 *   tile1  right:0   width:50%  height:65%   opacity:1   top:0
 *   tile2  right:0   width:50%  height:35%   opacity:1   bottom:0
 *   tile3  left:0    width:49%  height:50%   opacity:0   vis:hidden  bottom:0
 *   tile4  right:0   width:49%  height:50%   opacity:0   vis:hidden  top:0
 *
 * FRAME 0→1→2 (0–600vh): img2 slides in from right (left edge moves left)
 *   img1 shrinks rightward (right edge moves left, left stays at 0)
 *   tile1+tile2 translate left (x) — the whole right column shifts left
 *   img2 width 0→49%, vis→visible, opacity 0→1
 *   img1 width 50→26%  (right edge retreats left)
 *   tile1 x: 0 → -(50%-25%) = leftward shift so left edge aligns with img2's right edge
 *   tile2 x: same leftward shift
 *   scroll hint fades out
 *
 * FRAME 2→3→4 (600–1200vh):
 *   img3 height grows 0→50% from bottom
 *   tile3+tile4 fade in (opacity 0→1, vis→visible)
 *   img1 opacity 1→0, width→0
 *   tile1 opacity 1→0
 *   tile2 opacity 1→0
 *
 * FRAME 4→5→6 (1200–1800vh):
 *   img2 height 65→50% (compresses top half)
 *   img3 width 100→50% (pulls to right half, left edge moves right — only rightward move, by design)
 *   tile3 width →50%, locks bottom-left
 *   tile4 width →50%, locks top-right
 *   tile1/tile2 x resets (they're gone, opacity 0)
 *
 * FRAME 6→7→8 (1800–2400vh):
 *   Final 4-panel grid settles and holds
 *   img2  top:0   left:0   w:50% h:50%
 *   tile4 top:0   right:0  w:50% h:50%
 *   tile3 bot:0   left:0   w:50% h:50%
 *   img3  bot:0   right:0  w:50% h:50%
 */

import React, { useEffect, useRef, useState } from "react";
import { ApexStatMorph } from "../components/ApexStatMorph";
import { ArrowButton } from "../components/ArrowButton";
import { LatestNewsSection } from "../components/LatestNewsSection";

const OUR_FOCUS = [
  {
    title: "Legal",
    copy: "Referral network development, client acquisition systems, and offer architecture for law firms that want to grow beyond word of mouth. We find where the revenue is already sitting and build the structure to unlock it.",
  },
  {
    title: "Immigration",
    copy: "Candidate pipeline development, employer outreach systems, and new revenue stream design for immigration consultancies. We've identified opportunities most practices have never been offered a system to capture.",
  },
  {
    title: "Financial",
    copy: "Growth infrastructure, offer design, and client pipeline architecture for financial services practices across North America. We work where trust is already established — and compound it into recurring revenue.",
  },
];

const focusCardImageModules = import.meta.glob("../../card-image*.*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const FOCUS_CARD_IMAGES = Object.entries(focusCardImageModules)
  .sort(([a], [b]) => {
    const aMatch = a.match(/(\d+)(?=\.[^.]+$)/);
    const bMatch = b.match(/(\d+)(?=\.[^.]+$)/);
    const aNum = aMatch ? Number(aMatch[1]) : Number.MAX_SAFE_INTEGER;
    const bNum = bMatch ? Number(bMatch[1]) : Number.MAX_SAFE_INTEGER;
    return aNum - bNum || a.localeCompare(b);
  })
  .map(([, src]) => src);

const ImgPh: React.FC<{ label: string; shade: string; noRadius?: boolean }> = ({ label, shade, noRadius }) => (
  <div style={{
    width: "100%", height: "100%", background: shade,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: noRadius ? 0 : "var(--tile-radius)",
    border: noRadius ? undefined : "1.5px dashed rgba(0,0,0,0.1)",
  }}>
    <span style={{
      fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "rgba(0,0,0,0.3)",
      textAlign: "center", padding: "1rem",
    }}>{label}</span>
  </div>
);

const Home: React.FC = () => {
  const blockRef   = useRef<HTMLDivElement>(null);
  const img1Ref    = useRef<HTMLElement>(null);
  const img2Ref    = useRef<HTMLElement>(null);
  const img3Ref    = useRef<HTMLElement>(null);
  const tile1Ref   = useRef<HTMLElement>(null);
  const tile2Ref   = useRef<HTMLElement>(null);
  const tile3Ref   = useRef<HTMLElement>(null);
  const tile4Ref   = useRef<HTMLElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const newsRef    = useRef<HTMLElement>(null);
  const [missionHover, setMissionHover] = useState<"why" | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    if (OUR_FOCUS.length <= 1) return;
    const timer = window.setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % OUR_FOCUS.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let revertFullWidthMediaMm: (() => void) | undefined;

    const load = () => {
      if ((window as any).gsap && (window as any).ScrollTrigger) { init(); return; }
      const s1 = document.createElement("script");
      s1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      document.head.appendChild(s1);
      s1.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
        document.head.appendChild(s2);
        s2.onload = init;
      };
    };

    const init = () => {
      const gsap = (window as any).gsap;
      const ST   = (window as any).ScrollTrigger;
      gsap.registerPlugin(ST);

      const block = blockRef.current;
      if (!block) return;

      const isMobile = window.matchMedia("(max-width: 959px)").matches;

      const img1 = img1Ref.current;
      const img2 = img2Ref.current;
      const img3 = img3Ref.current;
      const t1 = tile1Ref.current;
      const t2 = tile2Ref.current;
      const t3 = tile3Ref.current;
      const t4 = tile4Ref.current;
      const scrl = scrollRef.current;

      if (!isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
            trigger: block,
            start: "top top",
            end: "+=1800vh",
            pin: true,
          pinSpacing: true,
            scrub: 1,
        },
      });

        tl.to(img1, { width: "26%", ease: "none", duration: 2 }, 0)
          .to(img2, { width: "49%", height: "100%", visibility: "visible", opacity: 1, ease: "none", duration: 2 }, 0)
          .to(t1, { x: "-98%", ease: "none", duration: 2 }, 0)
          .to(t2, { x: "-98%", ease: "none", duration: 2 }, 0)
          .to(scrl, { width: "0rem", ease: "none", duration: 2 }, 0)
          .to(img2, { width: "100%", ease: "none", duration: 2 }, 2)
          .to(img1, { width: "0%", ease: "none", duration: 2 }, 2)
          .to(t1, { x: "-200%", ease: "none", duration: 2 }, 2)
          .to(t2, { x: "-200%", ease: "none", duration: 2 }, 2)
          .to(img2, { width: "50%", height: "50%", ease: "none", duration: 2 }, 4)
          .to(t4, { width: "50%", ease: "none", duration: 2 }, 4)
          .to(img3, { width: "50%", height: "50%", ease: "none", duration: 2 }, 4)
          .to(t3, { width: "50%", ease: "none", duration: 2 }, 4);
      }

      if (newsRef.current) {
        gsap.fromTo(
          newsRef.current.querySelectorAll(".hq-news-card"),
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.11,
            ease: "power2.out",
            scrollTrigger: { trigger: newsRef.current, start: "top 80%" },
          }
        );
      }

      const heroInner = document.querySelector(".HeroInner_wrapper");
      if (heroInner) {
        const subtitle = heroInner.querySelector(".HeroInner_subtitle");
        const title = heroInner.querySelector(".HeroInner_title");
        const pill = heroInner.querySelector(".HeroInner_pill");

        gsap.set([subtitle, title], { autoAlpha: 0, y: 32 });
        if (pill) {
          gsap.set(pill, {
            scale: 0.88,
            borderColor: "rgba(184,148,90,0)",
          });
        }

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroInner,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        heroTl
          .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" })
          .to(title, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.2");

        if (pill) {
          heroTl.to(
            pill,
            { scale: 1, borderColor: "#b8945a", duration: 0.45, ease: "back.out(2)" },
            "+=0.1"
          );
        }
      }

      const mediaWrap = document.querySelector(".FullWidthMedia_wrapper");
      const mediaImage = document.querySelector(".FullWidthMedia_image");
      if (mediaWrap && mediaImage) {
        const mediaScrollTriggerBase = {
          trigger: mediaWrap,
          start: "top 88%",
          end: "top 38%",
          scrub: 1.1,
        };

        gsap.fromTo(
          mediaWrap,
          { paddingLeft: "4.5rem", paddingRight: "4.5rem" },
          {
            paddingLeft: "0rem",
            paddingRight: "0rem",
            ease: "none",
            scrollTrigger: { ...mediaScrollTriggerBase },
          }
        );

        const fwMm = gsap.matchMedia();
        revertFullWidthMediaMm = () => fwMm.revert();

        fwMm.add("(min-width: 960px)", () => {
          gsap.fromTo(
            mediaImage,
            { borderRadius: "18px", aspectRatio: "16 / 7" },
            {
              borderRadius: "0px",
              aspectRatio: "40 / 21",
              ease: "none",
              scrollTrigger: { ...mediaScrollTriggerBase },
            }
          );
        });

        fwMm.add("(max-width: 959px)", () => {
        gsap.fromTo(
            mediaImage,
            { borderRadius: "18px", aspectRatio: "4 / 3", minHeight: 280 },
            {
              borderRadius: "0px",
              aspectRatio: "10 / 9",
              minHeight: 336,
              ease: "none",
              scrollTrigger: { ...mediaScrollTriggerBase },
            }
          );
        });
      }

      const metricsSection = document.querySelector(".Metrics_block");
      if (metricsSection) {
        const metricsSubtitle = metricsSection.querySelector(".Metrics_subtitle");
        const metricsTitle = metricsSection.querySelector(".Metrics_title");
        const metricsMorph = metricsSection.querySelector(".ApexStatMorph");

        gsap.set([metricsSubtitle, metricsTitle, metricsMorph], { autoAlpha: 0, y: 38 });

        const metricsIntro = gsap.timeline({
          scrollTrigger: {
            trigger: metricsSection,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        metricsIntro
          .to(metricsSubtitle, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" })
          .to(metricsTitle, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.15")
          .to(metricsMorph, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.2");

        const metricsScrub = gsap.timeline({
          scrollTrigger: {
            trigger: metricsSection,
            start: "top 88%",
            end: "bottom 28%",
            scrub: 1.1,
          },
        });
        metricsScrub
          .fromTo(metricsTitle, { x: 0 }, { x: -14, ease: "none" }, 0)
          .fromTo(metricsMorph, { y: 0, scale: 1 }, { y: -18, scale: 1.03, ease: "none" }, 0);
      }

      const missionSection = document.querySelector(".OurMission_block");
      if (missionSection) {
        const missionSubtitle = missionSection.querySelector(".OurMission_sectionSubtitle");
        const missionItemTitles = missionSection.querySelectorAll(".OurMission_title");
        const missionItems = missionSection.querySelectorAll(".OurMission_item");

        gsap.set(missionSubtitle, { autoAlpha: 0, y: 36 });
        gsap.set(missionItems, {
          autoAlpha: 0.2,
          y: 38,
          x: 80,
        });
        gsap.set(missionItemTitles, { autoAlpha: 0.6 });

        const missionIntro = gsap.timeline({
          scrollTrigger: {
            trigger: missionSection,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        missionIntro
          .to(missionSubtitle, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
          .to(missionItems, { autoAlpha: 1, y: 0, x: 0, stagger: 0.14, duration: 0.6, ease: "power2.out" }, "-=0.15");

        const missionScrub = gsap.timeline({
          scrollTrigger: {
            trigger: missionSection,
            start: "top 86%",
            end: "bottom 30%",
            scrub: 1.1,
          },
        });
        missionScrub
          .fromTo(missionItems, { y: 0 }, { y: -24, stagger: 0.08, ease: "none" }, 0)
          .fromTo(missionItemTitles, { x: 0 }, { x: -10, stagger: 0.08, ease: "none" }, 0);
      }
    };

    load();
    return () => {
      revertFullWidthMediaMm?.();
      const ST = (window as any).ScrollTrigger;
      if (ST) ST.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <div ref={blockRef} className="hq-block">
        <div className="hq-spacer" />
        <div className="hq-wrapper">

          <picture ref={img1Ref as React.Ref<HTMLElement>} className="hq-image hq-image1">
            <img src="/photo-1.webp" alt="Garheng Kong talking" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"var(--tile-radius)", display:"block" }} />
          </picture>

          <picture ref={img2Ref as React.Ref<HTMLElement>} className="hq-image hq-image2">
            <img src="/photo-2.webp" alt="Meeting table discussion" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"var(--tile-radius)", display:"block" }} />
          </picture>

          <picture ref={img3Ref as React.Ref<HTMLElement>} className="hq-image hq-image3">
            <img src="/photo-3.webp" alt="Three people at desk" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"var(--tile-radius)", display:"block" }} />
          </picture>

          <article ref={tile1Ref as React.Ref<HTMLElement>} className="hq-tile hq-tile1">
            <a className="hq-tile__link" href="/about">
              <div className="hq-tile__inner">
                <ArrowButton href="/about" />
                <div>
                  <p className="hq-subtitle2">What we do</p>
                  <h3 className="hq-tile__title h4">
                    We architect the systems that turn professional expertise into compounding revenue
                  </h3>
                </div>
              </div>
            </a>
          </article>

          <article ref={tile2Ref as React.Ref<HTMLElement>} className="hq-tile hq-tile2">
            <a className="hq-tile__link" href="/approach">
              <div className="hq-tile__inner">
                <ArrowButton href="/approach" />
                <div>
                  <p className="hq-subtitle2">Our approach</p>
                  <h3 className="hq-tile__title h4">
                    We don't sell channels. We install architecture.
                  </h3>
                </div>
              </div>
            </a>
          </article>

          <article ref={tile3Ref as React.Ref<HTMLElement>} className="hq-tile hq-tile3">
            <a className="hq-tile__link" href="/about">
              <div className="hq-tile__inner">
                <ArrowButton href="/about" />
                <div>
                  <p className="hq-subtitle2">Our clients</p>
                  <h3 className="hq-tile__title h4">
                    Legal, immigration, and financial practices across North America
                  </h3>
                </div>
              </div>
            </a>
          </article>

          <article ref={tile4Ref as React.Ref<HTMLElement>} className="hq-tile hq-tile4">
            <a className="hq-tile__link" href="/about">
              <div className="hq-tile__inner">
                <ArrowButton href="/about" />
                <div>
                  <p className="hq-subtitle2">Results</p>
                  <h3 className="hq-tile__title h4">
                    $47,200 added to a boutique firm's revenue. In 60 days. Zero ad spend.
                  </h3>
                </div>
              </div>
            </a>
          </article>

          <div ref={scrollRef} className="hq-bottom-scroll">
            <div className="hq-scroll-inner">
              <div className="hq-scroll-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v14M4 11l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span>Scroll</span>
          </div>

        </div>
      </div>

      <div className="hq-below-fold">
        <section className="HeroInner_block">
          <div className="Wrapper_wrapper HeroInner_wrapper">
            <h1 className="HeroInner_subtitle subtitle2">Why Apex</h1>
            <h2 className="HeroInner_title h3">
              <em>We don't grow your business through </em><b><span className="hq-pill HeroInner_pill">ads</span></b><em>. We grow it through architecture.</em>
            </h2>
          </div>
        </section>

        <section className="FullWidthMedia_block">
          <div className="Wrapper_wrapper FullWidthMedia_wrapper">
            <div className="FullWidthMedia_inner FullWidthMedia_image">
              <div className="FullWidthMedia_bg">
                <img
                  src="/photo-4.webp"
                  alt="Two people at a computer"
                  className="FullWidthMedia_img"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="Metrics_block">
          <div className="Wrapper_wrapper">
            <h2 className="Metrics_subtitle subtitle2">What we deliver</h2>
            <h3 className="Metrics_title h2">
              <em>Revenue and </em><b><span className="hq-pill">results</span></b>
            </h3>
            <ApexStatMorph />
          </div>
        </section>

        <section className="OurMission_block">
          <div className="Wrapper_wrapper OurMission_wrapper">
            <h5 className="OurMission_sectionSubtitle subtitle2">Our philosophy</h5>
            <div className="OurMission_preview" aria-hidden={missionHover === null}>
              {missionHover === "why" && (
                <div className="pendulum">
                  <div className="pendulum_box">
                    <div className="ball first"></div>
                    <div className="ball"></div>
                    <div className="ball"></div>
                    <div className="ball"></div>
                    <div className="ball last"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="OurMission_items">
              <article
                className="OurMission_item"
                onMouseEnter={() => setMissionHover("why")}
                onMouseLeave={() => setMissionHover(null)}
              >
                <div>
                  <h5 className="OurMission_subtitle subtitle2">Why</h5>
                  <h5 className="OurMission_title h5">
                    <em>Most growth firms sell you a channel. We identify where the money is already sitting in your practice and build the structure that unlocks it — </em><b>without adding complexity</b>
                  </h5>
                </div>
              </article>
              <article className="OurMission_item">
                <div>
                  <h5 className="OurMission_subtitle subtitle2">What</h5>
                  <h5 className="OurMission_title h5">
                    <em>We are </em><b>input-based</b><em> — every engagement is structured around deliverables and milestones, not retainers for effort</em>
                  </h5>
                </div>
              </article>
              <article className="OurMission_item">
                <div>
                  <h5 className="OurMission_subtitle subtitle2">How</h5>
                  <h5 className="OurMission_title h5">
                    <em>We come into your practice, audit what you already have, and build the </em><b>offers, pipelines, and systems</b><em> that compound your existing client relationships into new revenue</em>
                  </h5>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="hq-section hq-our-focus">
          <h2 className="hq-our-focus__heading">Our Focus</h2>
          <div className="hq-our-focus__rule" aria-hidden />
          <div className="hq-our-focus__carousel">
            <div className="hq-our-focus__track" style={{ transform: `translateX(-${focusIndex * 100}%)` }}>
              {OUR_FOCUS.map((item, idx) => (
                <article key={item.title} className="hq-our-focus__slide" aria-label={item.title}>
                  <div className="hq-our-focus__graphic">
                    {FOCUS_CARD_IMAGES.length > 0 ? (
                      <img
                        className="hq-our-focus__image"
                        src={FOCUS_CARD_IMAGES[idx % FOCUS_CARD_IMAGES.length]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <ImgPh label="Card image placeholder" shade="#a9d48f" />
                    )}
                  </div>
                  <div className="hq-our-focus__overlay">
                    <div className="hq-our-focus__title-box">
                      <h3 className="hq-our-focus__title h6">{item.title}</h3>
                    </div>
                    <p className="hq-our-focus__copy">{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="hq-our-focus__dots" aria-hidden>
              {OUR_FOCUS.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  className={`hq-our-focus__dot${idx === focusIndex ? " is-active" : ""}`}
                  onClick={() => setFocusIndex(idx)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="hq-focus-bridge" aria-label="Our Focus Impact Statement">
          <div className="Wrapper_wrapper hq-focus-bridge__inner">
            <h2 className="HeroInner_title hq-focus-bridge__title">
              <em>
                Every party wins at every rung. That is the standard we hold every engagement to — not
                just for our clients, but for everyone their clients serve.
              </em>
            </h2>
          </div>
        </section>

        <section className="hq-section hq-innovations">
          <div className="hq-innovations__inner">
            <div className="hq-innovations__left">
              <p className="hq-innovations__eyebrow">Growth consulting</p>
              <h2 className="hq-innovations__title">
                We believe the money is already in your practice. You just need the architecture to unlock it.
              </h2>
            </div>
            <div className="hq-innovations__right">
              <div className="hq-innovations__icon-wrap" aria-hidden>
                <div className="hq-cube-stage">
                  <div className="hq-cube-roll">
                    <div className="hq-cube-face hq-cube-face--front">Offer Design</div>
                    <div className="hq-cube-face hq-cube-face--back">Pipeline</div>
                    <div className="hq-cube-face hq-cube-face--left">Revenue</div>
                    <div className="hq-cube-face hq-cube-face--right">Systems</div>
                    <div className="hq-cube-face hq-cube-face--top">Audit</div>
                    <div className="hq-cube-face hq-cube-face--bottom">Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LatestNewsSection ref={newsRef} />
      </div>
    </>
  );
};

const STYLES = `
/* Home-only styles (tokens & base typography: src/styles/globals.css) */

/* ── imageZoom — source: animation:zoomOut 1s ease forwards ─────────── */
@keyframes zoomOut {
  0%   { transform:scale(1.1); opacity:0.8; }
  to   { transform:scale(1);   opacity:1;   }
}
.hq-image img { animation:zoomOut 1s ease forwards; }

/* ── Page transition — source: scale(0.8) + opacity, .6s ────────────── */
.page-transition-enter { opacity:0; transform:scale(0.8); }
.page-transition-enter-active { opacity:1; transform:scale(1); transition:opacity .6s,transform .6s; }
.page-transition-exit  { opacity:1; transform:scale(1); }
.page-transition-exit-active  { opacity:0; transform:scale(0.8); transition:opacity .6s,transform .6s; }

/* ── Block ──────────────────────────────────────────────────────────── */
.hq-block {
  position:relative;
  height:100vh;
  overflow:hidden;
  z-index:2;
}

/* ── Spacer ─────────────────────────────────────────────────────────── */
.hq-spacer {
  position:relative;
  height:7.5rem;
  background:#fff;
  width:100%;
  z-index:1;
}

/* ── Wrapper ────────────────────────────────────────────────────────── */
/* border:1.25rem solid #fff = the white gutter between every panel     */
.hq-wrapper {
  position:relative;
  border:var(--border) solid #fff;
  width:100%;
  height:calc(100% - 7.5rem);
  overflow:hidden;
}

/* ── Images ─────────────────────────────────────────────────────────── */
.hq-image {
  position:absolute;
  border:var(--img-border) solid #fff;
  overflow:hidden;
  display:block;
}
.hq-image > div {
  border-radius:var(--tile-radius);
  height:100%;
  width:100%;
  object-fit:cover;
}

/* Initial states from SSR HTML */
.hq-image1 { left:0; top:0; width:50%; height:100%; opacity:1; z-index:1; }
.hq-image2 { right:0; top:0; width:0%; height:0%; opacity:0; visibility:hidden; background-color:#fff; z-index:5; }
.hq-image3 { bottom:0; left:0; width:0%; height:0%; z-index:6; display:block; }

/* ── Tiles ──────────────────────────────────────────────────────────── */
.hq-tile {
  position:absolute;
  border-radius:var(--tile-radius);
  border:var(--img-border) solid #fff;
  overflow:hidden;
}
.hq-tile__link { display:block; padding:1.6875rem; height:100%; position:relative; }
.hq-tile__inner {
  height:100%; display:flex; flex-flow:column;
  justify-content:space-between; max-width:calc(100% - 1.25rem);
}
.hq-tile__title { line-height:1.1; }
.hq-tile__title.h4 { font-size:clamp(1.7rem,2.55vw,6.4rem); }

/* tile1: grey, top-right, 65% tall — VISIBLE at load */
.hq-tile1 {
  background-color:var(--grey-light); z-index:2;
  top:0; right:0; width:50%; height:65%;
}
.hq-tile1::before {
  content:''; position:absolute; top:6.25rem; right:-2.5rem;
  width:29.375rem; height:29.375rem; border-radius:50%;
  border:1px solid rgba(184,148,90,0.12);
  box-shadow:
    0 0 0 3rem rgba(184,148,90,0.05),
    0 0 0 6rem rgba(184,148,90,0.04),
    0 0 0 9rem rgba(184,148,90,0.03),
    0 0 0 12rem rgba(184,148,90,0.02);
  transform:rotate(-40deg); pointer-events:none;
}

/* tile2: green, bottom-right, 35% tall — VISIBLE at load */
.hq-tile2 {
  background-color:var(--green-light); z-index:3;
  bottom:0; right:0; width:50%; height:35%;
}

/* tile3: grey, bottom-RIGHT — starts at width:0, grows leftward from right edge */
.hq-tile3 {
  background-color:var(--grey-light); z-index:6;
  right:0; bottom:0; width:0%; height:50%;
  overflow:hidden;
}
.hq-tile3::before {
  content:''; position:absolute; bottom:0; right:0;
  width:42.375rem; height:33.375rem; border-radius:50%;
  border:1px solid rgba(184,148,90,0.1);
  box-shadow: 0 0 0 3rem rgba(184,148,90,0.04), 0 0 0 6rem rgba(184,148,90,0.03);
  transform:rotate(-140deg); pointer-events:none;
}

/* tile4: green, top-left — anchored left:0 top:0, grows rightward */
.hq-tile4 {
  background-color:var(--green-light); z-index:9;
  left:0; top:0; width:0%; height:50%;
}

/* ── Scroll indicator ───────────────────────────────────────────────── */
.hq-bottom-scroll {
  position:absolute; bottom:0; left:0;
  width:7.5rem; height:9.3125rem;
  display:flex; flex-direction:column;
  align-items:center; justify-content:flex-end;
  gap:0.5rem; padding-bottom:0.5rem;
  color:var(--grey-darkest); font-size:0.875rem; font-weight:600;
  z-index:20;
}
.hq-scroll-inner { width:3.75rem; height:3.75rem; }
.hq-scroll-icon {
  width:3.75rem; height:3.75rem;
  background-color:var(--grey-darkest); border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  color:#fff; transform:rotate(-90deg); transition:background 0.25s;
}
.hq-scroll-icon:hover { background:var(--green-dark); }

/* ── Below fold ─────────────────────────────────────────────────────── */
.hq-below-fold { background:var(--white); position:relative; z-index:2; }

.Wrapper_wrapper { width:100%; max-width:none; margin:0; padding:0 2.5rem; }

/* .hq-pill — see src/styles/globals.css */
.HeroInner_pill { transform-origin:50% 60%; }

.HeroInner_block { background:var(--white); }
.HeroInner_wrapper {
  padding:5rem 2.5rem 4rem;
  max-width:1400px; margin:0 auto;
}
.HeroInner_subtitle {
  font-size:0.75rem; font-weight:600; letter-spacing:-0.01em;
  display:flex; align-items:center; gap:0.375rem;
  margin-bottom:1.5rem; color:var(--grey-darkest);
}
.HeroInner_subtitle::before {
  content:''; display:block; width:6px; height:6px;
  border-radius:50%; background:var(--green-dark); flex-shrink:0;
}
.HeroInner_title {
  font-weight:600;
  font-size:clamp(2.5rem,5.5vw,5rem);
  line-height:1.05;
  letter-spacing:-0.03em;
  color:var(--grey-darkest);
  max-width:18ch;
}
.HeroInner_title em { font-style:normal; }
.HeroInner_title b  { font-weight:600; }

.FullWidthMedia_block { background:var(--white); border-top:1px solid var(--grey-darkest); }
.FullWidthMedia_inner { width:100%; }
.FullWidthMedia_image { aspect-ratio:16/7; overflow:hidden; }
.FullWidthMedia_bg {
  position:relative; width:100%; height:100%;
}
.FullWidthMedia_img {
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  border-radius:0;
}

.Metrics_block { background:var(--grey-darkest); padding:7.75rem 0 0; overflow:hidden; }
.Metrics_block .Wrapper_wrapper { width:100%; max-width:none; margin:0; }
.Metrics_subtitle {
  font-size:0.75rem; font-weight:600; letter-spacing:-0.01em;
  display:flex; align-items:center; gap:0.375rem;
  margin-bottom:1.5rem;
  color:rgba(255,255,255,0.9);
}
.Metrics_subtitle::before {
  content:''; display:block; width:6px; height:6px;
  border-radius:50%; background:var(--green-light); flex-shrink:0;
}
.Metrics_title {
  font-size:clamp(3rem,7vw,6rem);
  font-weight:700; letter-spacing:-0.03em; line-height:1;
  margin-bottom:2.1rem;
  color:var(--white);
}
.Metrics_title em { font-style:normal; }
.Metrics_title b  { font-weight:700; color:var(--green-light); }
.ApexStatMorph {
  width:min(560px,100%);
  margin:0 auto;
  display:flex;
  justify-content:center;
  align-items:center;
}
.ApexStatMorph canvas {
  width:min(560px,100%);
  height:auto;
  display:block;
}

.OurMission_block { background:var(--grey-darkest); padding:7.25rem 0; overflow:hidden; }
.OurMission_wrapper {
  display:grid;
  grid-template-columns:1fr 1fr;
  grid-template-rows:auto 1fr;
  gap:0 4rem;
  align-items:start;
}
.OurMission_sectionSubtitle {
  font-size:0.75rem; font-weight:600; letter-spacing:-0.01em;
  display:flex; align-items:center; gap:0.375rem;
  color:rgba(255,255,255,0.92);
  grid-column:1; grid-row:1;
  padding-top:2.5rem;
}
.OurMission_sectionSubtitle::before {
  content:''; display:block; width:6px; height:6px;
  border-radius:50%; background:var(--green-light); flex-shrink:0;
}
.OurMission_preview {
  grid-column:1;
  grid-row:2;
  min-height:320px;
  display:flex;
  align-items:center;
  justify-content:center;
}
.OurMission_items {
  grid-column:2; grid-row:1 / 3;
  display:flex;
  flex-direction:column;
}
.OurMission_item {
  border-top:1px solid rgba(255,255,255,0.28);
  padding:2.5rem 0;
}
.OurMission_subtitle {
  font-size:0.75rem; font-weight:600; letter-spacing:-0.01em;
  display:flex; align-items:center; gap:0.375rem;
  margin-bottom:1rem;
  color:rgba(255,255,255,0.9);
}
.OurMission_subtitle::before {
  content:''; display:block; width:6px; height:6px;
  border-radius:50%; background:var(--green-light); flex-shrink:0;
}
.OurMission_title {
  font-size:clamp(1.5rem,2.5vw,2rem);
  font-weight:600; line-height:1.2; letter-spacing:-0.02em;
  color:rgba(255,255,255,0.95);
}
.OurMission_title em { font-style:normal; font-weight:600; }
.OurMission_title b  { font-weight:600; color:var(--green-light); }

.pendulum {
  position:relative;
  width:220px;
  height:180px;
  background-color:#f8c6cf;
  border-radius:5%;
  border-top:15px solid #eee7d5;
}
.pendulum_box {
  display:flex;
  padding:120px 0 0 10px;
  position:absolute;
}
.ball {
  height:40px;
  width:40px;
  border-radius:50%;
  background-color:#455681;
  position:relative;
  transform-origin:50% -300%;
}
.ball::before {
  content:"";
  width:2px;
  height:120px;
  background-color:#fffeff;
  left:18px;
  top:-120px;
  position:absolute;
}
.ball.first {
  animation:firstball 0.9s alternate ease-in infinite;
}
@keyframes firstball {
  0% { transform:rotate(35deg); }
  50% { transform:rotate(0deg); }
}
.ball.last {
  animation:lastball 0.9s alternate ease-out infinite;
}
@keyframes lastball {
  50% { transform:rotate(0deg); }
  100% { transform:rotate(-35deg); }
}

.hq-our-focus {
  position:relative;
  background:#efefef;
  min-height:100vh;
  padding-top:12.5rem;
  padding-bottom:12.5rem;
}
.hq-our-focus__heading {
  font-size:clamp(3rem,7vw,6rem);
  line-height:1;
  letter-spacing:-0.03em;
  font-weight:700;
  color:#181d23;
}
.hq-our-focus__rule {
  width:100%;
  border-top:1px solid #242931;
  margin-top:0.9rem;
}
.hq-our-focus__items {
  display:none;
}
.hq-our-focus__carousel {
  margin-top:2.25rem;
  overflow:hidden;
}
.hq-our-focus__track {
  display:flex;
  transition:transform 0.6s ease;
}
.hq-our-focus__slide {
  position:relative;
  flex:0 0 100%;
  min-height:608px;
  border-radius:8px;
  overflow:hidden;
  background:#9fd4f8;
}
.hq-our-focus__graphic {
  position:absolute;
  inset:0;
}
.hq-our-focus__image {
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}
.hq-our-focus__overlay {
  position:absolute;
  top:1.1rem;
  left:1.1rem;
  right:1.1rem;
  display:grid;
  grid-template-columns:minmax(240px, 46%) minmax(0, 22%);
  gap:0.5rem;
  align-items:start;
}
.hq-our-focus__title-box,
.hq-our-focus__copy {
  background:rgba(250,250,245,0.9);
  border-radius:6px;
}
.hq-our-focus__title-box {
  padding:0.75rem 1rem;
}
.hq-our-focus__copy {
  margin:0;
  padding:0.5rem 0.6rem;
  font-size:0.72rem;
  line-height:1.28;
  max-width:none;
  color:#242b33;
}
.hq-our-focus__dots {
  margin-top:0.85rem;
  display:flex;
  justify-content:center;
  gap:0.4rem;
}
.hq-our-focus__dot {
  width:0.5rem;
  height:0.5rem;
  border-radius:50%;
  border:none;
  background:rgba(24,29,35,0.28);
  cursor:pointer;
}
.hq-our-focus__dot.is-active {
  background:#181d23;
}
.hq-our-focus__title {
  margin:0;
  font-size:clamp(1.6rem,2.1vw,2rem);
  font-weight:600;
  line-height:1.1;
  color:#1d252d;
}
.hq-our-focus__copy {
  font-size:0.72rem;
}

.hq-focus-bridge {
  position:relative;
  min-height:100vh;
  display:grid;
  place-items:center;
  background:#fff;
  overflow:hidden;
  padding:3rem 0;
}
.hq-focus-bridge::before {
  content:"";
  position:absolute;
  inset:-8% -6%;
  opacity:0.55;
  pointer-events:none;
  background:
    repeating-radial-gradient(
      ellipse 42% 18% at 28% 44%,
      rgba(39,42,42,0.06) 0 1px,
      transparent 1px 4px
    ),
    repeating-radial-gradient(
      ellipse 44% 18% at 72% 56%,
      rgba(39,42,42,0.05) 0 1px,
      transparent 1px 4px
    );
  transform:rotate(-20deg) scale(1.08);
}
.hq-focus-bridge__inner {
  position:relative;
  z-index:1;
  display:flex;
  justify-content:center;
}
.hq-focus-bridge__title {
  max-width:18ch;
  text-align:center;
}
.hq-focus-bridge__title em {
  font-style:normal;
}

.hq-innovations {
  background:#efefef;
  /* Keep full-width section, but inset inner panels to match Our Focus */
  padding:0 clamp(1.25rem, 3.4vw, 2.1rem);
}
.hq-innovations__inner {
  display:grid;
  grid-template-columns:42% 58%;
  min-height:100vh;
  align-items:stretch;
}
.hq-innovations__left {
  background:#c8a96e;
  color:#1d252d;
  padding:1.1rem 2rem 1.5rem;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
}
.hq-innovations__eyebrow {
  font-size:0.8rem;
  color:#1f2a2d;
  margin-bottom:auto;
  position:relative;
  padding-left:0.95rem;
}
.hq-innovations__eyebrow::before {
  content:"";
  width:5px;
  height:5px;
  border-radius:50%;
  background:#1f2a2d;
  position:absolute;
  left:0;
  top:0.48rem;
}
.hq-innovations__title {
  max-width:13ch;
  font-size:clamp(1.3rem,3vw,3rem);
  line-height:1.03;
  letter-spacing:-0.035em;
  font-weight:600;
}
.hq-innovations__right {
  display:grid;
  place-items:center;
  border-left:2px solid rgba(27,34,38,0.12);
  position:relative;
}
.hq-innovations__icon-wrap {
  width:min(66%,430px);
  min-height:280px;
  display:grid;
  place-items:center;
}
.hq-cube-stage {
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  perspective:1000px;
  background:transparent;
}
.hq-cube-roll {
  --cube-size:150px;
  --cube-half:75px;
  position:relative;
  width:var(--cube-size);
  height:var(--cube-size);
  transform-style:preserve-3d;
  animation:hq-cube-roll 5s infinite;
}
@media (min-width:480px) {
  .hq-cube-roll {
    --cube-size:250px;
    --cube-half:125px;
  }
}
.hq-cube-face {
  position:absolute;
  inset:0;
  box-sizing:border-box;
  display:flex;
  align-items:center;
  justify-content:center;
  height:var(--cube-size);
  width:var(--cube-size);
  border:2px solid rgba(255,255,255,0.15);
  color:#fff;
  background-color:#0f1118;
  font-size:clamp(1rem,4vw,1.875rem);
  font-weight:600;
  text-align:center;
  backface-visibility:visible;
}
.hq-cube-face--front  { transform:translateZ(var(--cube-half)); }
.hq-cube-face--back   { transform:rotateY(180deg) translateZ(var(--cube-half)); }
.hq-cube-face--left   { transform:rotateY(-90deg) translateZ(var(--cube-half)); }
.hq-cube-face--right  { transform:rotateY(90deg) translateZ(var(--cube-half)); }
.hq-cube-face--top    { transform:rotateX(90deg) translateZ(var(--cube-half)); }
.hq-cube-face--bottom { transform:rotateX(-90deg) translateZ(var(--cube-half)); }
@keyframes hq-cube-roll {
  0%   { transform:rotateX(45deg) rotateY(-45deg); }
  25%  { transform:rotateX(-45deg) rotateY(-45deg); }
  50%  { transform:rotateX(45deg) rotateY(45deg); }
  75%  { transform:rotateX(-45deg) rotateY(45deg); }
  100% { transform:rotateX(45deg) rotateY(-45deg); }
}

/* ── Mobile ─────────────────────────────────────────────────────────── */
@media (max-width:959px) {
  .hq-block { height:auto; min-height:100vh; overflow:visible; }
  .hq-spacer  { height:5rem; }
  .hq-wrapper {
    border-width:0.625rem;
    height:auto;
    min-height:0;
    display:flex;
    flex-flow:column;
    overflow:visible;
  }
  .hq-image, .hq-tile {
    position:static !important; width:100% !important; height:auto !important;
    opacity:1 !important; visibility:visible !important; border-radius:0.75rem;
    transform:none !important;
  }
  .hq-image   { min-height:60vw; }
  .hq-image1  { order:-1; }
  .hq-tile1   { order:0; min-height:16.25rem; }
  .hq-tile3   { order:1; background-color:var(--green-light); }
  .hq-image2  { order:2; }
  .hq-tile4   { order:3; background-color:var(--green-light); }
  .hq-image3  { order:6; }
  .hq-bottom-scroll { display:none; }
  .FullWidthMedia_image { aspect-ratio:4/3; min-height:280px; }
  .hq-our-focus { min-height:auto; padding-top:6rem; padding-bottom:6rem; }
  .hq-our-focus__heading { font-size:clamp(2.8rem,10vw,4rem); }
  .hq-our-focus__slide { min-height:420px; }
  .hq-our-focus__overlay {
    grid-template-columns:minmax(180px, 58%) minmax(0, 34%);
    top:0.85rem; left:0.85rem; right:0.85rem;
  }
  .hq-our-focus__title { font-size:clamp(1.35rem,6vw,1.8rem); }
  .hq-our-focus__copy { font-size:0.66rem; }
  .hq-focus-bridge { min-height:72vh; }
  .hq-focus-bridge__title { max-width:16ch; font-size:clamp(2rem,9vw,3.25rem); }
  .OurMission_wrapper { grid-template-columns:1fr; grid-template-rows:auto auto auto; gap:1.5rem 0; }
  .OurMission_sectionSubtitle { grid-column:1; grid-row:1; padding-top:0; }
  .OurMission_preview { display:none; }
  .OurMission_items { grid-column:1; grid-row:3; }
  .hq-innovations { padding-top:0; }
  .hq-innovations__inner  { grid-template-columns:1fr; min-height:auto; }
  .hq-innovations__left { min-height:380px; padding:1rem 1.25rem 1.5rem; }
  .hq-innovations__title { max-width:16ch; font-size:clamp(1.5rem,8vw,2.5rem); }
  .hq-innovations__right { min-height:340px; border-left:none; border-top:2px solid rgba(27,34,38,0.12); }
  .hq-innovations__icon-wrap { width:min(72%,300px); }
}
`;

export default Home;
