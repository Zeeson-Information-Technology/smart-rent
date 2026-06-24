import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { Footer, PageHero, SectionWrapper } from "@/components/marketing";
import { PublicNavbar } from "@/components/navigation";
import { Badge, Button, Card, CardContent, CardHeader, Input } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SmartRent for product questions, sales conversations, and partnership enquiries.",
};

const contactItems = [
  {
    icon: MapPin,
    title: "Office",
    lines: ["SmartRent", "123 Canary Wharf", "London", "E14 5AB", "United Kingdom"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@smartrent.example"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+44 20 0000 0000"],
  },
];

export default function ContactPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <SectionWrapper className="border-b bg-white py-0">
          <PageHero
            description="Speak with the SmartRent team about property documentation, issue workflows, reporting needs, or future platform use cases."
            eyebrow="Contact"
            title="Let's talk about clearer property operations."
          >
            <Card>
              <CardHeader>
                <Badge>Contact details</Badge>
                <h2 className="mt-4 text-2xl font-semibold tracking-normal text-slate-950">
                  SmartRent
                </h2>
              </CardHeader>
              <CardContent className="grid gap-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div className="flex gap-3 rounded-xl border bg-slate-50 p-4" key={item.title}>
                      <Icon className="mt-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                      <div>
                        <p className="font-medium text-slate-950">{item.title}</p>
                        <div className="mt-1 text-sm leading-6 text-slate-600">
                          {item.lines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </PageHero>
        </SectionWrapper>

        <SectionWrapper className="bg-slate-50">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
                  Send a message
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This static form is a frontend placeholder and does not submit data yet.
                </p>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <Input label="Name" name="name" placeholder="Alex Morgan" type="text" />
                  <Input label="Email" name="email" placeholder="you@example.com" type="email" />
                  <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="message">
                    Message
                    <textarea
                      className="min-h-32 rounded-lg border bg-white px-3 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
                      id="message"
                      name="message"
                      placeholder="Tell us what you would like to discuss"
                    />
                  </label>
                  <Button className="w-full sm:w-fit" type="button">
                    Send message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
