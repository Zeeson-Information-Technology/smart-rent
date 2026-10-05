import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  FileText,
  Gauge,
  Home,
  KeyRound,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UploadCloud,
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
      "Use structured records and portfolio analytics to support professional reviews.",
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

const prioritySignals = [
  { label: "Evidence attached", value: "3 files" },
  { label: "Tenant impact", value: "Active" },
  { label: "Case age", value: "2 days" },
];

const faqs = [
  {
    question: "What does SmartRent help teams document?",
    answer:
      "SmartRent organizes property records, tenancy context, issue reports, evidence uploads, messages, disputes, and notifications into role-aware workflows.",
  },
  {
    question: "Who is SmartRent designed for?",
    answer:
      "Landlords, property managers, and operations teams that need organized property and dispute documentation.",
  },
  {
    question: "Can the platform support evaluation and QA evidence?",
    answer:
      "Yes. The interface is designed around repeatable journeys and clear records so screenshots and test evidence can be captured consistently.",
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
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-2xl">
              <Badge variant="slate">Features</Badge>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950">
                Everything starts with clear documentation.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                SmartRent brings property context, issue records, messages, and
                evidence into a structured workspace designed for repeatable
                landlord and tenant workflows.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard {...feature} key={feature.title} />
              ))}
            </div>
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
                Smart prioritization helps property teams understand urgent
                issues, missing documentation, and records that need follow-up.
              </p>
              <div className="mt-6 grid gap-3">
                {prioritySignals.map((signal) => (
                  <div
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    key={signal.label}
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {signal.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-950">
                      {signal.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm shadow-blue-950/5 sm:p-6">
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
                        <Icon
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                        <p className="mt-5 text-sm text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {item.value}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4">
                <p className="text-sm font-semibold text-slate-950">
                  Recommended handling path
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {["Document", "Notify", "Resolve"].map((item, index) => (
                    <div
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                      key={item}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50" id="workflow">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="order-2 grid gap-3 lg:order-1">
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
            <div className="order-1 lg:order-2">
              <Badge variant="slate">How it works</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                A simple workflow for complex property records.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Each step creates an operating record that can later support
                issue resolution, evidence review, and dispute documentation.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Home, label: "Property" },
                  { icon: UploadCloud, label: "Evidence" },
                  { icon: FileText, label: "Report" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      className="rounded-xl border border-slate-200 bg-white p-4"
                      key={item.label}
                    >
                      <Icon
                        className="h-5 w-5 text-blue-600"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge>Benefits</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                Built for trust, speed, and accountability.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                A consistent record makes it easier to explain what happened,
                who responded, and which evidence supports the next action.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  className="flex items-start gap-3 rounded-xl border bg-white p-4"
                  key={benefit}
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                  <span className="font-medium leading-6 text-slate-800">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: KeyRound,
                    title: "Role access",
                    text: "Landlord, tenant, and admin views.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Evidence trail",
                    text: "Uploads, messages, and status history.",
                  },
                  {
                    icon: ClipboardCheck,
                    title: "Case review",
                    text: "Dispute-ready documentation.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      className="rounded-xl bg-slate-50 p-4"
                      key={item.title}
                    >
                      <Icon
                        className="h-5 w-5 text-blue-600"
                        aria-hidden="true"
                      />
                      <h3 className="mt-4 text-sm font-semibold text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <Badge variant="slate">Research ready</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                Designed to support evaluation, testing, and evidence capture.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The interface is structured around traceable user journeys so
                dissertation testing can capture clear screenshots and
                repeatable workflows across roles.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-white">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Badge>Product workspace</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                One workspace for day-to-day property operations.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Clear dashboards surface portfolio health, urgent issues,
                tenancy activity, messages, and disputes without unnecessary
                noise.
              </p>
            </div>
            <DashboardPreview />
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <Badge variant="slate">FAQ</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
                Questions about the SmartRent workflow.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Common context for reviewers, stakeholders, and early testers.
              </p>
            </div>
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-950">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </p>
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
