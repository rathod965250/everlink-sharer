import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function TinyLink() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Create a Tiny Link — Free Tiny URL Generator | ShortenURL</title>
        <meta name="description" content="Create a tiny link in seconds. Free tiny URL generator to shorten links with optional custom alias and expiration." />
        <link rel="canonical" href="https://goshortenurl.xyz/tiny-link" />
        <meta name="keywords" content="tiny link, short url, shorten url, link shortener, create tiny url" />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Create Tiny Links in Seconds</h1>
        <p className="text-zinc-600">Make short, memorable links you can share anywhere. Free and secure.</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Why tiny links?</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Look clean on social posts and profiles</li>
            <li>Easy to say and remember in conversations</li>
            <li>Great for QR codes and printed materials</li>
            <li>Optional custom alias for brand consistency</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <h2 className="font-semibold mb-2">Common uses</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
            <li>Link in bio</li>
            <li>Event sign-up and RSVP links</li>
            <li>Customer support and knowledge base</li>
            <li>Marketing promotions and coupons</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">How to create a tiny link</h2>
        <ol className="list-decimal pl-6 space-y-2 text-zinc-700">
          <li>Go to the <Link to="/" className="text-[#804DE0] underline">homepage</Link> and paste your long URL.</li>
          <li>Optionally set a custom alias to match your brand.</li>
          <li>Click “Shorten URL” and share your tiny link.</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">FAQs</h2>
        <div className="space-y-3">
          <details>
            <summary className="font-medium">Do tiny links expire?</summary>
            <p className="text-sm text-zinc-700 mt-1">You decide. Keep them forever or set an expiration window.</p>
          </details>
          <details>
            <summary className="font-medium">Are tiny links secure?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. All links are served over HTTPS. You can set expirations to control sharing.</p>
          </details>
          <details>
            <summary className="font-medium">Can I brand my link?</summary>
            <p className="text-sm text-zinc-700 mt-1">Yes. Use a custom alias so the tiny link matches your campaign or brand.</p>
          </details>
        </div>
      </section>

      <div className="text-center">
        <Link to="/" className="inline-block px-5 py-2 rounded-md bg-[#804DE0] text-white hover:bg-[#6d3fc0]">Create a tiny link now</Link>
      </div>
    </div>
  );
}
