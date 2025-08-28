import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Link, Mail, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Password requirements helper
const validatePassword = (password: string) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return '';
};

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const [formErrors, setFormErrors] = useState<{email?: string; password?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateForm = (isSignUp = false) => {
    const errors: {email?: string; password?: string} = {};
    
    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (isSignUp) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    
    if (error) {
      console.error('Sign in error:', error);
      // More specific error messages based on error code
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before signing in.';
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    
    setIsSubmitting(true);
    const { error } = await signUp(email.trim(), password);
    
    if (error) {
      console.error('Sign up error:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Try signing in instead.';
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      // Clear form on successful sign up
      setEmail('');
      setPassword('');
      setFormErrors({});
      
      toast({
        title: "Check your email",
        description: "We've sent a confirmation link to your email address.",
      });
      
      // Switch to sign in tab after successful sign up
      setActiveTab('signin');
    }
    
    setIsSubmitting(false);
  };

  const isLoading = authLoading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              ShortenURL
            </h1>
          </div>
          <p className="text-muted-foreground">
            Create an account or sign in to manage your shortened links
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome to ShortenURL</CardTitle>
            <CardDescription>
              {activeTab === 'signin' 
                ? 'Sign in to your account' 
                : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {formErrors.email && (
                    <Alert variant="destructive" className="text-sm py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formErrors.email}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn("h-11 pl-10", formErrors.email && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <button 
                        type="button" 
                        className="text-xs text-muted-foreground hover:underline"
                        onClick={() => {
                          toast({
                            title: "Reset Password",
                            description: "Please contact support to reset your password.",
                          });
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn("h-11 pl-10", formErrors.password && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.password && (
                      <p className="text-xs text-destructive">{formErrors.password}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-11"
                    onClick={() => {
                      toast({
                        title: "Coming soon",
                        description: "Social logins will be available soon!",
                      });
                    }}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {(formErrors.email || formErrors.password) && (
                    <Alert variant="destructive" className="text-sm py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {formErrors.email || formErrors.password}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn("h-11 pl-10", formErrors.email && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password (min 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn("h-11 pl-10", formErrors.password && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                    {activeTab === 'signup' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Use 8+ characters with uppercase letters and numbers.
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </div>
                  
                  <p className="px-2 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center py-4 border-t bg-muted/30">
            <p className="text-center text-sm text-muted-foreground">
              {activeTab === 'signin' ? (
                <>
                  Don't have an account?{" "}
                  <button 
                    type="button" 
                    className="font-medium text-primary hover:underline"
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button 
                    type="button" 
                    className="font-medium text-primary hover:underline"
                    onClick={() => setActiveTab('signin')}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
        
        {/* Footer intentionally removed on auth page */}
      </div>
    </div>
  );
};

export default Auth;