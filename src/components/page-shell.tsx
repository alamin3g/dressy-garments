import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { AutoReveal, Reveal } from "./reveal";
import { usePageContent, renderRichText } from "@/lib/page-content";

export function PageShell({
  eyebrow,
  title,
  intro,
  path,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  path?: string;
  children: ReactNode;
}) {
  const c = usePageContent(path ?? "");
  const eyebrowText = path ? c("hero_eyebrow", eyebrow) : eyebrow;
  const introText = path ? c("hero_intro", intro) : intro;
  const titleNode = path ? renderRichText(c("hero_title"), title) : title;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 pb-14 pt-6 md:px-10">
          <p className="label-xs animate-fade-up text-primary">{eyebrowText}</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <h1
              className="display animate-fade-up text-5xl leading-[0.95] sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "90ms" }}
            >
              {titleNode}
            </h1>
            <p
              className="max-w-md animate-fade-up self-end font-sans text-sm leading-relaxed text-muted-foreground"
              style={{ animationDelay: "180ms" }}
            >
              {introText}
            </p>
          </div>
        </div>
      </section>


      <AutoReveal skipFirst={false}>{children}</AutoReveal>

      <Reveal as="section" variant="fade" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-8 px-6 py-14 md:px-10">
          <h2 className="display text-4xl md:text-5xl">Connect With Us</h2>
          <Link
            to="/contact"
            className="label-xs btn-sheen group flex items-center gap-6 bg-background px-6 py-4 text-foreground"
          >
            Start a Project
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <SiteFooter />
    </div>
  );
}
