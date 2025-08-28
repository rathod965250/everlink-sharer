import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Copy, Check, TrendingUp, BarChart3, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface LinkShortenerProps {
  user?: any;
}
export const LinkShortener = ({
  user
}: LinkShortenerProps) => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationValue, setExpirationValue] = useState(0);
  const [expirationType, setExpirationType] = useState("never");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const {
    toast
  } = useToast();
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
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  const calculateExpirationDate = () => {
    if (expirationType === 'never') return null;
    const now = new Date();
    const value = parseInt(expirationValue.toString());
    switch (expirationType) {
      case 'minutes':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'hours':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'days':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      case 'months':
        return new Date(now.setMonth(now.getMonth() + value));
      default:
        return null;
    }
  };
  const shortenLink = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "URL field cannot be empty",
        variant: "destructive"
      });
      return;
    }
    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }
    if (expirationType !== 'never' && (!expirationValue || expirationValue <= 0)) {
      toast({
        title: "Invalid expiration",
        description: "Please enter a valid expiration value",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      let shortCode;
      if (customAlias.trim()) {
        // Validate custom alias format
        if (!/^[A-Za-z0-9_-]+$/.test(customAlias.trim())) {
          toast({
            title: "Invalid alias",
            description: "Alias can only contain letters, numbers, hyphens, and underscores",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Check if custom alias already exists
        const {
          data: existing
        } = await supabase.from('links').select('short_code').eq('short_code', customAlias.trim()).single();
        if (existing) {
          toast({
            title: "Alias already taken",
            description: "This custom alias is already in use. Please choose another one.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        shortCode = customAlias.trim();
      } else {
        // Generate random short code
        shortCode = generateShortCode();

        // Check if short code already exists, regenerate if needed
        let {
          data: existing
        } = await supabase.from('links').select('short_code').eq('short_code', shortCode).single();
        while (existing) {
          shortCode = generateShortCode();
          const {
            data: newExisting
          } = await supabase.from('links').select('short_code').eq('short_code', shortCode).single();
          existing = newExisting;
        }
      }
      const expiresAt = calculateExpirationDate();
      const {
        data,
        error
      } = await supabase.from('links').insert({
        short_code: shortCode,
        original_url: url,
        user_id: user?.id || null,
        expires_at: expiresAt?.toISOString() || null,
        expiration_type: expirationType,
        expiration_value: expirationType === 'never' ? 0 : expirationValue
      }).select().single();
      if (error) throw error;
      const shortUrl = `${window.location.origin}/${shortCode}`;
      setShortenedUrl(shortUrl);
      toast({
        title: "✨ Link shortened successfully!",
        description: `Your Zagurl link is ready to use${expiresAt ? ` and expires in ${expirationValue} ${expirationType}` : ''}`
      });
    } catch (error) {
      console.error('Error shortening link:', error);
      toast({
        title: "Error",
        description: "Failed to shorten the link. Please try again.",
        variant: "destructive"
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
        description: "Shortened link copied to clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };
  return <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-primary/20 blur-3xl"></div>
          <div className="relative space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Zagurl
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-slate-950">
              Transform your long URLs into <span className="text-primary font-semibold">short, memorable links</span> that never expire
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-success">
                <Zap className="h-5 w-5" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2 text-accent-foreground">
                <Sparkles className="h-5 w-5" />
                <span>FREE Forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card via-card to-secondary/20 border-primary/20 glow-effect hover-scale">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center glow-effect bg-violet-500">
            <Link2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text font-bold text-violet-500">
              Get Your Free Link
            </CardTitle>
            <CardDescription className="text-lg text-zinc-900">
              No registration required • Custom aliases available • Analytics included
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input type="url" placeholder="Enter your long URL here..." value={url} onChange={e => setUrl(e.target.value)} className="flex-1 h-12 text-base border-primary/20 focus:border-primary/40" onKeyPress={e => e.key === 'Enter' && shortenLink()} />
              <Button onClick={shortenLink} disabled={isLoading} className="h-12 px-8 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 glow-effect font-medium">
                {isLoading ? "Shortening..." : "Get My Link FREE"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input type="text" placeholder="Custom alias (optional) - e.g., myblog" value={customAlias} onChange={e => setCustomAlias(e.target.value)} className="h-10 text-sm border-primary/20 focus:border-primary/40" />
                <p className="text-xs text-muted-foreground">
                  Create a memorable custom alias or leave empty for auto-generation
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={expirationType} onValueChange={setExpirationType}>
                    <SelectTrigger className="h-10 border-primary/20">
                      <SelectValue placeholder="Expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expire</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                  {expirationType !== 'never' && <Input type="number" placeholder="Value" value={expirationValue || ''} onChange={e => setExpirationValue(parseInt(e.target.value) || 0)} className="h-10 w-24 border-primary/20" min="1" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  Set when your link should expire (optional)
                </p>
              </div>
            </div>
          </div>

          {shortenedUrl && <Card className="border-success/20 bg-success/5 animate-fade-in">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-success flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Your Zagurl link is ready!
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                    <span className="flex-1 font-mono text-sm break-all">
                      {shortenedUrl}
                    </span>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-2 shrink-0 hover-scale">
                      {copied ? <>
                          <Check className="w-4 h-4 text-success" />
                          Copied
                        </> : <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>}

          <div className="flex items-center justify-center gap-8 pt-4 border-t border-primary/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-success" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Ultra-fast (&lt;150ms)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4 text-accent-foreground" />
              <span>Analytics included</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};