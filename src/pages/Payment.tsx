
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePaymentUrl } from '@/services/moncashService';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get formData from location state
  const { formData } = location.state || {};
  
  useEffect(() => {
    // If no form data, redirect back to application form
    if (!formData) {
      toast({
        title: "Erreur",
        description: "Aucune information de demande trouvée. Veuillez remplir le formulaire de demande.",
        variant: "destructive"
      });
      navigate('/demande');
    } else {
      // Store form data in session storage for later retrieval
      sessionStorage.setItem('pendingLoanApplication', JSON.stringify(formData));
      console.log("Loan application stored in session:", formData);
    }
  }, [formData, navigate, toast]);
  
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // For demonstration purposes, we'll go directly to the callback
      // In production, this should call the actual MonCash API
      navigate('/payment-callback?transactionId=demo12345');
      
      /* In production, use this:
      const paymentUrl = await generatePaymentUrl(1000); // 1000 HTG fee
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Failed to generate payment URL");
      }
      */
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erreur de Paiement",
        description: "Impossible de procéder au paiement. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  if (!formData) {
    return null; // Will redirect in useEffect
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-HT', { 
      style: 'currency', 
      currency: 'HTG',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">Paiement des Frais</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Frais d'Analyse de Dossier</CardTitle>
          <CardDescription>
            Veuillez payer les frais d'analyse de dossier pour continuer votre demande de prêt.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-3">Résumé de la Demande</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Nom:</div>
              <div className="font-semibold text-right">{formData.fullName}</div>
              
              <div>Montant demandé:</div>
              <div className="font-semibold text-right">{formatCurrency(formData.amount)}</div>
              
              <div>Durée:</div>
              <div className="font-semibold text-right">{formData.duration} mois</div>
            </div>
          </div>
          
          <div className="border-t border-b py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Frais d'analyse de dossier:</span>
              <span className="font-bold text-xl">{formatCurrency(1000)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ces frais sont non remboursables et servent à couvrir l'analyse de votre demande de prêt.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handlePayment} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Traitement...
              </>
            ) : (
              'Payer avec MonCash'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Votre paiement sera traité par MonCash, la plateforme de paiement mobile de Digicel Haïti.
      </p>
    </div>
  );
};

export default Payment;
