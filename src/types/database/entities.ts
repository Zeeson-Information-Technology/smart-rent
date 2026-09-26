import type {
  DISPUTE_STATUSES,
  EVIDENCE_TYPES,
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  MESSAGE_STATUSES,
  NOTIFICATION_RELATED_ENTITY_TYPES,
  NOTIFICATION_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  TENANCY_STATUSES,
  INVENTORY_CONDITIONS,
  RENT_PAYMENT_STATUSES,
  USER_ROLES,
} from "@/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];
export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];
export type TenancyStatus = (typeof TENANCY_STATUSES)[number];
export type InventoryCondition = (typeof INVENTORY_CONDITIONS)[number];
export type RentPaymentStatus = (typeof RENT_PAYMENT_STATUSES)[number];
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type NotificationRelatedEntityType =
  (typeof NOTIFICATION_RELATED_ENTITY_TYPES)[number];

export type TimestampFields = {
  createdAt: Date;
  updatedAt: Date;
};

export type BaseEntity = TimestampFields & {
  id: string;
};

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  imageUrl?: string;
}

export interface Property extends BaseEntity {
  landlordId: string;
  propertyName: string;
  address: string;
  city: string;
  postcode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  description?: string;
  bedroomCount: number;
}

export interface TenancyTenant {
  tenantId?: string | null;
  name: string;
  email: string;
  phone: string;
}

export interface Tenancy extends BaseEntity {
  propertyId: string;
  landlordId: string;
  tenantId?: string | null;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  additionalTenants: TenancyTenant[];
  startDate: Date;
  endDate?: Date;
  rentAmount: number;
  status: TenancyStatus;
}

export interface InventoryItem extends BaseEntity {
  propertyId: string;
  landlordId: string;
  name: string;
  category: string;
  condition: InventoryCondition;
  quantity: number;
  notes?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
}

export interface RentPayment extends BaseEntity {
  tenancyId: string;
  landlordId: string;
  dueDate: Date;
  amountDue: number;
  amountPaid: number;
  status: RentPaymentStatus;
  paidAt?: Date;
  notes?: string;
}

export interface Issue extends BaseEntity {
  propertyId: string;
  tenancyId?: string;
  tenantId: string;
  landlordId: string;
  title: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
}

export interface Evidence extends BaseEntity {
  uploadedBy: string;
  issueId?: string;
  disputeId?: string;
  fileName: string;
  fileUrl: string;
  fileType: EvidenceType;
  cloudinaryPublicId: string;
}

export interface Message extends BaseEntity {
  conversationId: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  tenancyId?: string;
  issueId?: string;
  subject: string;
  message: string;
  isRead: boolean;
}

export interface Conversation extends BaseEntity {
  participants: string[];
  issueId?: string;
  tenancyId?: string;
  propertyId?: string;
  subject: string;
  lastMessage: string;
  lastMessageAt: Date;
}

export interface Dispute extends BaseEntity {
  disputeReference: string;
  propertyId: string;
  tenancyId?: string;
  issueId?: string;
  landlordId: string;
  tenantId: string;
  raisedBy: string;
  title: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  priority: IssuePriority;
  resolutionNotes?: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedEntityType?: NotificationRelatedEntityType;
  relatedEntityId?: string;
  isRead: boolean;
}

export interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  message: string;
  status: "new" | "reviewed";
}
