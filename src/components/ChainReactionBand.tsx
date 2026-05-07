import { forwardRef } from "react";
import "./ChainReactionBand.css";

export type ChainReactionColumn = {
  title: string;
  items: string[];
};

const DEFAULT_COLUMNS: ChainReactionColumn[] = [
  {
    title: "For immigration consultancies",
    items: [
      "Dormant database reactivation",
      "Express Entry candidate pipeline",
      "Employer introduction systems",
      "New service tier design",
    ],
  },
  {
    title: "For legal practices",
    items: [
      "Referral network development",
      "Client acquisition systems",
      "Offer and pricing restructure",
      "Recurring revenue architecture",
    ],
  },
  {
    title: "For financial services",
    items: [
      "Pipeline development",
      "Client lifetime value optimisation",
      "Upsell path design",
      "Automated follow-up systems",
    ],
  },
];

export type ChainReactionBandProps = {
  columns?: ChainReactionColumn[];
};

export const ChainReactionBand = forwardRef<HTMLElement, ChainReactionBandProps>(
  function ChainReactionBand({ columns = DEFAULT_COLUMNS }, ref) {
    return (
      <section ref={ref} className="hq-chain-band" aria-labelledby="hq-chain-band-heading">
        <div className="hq-chain-band__inner">
          <h2 id="hq-chain-band-heading" className="hq-chain-band__heading visually-hidden">
            Apex Consulting capabilities
          </h2>
          <p className="hq-chain-band__lede">
            <span className="hq-chain-band__lede-body">
              Apex is built on a single conviction: that every professional services practice already has the clients,
              the trust, and the expertise required to generate significantly more revenue. The only thing missing is
              the offer architecture and activation system to unlock it. We have built both.
            </span>{" "}
            <span className="hq-chain-band__lede-accent">
              Here is what our engagements actually deliver:
            </span>
          </p>

          <div className="hq-chain-band__divider" aria-hidden />

          <div className="hq-chain-band__grid">
            {columns.map((col) => (
              <div key={col.title} className="hq-chain-band__col">
                <h3 className="hq-chain-band__col-title">{col.title}</h3>
                <ul className="hq-chain-band__list">
                  {col.items.map((item) => (
                    <li key={item} className="hq-chain-band__list-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

ChainReactionBand.displayName = "ChainReactionBand";
