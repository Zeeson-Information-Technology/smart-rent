import type { Metadata } from "next";
import { Building2, CheckCircle2, Compass, ShieldCheck, Users } from "lucide-react";

import {
  CtaSection,
  Footer,
  PageHero,
  SectionWrapper,
} from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Badge, Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SmartRent, a PropTech platform concept for clearer property management and dispute documentation.",
};

const principles = [
  {
    icon: ShieldCheck,
    title: "Trustworthy records",
    description:
      "Property teams need records that are easy to review, share, and understand.",
  },
  {
    icon: Compass,
    title: "Operational focus",
    description:
      "The interface prioritizes practical workflows over decorative complexity.",
  },
  {
    icon: Users,
    title: "Built for collaboration",
    description:
      "Landlords, tenants, and teams benefit from clearer information boundaries.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            description="SmartRent is being shaped as a modern SaaS platform for landlords and property teams that need cleaner records, better issue visibility, and more professional documentation."
            eyebrow="About SmartRent"
            title="A PropTech foundation for clearer property operations."
          >
            <Card className="bg-slate-950 text-white">
              <CardContent className="p-8">
                <Building2 className="h-10 w-10 text-blue-300" aria-hidden="true" />
                <p className="mt-8 text-2xl font-semibold leading-snug">
                  We believe property management software should make evidence,
                  decisions, and communication easier to understand.
                </p>
              </CardContent>
            </Card>
          </PageHero>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <Card key={principle.title}>
                  <CardContent className="p-6">
                    <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    <h2 className="mt-5 text-lg font-semibold text-slate-950">
                      {principle.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="mx-auto max-w-3xl">
            <Badge>Mission</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
              Make every property record easier to defend, explain, and act on.
            </h2>
            <div className="mt-8 grid gap-3">
              {[
                "Reduce scattered property documentation",
                "Create calm, professional tools for repeated operations",
                "Prepare a clean UI foundation for future product development",
              ].map((item) => (
                <div className="flex items-center gap-3 rounded-xl border bg-white p-4" key={item}>
                  <CheckCircle2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
