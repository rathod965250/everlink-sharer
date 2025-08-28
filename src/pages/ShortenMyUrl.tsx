import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function ShortenMyUrl() {
  const canonical = "https://goshortenurl.xyz/shorten-my-url";
  const faqs = [
    {
      q: "How do I shorten my URL?",
      a: "Paste your long link on the homepage, optionally set a custom alias or expiration, then click Shorten URL.",
    },
    {
      q: "Is this URL shortener free?",
      a: "Yes, you can shorten unlimited links for free. No signup is required.",
    },
    {
      q: "Can I make a short link that expires?",
      a: "Yes, choose minutes, hours, days, or months for auto‑expiry when creating your link.",
    },
    {
      q: "Do you support QR codes?",
      a: "Yes, a downloadable QR code is generated automatically for every shortened link.",
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
        <title>Shorten My URL — Free, Fast Short URL Generator | ShortenURL</title>
        <meta
          name="description"
          content="Shorten my URL in seconds. Free link shortener with custom alias, expiration, and QR codes. Create short links that are easy to share."
        />
        <meta
          name="keywords"
          content="shorten my url, short my url, shorten link, shorten links, short url, link shortener"
        />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Shorten My URL</h1>
        <p className="text-zinc-600">
          Create a short URL that’s easy to copy, paste, and share anywhere. Free forever. No signup required.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Why use a short URL?</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Cleaner links for social, SMS, and emails</li>
            <li>Custom alias so your link is memorable</li>
            <li>Optional expiry for limited‑time shares</li>
            <li>Instant QR for print or offline sharing</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">How to shorten your URL</h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-700">
            <li>
              Go to the <Link to="/" className="text-[#804DE0] underline">homepage</Link> and paste your long link.
            </li>
            <li>Optionally set a custom alias and expiry.</li>
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
      <p className="text-xs text-zinc-500 mt-6 text-center">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}
