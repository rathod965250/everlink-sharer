import { LinkShortener } from "@/components/LinkShortener";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header user={user} onSignOut={handleSignOut} />
      <main className="container mx-auto px-4 py-8">
        <LinkShortener user={user} />
      </main>
    </div>
  );
};

export default Index;