import { Badge } from "@/components/ui";
import type { PropertyType } from "@/types/database";

type PropertyTypeBadgeProps = {
  propertyType: PropertyType;
};

export function PropertyTypeBadge({ propertyType }: PropertyTypeBadgeProps) {
  return (
    <Badge className="bg-blue-50 text-blue-700 ring-blue-100" variant="blue">
      {propertyType}
    </Badge>
  );
}
