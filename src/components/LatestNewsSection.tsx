import { forwardRef } from "react";
import { HqNewsCard } from "./HqNewsCard";

export type HqLatestNewsItem = {
  tag: string;
  headline: string;
  date: string;
  href?: string;
};

/** Default trio shown on Home, About, and Team */
export const HQ_LATEST_NEWS_ITEMS: HqLatestNewsItem[] = [
  {
    tag: "Client result",
    headline: "$47,200 added to a boutique immigration consultancy in 60 days — zero ad spend",
    date: "Case study",
  },
  {
    tag: "Perspective",
    headline: "Why most professional services firms don't have a lead problem — they have an offer problem",
    date: "Apex Consulting",
  },
  {
    tag: "Perspective",
    headline: "The four stages every practice moves through — and why 95% never leave the first two",
    date: "Apex Consulting",
  },
];

export type LatestNewsSectionProps = {
  eyebrow?: string;
  items?: HqLatestNewsItem[];
  className?: string;
};

export const LatestNewsSection = forwardRef<HTMLElement, LatestNewsSectionProps>(
  function LatestNewsSection(
    { eyebrow = "Perspectives and results", items = HQ_LATEST_NEWS_ITEMS, className },
    ref,
  ) {
    return (
      <section
        ref={ref}
        className={["hq-section", "hq-section--news", className].filter(Boolean).join(" ")}
        aria-label={eyebrow}
      >
        <p className="hq-eyebrow hq-subtitle2">{eyebrow}</p>
        <div className="hq-news-grid">
          {items.map((item, i) => (
            <HqNewsCard
              key={`${item.headline}-${i}`}
              tag={item.tag}
              headline={item.headline}
              date={item.date}
              href={item.href}
            />
          ))}
        </div>
      </section>
    );
  },
);

LatestNewsSection.displayName = "LatestNewsSection";
