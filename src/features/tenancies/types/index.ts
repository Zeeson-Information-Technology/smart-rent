import type {
  PropertyStatus,
  PropertyType,
  TenancyStatus,
} from "@/types/database";

export type TenancyPropertySummary = {
  id: string;
  propertyName: string;
  address: string;
  city: string;
  postcode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
};

export type TenancyRecord = {
  id: string;
  propertyId: string;
  landlordId: string;
  tenantId?: string | null;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  additionalTenants: Array<{
    tenantId?: string | null;
    name: string;
    email: string;
    phone: string;
  }>;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  depositAmount: number;
  status: TenancyStatus;
  property: TenancyPropertySummary | null;
  createdAt: string;
  updatedAt: string;
};

export type TenancyFormValues = {
  propertyId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  additionalTenants: Array<{ name: string; email: string; phone: string }>;
  startDate: string;
  endDate: string;
  rentAmount: string;
  depositAmount: string;
  status: TenancyStatus;
};
