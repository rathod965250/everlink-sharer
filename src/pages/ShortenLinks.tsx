import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function ShortenLinks() {
  const canonical = "https://goshortenurl.xyz/shorten-links";
  const faqs = [
    {
      q: "What does a link shortener do?",
      a: "It converts a long URL into a short, shareable link that redirects to the original destination.",
    },
    {
      q: "Can I shorten multiple links?",
      a: "Yes, shorten as many links as you want, for free.",
    },
    {
      q: "Can I customize the short code?",
      a: "Yes, choose a custom alias so your link is easy to remember.",
    },
    {
      q: "Do you generate QR codes?",
      a: "Yes, every short link has an instant QR code you can download.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Shorten Links — Free URL Shortener with Custom Alias & QR | ShortenURL</title>
        <meta
          name="description"
          content="Shorten links in seconds. Free URL shortener with custom alias, expiration, and QR codes. Create short URLs for social, SMS, and marketing."
        />
        <meta
          name="keywords"
          content="shorten links, shorten link, short url, link shortener, site to shorten url, website url shortener, short my url"
        />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Shorten Links</h1>
        <p className="text-zinc-600">
          Make clean, shareable short links for every channel — free, fast, and secure.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Why ShortenURL?</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Short, memorable URLs</li>
            <li>Custom alias and optional expiration</li>
            <li>Instant QR codes for print or offline</li>
            <li>HTTPS security</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">How to shorten your link</h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-700">
            <li>Go to the <Link to="/" className="text-[#804DE0] underline">homepage</Link>.</li>
            <li>Paste a long URL, set alias/expiry if you want.</li>
            <li>Click <em>Shorten URL</em> and copy the result.</li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">FAQs</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q}>
              <summary className="font-medium">{q}</summary>
              <p className="text-sm text-zinc-700 mt-1">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link to="/" className="inline-block px-5 py-2 rounded-md bg-[#804DE0] text-white hover:bg-[#6d3fc0]">
          Shorten a link now
        </Link>
      </div>
    </div>
  );
}
