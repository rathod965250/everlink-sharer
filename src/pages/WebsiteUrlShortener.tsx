import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function WebsiteUrlShortener() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Website URL Shortener — Best URL Shortener Site | ShortenURL</title>
        <meta name="description" content="Shorten links securely with ShortenURL, the best website URL shortener site. Free, fast, and secure with custom alias and expiration." />
        <link rel="canonical" href="https://goshortenurl.xyz/website-url-shortener" />
        <meta name="keywords" content="site to shorten url, website url shortener, url shortener site, shorten links, short url" />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">The Best Website URL Shortener</h1>
        <p className="text-zinc-600">Create short, reliable links in seconds. Free forever. No signup required.</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Why ShortenURL?</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Clean, memorable short links</li>
            <li>Optional custom alias (e.g., yourbrand/promo)</li>
            <li>Expiry controls for limited-time campaigns</li>
            <li>HTTPS security end-to-end</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Popular use cases</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Share links on social and SMS without breaking lines</li>
            <li>Marketing campaigns with easy-to-read URLs</li>
            <li>QR codes for print materials and events</li>
            <li>Cleaner links for customer support</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">How it works</h2>
        <ol className="list-decimal pl-6 space-y-2 text-zinc-700">
          <li>Paste your long URL on the <Link to="/" className="text-[#804DE0] underline">homepage</Link>.</li>
          <li>Optionally set a custom alias and expiration.</li>
          <li>Click “Shorten URL” and copy your new short link.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Features at a glance</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-medium">Custom alias</h3>
            <p className="text-sm text-zinc-700">Set a branded code so your link is easy to remember.</p>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-medium">Expiration</h3>
            <p className="text-sm text-zinc-700">Make links expire after minutes, hours, days, or months.</p>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-medium">Secure</h3>
            <p className="text-sm text-zinc-700">All links are served over HTTPS and can be revoked by expiry.</p>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-medium">Fast</h3>
            <p className="text-sm text-zinc-700">Links resolve quickly for a smooth user experience.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">FAQs</h2>
        <div className="space-y-3">
          <details>
            <summary className="font-medium">Is ShortenURL free?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. You can shorten unlimited links for free without creating an account.</p>
          </details>
          <details>
            <summary className="font-medium">Can I customize my link?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. Set a custom alias when you shorten a link to make it more memorable.</p>
          </details>
          <details>
            <summary className="font-medium">Do links expire?</summary>
            <p className="text-sm text-zinc-700 mt-1">You choose. Links can last forever or expire after a set time.</p>
          </details>
          <details>
            <summary className="font-medium">Is it secure?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. We use HTTPS and support expiring links to reduce unwanted sharing.</p>
          </details>
        </div>
      </section>

      <div className="text-center">
        <Link to="/" className="inline-block px-5 py-2 rounded-md bg-[#804DE0] text-white hover:bg-[#6d3fc0]">Shorten a link now</Link>
      </div>
    </div>
  );
}
