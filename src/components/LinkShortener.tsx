import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Copy, Check, TrendingUp, BarChart3, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import QRCode from 'qrcode';
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
  const [qrDataUrl, setQrDataUrl] = useState("");
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
    
    // Reset previous results to avoid stale UI
    setQrDataUrl("");
    setShortenedUrl("");
    setCopied(false);
    setIsLoading(true);
    
    try {
      // Ensure we have the latest session before creating links
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      console.log('Creating link with user:', currentUser?.email || 'anonymous');
      
      const expiresAt = calculateExpirationDate();

      // Helper to perform the insert
      const insertLink = async (code: string) => {
        const linkData = {
          short_code: code,
          original_url: url,
          user_id: currentUser?.id || null,
          expires_at: expiresAt?.toISOString() || null,
          expiration_type: expirationType,
          expiration_value: expirationType === 'never' ? 0 : expirationValue
        };
        
        console.log('Inserting link data:', { ...linkData, user_id: linkData.user_id ? 'authenticated' : 'anonymous' });
        
        return await supabase
          .from('links')
          .insert(linkData)
          .select()
          .single();
      };

      let shortCode = customAlias.trim();

      if (shortCode) {
        // Validate custom alias format
        if (!/^[A-Za-z0-9_-]+$/.test(shortCode)) {
          toast({
            title: "Invalid alias",
            description: "Alias can only contain letters, numbers, hyphens, and underscores",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { error } = await insertLink(shortCode);
        if (error) {
          const msg = (error as any)?.message || String(error);
          if (/duplicate key value|unique constraint/i.test(msg)) {
            toast({
              title: "Alias already taken",
              description: "This custom alias is already in use. Please choose another one.",
              variant: "destructive"
            });
          } else {
            throw error;
          }
          setIsLoading(false);
          return;
        }
      } else {
        // Generate and attempt insert until success or max attempts
        const maxAttempts = 7;
        let attempt = 0;
        while (attempt < maxAttempts) {
          shortCode = generateShortCode();
          const { error } = await insertLink(shortCode);
          if (!error) break;
          const msg = (error as any)?.message || String(error);
          if (/duplicate key value|unique constraint/i.test(msg)) {
            attempt++;
            continue; // regenerate and retry
          }
          // Other errors: throw to outer catch
          throw error;
        }
        if (attempt >= maxAttempts) {
          throw new Error('Failed to generate a unique code. Please try again.');
        }
      }

      const shortUrl = `${window.location.origin}/${shortCode}`;
      setShortenedUrl(shortUrl);
      // Generate QR code image for the shortened URL (non-blocking feel)
      try {
        const dataUrl = await QRCode.toDataURL(shortUrl, { 
          width: 256, 
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrDataUrl(dataUrl);
      } catch (e) {
        console.warn('QR generation failed', e);
        setQrDataUrl("");
      }
      toast({
        title: "✨ Link shortened successfully!",
        description: `Your ShortenURL link is ready to use${expiresAt ? ` and expires in ${expirationValue} ${expirationType}` : ''}`
      });
    } catch (error) {
      console.error('Error shortening link:', error);
      // Provide clearer messages (RLS/duplicate/validation)
      const msg = (error as any)?.message || String(error);
      let friendly = msg;
      if (/row-level security|permission denied/i.test(msg)) {
        friendly = 'Permission denied by database policy. Please sign in before shortening links.';
      } else if (/duplicate key value|unique constraint/i.test(msg)) {
        friendly = 'Alias already exists. Try another custom alias.';
      }
      toast({
        title: "Error",
        description: friendly,
        variant: "destructive"
      });
      // Ensure QR from previous run does not linger
      setQrDataUrl("");
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = async () => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shortenedUrl);
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shortenedUrl;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // Execute the copy command
        const successful = document.execCommand('copy');
        if (!successful) {
          throw new Error('Copy command failed');
        }
        
        // Clean up
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Shortened link copied to clipboard.",
        duration: 2000
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      // Fallback: Show the URL in an alert so user can copy manually
      window.prompt('Copy to clipboard: Ctrl+C, Enter', shortenedUrl);
      
      toast({
        title: "Copy to clipboard failed",
        description: "The link has been selected. Press Ctrl+C to copy.",
        variant: "destructive"
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>ShortenURL — Shorten my URL fast | Free Link Shortener</title>
        <meta name="description" content="Shorten links instantly. Shorten my URL, compress long links, create tiny links — free, fast, and secure website URL shortener." />
        <link rel="canonical" href="https://goshortenurl.xyz/" />
        <meta property="og:title" content="ShortenURL — Free URL Shortener" />
        <meta property="og:description" content="Shorten link in seconds. Free and secure URL shortener with custom alias and expiration." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshortenurl.xyz/" />
        <meta name="twitter:title" content="ShortenURL — Free URL Shortener" />
        <meta name="twitter:description" content="Shorten links fast. No signup required." />
        <meta name="keywords" content="shorten my url, shorten links, shorten link, short my url, site to shorten url, website url shortener, url shortener site, url compressor, tiny link, shorten url, link shortener, short url" />
      </Helmet>
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Free URL Shortener
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          Create short links, QR codes, and track clicks. No signup required.
        </p>
      </div>

      {/* Main Card */}
      <Card className="bg-white border border-gray-200 shadow-lg rounded-lg sm:rounded-xl overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-[#804DE0] rounded-xl flex items-center justify-center shadow-md mb-3">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Shorten Your Link
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4">
            <div className="flex flex-col xs:flex-row gap-3">
              <div className="relative flex-1 w-full">
                <Input 
                  type="url" 
                  placeholder="Paste your long URL here..." 
                  value={url} 
                  onChange={e => setUrl(e.target.value)}
                  className="pl-10 h-12 text-sm sm:text-base border-gray-200 focus:border-[#804DE0] focus:ring-2 focus:ring-[#804DE0]/20 w-full"
                  onKeyPress={e => e.key === 'Enter' && shortenLink()}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link2 className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Button 
                onClick={shortenLink} 
                disabled={isLoading} 
                className="h-12 w-full xs:w-auto px-4 sm:px-6 bg-[#804DE0] hover:bg-[#6d3fc0] text-white font-medium transition-colors text-sm sm:text-base"
              >
                {isLoading ? "Shortening..." : "Shorten URL"}
              </Button>
            </div>
            
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Alias
                  </label>
                  <Input 
                    type="text" 
                    placeholder="myblog" 
                    value={customAlias} 
                    onChange={e => setCustomAlias(e.target.value)} 
                    className="h-10 text-sm border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: {window.location.host}/{customAlias || 'myalias'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Expiration
                  </label>
                  <div className="flex gap-2">
                    <Select value={expirationType} onValueChange={setExpirationType}>
                      <SelectTrigger className="h-10 border-gray-200 bg-white">
                        <SelectValue placeholder="Never expire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never expire</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                    {expirationType !== 'never' && (
                      <Input 
                        type="number" 
                        placeholder="1" 
                        value={expirationValue || ''} 
                        onChange={e => setExpirationValue(parseInt(e.target.value) || 0)} 
                        className="h-10 w-20 border-gray-200 bg-white"
                        min="1"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {expirationType === 'never' ? 'This link will never expire' : `Link will expire after ${expirationValue || 1} ${expirationType}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {shortenedUrl && <Card className="border-success/20 bg-success/5 animate-fade-in">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-success flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Your ShortenURL link is ready!
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
                      <div className="flex gap-2">
                        <Select value={expirationType} onValueChange={setExpirationType}>
                          <SelectTrigger className="h-10 border-gray-200 bg-white">
                            <SelectValue placeholder="Never expire" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">Never expire</SelectItem>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                        {expirationType !== 'never' && (
                          <Input 
                            type="number" 
                            placeholder="1" 
                            value={expirationValue || ''} 
                            onChange={e => setExpirationValue(parseInt(e.target.value) || 0)} 
                            className="h-10 w-20 border-gray-200 bg-white"
                            min="1"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {expirationType === 'never' ? 'This link will never expire' : `Link will expire after ${expirationValue || 1} ${expirationType}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {shortenedUrl && <Card className="border-success/20 bg-success/5 animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-success flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Your ShortenURL link is ready!
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
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Download @2x
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>}

          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-gray-100 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Ultra-fast</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Analytics</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
);
};