import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  ConversationModel,
  DisputeModel,
  IssueModel,
  MessageModel,
  PropertyModel,
  TenancyModel,
  UserModel,
} from "@/database/models";
import type {
  DashboardRecentDispute,
  DashboardRecentIssue,
  DashboardRecentMessage,
  DashboardRecentUser,
  DashboardStat,
  DashboardSummary,
  DashboardUpcomingActivity,
} from "@/features/dashboard/types";
import { connectMongoDB } from "@/lib/mongodb";
import type { UserRole } from "@/types/database";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }

  await connectMongoDB();

  const summary = await getDashboardSummary({
    email: session.user.email,
    id: session.user.id,
    role: session.user.role,
  });

  return NextResponse.json(summary);
}

type DashboardUser = {
  email: string;
  id: string;
  role: UserRole;
};

async function getDashboardSummary(user: DashboardUser): Promise<DashboardSummary> {
  if (user.role === "admin") {
    return getAdminSummary(user);
  }

  if (user.role === "tenant") {
    return getTenantSummary(user);
  }

  return getLandlordSummary(user);
}

async function getLandlordSummary(user: DashboardUser): Promise<DashboardSummary> {
  const issueQuery = { landlordId: user.id };
  const disputeQuery = { landlordId: user.id };
  const tenancyQuery = { landlordId: user.id };

  const [
    totalProperties,
    activeTenancies,
    openIssues,
    activeDisputes,
    unreadMessages,
    expectedRentRows,
    issueTotals,
    recentIssues,
    recentDisputes,
    recentMessages,
  ] = await Promise.all([
    PropertyModel.countDocuments({ landlordId: user.id }),
    TenancyModel.countDocuments({ ...tenancyQuery, status: "active" }),
    IssueModel.countDocuments({ ...issueQuery, status: { $in: openIssueStatuses } }),
    DisputeModel.countDocuments({ ...disputeQuery, status: { $in: activeDisputeStatuses } }),
    MessageModel.countDocuments({ receiverId: user.id, isRead: false }),
    TenancyModel.find({ ...tenancyQuery, status: "active" }).select("rentAmount"),
    getIssueResolutionCounts(issueQuery),
    getRecentIssues(issueQuery),
    getRecentDisputes(disputeQuery),
    getRecentMessages(user.id, user.role),
  ]);

  return {
    role: "landlord",
    stats: [
      stat("Total Properties", totalProperties, "building", "/properties", "View all properties", "blue"),
      stat("Active Tenancies", activeTenancies, "users", "/tenancies", "View all tenancies", "emerald"),
      stat("Open Issues", openIssues, "alert", "/issues", "View all issues", "orange"),
      stat("Active Disputes", activeDisputes, "scale", "/disputes", "View all disputes", "rose"),
      stat("Unread Messages", unreadMessages, "message", "/messages", "Open messages", "emerald"),
    ],
    recentIssues,
    recentDisputes,
    recentMessages,
    monthlyOverview: {
      activeTenancies,
      expectedMonthlyRent: sumRent(expectedRentRows),
      issueResolutionRate: calculateResolutionRate(issueTotals.total, issueTotals.resolved),
      openDisputes: activeDisputes,
      totalProperties,
    },
    upcomingActivities: defaultUpcomingActivities,
  };
}

