import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Copy, Check, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const LinkShortener = () => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const shortenLink = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "URL field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let shortCode;
      
      if (customAlias.trim()) {
        // Validate custom alias
        if (!/^[A-Za-z0-9_-]+$/.test(customAlias)) {
          toast({
            title: "Invalid alias",
            description: "Alias can only contain letters, numbers, hyphens, and underscores",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Check if custom alias already exists
        const { data: existing } = await supabase
          .from('links')
          .select('short_code')
          .eq('short_code', customAlias)
          .single();
          
        if (existing) {
          toast({
            title: "Alias already taken",
            description: "This custom alias is already in use. Please choose another one.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        shortCode = customAlias;
      } else {
        // Generate random short code
        shortCode = generateShortCode();
        
        // Check if short code already exists, regenerate if needed
        let { data: existing } = await supabase
          .from('links')
          .select('short_code')
          .eq('short_code', shortCode)
          .single();
        
        while (existing) {
          shortCode = generateShortCode();
          const { data: newExisting } = await supabase
            .from('links')
            .select('short_code')
            .eq('short_code', shortCode)
            .single();
          existing = newExisting;
        }
      }

      const { data, error } = await supabase
        .from('links')
        .insert({
          short_code: shortCode,
          original_url: url,
        })
        .select()
        .single();

      if (error) throw error;

      const shortUrl = `${window.location.origin}/${shortCode}`;
      setShortenedUrl(shortUrl);
      
      toast({
        title: "Link shortened successfully!",
        description: "Your shortened link is ready to use.",
      });
    } catch (error) {
      console.error('Error shortening link:', error);
      toast({
        title: "Error",
        description: "Failed to shorten the link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Shortened link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-card to-secondary/20 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
            <Link2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Link Shortener
            </CardTitle>
            <CardDescription className="text-lg">
              Transform your long URLs into short, memorable links that never expire
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-12 text-base"
                onKeyPress={(e) => e.key === 'Enter' && shortenLink()}
              />
              <Button
                onClick={shortenLink}
                disabled={isLoading}
                className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                {isLoading ? "Shortening..." : "Shorten"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Custom alias (optional) - e.g., myblog"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="h-10 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for a random 6-character code, or enter your own custom alias
              </p>
            </div>
          </div>

          {shortenedUrl && (
            <Card className="border-success/20 bg-success/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-success">
                    ✨ Your shortened link is ready!
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={shortenedUrl}
                      readOnly
                      className="flex-1 bg-background border-success/20"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="border-success/20 hover:bg-success/10"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Never Expires</h3>
              <p className="text-sm text-muted-foreground">
                Your links stay active forever
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Track Clicks</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your link performance
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Free Forever</h3>
              <p className="text-sm text-muted-foreground">
                No limits, no registration required
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};