import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/');
      return;
    }

    // Handle the OAuth redirect
    const handleOAuthRedirect = async () => {
      try {
        // This will parse the URL and complete the sign in if there's a session in the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          toast({
            title: 'Successfully signed in!',
            description: 'Welcome back!',
          });
          navigate('/');
        } else {
          // No session found, redirect to login
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        toast({
          title: 'Error',
          description: 'Failed to sign in. Please try again.',
          variant: 'destructive',
        });
        navigate('/auth');
      }
    };

    handleOAuthRedirect();
  }, [navigate, toast, user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
