import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, BarChart3, Link, ArrowLeft, Trash2, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LinkData {
  id: string;
  short_code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

const Analytics = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) {
      console.log('No user found for analytics');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching analytics for user:', user.email, 'ID:', user.id);
      
      // Get fresh session to ensure authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No valid session found');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched links:', data?.length || 0);
      setLinks(data || []);
      
      // Calculate total clicks
      const total = (data || []).reduce((sum, link) => sum + link.clicks, 0);
      setTotalClicks(total);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Link deleted successfully",
    });

    // Refresh the data
    fetchAnalytics();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Badge variant="secondary" className="text-sm">
              Real-time data
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{links.length}</div>
              <p className="text-xs text-muted-foreground">
                Shortened links created
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                Across all your links
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Average Clicks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Per link
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Links Table */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Your Shortened Links
            </CardTitle>
            <CardDescription>
              Manage and track the performance of all your shortened links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <div className="text-center py-12">
                <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any shortened links yet. Start by creating your first link!
                </p>
                <Button onClick={() => navigate('/')} className="gap-2">
                  <Link className="h-4 w-4" />
                  Create Link
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Short Link</TableHead>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={`/${link.short_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              {window.location.origin}/{link.short_code}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <span className="text-sm text-muted-foreground truncate block">
                              {truncateUrl(link.original_url)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {link.clicks}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(link.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/${link.short_code}`, '_blank')}
                              className="gap-2 h-8"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                              className="gap-2 h-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;