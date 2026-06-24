import type { Metadata } from "next";
import { AlertTriangle, Ban, FileText, Scale, ShieldAlert, UserCheck } from "lucide-react";

import { Footer, PageHero, SectionWrapper } from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "SmartRent terms covering acceptable use, user responsibilities, platform limitations, liability, and account termination.",
};

const termsSections = [
  {
    icon: UserCheck,
    title: "Acceptable use",
    body: "Users should use SmartRent for lawful property management, documentation, communication, and reporting purposes only.",
  },
  {
    icon: FileText,
    title: "User responsibilities",
    body: "Users are responsible for entering accurate information, respecting tenant privacy, maintaining account access, and complying with applicable laws.",
  },
  {
    icon: AlertTriangle,
    title: "Platform limitations",
    body: "SmartRent may provide workflow support and record organization, but it does not replace legal, financial, insurance, or professional property advice.",
  },
  {
    icon: Scale,
    title: "Liability disclaimer",
    body: "To the fullest extent permitted by law, SmartRent is not liable for indirect losses, incomplete user records, or decisions made from placeholder or user-provided information.",
  },
  {
    icon: Ban,
    title: "Account termination",
    body: "Access may be suspended or terminated for misuse, unlawful conduct, security concerns, or violation of platform terms once account systems are enabled.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            description="The operating expectations and platform boundaries for SmartRent users and workspaces."
            eyebrow="Terms"
            title="Terms for responsible SmartRent use."
          >
            <Card className="bg-slate-950 text-white">
              <CardContent className="p-8">
                <ShieldAlert className="h-10 w-10 text-blue-300" aria-hidden="true" />
                <p className="mt-8 text-2xl font-semibold leading-snug">
                  SmartRent is a documentation and property operations platform,
                  not a substitute for professional advice.
                </p>
              </CardContent>
            </Card>
          </PageHero>
        </SectionWrapper>
        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-4 md:grid-cols-2">
            {termsSections.map((section) => {
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
