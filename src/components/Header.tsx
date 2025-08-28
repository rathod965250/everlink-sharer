import { Button } from "@/components/ui/button";
import { User, LogOut, BarChart3, Link, Zap, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center glow-effect">
                <Link className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Zagurl
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Free Forever • No Signup Needed</p>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1 text-sm text-success font-medium">
              <Zap className="h-4 w-4" />
              <span>Fast</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-primary font-medium">
              <Shield className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-accent-foreground font-medium">
              <Clock className="h-4 w-4" />
              <span>FREE</span>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/analytics')}
                  className="gap-2 hover-scale"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 bg-accent/50 rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium hidden sm:inline">{user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="gap-2 hover-scale border-primary/20 hover:border-primary/40"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};