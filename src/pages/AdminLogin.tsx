
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateAdmin, isAuthenticated } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LockKeyhole, User } from 'lucide-react';
import { setupDefaultAdmins, testAdminLogin } from '@/utils/adminSetup';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('fastloan633@gmail.com'); // Pre-fill with test account
  const [password, setPassword] = useState('AdminPassword2025!'); // Pre-fill with test password
  const [isLoading, setIsLoading] = useState(false);
  const [testCredentials, setTestCredentials] = useState<string>('');

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
      return;
    }

    // Setup default admins on component mount
    const initializeAdmins = async () => {
      try {
        console.log('🚀 Initializing default admin accounts...');
        const successfulAdmins = await setupDefaultAdmins();
        
        if (successfulAdmins.length > 0) {
          const credentialsText = successfulAdmins
            .map(admin => `${admin.email} / ${admin.password}`)
            .join(' or ');
          setTestCredentials(credentialsText);
          
          toast({
            title: "Test Credentials Available",
            description: `You can use: ${successfulAdmins[0].email}`,
          });
        }
      } catch (error) {
        console.error('❌ Failed to initialize admins:', error);
      }
    };

    initializeAdmins();
  }, [navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('🔐 Attempting login for:', email);

    try {
      // First test the credentials
      const testResult = await testAdminLogin(email, password);
      console.log('🧪 Pre-login test result:', testResult);

      // Proceed with actual authentication
      const authenticated = await authenticateAdmin(email, password);

      if (authenticated) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to the admin dashboard.',
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
          {testCredentials && (
            <div className="text-xs text-center p-2 bg-blue-50 rounded">
              Test credentials: {testCredentials}
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
