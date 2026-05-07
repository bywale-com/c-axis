import React from "react";
import { ArrowButton } from "./ArrowButton";

export type HqNewsCardProps = {
  tag: string;
  headline: string;
  /** Home news uses a calendar string; team cards reuse this slot for role/title */
  date: string;
  href?: string;
};

export const HqNewsCard: React.FC<HqNewsCardProps> = ({ tag, headline, date, href = "#" }) => (
  <article className="hq-news-card">
    <ArrowButton href={href} />
    <span className="hq-news-tag hq-subtitle2">{tag}</span>
    <h4 className="hq-news-headline h6">{headline}</h4>
    <time className="hq-news-date">{date}</time>
  </article>
);
