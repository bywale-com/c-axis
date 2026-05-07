import React, { useEffect, useRef } from "react";
import { ChainReactionBand } from "../components/ChainReactionBand";
import { LatestNewsSection } from "../components/LatestNewsSection";
import "./AboutPage.css";

const INFRA_LAYERS = [
  {
    title: "Offer design",
    copy: "We design the offers your practice leads with — priced, structured, and positioned to close at every stage of the client relationship.",
    partner: "Starting point",
    icon: "pixel",
  },
  {
    title: "Pipeline development",
    copy: "We build the outreach systems, referral networks, and candidate pipelines that fill your calendar with qualified conversations — without paid advertising.",
    partner: "Core delivery",
    icon: "grid",
  },
  {
    title: "Revenue architecture",
    copy: "We map and restructure how your practice monetises its expertise — adding service tiers, upsell paths, and recurring revenue streams to what already works.",
    partner: "Core delivery",
    icon: "dot",
  },
  {
    title: "Systems and automation",
    copy: "We identify what in your growth motion can be systematised, then build it — so the work compounds without requiring proportional effort from you.",
    partner: "Scale layer",
    icon: "lines",
  },
];

const OPERATIONS_PILLARS = ["Audit", "Activate", "Compound"];

const OPS_PROCESS_DISKS = [
  {
    disk: 4,
    title: "Audit the database",
    text: "We analyse your existing client base and surface where latent revenue is sitting — dormant, unmonetised, untouched.",
    gradientClass: "OpsConnect_diskGradient--4",
  },
  {
    disk: 3,
    title: "Design the offer",
    text: "We build the offer stack that turns what you already have into a structured, scalable revenue sequence.",
    gradientClass: "OpsConnect_diskGradient--3",
  },
  {
    disk: 2,
    title: "Activate the pipeline",
    text: "We run the campaign — email, outreach, follow-up — and get your existing clients raising their hand for the next thing.",
    gradientClass: "OpsConnect_diskGradient--2",
  },
  {
    disk: 1,
    title: "Collect and compound",
    text: "Revenue from activation funds the next stage. Each cycle compounds. The business grows without proportional effort.",
    gradientClass: "OpsConnect_diskGradient--1",
  },
] as const;

const AboutPage: React.FC = () => <AboutPageContent />;

