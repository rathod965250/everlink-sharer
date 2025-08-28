import { Helmet } from "react-helmet-async";

export default function Privacy() {
  const canonical = "https://goshortenurl.xyz/privacy";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Privacy Policy — ShortenURL</title>
        <meta name="description" content="ShortenURL privacy policy: what we collect, how we use data, and your rights. We keep it minimal and transparent." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-zinc-700 mb-4">We collect the minimum data necessary to operate the service. This generally includes the original URL, the generated short code, and basic event data for redirects.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">What we collect</h2>
      <ul className="list-disc pl-5 space-y-1 text-zinc-700">
        <li>Original URL and short code you create</li>
        <li>Optional alias and expiration settings</li>
        <li>Basic logs for reliability and security</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">What we don’t collect</h2>
      <ul className="list-disc pl-5 space-y-1 text-zinc-700">
        <li>No unnecessary personal data</li>
        <li>No selling of data</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your rights</h2>
      <p className="text-zinc-700">Contact us any time at support@goshortenurl.xyz for questions or data requests.</p>
      <p className="text-xs text-zinc-500 mt-6">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}
