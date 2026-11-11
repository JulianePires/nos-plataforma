import { type InputHTMLAttributes, useId } from "react";
import { cx } from "./cx";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "tel"
  | "url"
  | "number";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  type?: InputType;
};

const field =
  "h-10 w-full rounded-md border border-border bg-surface-2 px-3 font-sans text-base text-text " +
  "placeholder:text-text-muted " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export function Input({ label, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="font-sans text-sm font-medium text-text"
      >
        {label}
      </label>
      <input id={inputId} className={cx(field, className)} {...props} />
    </div>
  );
}
