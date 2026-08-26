import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { getSEOMetadata } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    getSEOMetadata({
      title: "Privacy Policy — Dressy Clothing Ltd.",
      description:
        "How Dressy Clothing Ltd. collects, uses and protects the personal information shared through our website and enquiry forms.",
      url: "/privacy",
    }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect the details you voluntarily provide through our enquiry and newsletter forms — name, company, email address, phone number and the content of your message. We also record basic technical data such as IP address, browser type and pages visited.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information is used to respond to enquiries, prepare quotations, share collection and capability updates you have requested, and improve the performance of this website. We never sell your data.",
  },
  {
    title: "Cookies & Analytics",
    body: "This site uses essential cookies and anonymous visit analytics to understand traffic and improve the browsing experience. You can disable cookies in your browser at any time.",
  },
  {
    title: "Data Sharing",
    body: "We share information only with service providers that help us operate the website and communicate with you, and only to the extent required. We may disclose data where required by applicable law.",
  },
  {
    title: "Data Retention & Security",
    body: "Enquiry records are retained for as long as needed to serve your business relationship with us and are stored on secured, access-controlled systems.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by writing to info@dressyclothing.com.",
  },
];

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal / Privacy Policy"
      title={
        <>
          Privacy
          <br />
          Policy.
        </>
      }
      intro="Dressy Clothing Ltd. respects your privacy. This policy explains what we collect, why we collect it and how you stay in control."
    >
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <ul className="divide-y divide-border border-y border-border">
            {SECTIONS.map((s) => (
              <li key={s.title} className="grid gap-4 py-8 lg:grid-cols-[1fr_2fr]">
                <h2 className="display text-2xl">{s.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs text-muted-foreground">
            Questions about this policy? Email{" "}
            <a className="text-primary hover:underline" href="mailto:info@dressyclothing.com">
              info@dressyclothing.com
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
