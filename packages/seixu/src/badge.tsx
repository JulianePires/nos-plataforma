import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export type BadgeTone =
  | "neutral"
  | "blue"
  | "purple"
  | "brown"
  | "green"
  | "red";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const base =
  "inline-flex items-center rounded-sm border px-2 py-0.5 font-sans text-xs font-medium leading-none";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-3 text-text-muted border-border",
  blue: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  purple: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  brown: "bg-accent-brown/15 text-accent-brown border-accent-brown/30",
  green: "bg-success/15 text-success border-success/30",
  red: "bg-danger/15 text-danger border-danger/30",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span className={cx(base, tones[tone], className)} {...props} />;
}
