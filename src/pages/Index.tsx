import { LinkShortener } from "@/components/LinkShortener";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LS</span>
            </div>
            <span className="font-bold text-lg">LinkShortener</span>
          </div>
          <Button variant="outline" asChild>
            <a href="/analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
            Shorten Links That Last Forever
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create short, memorable links that never expire. Perfect for social media, marketing campaigns, and sharing.
          </p>
        </div>
        
        <LinkShortener />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 LinkShortener. Simple, reliable, and free forever.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
