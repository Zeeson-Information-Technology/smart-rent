import { AlertTriangle, CheckCircle2, FileText, Home, MessageSquare } from "lucide-react";

import { Badge, Card, CardContent, CardHeader } from "@/components/ui";

const metrics = [
  { label: "Properties", value: "42", tone: "text-blue-700" },
  { label: "Open issues", value: "18", tone: "text-amber-700" },
  { label: "Reports", value: "9", tone: "text-emerald-700" },
];

const activities = [
  { icon: AlertTriangle, label: "Damp report updated", meta: "Flat 8B" },
  { icon: MessageSquare, label: "Tenant message logged", meta: "Lease 204" },
  { icon: FileText, label: "Evidence bundle drafted", meta: "Case SR-118" },
];

export function DashboardPreview() {
  return (
    <Card className="w-full overflow-hidden border-blue-100 shadow-xl shadow-blue-950/10">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Home className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Portfolio command center
              </p>
              <h2 className="truncate text-lg font-semibold text-slate-950">
                Canary Wharf Homes
              </h2>
            </div>
          </div>
          <Badge className="shrink-0" variant="green">
            Live preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid gap-3 min-[520px]:grid-cols-3">
          {metrics.map((metric) => (
            <div className="rounded-xl border bg-white p-4" key={metric.label}>
              <p className={`text-2xl font-semibold ${metric.tone}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-950">Priority queue</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="mt-4 grid gap-3">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                  key={activity.label}
                >
                  <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {activity.label}
                    </p>
                    <p className="text-xs text-slate-500">{activity.meta}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
