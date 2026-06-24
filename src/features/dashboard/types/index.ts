import type { DisputeStatus, IssuePriority, IssueStatus, UserRole } from "@/types/database";

export type DashboardStat = {
  href?: string;
  icon: "alert" | "building" | "home" | "message" | "scale" | "user" | "users";
  iconTone?: "blue" | "emerald" | "orange" | "rose";
  label: string;
  linkLabel?: string;
  value: string;
};

export type DashboardRecentIssue = {
  href: string;
  issue: string;
  priority: IssuePriority;
  property: string;
  reportedOn: string;
  status: IssueStatus;
};

export type DashboardRecentDispute = {
  disputeId: string;
  href: string;
  property: string;
  status: DisputeStatus;
  tenant: string;
  updatedOn: string;
};

export type DashboardRecentMessage = {
  href: string;
  preview: string;
  sender: string;
  time: string;
};

export type DashboardRecentUser = {
  email: string;
  name: string;
  role: string;
};

export type DashboardMonthlyOverview = {
  activeTenancies: number;
  expectedMonthlyRent: number;
  issueResolutionRate: number;
  openDisputes: number;
  totalProperties: number;
};

export type DashboardUpcomingActivity = {
  date: string;
  location: string;
  time: string;
  title: string;
};

export type DashboardSummary = {
  monthlyOverview: DashboardMonthlyOverview;
  recentDisputes: DashboardRecentDispute[];
  recentIssues: DashboardRecentIssue[];
  recentMessages: DashboardRecentMessage[];
  recentUsers?: DashboardRecentUser[];
  role: UserRole;
  stats: DashboardStat[];
  upcomingActivities: DashboardUpcomingActivity[];
};
