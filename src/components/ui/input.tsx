import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label
      className="grid min-w-0 gap-2 text-sm font-medium text-slate-700"
      htmlFor={inputId}
    >
      {label ? <span>{label}</span> : null}
      <input
        className={cn(
          "h-11 w-full min-w-0 max-w-full rounded-lg border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50",
          className,
        )}
        id={inputId}
        {...props}
      />
    </label>
  );
}
