
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = () => {
    // Simulating a payment process
    setTimeout(() => {
      toast({
        title: "Paiement Réussi",
        description: "Votre paiement de 1 000 HTG a été traité avec succès. Nous allons analyser votre dossier."
      });
      navigate('/confirmation');
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Paiement des Frais d'Analyse</CardTitle>
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
          
          <div className="space-y-4">
            <h3 className="font-semibold">Options de Paiement</h3>
            
            <div className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50 cursor-pointer">
              <input 
                type="radio" 
                id="card" 
                name="paymentMethod" 
                defaultChecked 
              />
              <label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" /> 
                Carte de Crédit/Débit
              </label>
            </div>
            
            <div className="space-y-3 p-4 border rounded-md">
              <div className="space-y-1">
                <label htmlFor="cardNumber" className="text-sm">
                  Numéro de Carte
                </label>
                <input 
                  type="text" 
                  id="cardNumber"
                  className="w-full p-2 border rounded-md"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="expiry" className="text-sm">
                    Date d'Expiration
                  </label>
                  <input 
                    type="text" 
                    id="expiry"
                    className="w-full p-2 border rounded-md"
                    placeholder="MM/YY"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="cvc" className="text-sm">
                    CVC
                  </label>
                  <input 
                    type="text" 
                    id="cvc"
                    className="w-full p-2 border rounded-md"
                    placeholder="123"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="nameOnCard" className="text-sm">
                  Nom sur la Carte
                </label>
                <input 
                  type="text" 
                  id="nameOnCard"
                  className="w-full p-2 border rounded-md"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handlePayment}
          >
            <CreditCard className="mr-2 h-4 w-4" /> 
            Payer 1 000 HTG
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
