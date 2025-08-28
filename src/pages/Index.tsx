import { LinkShortener } from "@/components/LinkShortener";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header user={user} onSignOut={handleSignOut} />
      <main className="container mx-auto px-4 py-8 bg-zinc-50">
        <LinkShortener user={user} />
        <section className="mt-10 text-center">
          <div className="inline-flex flex-wrap gap-3 justify-center text-sm">
            <Link to="/website-url-shortener" className="text-[#804DE0] hover:underline">Website URL Shortener</Link>
            <span className="text-zinc-400">•</span>
            <Link to="/url-compressor" className="text-[#804DE0] hover:underline">URL Compressor</Link>
            <span className="text-zinc-400">•</span>
            <Link to="/tiny-link" className="text-[#804DE0] hover:underline">Create Tiny Link</Link>
          </div>
        </section>
      </main>
    </div>;
};
export default Index;