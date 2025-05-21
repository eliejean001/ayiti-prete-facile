
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = () => {
    // Display info toast about upcoming MonCash integration
    toast({
      title: "MonCash sera bientôt disponible",
      description: "Le paiement par MonCash sera bientôt disponible. Pour le moment, nous validons votre demande sans paiement."
    });

    // Simulate successful payment for demonstration purposes
    // This will be replaced with actual MonCash integration
    setTimeout(() => {
      toast({
        title: "Demande Reçue",
        description: "Votre demande a été enregistrée avec succès. Nous allons analyser votre dossier."
      });
      navigate('/confirmation');
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Frais d'Analyse</CardTitle>
          <CardDescription>
            Frais pour l'analyse de votre demande de prêt
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="border-y py-4">
            <div className="flex justify-between items-center">
              <span>Frais d'analyse de dossier:</span>
              <span className="font-bold">1 000 HTG</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ces frais sont non remboursables et couvrent le processus d'analyse de votre demande de prêt.
            </p>
          </div>
          
          <div className="space-y-4 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <h3 className="font-semibold text-amber-700 mb-2">MonCash - Bientôt Disponible</h3>
              <p className="text-sm text-amber-600">
                Le paiement par MonCash sera bientôt intégré à notre plateforme.
                Pour le moment, votre demande sera soumise sans paiement.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handlePayment}
          >
            <DollarSign className="mr-2 h-4 w-4" /> 
            Continuer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
