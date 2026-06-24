"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  FileText,
  Home,
  MessageSquare,
  Plus,
  Scale,
  Send,
  UserPlus,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  ActivityItem,
  DashboardBarChart,
  DashboardBreakdown,
  DashboardCard,
  DashboardChartCard,
  DashboardLineChart,
  DataTable,
  EmptyState,
  QuickActionButton,
  StatCard,
} from "@/components/dashboard";
import { DisputeStatusBadge } from "@/features/disputes/components";
import type { DashboardStat, DashboardSummary } from "@/features/dashboard/types";
import { IssuePriorityBadge, IssueStatusBadge } from "@/features/issues/components";

type DashboardClientProps = {
  name: string;
};

const statIcons: Record<DashboardStat["icon"], LucideIcon> = {
  alert: AlertCircle,
  building: Building2,
  home: Home,
  message: MessageSquare,
  scale: Scale,
  user: UserRound,
  users: Users,
};

const iconToneClassNames: Record<NonNullable<DashboardStat["iconTone"]>, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  orange: "bg-orange-50 text-orange-600",
  rose: "bg-rose-50 text-rose-600",
};

export function DashboardClient({ name }: DashboardClientProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/summary", {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!mounted) return;

      if (!response.ok) {
        setError(result?.error ?? "Unable to load dashboard summary.");
        setIsLoading(false);
        return;
      }

      setSummary(result);
      setIsLoading(false);
    }

    void loadSummary();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <DashboardSkeleton name={name} />;
  }

  if (error) {
    return (
      <EmptyState
        description={error}
        icon={AlertCircle}
        title="Unable to load dashboard"
      />
    );
  }

  if (!summary) {
    return (
      <EmptyState
        description="No dashboard data is currently available for this account."
        icon={Building2}
        title="No dashboard data"
      />
    );
  }

  if (summary.role === "tenant") {
    return <TenantDashboard name={name} summary={summary} />;
  }

  if (summary.role === "admin") {
    return <AdminDashboard name={name} summary={summary} />;
  }

  return <LandlordDashboard name={name} summary={summary} />;
}

function LandlordDashboard({ name, summary }: { name: string; summary: DashboardSummary }) {
  return (
    <>
      <DashboardWelcome
        description={`Welcome back, ${getFirstName(name)}! Here's what's happening with your properties.`}
        title="Dashboard"
      />
      <StatsGrid stats={summary.stats} />
      <PortfolioCharts summary={summary} />
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.45fr_0.75fr]">
        <RecentIssues summary={summary} />
        <div className="grid gap-6">
          <MonthlyOverview summary={summary} />
          <RecentMessages summary={summary} />
          <UpcomingActivities summary={summary} />
        </div>
      </div>
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.45fr_0.75fr]">
        <RecentDisputes summary={summary} />
        <QuickActions />
      </div>
    </>
  );
}

function TenantDashboard({ name, summary }: { name: string; summary: DashboardSummary }) {
  return (
    <>
      <DashboardWelcome
        description={`Welcome back, ${getFirstName(name)}! Here's the latest activity for your tenancy.`}
        title="Dashboard"
      />
      <StatsGrid stats={summary.stats} />
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.35fr_0.85fr]">
        <DashboardChartCard
          description="Your recent issue activity from SmartRent records."
          title="Issue History"
        >
          <DashboardLineChart data={issueTrend(summary)} label="Tenant issue history" />
        </DashboardChartCard>
        <DashboardChartCard
          description="Current issue and dispute activity for your tenancy."
          title="Response Breakdown"
        >
          <DashboardBreakdown
            items={[
              { label: "Open issues", value: countOpenIssues(summary).toString(), colorClassName: "bg-orange-500" },
              { label: "Active disputes", value: countActiveDisputes(summary).toString(), colorClassName: "bg-rose-500" },
              { label: "Resolved rate", value: `${summary.monthlyOverview.issueResolutionRate}%`, colorClassName: "bg-emerald-500" },
            ]}
          />
        </DashboardChartCard>
      </div>
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.35fr_0.85fr]">
        <RecentIssues summary={summary} />
        <div className="grid gap-6">
          <RecentMessages summary={summary} />
          <RecentDisputes summary={summary} />
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ name, summary }: { name: string; summary: DashboardSummary }) {
  return (
    <>
      <DashboardWelcome
        description={`Welcome back, ${getFirstName(name)}! Here's the current SmartRent platform overview.`}
        title="Dashboard"
      />
      <StatsGrid stats={summary.stats} />
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.35fr_0.85fr]">
        <DashboardChartCard
          description="Current platform totals from MongoDB."
          title="Platform Overview"
        >
          <DashboardBarChart data={adminOverview(summary)} label="Admin platform overview" />
        </DashboardChartCard>
        <DashboardChartCard
          description="Operational activity from current issue and dispute records."
          title="Activity Volume"
        >
          <DashboardBarChart data={activityVolume(summary)} label="Admin activity volume" />
        </DashboardChartCard>
      </div>
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.35fr_0.85fr]">
        <RecentUsers summary={summary} />
        <div className="grid gap-6">
          <RecentIssues summary={summary} />
          <RecentDisputes summary={summary} />
        </div>
      </div>
    </>
  );
}

