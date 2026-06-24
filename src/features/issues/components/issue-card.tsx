import type { ReactNode } from "react";

type IssueCardProps = {
  children: ReactNode;
  title: string;
};

export function IssueCard({ children, title }: IssueCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