async function getTenantSummary(user: DashboardUser): Promise<DashboardSummary> {
  const tenantTenancyQuery = {
    $or: [{ tenantId: user.id }, { tenantEmail: user.email.toLowerCase() }],
  };
  const tenancies = await TenancyModel.find(tenantTenancyQuery).select("_id propertyId status rentAmount");
  const tenancyIds = tenancies.map((tenancy) => tenancy._id.toString());
  const propertyIds = tenancies.map((tenancy) => tenancy.propertyId);
  const issueQuery = { $or: [{ tenantId: user.id }, { tenancyId: { $in: tenancyIds } }] };
  const disputeQuery = { tenantId: user.id };

  const [
    activeTenancy,
    openIssues,
    activeDisputes,
    unreadMessages,
    issueTotals,
    recentIssues,
    recentDisputes,
    recentMessages,
  ] = await Promise.all([
    TenancyModel.countDocuments({ ...tenantTenancyQuery, status: "active" }),
    IssueModel.countDocuments({ ...issueQuery, status: { $in: openIssueStatuses } }),
    DisputeModel.countDocuments({ ...disputeQuery, status: { $in: activeDisputeStatuses } }),
    MessageModel.countDocuments({ receiverId: user.id, isRead: false }),
    getIssueResolutionCounts(issueQuery),
    getRecentIssues(issueQuery),
    getRecentDisputes(disputeQuery),
    getRecentMessages(user.id, user.role),
  ]);

  return {
    role: "tenant",
    stats: [
      stat("Active Tenancy", activeTenancy, "home", "/my-tenancy", "View tenancy", "blue"),
      stat("Open Issues", openIssues, "alert", "/issues", "View issues", "orange"),
      stat("Active Disputes", activeDisputes, "scale", "/disputes", "View disputes", "rose"),
      stat("Unread Messages", unreadMessages, "message", "/messages", "Open messages", "emerald"),
    ],
    recentIssues,
    recentDisputes,
    recentMessages,
    monthlyOverview: {
      activeTenancies: activeTenancy,
      expectedMonthlyRent: sumRent(tenancies),
      issueResolutionRate: calculateResolutionRate(issueTotals.total, issueTotals.resolved),
      openDisputes: activeDisputes,
      totalProperties: new Set(propertyIds).size,
    },
    upcomingActivities: [],
  };
}

async function getAdminSummary(user: DashboardUser): Promise<DashboardSummary> {
  const [
    totalUsers,
    totalLandlords,
    totalTenants,
    totalProperties,
    totalTenancies,
    totalIssues,
    totalDisputes,
    recentUsers,
    recentIssues,
    recentDisputes,
    recentMessages,
  ] = await Promise.all([
    UserModel.countDocuments({}),
    UserModel.countDocuments({ role: "landlord" }),
    UserModel.countDocuments({ role: "tenant" }),
    PropertyModel.countDocuments({}),
    TenancyModel.countDocuments({}),
    IssueModel.countDocuments({}),
    DisputeModel.countDocuments({}),
    getRecentUsers(),
    getRecentIssues({}),
    getRecentDisputes({}),
    getRecentMessages(user.id, user.role),
  ]);

  return {
    role: "admin",
    stats: [
      stat("Total Users", totalUsers, "users", "/users", "View users", "blue"),
      stat("Landlords", totalLandlords, "user", "/users", "View landlords", "emerald"),
      stat("Tenants", totalTenants, "user", "/users", "View tenants", "orange"),
      stat("Properties", totalProperties, "building", "/properties", "View properties", "rose"),
      stat("Tenancies", totalTenancies, "home", "/tenancies", "View tenancies", "emerald"),
      stat("Issues", totalIssues, "alert", "/issues", "View issues", "orange"),
      stat("Disputes", totalDisputes, "scale", "/disputes", "View disputes", "rose"),
    ],
    recentIssues,
    recentDisputes,
    recentMessages,
    recentUsers,
    monthlyOverview: {
      activeTenancies: totalTenancies,
      expectedMonthlyRent: 0,
      issueResolutionRate: 0,
      openDisputes: totalDisputes,
      totalProperties,
    },
    upcomingActivities: [],
  };
}

const openIssueStatuses = ["open", "in_progress", "awaiting_response"];
const activeDisputeStatuses = ["open", "under_review", "in_progress"];

const defaultUpcomingActivities: DashboardUpcomingActivity[] = [
  {
    date: "Pending",
    location: "SmartRent calendar",
    time: "TBC",
    title: "Appointments model not connected yet",
  },
];