function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          href={item.href}
          icon={statIcons[item.icon]}
          iconClassName={item.iconTone ? iconToneClassNames[item.iconTone] : undefined}
          key={item.label}
          label={item.label}
          linkLabel={item.linkLabel}
          value={item.value}
        />
      ))}
    </div>
  );
}

function PortfolioCharts({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="mt-6 grid gap-6 2xl:grid-cols-[1.45fr_0.75fr]">
      <DashboardChartCard
        description="Recent issue volume based on current records."
        title="Issue Trend"
      >
        <DashboardLineChart data={issueTrend(summary)} label="Issue trend" />
      </DashboardChartCard>
      <DashboardChartCard
        description="Current open issues grouped by priority."
        title="Issue Priorities"
      >
        <DashboardBarChart data={issuePriorityVolume(summary)} label="Issue priority volume" />
      </DashboardChartCard>
    </div>
  );
}

function RecentIssues({ summary }: { summary: DashboardSummary }) {
  if (summary.recentIssues.length === 0) {
    return (
      <EmptyState
        description="Recent issue activity will appear here."
        icon={AlertCircle}
        title="No recent issues"
      />
    );
  }

  return (
    <DashboardCard title="Recent Issues">
      <DataTable
        columns={[
          { header: "Issue", render: (row) => <Link className="font-medium text-blue-700 hover:text-blue-800" href={row.href}>{row.issue}</Link> },
          { header: "Property", render: (row) => row.property },
          { header: "Priority", render: (row) => <IssuePriorityBadge priority={row.priority} /> },
          { header: "Status", render: (row) => <IssueStatusBadge status={row.status} /> },
          { header: "Reported On", render: (row) => row.reportedOn },
        ]}
        rows={summary.recentIssues}
        variant="embedded"
      />
    </DashboardCard>
  );
}

function RecentDisputes({ summary }: { summary: DashboardSummary }) {
  if (summary.recentDisputes.length === 0) {
    return (
      <EmptyState
        description="Recent dispute activity will appear here."
        icon={Scale}
        title="No recent disputes"
      />
    );
  }

  return (
    <DashboardCard title="Recent Disputes">
      <DataTable
        columns={[
          { header: "Dispute ID", render: (row) => <Link className="font-medium text-blue-700 hover:text-blue-800" href={row.href}>{row.disputeId}</Link> },
          { header: "Tenant", render: (row) => row.tenant },
          { header: "Property", render: (row) => row.property },
          { header: "Status", render: (row) => <DisputeStatusBadge status={row.status} /> },
          { header: "Updated On", render: (row) => row.updatedOn },
        ]}
        rows={summary.recentDisputes}
        variant="embedded"
      />
    </DashboardCard>
  );
}

