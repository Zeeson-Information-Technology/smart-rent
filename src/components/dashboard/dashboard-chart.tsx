import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { DashboardCard } from "./dashboard-card";

export type ChartDataPoint = {
  label: string;
  value: number;
};

type DashboardChartCardProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function DashboardChartCard({
  children,
  className,
  description,
  title,
}: DashboardChartCardProps) {
  return (
    <DashboardCard className={className}>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </DashboardCard>
  );
}

type LineChartProps = {
  data: ChartDataPoint[];
  label: string;
};

export function DashboardLineChart({ data, label }: LineChartProps) {
  const width = 640;
  const height = 220;
  const paddingX = 34;
  const paddingTop = 20;
  const paddingBottom = 44;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

  const points = data.map((item, index) => {
    const x = paddingX + index * stepX;
    const y = paddingTop + chartHeight - (item.value / maxValue) * chartHeight;

    return { ...item, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${path} L ${points[points.length - 1]?.x ?? paddingX} ${
    height - paddingBottom
  } L ${paddingX} ${height - paddingBottom} Z`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
      <svg
        aria-label={label}
        className="h-64 w-full"
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id="dashboard-line-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => {
          const y = paddingTop + (chartHeight / 3) * line;

          return (
            <line
              key={line}
              stroke="#E2E8F0"
              strokeWidth="1"
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
            />
          );
        })}

        <path d={areaPath} fill="url(#dashboard-line-area)" />
        <path d={path} fill="none" stroke="#2563EB" strokeLinecap="round" strokeWidth="4" />

        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} fill="#FFFFFF" r="6" stroke="#2563EB" strokeWidth="3" />
            <text
              fill="#64748B"
              fontSize="12"
              textAnchor="middle"
              x={point.x}
              y={height - 16}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

type BarChartProps = {
  data: ChartDataPoint[];
  label: string;
};

export function DashboardBarChart({ data, label }: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div aria-label={label} className="grid gap-4" role="img">
      {data.map((item) => {
        const percentage = Math.max((item.value / maxValue) * 100, 7);

        return (
          <div className="grid gap-2" key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type BreakdownItem = {
  colorClassName: string;
  label: string;
  value: string;
};

type DashboardBreakdownProps = {
  items: BreakdownItem[];
};

export function DashboardBreakdown({ items }: DashboardBreakdownProps) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
          key={item.label}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className={cn("h-3 w-3 shrink-0 rounded-full", item.colorClassName)}
            />
            <span className="truncate text-sm font-medium text-slate-700">{item.label}</span>
          </div>
          <span className="text-sm font-semibold text-slate-950">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
