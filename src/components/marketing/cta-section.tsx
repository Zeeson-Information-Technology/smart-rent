import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";

export function CtaSection() {
  return (
    <section className="bg-blue-600 py-16 text-white sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
            SmartRent for modern property teams
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-normal sm:text-4xl">
            Bring property records, issues, messaging, and reports into one clear workspace.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register">
            <Button className="bg-white text-blue-700 hover:bg-blue-50" size="lg">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="border-white/40 bg-transparent text-white hover:bg-white/10" size="lg" variant="outline">
              Contact sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
