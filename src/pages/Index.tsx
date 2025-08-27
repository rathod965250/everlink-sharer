import { LinkShortener } from "@/components/LinkShortener";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, BarChart3, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Link className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              LinkShort
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Transform your long URLs into short, shareable links instantly
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/analytics')}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="gap-2 ml-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        <LinkShortener />
      </div>
    </div>
  );
};

export default Index;