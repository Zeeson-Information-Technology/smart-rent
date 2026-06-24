import type {
  IssueCategory,
  IssuePriority,
  IssueStatus,
  PropertyStatus,
  PropertyType,
} from "@/types/database";

export type IssuePropertySummary = {
  id: string;
  propertyName: string;
  address: string;
  city: string;
  postcode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
};

export type IssueTenancySummary = {
  id: string;
  tenantName: string;
  tenantEmail: string;
};

export type IssueRecord = {
  id: string;
  propertyId: string;
  tenancyId?: string | null;
  tenantId: string;
  landlordId: string;
  title: string;
  category: IssueCategory;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  property: IssuePropertySummary | null;
  tenancy: IssueTenancySummary | null;
  createdAt: string;
  updatedAt: string;
};

export type IssueFormValues = {
  propertyId: string;
  tenancyId: string;
  category: IssueCategory;
  title: string;
  description: string;
};