function RecentMessages({ summary }: { summary: DashboardSummary }) {
  if (summary.recentMessages.length === 0) {
    return (
      <EmptyState
        description="Recent conversations will appear here."
        icon={MessageSquare}
        title="No recent messages"
      />
    );
  }

  return (
    <DashboardCard title="Recent Messages">
      <div className="grid gap-3 p-5">
        {summary.recentMessages.map((message) => (
          <Link
            className="block rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
            href={message.href}
            key={`${message.href}-${message.sender}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-950">{message.sender}</p>
              <p className="text-xs text-slate-500">{message.time}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{message.preview}</p>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}

function RecentUsers({ summary }: { summary: DashboardSummary }) {
  const users = summary.recentUsers ?? [];

  if (users.length === 0) {
    return (
      <EmptyState
        description="Recently registered users will appear here."
        icon={Users}
        title="No recent users"
      />
    );
  }

  return (
    <DashboardCard title="Recent Users">
      <DataTable
        columns={[
          { header: "Name", render: (row) => <span className="font-medium text-slate-950">{row.name}</span> },
          { header: "Email", render: (row) => row.email },
          { header: "Role", render: (row) => row.role },
        ]}
        rows={users}
        variant="embedded"
      />
    </DashboardCard>
  );
}

function MonthlyOverview({ summary }: { summary: DashboardSummary }) {
  const overview = summary.monthlyOverview;

  return (
    <DashboardCard title="Monthly Overview">
      <div className="grid gap-4 p-5">
        <OverviewMetric label="Expected Monthly Rent" value={formatCurrency(overview.expectedMonthlyRent)} />
        <OverviewMetric label="Issue Resolution Rate" value={`${overview.issueResolutionRate}%`} />
        <OverviewMetric label="Open Disputes" value={overview.openDisputes.toString()} />
      </div>
    </DashboardCard>
  );
}

function OverviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function UpcomingActivities({ summary }: { summary: DashboardSummary }) {
  return (
    <DashboardCard title="Upcoming Activities">
      <div className="grid gap-3 p-5">
        {summary.upcomingActivities.length > 0 ? (
          summary.upcomingActivities.map((activity) => (
            <ActivityItem
              date={activity.date}
              key={`${activity.title}-${activity.date}`}
              location={activity.location}
              time={activity.time}
              title={activity.title}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500">No upcoming activities are connected yet.</p>
        )}
      </div>
    </DashboardCard>
  );
}

function QuickActions() {
  return (
    <DashboardCard title="Quick Actions">
      <div className="grid gap-3 p-5 sm:grid-cols-2 2xl:grid-cols-1">
        <QuickActionButton href="/properties/new" icon={Plus} label="Add New Property" />
        <QuickActionButton href="/tenancies/new" icon={UserPlus} label="Add New Tenancy" />
        <QuickActionButton href="/issues/new" icon={Wrench} label="Create Issue" />
        <QuickActionButton href="/disputes/new" icon={Scale} label="Raise Dispute" />
        <QuickActionButton href="/messages" icon={Send} label="Send Message" />
        <QuickActionButton href="/reports" icon={FileText} label="Generate Report" />
      </div>
    </DashboardCard>
  );
}

function DashboardWelcome({ description, title }: { description: string; title: string }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <CalendarDays className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <div>
          <p className="text-xs font-medium text-slate-500">Today</p>
          <p className="text-sm font-semibold text-slate-950">
            {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date())}
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton({ name }: { name: string }) {
  return (
    <>
      <DashboardWelcome
        description={`Welcome back, ${getFirstName(name)}! Loading your dashboard data.`}
        title="Dashboard"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" key={index} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.45fr_0.75fr]">
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    </>
  );
}

function issueTrend(summary: DashboardSummary) {
  const grouped = new Map<string, number>();
  for (const issue of summary.recentIssues) {
    grouped.set(issue.reportedOn, (grouped.get(issue.reportedOn) ?? 0) + 1);
  }

  const entries = Array.from(grouped.entries()).slice(-6);
  return entries.length > 0
    ? entries.map(([label, value]) => ({ label, value }))
    : [{ label: "No data", value: 0 }];
}

function issuePriorityVolume(summary: DashboardSummary) {
  return [
    { label: "High", value: summary.recentIssues.filter((issue) => issue.priority === "high").length },
    { label: "Medium", value: summary.recentIssues.filter((issue) => issue.priority === "medium").length },
    { label: "Low", value: summary.recentIssues.filter((issue) => issue.priority === "low").length },
  ];
}

function adminOverview(summary: DashboardSummary) {
  return summary.stats.slice(0, 7).map((item) => ({
    label: item.label,
    value: Number(item.value),
  }));
}

function activityVolume(summary: DashboardSummary) {
  return [
    { label: "Recent issues", value: summary.recentIssues.length },
    { label: "Recent disputes", value: summary.recentDisputes.length },
    { label: "Recent messages", value: summary.recentMessages.length },
    { label: "Recent users", value: summary.recentUsers?.length ?? 0 },
  ];
}

function countOpenIssues(summary: DashboardSummary) {
  return summary.recentIssues.filter((issue) =>
    ["open", "in_progress", "awaiting_response"].includes(issue.status),
  ).length;
}

function countActiveDisputes(summary: DashboardSummary) {
  return summary.recentDisputes.filter((dispute) =>
    ["open", "under_review", "in_progress"].includes(dispute.status),
  ).length;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function getFirstName(name: string) {
  return name.split(" ").filter(Boolean)[0] ?? "there";
}
