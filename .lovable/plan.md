## Goal
Rank #1 on Google for "lodestar college counseling" (and close variants), ahead of lodestarcollegecounseling.com.

## Reality check
That competitor owns the exact-match domain (lodestarcollegecounseling.com), has years of indexed pages, backlinks, and brand history. We can absolutely climb past them, but Google needs signals that **we** are the "Lodestar College Counseling" a searcher wants. This is a 4–12 week effort, not a one-edit fix. Below is what I'll do on-site now, plus the off-site actions only you can do.

---

## On-site changes I'll make (this session)

### 1. Strengthen brand signals in metadata
- Homepage `<title>`: lead with the exact brand phrase.
  - New: `Lodestar College Counseling — Ivy League Admissions Consulting`
- Homepage meta description: front-load "Lodestar College Counseling" and add "official site".
- Add `og:title` / `twitter:title` matching.
- Update `<h1>` on the homepage to include "Lodestar College Counseling" verbatim (currently the brand phrase is not the H1).

### 2. Expand structured data (JSON-LD)
In `src/routes/__root.tsx`, extend the `EducationalOrganization` schema with:
- `founder` (Person: name, jobTitle, sameAs LinkedIn if you have one)
- `address` (PostalAddress — even just `addressCountry: "US"` + region)
- `aggregateRating` **only if** you have real reviews to cite (skip otherwise — fake ratings get penalized)
- `contactPoint` (phone, email, contactType: "customer service")
- `slogan` and a richer `description` (the 731-char blurb you approved)

Add a `LocalBusiness` schema on `/contact` with the same NAP (name/address/phone) — consistent NAP across the web is a major local-SEO signal.

### 3. Add an FAQ page + FAQPage schema
New route `/faq` answering:
- "Is Lodestar College Counseling the same as [competitor]?" → clarify: no, we're Lodestar Advising / Lodestar CCG, founder-led, based [your location].
- "Who founded Lodestar College Counseling?"
- "What colleges do Lodestar students get into?"
- "How much does Lodestar College Counseling cost?" (range or "starts at")
- "Where is Lodestar College Counseling located?"

FAQPage JSON-LD lets Google show expandable Q&A directly in results — takes vertical space away from the competitor.

### 4. Homepage copy: use the brand phrase more (naturally)
Right now the site says "Lodestar" a lot but rarely "Lodestar College Counseling" as one phrase. Add 3–4 natural uses across the hero, intro paragraph, and About section. Not stuffing — just making sure the exact phrase appears where it belongs.

### 5. Internal linking + breadcrumbs
- Add `BreadcrumbList` JSON-LD to every leaf route.
- Add a small "About Lodestar College Counseling" block on `/about` that uses the full brand phrase in its H1.

### 6. Sitemap + robots hygiene
- Add `/faq` to `public/sitemap.xml`.
- Confirm `robots.txt` allows all (already does).
- Add `lastmod` dates to sitemap entries.

---

## What only you can do (off-site — this is where the ranking actually moves)

I'll give you a checklist in chat after the on-site work. The big ones:

1. **Google Business Profile** — finish it. Add the 731-char description you already have, upload 8–10 photos, pick categories ("Educational consultant", "College", "Counselor"), add service areas, and get **5+ real Google reviews** in the next 30 days. This alone can flip the top result for a branded search.
2. **Google Search Console** — submit the sitemap and request indexing on the homepage + /faq. I can automate part of this via the Search Console connector if you want.
3. **Backlinks from directories** — get listed (with consistent NAP) on: Yelp, BBB, Niche.com, IECA directory, HECA directory, LinkedIn Company page, Crunchbase, local chamber of commerce.
4. **Press / mentions** — a single article on a .edu or a well-known college-admissions blog linking to lodestaradvising.com moves the needle more than 50 on-site tweaks.
5. **Social consistency** — make sure Instagram, Facebook, LinkedIn bios all say "Lodestar College Counseling" and link to lodestaradvising.com.

---

## Technical section (for reference)

Files I'll touch:
- `src/routes/__root.tsx` — expand JSON-LD, tighten homepage-inherited meta
- `src/routes/index.tsx` — H1, hero copy, per-route title/description override
- `src/routes/about.tsx` — H1 and intro copy include full brand phrase
- `src/routes/contact.tsx` — LocalBusiness JSON-LD refinement, NAP block
- `src/routes/faq.tsx` — **new** route with FAQPage JSON-LD
- `public/sitemap.xml` handler (`src/routes/sitemap[.]xml.ts`) — add /faq, lastmod
- Every leaf route — add BreadcrumbList JSON-LD

No business-logic or backend changes. No design overhaul.

---

## Honest expectation
- Week 1–2: on-site changes indexed, Search Console + GBP filled in.
- Week 2–6: FAQ rich results start showing, GBP reviews accumulate, ranking climbs from #3 toward #1–2.
- Week 6–12: with backlinks + reviews, #1 for the branded query is realistic.

Approve this and I'll make the on-site changes in one pass, then hand you the off-site checklist.