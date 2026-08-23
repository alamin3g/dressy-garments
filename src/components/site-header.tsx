import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";

export const NAV = [
  { label: "Capabilities", to: "/capabilities" },
  { label: "Products", to: "/products" },
  { label: "Factory", to: "/factory" },
  { label: "Compliance", to: "/compliance" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Logo({ className = "", scrolled = false }: { className?: string; scrolled?: boolean }) {
  return (
    <Link to="/" aria-label="Dressy home" className="group inline-flex items-center">
      <img
        src="/dressy-logo.png"
        alt="Dressy Logo"
        className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
          scrolled ? "h-6 sm:h-7" : "h-7 sm:h-8"
        } ${className}`}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 transition-all duration-500 md:px-8">
      {/* Main Sticky Liquid Glass Navbar */}
      <div
        className={`relative mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-[1050px] mt-3 sm:mt-2 h-12 rounded-full border border-white/15 bg-background/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl px-6"
            : isHome
            ? "max-w-[1400px] mt-2 sm:mt-0 h-14 sm:h-[72px] border-b border-transparent bg-transparent backdrop-blur-none px-4 md:px-8"
            : "max-w-[1400px] mt-2 sm:mt-0 h-14 sm:h-[72px] border-b border-border/40 bg-background/80 backdrop-blur-md px-4 md:px-8"
        }`}
      >
        {/* Logo on Top-Left */}
        <Logo scrolled={scrolled} />

        {/* Desktop Navigation Links - Centered */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/30"
                    : "text-foreground/80 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Button */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 active:scale-95"
          >
            <span>Start a Project</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-lg border border-primary bg-primary p-2 text-primary-foreground transition-transform duration-200 hover:bg-primary/90 active:scale-95 lg:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Sheet */}
      <div
        className={`mx-auto max-w-[1400px] grid overflow-hidden transition-all duration-400 ease-in-out lg:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-border/40 bg-background/95 px-4 py-4 backdrop-blur-2xl shadow-2xl sm:px-6 sm:py-6">
          <nav className="flex flex-col gap-2">
            {NAV.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:py-3 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-card/40 text-foreground/90 hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <ArrowRight className="size-4 shrink-0 opacity-60" />

                </Link>
              );
            })}
            <div className="mt-3 pt-3 border-t border-border/40 flex flex-col gap-3 sm:mt-4 sm:pt-4">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20"
              >
                <span>Start a Project</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

