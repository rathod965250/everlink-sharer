import { Helmet } from "react-helmet-async";

export default function About() {
  const canonical = "https://goshortenurl.xyz/about";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>About ShortenURL — Our Mission, Trust & Security</title>
        <meta name="description" content="Learn about ShortenURL: our mission to make links simple, fast, and secure. Privacy-first, transparent uptime, and user trust at the core." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">About ShortenURL</h1>
      <p className="text-zinc-700 mb-4">ShortenURL helps people and teams create clean, reliable short links with privacy and performance in mind.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Our principles</h2>
      <ul className="list-disc pl-5 space-y-1 text-zinc-700">
        <li>Privacy-first: we store only what’s necessary to run the service.</li>
        <li>Security: HTTPS everywhere; time-limited links available.</li>
        <li>Performance: fast redirects and lightweight UI.</li>
        <li>Transparency: clear docs and responsive support.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Team & authorship</h2>
      <p className="text-zinc-700">Content is written and reviewed by our product and engineering team. Pages show their last updated date for transparency.</p>
      <p className="text-xs text-zinc-500 mt-6">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}
