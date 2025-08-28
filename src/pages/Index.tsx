import { LinkShortener } from "@/components/LinkShortener";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully."
    });
  };
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShortenURL",
    url: "https://goshortenurl.xyz/",
    logo: "https://goshortenurl.xyz/favicon.ico",
    contactPoint: [{ "@type": "ContactPoint", email: "support@goshortenurl.xyz", contactType: "customer support" }]
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShortenURL",
    url: "https://goshortenurl.xyz/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://goshortenurl.xyz/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>URL Shortener | Link Shortener | Short URL — ShortenURL</title>
        <meta name="description" content="Free URL shortener to create short links instantly. Custom alias, expiration, and QR code generation. Fast, secure, and easy to use." />
        <meta name="keywords" content="shorten url, link shortener, short url, shorten links, url shortener site, website url shortener" />
        <link rel="canonical" href="https://goshortenurl.xyz/" />
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(siteJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is a URL shortener?", acceptedAnswer: { "@type": "Answer", text: "A URL shortener converts long links into short, easy-to-share URLs that redirect to the original page." }},
            { "@type": "Question", name: "Is ShortenURL free?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can shorten unlimited links for free without creating an account." }},
            { "@type": "Question", name: "Can I customize my short link?", acceptedAnswer: { "@type": "Answer", text: "Yes. Set a custom alias when creating your short link to make it more memorable." }},
            { "@type": "Question", name: "Do you provide QR codes?", acceptedAnswer: { "@type": "Answer", text: "Yes. A QR code is automatically generated for every shortened link and can be downloaded." }},
            { "@type": "Question", name: "Can links expire?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can choose minutes, hours, days, or months for auto-expiration when creating a link." }}
          ]
        })}</script>
      </Helmet>
      <Header user={user} onSignOut={handleSignOut} />
      <main className="container mx-auto px-4 py-8 bg-zinc-50">
        <div className="flex justify-center">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8D8F5] text-black border border-transparent shadow-sm"
            aria-label="Made with love for you"
            title="Made with love for you"
          >
            <span className="text-base">❤️</span>
            <span className="text-xs font-semibold tracking-wide uppercase">Made with love for you</span>
          </span>
        </div>
        <LinkShortener user={user} />
        <section className="mt-10 text-center">
          <div className="inline-flex flex-wrap gap-3 justify-center text-sm">
            <Link to="/website-url-shortener" className="text-[#804DE0] hover:underline">Website URL Shortener</Link>
            <span className="text-zinc-400">•</span>
            <Link to="/url-compressor" className="text-[#804DE0] hover:underline">URL Compressor</Link>
            <span className="text-zinc-400">•</span>
            <Link to="/tiny-link" className="text-[#804DE0] hover:underline">Create Tiny Link</Link>
            <span className="text-zinc-400">•</span>
            <Link to="/shorten-my-url" className="text-[#804DE0] hover:underline">Shorten My URL</Link>
            <span className="text-zinc-400">•</span>
            <Link to="/shorten-links" className="text-[#804DE0] hover:underline">Shorten Links</Link>
          </div>
        </section>
        <section className="mt-6 text-center">
          <div className="inline-flex flex-wrap gap-3 justify-center text-xs text-zinc-600">
            <Link to="/about" className="hover:underline">About</Link>
            <span>•</span>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        </section>
        <footer className="mt-12 pb-6 text-center text-xs text-zinc-500">
          2025 ShortenURL. All rights reserved
        </footer>
      </main>
    </div>;
};
export default Index;