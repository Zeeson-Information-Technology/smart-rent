import type { Metadata } from "next";
import { Cloud, KeyRound, LockKeyhole, MailWarning, ShieldCheck, UserCog } from "lucide-react";

import { Footer, PageHero, SectionWrapper } from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Security",
  description:
    "SmartRent security information covering data protection, encryption, authentication, cloud security, and responsible disclosure.",
};

const securitySections = [
  {
    icon: ShieldCheck,
    title: "Data protection",
    body: "SmartRent is designed to protect sensitive property, tenancy, issue, dispute, and communication records through clear access boundaries.",
  },
  {
    icon: LockKeyhole,
    title: "Encryption",
    body: "Production architecture should use encryption in transit and at rest through trusted infrastructure, database, and storage providers.",
  },
  {
    icon: UserCog,
    title: "Authentication",
    body: "Authentication is planned as a dedicated access layer with session management and role-aware workspace controls. It is not connected in the current static UI.",
  },
  {
    icon: Cloud,
    title: "Cloud security",
    body: "Cloud infrastructure should follow least-privilege access, environment variable controls, audit logging, and secure deployment practices.",
  },
  {
    icon: MailWarning,
    title: "Responsible disclosure",
    body: "Security concerns can be reported to hello@smartrent.co.uk with enough detail for review and responsible remediation.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            description="A summary of SmartRent security principles for protecting property documentation and workspace access."
            eyebrow="Security"
            title="Security built around trustworthy property records."
          >
            <Card className="bg-blue-600 text-white">
              <CardContent className="p-8">
                <KeyRound className="h-10 w-10 text-blue-100" aria-hidden="true" />
                <p className="mt-8 text-2xl font-semibold leading-snug">
                  SmartRent security planning focuses on data protection,
                  authentication, cloud controls, and responsible disclosure.
                </p>
              </CardContent>
            </Card>
          </PageHero>
        </SectionWrapper>
        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-4 md:grid-cols-2">
            {securitySections.map((section) => {
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
