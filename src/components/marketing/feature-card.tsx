import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui";

type FeatureCardProps = {
  description: string;
  icon: LucideIcon;
  title: string;
};

export function FeatureCard({ description, icon: Icon, title }: FeatureCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-normal text-slate-950">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
