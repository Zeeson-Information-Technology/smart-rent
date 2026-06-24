import { Globe, Mail, MapPin, Phone, Rss, Share2 } from "lucide-react";
import Link from "next/link";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/security", label: "Security" },
];

const socialLinks = [
  { href: "#", label: "LinkedIn", icon: Share2 },
  { href: "#", label: "Twitter", icon: Rss },
  { href: "#", label: "Facebook", icon: Globe },
];

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link className="text-lg font-semibold text-slate-950" href="/">
            SmartRent
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            SmartRent helps property teams document issues, manage records, and prepare professional dispute-ready reports.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  href={link.href}
                  key={link.label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>

        <FooterColumn links={companyLinks} title="Company" />
        <FooterColumn links={legalLinks} title="Legal" />

        <div>
          <h2 className="text-sm font-semibold text-slate-950">Contact</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p className="flex gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              <span>
                SmartRent
                <br />
                123 Canary Wharf
                <br />
                London
                <br />
                E14 5AB
                <br />
                United Kingdom
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
              hello@smartrent.example
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" aria-hidden="true" />
              +44 20 0000 0000
            </p>
          </div>
        </div>
      </div>
      <div className="border-t py-5">
        <div className="mx-auto w-full max-w-7xl px-4 text-sm text-slate-500 sm:px-6 lg:px-8">
          (c) 2026 SmartRent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  links: Array<{ href: string; label: string }>;
  title: string;
};

function FooterColumn({ links, title }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        {links.map((link) => (
          <li key={link.label}>
            <Link className="transition-colors hover:text-blue-700" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
