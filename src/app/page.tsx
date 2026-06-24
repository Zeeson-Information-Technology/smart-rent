import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  Home,
  MessageSquare,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import {
  CtaSection,
  DashboardPreview,
  FeatureCard,
  Footer,
  PageHero,
  SectionWrapper,
} from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Badge, Button, Card, CardContent } from "@/components/ui";

const features = [
  {
    icon: Home,
    title: "Portfolio records",
    description:
      "Keep property, tenancy, and document context organized across your portfolio.",
  },
  {
    icon: Wrench,
    title: "Issue documentation",
    description:
      "Capture maintenance issues, photos, notes, updates, and resolution context.",
  },
  {
    icon: MessageSquare,
    title: "Communication history",
    description:
      "Connect conversations to properties, tenancies, issues, and dispute timelines.",
  },
  {
    icon: FileText,
    title: "Report preparation",
    description:
      "Turn structured records into professional report previews for review.",
  },
];

const steps = [
  "Add properties, contacts, and tenancy context",
  "Document issues, updates, evidence, and messages",
  "Review prioritized items and prepare report-ready records",
];

const benefits = [
  "Clear audit trail for property decisions",
  "Less manual chasing across inboxes and folders",
  "Professional records for owners, tenants, and teams",
  "Responsive workspace for desktop and mobile workflows",
];

const faqs = [
  {
    question: "Is SmartRent connected to live services yet?",
    answer:
      "No. This marketing website is static and does not connect authentication, database, storage, or backend services.",
  },
  {
    question: "Who is SmartRent designed for?",
    answer:
      "Landlords, property managers, and operations teams that need organized property and dispute documentation.",
  },
  {
    question: "Can the UI support a dashboard later?",
    answer:
      "Yes. The components are structured so dashboard pages and product workflows can be added without replacing the marketing foundation.",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            actions={
              <>
                <Link href="/register">
                  <Button size="lg">
                    Get started
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline">
                    Explore features
                  </Button>
                </Link>
              </>
            }
            description="SmartRent gives property teams a clean place to document issues, centralize property records, and prepare dispute-ready reports without operational clutter."
            eyebrow="Modern PropTech documentation"
            title="Smarter property records for landlords and teams."
          >
            <DashboardPreview />
          </PageHero>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50" id="features">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge variant="slate">Features</Badge>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950">
                Everything starts with clear documentation.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              The public UI previews the product direction with static content,
              accessible components, and responsive layouts.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard {...feature} key={feature.title} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge>Smart prioritization</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                Surface the work that needs attention first.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Prioritization previews help property teams understand urgent
                issues, missing documentation, and records that need follow-up.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Gauge, label: "Risk score", value: "High" },
                { icon: Clock3, label: "SLA window", value: "24h" },
                { icon: Sparkles, label: "Next action", value: "Review" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.label}>
                    <CardContent className="p-5">
                      <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      <p className="mt-5 text-sm text-slate-500">{item.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">
                        {item.value}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50" id="workflow">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <Badge variant="slate">How it works</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                A simple workflow for complex property records.
              </h2>
            </div>
            <div className="grid gap-3">
              {steps.map((step, index) => (
                <div
                  className="flex gap-4 rounded-xl border bg-white p-5 shadow-sm"
                  key={step}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 font-medium text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge>Benefits</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                Built for trust, speed, and accountability.
              </h2>
            </div>
            <div className="grid gap-3">
              {benefits.map((benefit) => (
                <div className="flex items-center gap-3 rounded-xl border bg-white p-4" key={benefit}>
                  <CheckCircle2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="font-medium text-slate-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="slate">Product preview</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                A dashboard foundation ready for future product screens.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Placeholder dashboard mockups show the product&apos;s information
                density, hierarchy, and professional SaaS feel.
              </p>
            </div>
            <DashboardPreview />
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="mx-auto max-w-3xl">
            <Badge>FAQ</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
              Questions before the product backend is connected.
            </h2>
            <div className="mt-8 grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                  </CardContent>
                </Card>
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
