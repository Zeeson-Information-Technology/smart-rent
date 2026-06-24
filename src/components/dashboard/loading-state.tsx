import { cn } from "@/lib/utils/cn";

type LoadingStateProps = {
  className?: string;
  rows?: number;
  title?: string;
};

export function LoadingState({
  className,
  rows = 4,
  title = "Loading content",
}: LoadingStateProps) {
  return (
    <div
      aria-label={title}
      aria-live="polite"
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60",
        className,
      )}
      role="status"
    >
      <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-5 grid gap-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="grid gap-2" key={index}>
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
