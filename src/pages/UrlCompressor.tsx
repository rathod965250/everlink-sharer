import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function UrlCompressor() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>URL Compressor — Compress Long URLs into Short Links | ShortenURL</title>
        <meta name="description" content="Compress long URLs into tiny links you can share anywhere. Free, secure, and fast URL compressor (shortener) with custom alias and expiration." />
        <link rel="canonical" href="https://goshortenurl.xyz/url-compressor" />
        <meta name="keywords" content="url compressor, shorten url, compress long url, tiny link, short url" />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">URL Compressor (Shorten Long Links)</h1>
        <p className="text-zinc-600">Make long links small and easy to share. Free and secure.</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Benefits</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Cleaner messages on SMS, WhatsApp, and social</li>
            <li>Prevents line breaks in emails and chat apps</li>
            <li>Looks trustworthy with HTTPS</li>
            <li>Optional expiry for one-time or time-limited shares</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Popular use cases</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Customer support replies</li>
            <li>Social media posts and bios</li>
            <li>SMS campaigns and push notifications</li>
            <li>Print materials with QR codes</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">How to compress a URL</h2>
        <ol className="list-decimal pl-6 space-y-2 text-zinc-700">
          <li>Go to the <Link to="/" className="text-[#804DE0] underline">homepage</Link> and paste your long link.</li>
          <li>Optionally add a custom alias and choose an expiration.</li>
          <li>Press “Shorten URL” and copy your new short link.</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">FAQs</h2>
        <div className="space-y-3">
          <details>
            <summary className="font-medium">Is this real compression?</summary>
            <p className="text-sm text-zinc-700 mt-1">We shorten the link and redirect to the long URL. The result is the same for sharing: a tiny, easy-to-read link.</p>
          </details>
          <details>
            <summary className="font-medium">Do I need an account?</summary>
            <p className="text-sm text-zinc-700 mt-1">No. You can shorten links for free without signing up.</p>
          </details>
          <details>
            <summary className="font-medium">Can links expire?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. Choose minutes, hours, days, or months to control access.</p>
          </details>
          <details>
            <summary className="font-medium">Is it safe?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. Links are served over HTTPS and can be set to expire automatically.</p>
          </details>
        </div>
      </section>

      <div className="text-center">
        <Link to="/" className="inline-block px-5 py-2 rounded-md bg-[#804DE0] text-white hover:bg-[#6d3fc0]">Compress a URL now</Link>
      </div>
    </div>
  );
}
