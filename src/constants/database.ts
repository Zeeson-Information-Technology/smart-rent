export const USER_ROLES = ["admin", "landlord", "tenant"] as const;

export const ISSUE_STATUSES = [
  "open",
  "in_progress",
  "awaiting_response",
  "resolved",
  "closed",
] as const;

export const ISSUE_PRIORITIES = ["high", "medium", "low"] as const;

export const ISSUE_CATEGORIES = [
  "Water Leak",
  "Electrical Fault",
  "Heating Failure",
  "Security Issue",
  "Noise Complaint",
  "Appliance Fault",
  "General Maintenance",
  "Cosmetic Repair",
] as const;

export const DISPUTE_STATUSES = [
  "open",
  "under_review",
  "in_progress",
  "resolved",
  "closed",
] as const;

export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Studio",
  "Shared Accommodation",
  "Commercial",
] as const;

export const PROPERTY_STATUSES = ["active", "inactive", "maintenance"] as const;

export const TENANCY_STATUSES = [
  "active",
  "pending",
  "ended",
  "cancelled",
] as const;

export const INVENTORY_CONDITIONS = ["new", "good", "fair", "poor"] as const;

export const RENT_PAYMENT_STATUSES = [
  "pending",
  "partial",
  "paid",
  "overdue",
] as const;

export const EVIDENCE_TYPES = ["image", "pdf"] as const;

export const MESSAGE_STATUSES = ["sent", "delivered", "read"] as const;

export const NOTIFICATION_TYPES = [
  "issue_created",
  "issue_status_updated",
  "evidence_uploaded",
  "message_received",
  "dispute_created",
  "dispute_status_updated",
  "tenancy_created",
  "property_created",
] as const;

export const NOTIFICATION_RELATED_ENTITY_TYPES = [
  "property",
  "tenancy",
  "issue",
  "evidence",
  "message",
  "dispute",
] as const;
