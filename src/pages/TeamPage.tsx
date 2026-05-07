import React from "react";
import { HqNewsCard } from "../components/HqNewsCard";
import { LatestNewsSection } from "../components/LatestNewsSection";
import "./TeamPage.css";

type TeamMember = {
  name: string;
  title: string;
  href: string;
};

/** Rows of `HqNewsCard`s — height styled in TeamPage.css */
const TEAM_ROWS: TeamMember[][] = [
  [
    { name: "Wale Omotayo", title: "Founder & Division Lead", href: "#" },
  ],
];

const TEAM_CARD_TAG = "Apex Consulting";

const partnerFirmImageModules = import.meta.glob("../../partner-firm*.*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const PARTNER_FIRM_IMAGES = Object.entries(partnerFirmImageModules)
  .sort(([a], [b]) => {
    const aMatch = a.match(/(\d+)(?=\.[^.]+$)/);
    const bMatch = b.match(/(\d+)(?=\.[^.]+$)/);
    const aNum = aMatch ? Number(aMatch[1]) : Number.MAX_SAFE_INTEGER;
    const bNum = bMatch ? Number(bMatch[1]) : Number.MAX_SAFE_INTEGER;
    return aNum - bNum || a.localeCompare(b);
  })
  .map(([, src], idx) => ({
    src,
    alt: `Partner Firm ${idx + 1}`,
  }));

const TeamPage: React.FC = () => (
  <>
  <section className="hq-team-hero">
    <div className="hq-team-hero__row">
      <div className="hq-team-hero__copy">
        <p className="hq-subtitle2">The team</p>
        <h1 className="hq-team-hero__title">
          A small team with sharp expertise, built to deliver results for{" "}
          <span className="hq-pill">legal and financial</span> practices across North America
        </h1>
      </div>
      <div className="hq-team-hero__right">
        <div className="hq-team-panel">
          <header className="hq-team-panel__header">
            <div className="hq-team-panel__mesh" aria-hidden />
            <h2 className="hq-team-panel__title">Investment Team</h2>
            <div className="hq-team-panel__rule" aria-hidden />
          </header>
          <div className="hq-team-cards-stack">
            {TEAM_ROWS.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className={`hq-team-cards${row.length < 3 ? " hq-team-cards--partial" : ""}`}
                role="list"
              >
                {row.map((m) => (
                  <div key={m.name} className="hq-team-cards__cell" role="listitem">
                    <HqNewsCard tag={TEAM_CARD_TAG} headline={m.name} date={m.title} href={m.href} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <section className="hq-team-panel__group hq-team-panel__group--next-category" aria-labelledby="partner-firms-title">
            <header className="hq-team-panel__header">
              <div className="hq-team-panel__mesh" aria-hidden />
              <h2 className="hq-team-panel__title" id="partner-firms-title">
                Partner Firms
              </h2>
              <div className="hq-team-panel__rule" aria-hidden />
            </header>
            <div className="hq-partner-firms-grid" role="list" aria-label="Partner Firms">
              {PARTNER_FIRM_IMAGES.map((firm) => (
                <article key={firm.src} className="hq-partner-firm-card" role="listitem">
                  <img className="hq-partner-firm-card__image" src={firm.src} alt={firm.alt} loading="lazy" decoding="async" />
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
  <LatestNewsSection />
  </>
);

export default TeamPage;
