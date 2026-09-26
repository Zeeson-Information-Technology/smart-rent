import type { PropertyStatus, PropertyType } from "@/types/database";

export type PropertyRecord = {
  id: string;
  landlordId: string;
  propertyName: string;
  address: string;
  city: string;
  postcode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  description: string;
  bedroomCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PropertyFormValues = {
  landlordId?: string;
  propertyName: string;
  address: string;
  city: string;
  postcode: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  description: string;
  bedroomCount: string;
};
