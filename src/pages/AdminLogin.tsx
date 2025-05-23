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

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer votre email et mot de passe.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const authenticated = await authenticateAdmin(email, password);

      if (authenticated) {
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue dans le tableau de bord.',
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: 'Échec de la connexion',
          description: 'Email ou mot de passe incorrect.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue pendant la connexion.',
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
          <CardTitle className="text-2xl font-bold text-center">Connexion Admin</CardTitle>
          <CardDescription className="text-center">
            Entrez vos identifiants pour accéder au tableau de bord
          </CardDescription>
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
                <LockKeyhole className="h-4 w-4" /> Mot de passe
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
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