function stat(
  label: string,
  value: number,
  icon: DashboardStat["icon"],
  href?: string,
  linkLabel?: string,
  iconTone?: DashboardStat["iconTone"],
): DashboardStat {
  return {
    href,
    icon,
    iconTone,
    label,
    linkLabel,
    value: value.toString(),
  };
}

async function getIssueResolutionCounts(query: object) {
  const [total, resolved] = await Promise.all([
    IssueModel.countDocuments(query),
    IssueModel.countDocuments({ ...query, status: { $in: ["resolved", "closed"] } }),
  ]);

  return { resolved, total };
}

async function getRecentIssues(query: object): Promise<DashboardRecentIssue[]> {
  const issues = await IssueModel.find(query).sort({ createdAt: -1 }).limit(5);
  const propertyIds = [...new Set(issues.map((issue) => issue.propertyId))];
  const properties = await PropertyModel.find({ _id: { $in: propertyIds } });
  const propertiesById = new Map(
    properties.map((property) => [property._id.toString(), property.propertyName]),
  );

  return issues.map((issue) => ({
    href: `/issues/${issue._id.toString()}`,
    issue: issue.title,
    priority: issue.priority,
    property: propertiesById.get(issue.propertyId) ?? "Property unavailable",
    reportedOn: formatDate(issue.createdAt),
    status: issue.status,
  }));
}

async function getRecentDisputes(query: object): Promise<DashboardRecentDispute[]> {
  const disputes = await DisputeModel.find(query).sort({ updatedAt: -1 }).limit(5);
  const propertyIds = [...new Set(disputes.map((dispute) => dispute.propertyId))];
  const tenantIds = [...new Set(disputes.map((dispute) => dispute.tenantId))];
  const [properties, tenants] = await Promise.all([
    PropertyModel.find({ _id: { $in: propertyIds } }),
    UserModel.find({ _id: { $in: tenantIds } }),
  ]);
  const propertiesById = new Map(
    properties.map((property) => [property._id.toString(), property.propertyName]),
  );
  const tenantsById = new Map(
    tenants.map((tenant) => [tenant._id.toString(), tenant.name]),
  );

  return disputes.map((dispute) => ({
    disputeId: dispute.disputeReference,
    href: `/disputes/${dispute._id.toString()}`,
    property: propertiesById.get(dispute.propertyId) ?? "Property unavailable",
    status: dispute.status,
    tenant: tenantsById.get(dispute.tenantId) ?? "Tenant",
    updatedOn: formatDate(dispute.updatedAt),
  }));
}

async function getRecentMessages(userId: string, role: UserRole): Promise<DashboardRecentMessage[]> {
  const query = role === "admin" ? {} : { participants: userId };
  const conversations = await ConversationModel.find(query).sort({ lastMessageAt: -1 }).limit(5);
  const otherUserIds = conversations.flatMap((conversation) =>
    conversation.participants.filter((participant) => participant !== userId),
  );
  const users = await UserModel.find({ _id: { $in: otherUserIds } });
  const usersById = new Map(users.map((user) => [user._id.toString(), user.name]));

  return conversations.map((conversation) => {
    const otherParticipant = conversation.participants.find(
      (participant) => participant !== userId,
    );

    return {
      href: `/messages/${conversation._id.toString()}`,
      preview: conversation.lastMessage,
      sender: otherParticipant
        ? usersById.get(otherParticipant) ?? "SmartRent user"
        : "SmartRent conversation",
      time: formatDate(conversation.lastMessageAt),
    };
  });
}

async function getRecentUsers(): Promise<DashboardRecentUser[]> {
  const users = await UserModel.find({}).sort({ createdAt: -1 }).limit(5);

  return users.map((user) => ({
    email: user.email,
    name: user.name,
    role: user.role,
  }));
}

function calculateResolutionRate(total: number, resolved: number) {
  if (total === 0) return 0;
  return Math.round((resolved / total) * 100);
}

function sumRent(rows: Array<{ rentAmount: number }>) {
  return rows.reduce((total, row) => total + row.rentAmount, 0);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}
