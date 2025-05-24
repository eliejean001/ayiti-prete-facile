
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { setupDefaultAdmins, testAdminLogin } from '@/utils/adminSetup';

interface AdminSetupProps {
  onSetupComplete: () => void;
}

const AdminSetup = ({ onSetupComplete }: AdminSetupProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<string>('');

  // Auto-setup default admins on component mount
  useEffect(() => {
    const autoSetup = async () => {
      try {
        console.log('🚀 Auto-setting up default admin accounts...');
        const successfulAdmins = await setupDefaultAdmins();
        
        if (successfulAdmins.length > 0) {
          setSetupStatus(`✅ Default admin accounts ready. You can use: ${successfulAdmins.map(a => a.email).join(', ')}`);
          
          // Test the first admin account
          const firstAdmin = successfulAdmins[0];
          const loginTest = await testAdminLogin(firstAdmin.email, firstAdmin.password);
          
          if (loginTest) {
            console.log('✅ Admin login test passed');
            toast({
              title: "Admin Setup Complete",
              description: `Default admin accounts are ready. Test credentials: ${firstAdmin.email}`,
            });
          } else {
            console.warn('⚠️ Admin login test failed');
          }
        }
      } catch (error) {
        console.error('❌ Auto-setup failed:', error);
        setSetupStatus('⚠️ Auto-setup encountered issues. Manual setup available below.');
      }
    };
    
    autoSetup();
  }, [toast]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { setupInitialAdmin } = await import('@/utils/passwordUtils');
      await setupInitialAdmin(email, password);
      
      // Test the login
      const loginTest = await testAdminLogin(email, password);
      
      if (loginTest) {
        toast({
          title: "Success",
          description: `Admin account created and tested successfully for ${email}`,
        });
        onSetupComplete();
      } else {
        toast({
          title: "Warning",
          description: "Admin account created but login test failed. Please try logging in.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Setup error:", error);
      toast({
        title: "Error",
        description: "Unable to create admin account.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Setup</CardTitle>
          <CardDescription className="text-center">
            Set up administrator accounts
          </CardDescription>
          {setupStatus && (
            <div className="text-sm text-center p-2 bg-blue-50 rounded">
              {setupStatus}
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSetup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  Setting up...
                </>
              ) : (
                'Create Additional Admin Account'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminSetup;
