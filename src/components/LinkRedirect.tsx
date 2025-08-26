import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LinkRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        // Get the original URL
        const { data: link, error } = await supabase
          .from('links')
          .select('original_url')
          .eq('short_code', code)
          .single();

        if (error || !link) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        // Increment click count
        await supabase.rpc('increment_clicks', { short_code: code });

        setOriginalUrl(link.original_url);
        
        // Redirect after a brief delay to show the preview
        setTimeout(() => {
          window.location.href = link.original_url;
        }, 2000);
        
      } catch (error) {
        console.error('Error handling redirect:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    handleRedirect();
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <h3 className="font-semibold">Redirecting...</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we redirect you
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Link Not Found</CardTitle>
            <CardDescription>
              This shortened link doesn't exist or may have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <a href="/">Create New Link</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (originalUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <ExternalLink className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-xl">Redirecting to...</CardTitle>
            <CardDescription className="break-all">
              {originalUrl}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You will be redirected automatically in a moment.
            </p>
            <Button 
              asChild 
              className="w-full"
              onClick={() => window.location.href = originalUrl}
            >
              <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                Continue to Website
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Navigate to="/" replace />;
};