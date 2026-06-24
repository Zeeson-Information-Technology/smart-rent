import type { Metadata } from "next";
import { Cookie, Database, Mail, ShieldCheck, TimerReset, UserRound } from "lucide-react";

import { Footer, PageHero, SectionWrapper } from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "SmartRent privacy information covering data collection, user information, cookies, retention, and contact details.",
};

const privacySections = [
  {
    icon: Database,
    title: "Data collection",
    body: "SmartRent is designed to collect account, property, tenancy, issue, dispute, and communication records when product features are enabled. The current website uses static placeholder content only.",
  },
  {
    icon: UserRound,
    title: "User information",
    body: "User information may include names, email addresses, workspace details, property roles, and preferences needed to operate a property management workspace.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    body: "Cookies may be used for essential site behavior, security, session continuity, analytics, and preference storage when those services are connected.",
  },
  {
    icon: TimerReset,
    title: "Data retention",
    body: "Records should be retained only for as long as required for account operation, legal obligations, dispute documentation, and legitimate business purposes.",
  },
  {
    icon: Mail,
    title: "Contact information",
    body: "Privacy questions can be directed to SmartRent, 123 Canary Wharf, London, E14 5AB, United Kingdom or hello@smartrent.co.uk.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            description="How SmartRent approaches privacy, data collection, and responsible handling of property management records."
            eyebrow="Privacy"
            title="Privacy information for SmartRent users."
          >
            <Card className="bg-blue-600 text-white">
              <CardContent className="p-8">
                <ShieldCheck className="h-10 w-10 text-blue-100" aria-hidden="true" />
                <p className="mt-8 text-2xl font-semibold leading-snug">
                  Property records can contain sensitive context. SmartRent is
                  designed around clear data boundaries and transparent handling.
                </p>
              </CardContent>
            </Card>
          </PageHero>
        </SectionWrapper>
        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-4 md:grid-cols-2">
            {privacySections.map((section) => {
              const Icon = section.icon;

              return (
                <Card key={section.title}>
                  <CardContent className="p-6">
                    <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    <h2 className="mt-5 text-lg font-semibold text-slate-950">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {section.body}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