const AboutPageContent: React.FC = () => {
  const pageRootRef = useRef<HTMLDivElement>(null);
  const opsSectionRef = useRef<HTMLElement | null>(null);
  const chainBandRef = useRef<HTMLElement | null>(null);
  const newsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = pageRootRef.current;
    if (!root) return;

    let gsapCtx: { revert: () => void } | null = null;

    const load = () => {
      if ((window as any).gsap && (window as any).ScrollTrigger) {
        init();
        return;
      }
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
      const ST = (window as any).ScrollTrigger;
      if (!gsap || !ST) return;
      gsap.registerPlugin(ST);

      const desktopMq = window.matchMedia("(min-width: 960px)");

      gsapCtx = gsap.context(() => {
        const toggleReveal = {
          toggleActions: "play none none reverse" as const,
        };

        root.querySelectorAll(".HeroInner_wrapper").forEach((heroInner) => {
          const subtitle = heroInner.querySelector(".HeroInner_subtitle");
          const title = heroInner.querySelector(".HeroInner_title");
          const pill = heroInner.querySelector(".HeroInner_pill");
          if (!subtitle || !title) return;

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
              ...toggleReveal,
            },
          });

          heroTl
            .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" })
            .to(title, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.2");

          if (pill) {
            heroTl.to(
              pill,
              { scale: 1, borderColor: "#b8945a", duration: 0.45, ease: "back.out(2)" },
              "+=0.08",
            );
          }
        });

        const split = root.querySelector(".FullWidthMedia_split");
        if (split) {
          const imgCol = split.querySelector(".FullWidthMedia_image");
          const copyCol = split.querySelector(".FullWidthMedia_copy");
          if (imgCol && copyCol) {
            gsap.set([imgCol, copyCol], { autoAlpha: 0, y: 44 });
            gsap.to([imgCol, copyCol], {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.14,
              ease: "power2.out",
              scrollTrigger: {
                trigger: split,
                start: "top 76%",
                ...toggleReveal,
              },
            });
          }
        }

        const infraGrid = root.querySelector(".InfraLayers_grid");
        if (infraGrid) {
          const cards = infraGrid.querySelectorAll(".InfraLayers_card");
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: infraGrid,
                start: "top 78%",
                ...toggleReveal,
              },
            },
          );
        }

        const opsEl = opsSectionRef.current;
        if (opsEl) {
          const header = opsEl.querySelector(".OpsConnect_header");
          const stage = opsEl.querySelector(".OpsConnect_scrollStage");
          if (header && stage) {
            gsap.set([header, stage], { autoAlpha: 0, y: 30 });
            gsap.to([header, stage], {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.16,
              ease: "power2.out",
              scrollTrigger: {
                trigger: opsEl,
                start: "top 80%",
                ...toggleReveal,
              },
            });
          }

          if (desktopMq.matches) {
            const disks = Array.from(opsEl.querySelectorAll(".OpsConnect_disk")) as HTMLElement[];
            const diskGradients = Array.from(
              opsEl.querySelectorAll(".OpsConnect_diskGradient"),
            ) as HTMLElement[];
            const diskLabelHeadlines = Array.from(
              opsEl.querySelectorAll(".OpsConnect_disk-label-headline"),
            ) as HTMLElement[];
            const diskLabelTexts = Array.from(
              opsEl.querySelectorAll(".OpsConnect_disk-label-text"),
            ) as HTMLElement[];

            if (disks.length) {
              gsap.set(disks, {
                y: (index: number) => -index * 150,
                opacity: 0,
                zIndex: (_i: number, el: Element) => {
                  const v = Number((el as HTMLElement).dataset.disk) || 0;
                  return disks.length - v + 1;
                },
              });
              gsap.set(disks[0], { opacity: 1 });
              gsap.set(diskGradients, { rotation: 0, transformOrigin: "50% 50%" });
            }

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: opsEl,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                pinSpacing: true,
              },
            });

            if (disks.length) {
              tl.to(
                disks,
                {
                  y: (index: number) => -index * 54,
                  duration: 1,
                  ease: "power2.inOut",
                  stagger: { amount: 1, from: 1 },
                },
                0,
              )
                .to(
                  disks,
                  {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.inOut",
                    stagger: { amount: 1, from: 1 },
                  },
                  0,
                )
                .to(
                  diskGradients,
                  {
                    rotation: 360,
                    duration: 1,
                    ease: "power2.inOut",
                    stagger: 0.25,
                  },
                  0,
                )
                .to(
                  diskLabelHeadlines,
                  {
                    y: "20px",
                    duration: 1,
                    ease: "power2.inOut",
                    stagger: { amount: 1, from: 0 },
                  },
                  0.28,
                )
                .to(
                  diskLabelTexts,
                  {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    stagger: { each: 0.3, from: 0 },
                  },
                  0.48,
                );
            }
          }
        }

        const chainEl = chainBandRef.current;
        if (chainEl) {
          const lede = chainEl.querySelector(".hq-chain-band__lede");
          const divider = chainEl.querySelector(".hq-chain-band__divider");
          const cols = chainEl.querySelectorAll(".hq-chain-band__col");
          if (lede && divider && cols.length) {
            gsap.set([lede, divider], { autoAlpha: 0, y: 32 });
            gsap.set(cols, { autoAlpha: 0, y: 40 });
            const chainTl = gsap.timeline({
              scrollTrigger: {
                trigger: chainEl,
                start: "top 78%",
                ...toggleReveal,
              },
            });
            chainTl
              .to(lede, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power2.out" })
              .to(divider, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, "-=0.28")
              .to(
                cols,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.56,
                  stagger: 0.11,
                  ease: "power2.out",
                },
                "-=0.22",
              );
          }
        }

        const newsEl = newsSectionRef.current;
        if (newsEl) {
          const cards = newsEl.querySelectorAll(".hq-news-card");
          if (cards.length) {
            gsap.fromTo(
              cards,
              { y: 48, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.11,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: newsEl,
                  start: "top 80%",
                },
              },
            );
          }
        }
      }, root);

      requestAnimationFrame(() => {
        ST.refresh();
      });
    };

    load();
    return () => {
      gsapCtx?.revert();
    };
  }, []);

  return (
    <div ref={pageRootRef} className="hq-about-page">
    <section className="HeroInner_block">
      <div className="Wrapper_wrapper HeroInner_wrapper">
        <h1 className="HeroInner_subtitle subtitle2">About Apex</h1>
        <h2 className="HeroInner_title h3">
          <em>We don't run your ads. We don't post your content. We </em>
          <b>
            <span className="hq-pill HeroInner_pill">architect</span>
          </b>
          <em> the systems that turn your existing clients into compounding revenue.</em>
        </h2>
      </div>
    </section>

    <section className="FullWidthMedia_block">
      <div className="Wrapper_wrapper FullWidthMedia_wrapper">
        <div className="FullWidthMedia_split">
          <div className="FullWidthMedia_inner FullWidthMedia_image">
            <div className="FullWidthMedia_bg">
              <img src="/photo-4.png" alt="Two people at a computer" className="FullWidthMedia_img" />
            </div>
          </div>
          <div className="FullWidthMedia_copy">
            <h3 className="FullWidthMedia_copyTitle">
              The money is already in your practice. Most firms just don't have the structure to unlock it.
            </h3>
            <p className="FullWidthMedia_copyBody">
              We come into legal, immigration, and financial practices and do one thing: find where revenue is
              sitting dormant — in existing clients, undermonetised relationships, and offers that have never
              been packaged correctly — and build the architecture that unlocks it. No ads. No paid channels.
              Just structure applied to what you already have.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="HeroInner_block">
      <div className="Wrapper_wrapper HeroInner_wrapper">
        <h1 className="HeroInner_subtitle subtitle2">How we work</h1>
        <h2 className="HeroInner_title h3">
          <em>Four capabilities. One compounding outcome.</em>
        </h2>
      </div>
    </section>

    <section className="InfraLayers_block" aria-label="Infrastructure Layers Grid">
      <div className="InfraLayers_grid" role="list">
        {INFRA_LAYERS.map((item) => (
          <article key={item.title} className="InfraLayers_card" role="listitem">
            <div className="InfraLayers_cardTop">
              <h3 className="InfraLayers_title">{item.title}</h3>
              <span className={`InfraLayers_icon InfraLayers_icon--${item.icon}`} aria-hidden />
            </div>
            <p className="InfraLayers_copy">{item.copy}</p>
            <div className="InfraLayers_partner">
              <p className="InfraLayers_partnerLabel">Stage</p>
              <p className="InfraLayers_partnerName">{item.partner}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="OpsConnect_block" aria-label="Operations platform statement" ref={opsSectionRef}>
      <div className="OpsConnect_inner">
        <div className="OpsConnect_header">
          <p className="OpsConnect_subtitle">Our method</p>
          <h2 className="OpsConnect_title">
            Build <span className="OpsConnect_emphasis">once</span>.
            <br />
            Compound forever.
          </h2>
          <div className="OpsConnect_row" role="list">
            {OPERATIONS_PILLARS.map((item, idx) => (
              <React.Fragment key={item}>
                <span className="OpsConnect_pill" role="listitem">
                  {item}
                </span>
                {idx < OPERATIONS_PILLARS.length - 1 && (
                  <span className="OpsConnect_plus" aria-hidden>
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="OpsConnect_scrollStage">
          <p className="OpsConnect_processKicker">
            Every engagement follows the same four-step motion
          </p>
          <div className="OpsConnect_processStack">
            <div className="OpsConnect_disks">
              {OPS_PROCESS_DISKS.map((d) => (
                <div key={d.disk} className="OpsConnect_disk" data-disk={d.disk}>
                  <div className="OpsConnect_disk-graphic" aria-hidden="true">
                    <div className={`OpsConnect_diskGradient ${d.gradientClass}`} />
                  </div>
                  <div className="OpsConnect_disk-label">
                    <h3 className="OpsConnect_disk-label-headline">{d.title}</h3>
                    <p className="OpsConnect_disk-label-text">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <ChainReactionBand ref={chainBandRef} />

    <LatestNewsSection ref={newsSectionRef} />
  </div>
  );
};

export default AboutPage;
