import type { Metadata } from "next";
import {
  Archive,
  BarChart3,
  ClipboardCheck,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import {
  CtaSection,
  DashboardPreview,
  FeatureCard,
  Footer,
  PageHero,
  SectionWrapper,
} from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Badge, Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore SmartRent features for property records, issue documentation, messaging, reports, and dispute readiness.",
};

const featureGroups = [
  {
    icon: Home,
    title: "Property management",
    description:
      "Structure units, ownership details, contacts, and tenancy relationships in a clean workspace.",
  },
  {
    icon: Wrench,
    title: "Issue tracking",
    description:
      "Capture maintenance issues, updates, documentation status, and priority signals.",
  },
  {
    icon: ShieldCheck,
    title: "Dispute readiness",
    description:
      "Prepare organized timelines and evidence summaries for future dispute workflows.",
  },
  {
    icon: MessageSquare,
    title: "Messaging context",
    description:
      "Keep communication previews attached to the property and tenancy records they relate to.",
  },
  {
    icon: FileText,
    title: "Reports",
    description:
      "Preview structured reports that can later include records, evidence, issues, and messages.",
  },
  {
    icon: Archive,
    title: "Document organization",
    description:
      "Show how documents can be grouped by property, issue, tenancy, or report package.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            description="SmartRent brings property operations, issue documentation, communication context, and report previews together in a professional static frontend."
            eyebrow="Features"
            title="Designed around the property records teams actually need."
          >
            <DashboardPreview />
          </PageHero>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featureGroups.map((feature) => (
              <FeatureCard {...feature} key={feature.title} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
            <div>
              <Badge>Operational clarity</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                Static previews that map cleanly to future product modules.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The frontend structure is ready for later product screens
                without adding backend behavior to this marketing layer.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ClipboardCheck, label: "Structured intake" },
                { icon: BarChart3, label: "Portfolio visibility" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.label}>
                    <CardContent className="p-6">
                      <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      <h3 className="mt-5 text-lg font-semibold text-slate-950">
                        {item.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Built as responsive UI placeholders for future data-backed workflows.
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </SectionWrapper>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
