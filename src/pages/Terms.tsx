import { Helmet } from "react-helmet-async";

export default function Terms() {
  const canonical = "https://goshortenurl.xyz/terms";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Terms of Service — ShortenURL</title>
        <meta name="description" content="ShortenURL terms of service: acceptable use, availability, and liability limits." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">Acceptable use</h2>
      <p className="text-zinc-700">Do not use the service to distribute malware, abuse, or illegal content.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Availability</h2>
      <p className="text-zinc-700">We strive to maintain high uptime, but the service is provided as‑is without warranties.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-zinc-700">For questions, email support@goshortenurl.xyz.</p>
      <p className="text-xs text-zinc-500 mt-6">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}
