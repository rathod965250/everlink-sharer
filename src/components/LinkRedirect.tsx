import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const LinkRedirect = () => {
  const { code } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const redirectToLink = async () => {
      if (!code) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the link data with minimal latency
        const { data: link, error } = await supabase
          .from('links')
          .select('original_url, expires_at, clicks')
          .eq('short_code', code)
          .single();

        if (error || !link) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        // Check if link has expired
        if (link.expires_at && new Date(link.expires_at) < new Date()) {
          setExpired(true);
          setIsLoading(false);
          return;
        }

        setOriginalUrl(link.original_url);

        // Update click count asynchronously (don't wait for it)
        supabase
          .from('links')
          .update({ clicks: (link.clicks || 0) + 1 })
          .eq('short_code', code)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to update click count:', error);
            }
          });

        setIsLoading(false);

        // Immediate redirect for optimal performance (<150ms) without history entry
        setTimeout(() => {
          try {
            window.location.replace(link.original_url);
          } catch (redirectError) {
            console.error('Redirect failed:', redirectError);
            // Fallback to window.open if replace fails
            window.open(link.original_url, '_self');
          }
        }, 100);

      } catch (error) {
        console.error('Error fetching link:', error);
        setNotFound(true);
        setIsLoading(false);
      }
    };

    redirectToLink();
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
        <Card className="w-full max-w-md animate-fade-in">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we redirect you</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
        <Card className="w-full max-w-md animate-fade-in border-destructive/20">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2 text-destructive">Link Expired</h2>
            <p className="text-muted-foreground text-sm mb-6">
              This shortened link has expired and is no longer valid.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Create New Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
        <Card className="w-full max-w-md animate-fade-in border-destructive/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2 text-destructive">Link Not Found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              The shortened link you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (originalUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
        <Card className="w-full max-w-md animate-fade-in border-success/20">
          <CardContent className="p-8 text-center">
            <ExternalLink className="w-12 h-12 mx-auto mb-4 text-success" />
            <h2 className="text-xl font-semibold mb-2">Redirecting to:</h2>
            <p className="text-sm text-muted-foreground mb-6 break-all bg-accent/20 p-3 rounded-lg">
              {originalUrl}
            </p>
            <Button 
              onClick={() => window.location.replace(originalUrl)}
              className="w-full gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Continue to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback redirect to homepage
  window.location.href = '/';
  return null;
};