import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useLocation,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { insights } from "@/data/insights";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you requested does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Lodestar Advising | Personal College Admissions & Essay Coaching",
    description:
      "Lodestar Advising is a founder-led college counseling practice helping ambitious students build stronger applications, essays, and scholarship strategies. Work directly with Krish Sav through flexible admissions support or focused essay coaching.",
  },
  "/about": {
    title: "About Lodestar Advising | Founder-Led College Counseling",
    description:
      "Meet Krish Sav, founder of Lodestar Advising. Learn how firsthand admissions experience became a clear, rigorous college counseling playbook for ambitious students.",
  },
  "/services": {
    title: "College Counseling Programs | Lodestar Advising",
    description:
      "Explore Lodestar Advising programs: a flexible Lodestar Hour for admissions questions and a ten-class essay package for focused, founder-led college essay coaching.",
  },
  "/results": {
    title: "Student Results | Lodestar Advising College Counseling",
    description:
      "See the Lodestar Advising results story, including 12+ elite college acceptances, $600K+ in scholarships won for students, and 20+ clients helped.",
  },
  "/events": {
    title: "College Admissions Events | Lodestar Advising",
    description:
      "Find upcoming Lodestar Advising college admissions webinars, information sessions, and opportunities to learn the playbook behind stronger applications.",
  },
  "/faq": {
    title: "College Counseling FAQ | Lodestar Advising",
    description:
      "Get answers about Lodestar Advising college counseling, essay coaching, timelines, pricing, students served, and how to begin a consultation.",
  },
  "/contact": {
    title: "Contact Lodestar Advising | Book a Consultation",
    description:
      "Contact Lodestar Advising to book a complimentary 30-minute consultation with founder Krish Sav about college counseling, admissions strategy, or essay coaching.",
  },
  "/privacy": {
    title: "Privacy Policy | Lodestar Advising",
    description:
      "Learn how Lodestar Advising uses and protects the information shared through its college counseling inquiry form.",
  },
  "/insights": {
    title: "Admissions Insights | Lodestar Advising",
    description:
      "Lodestar Advising insights on the 2026 to 2027 admissions cycle, application strategy, AI and authenticity, and selective college preparation.",
  },
};

function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const insightSlug = pathname.startsWith("/insights/") ? pathname.split("/")[2] : undefined;
    const insight = insights.find((item) => item.slug === insightSlug);
    const metadata = insight
      ? {
          title: `${insight.title} | Lodestar Advising`,
          description: insight.dek,
        }
      : (pageMetadata[pathname] ?? pageMetadata["/"]);
    const canonicalPath = pathname === "/" ? "/" : pathname;
    document.title = metadata.title;

    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      value: string,
      content: string,
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta('meta[name="description"]', "name", "description", metadata.description);
    setMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
    setMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
    setMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      `https://lodestaradvising.com${canonicalPath}`,
    );
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      metadata.description,
    );

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://lodestaradvising.com${canonicalPath}`;
  }, [pathname]);

  return null;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SeoManager />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
