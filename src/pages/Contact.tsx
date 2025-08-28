import { Helmet } from "react-helmet-async";

export default function Contact() {
  const canonical = "https://goshortenurl.xyz/contact";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Contact ShortenURL — Support & Inquiries</title>
        <meta name="description" content="Contact the ShortenURL team for support, feedback, or partnership inquiries. We typically respond within 1–2 business days." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-zinc-700 mb-4">Need help or want to share feedback? Email us at <a href="mailto:support@goshortenurl.xyz" className="text-[#804DE0] underline">support@goshortenurl.xyz</a>.</p>
      <p className="text-zinc-700">We aim to respond within 1–2 business days.</p>
      <p className="text-xs text-zinc-500 mt-6">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}
