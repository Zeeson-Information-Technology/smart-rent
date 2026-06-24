import { Building2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/security", label: "Security" },
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link className="flex items-center gap-2 font-semibold text-slate-950" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>SmartRent</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link className="transition-colors hover:text-slate-950" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link className="hidden sm:block" href="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
