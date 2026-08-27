import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner";
import { trackVisit } from "@/lib/analytics.functions";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "bLtrXSM_InewWx5NGBPFs_aoPd0dsEcoTw0H3Vdxhro" },
      { name: "google-site-verification", content: "BCr9yM64yNnWh9n_vpwUZdzpBwWXH-t8aHXGpNtBRYY" },
      { property: "og:site_name", content: "Dressy Clothing LTD" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Archivo:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
      { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "96x96" },
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://dressyltd.com/#organization",
              name: "Dressy Clothing LTD",
              alternateName: ["Dressy Clothing Ltd", "Dressy Clothing", "Dressy"],
              legalName: "Dressy Clothing LTD",
              url: "https://dressyltd.com/",
              logo: {
                "@type": "ImageObject",
                url: "https://dressyltd.com/dressy-logo.png",
              },
              image: "https://dressyltd.com/dressy-logo.png",
              description:
                "Stitching with care & love. Dressy Clothing LTD delivers design, sourcing, and garment manufacturing from Bangladesh to global fashion markets.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kathgara, Ashulia",
                addressLocality: "Dhaka",
                addressCountry: "BD",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://dressyltd.com/#website",
              url: "https://dressyltd.com/",
              name: "Dressy Clothing LTD",
              alternateName: "Dressy Clothing Ltd",
              publisher: { "@id": "https://dressyltd.com/#organization" },
              inLanguage: "en",
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollProgress() {
  return null;
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    void trackVisit({ data: { path: pathname, referrer: document.referrer || "" } }).catch(() => {});
  }, [pathname]);


  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgress />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div className="pt-16 md:pt-20">
        <Outlet />
      </div>
      <ChatWidget />
      <Toaster position="bottom-center" richColors closeButton />
    </QueryClientProvider>
  );

}

