
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Loader2 } from 'lucide-react';
import { createPayment, generateOrderId, getPaymentUrl } from '@/services/moncashService';

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const FEE_AMOUNT = 1000; // 1000 HTG fee

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Check if we have form data from the previous step
      const formData = location.state?.formData;
      if (!formData) {
        toast({
          title: "Erreur",
          description: "Aucune donnée de formulaire trouvée. Veuillez remplir à nouveau le formulaire de demande.",
          variant: "destructive"
        });
        navigate('/demande');
        return;
      }

      // Store the loan application data in session storage for retrieval after payment
      sessionStorage.setItem('pendingLoanApplication', JSON.stringify(formData));

      // Generate a unique order ID
      const orderId = generateOrderId();
      
      // Create payment request to MonCash
      const paymentRequest = {
        amount: FEE_AMOUNT,
        orderId: orderId,
        reference: `Frais d'analyse - ${formData.fullName}`
      };

      // Display info toast about upcoming MonCash integration
      toast({
        title: "Création du paiement MonCash",
        description: "Nous préparons votre paiement via MonCash..."
      });

      // Create payment request
      const response = await createPayment(paymentRequest);
      
      if (response && response.payment_token) {
        // Get the payment URL to redirect the user
        const paymentUrl = getPaymentUrl(response.payment_token.token);
        
        // Redirect to MonCash payment page
        window.location.href = paymentUrl;
      } else {
        throw new Error("Réponse de paiement invalide");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      
      toast({
        title: "Erreur de Paiement",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'initialisation du paiement.",
        variant: "destructive"
      });
      
      // Show MonCash temporary unavailable message
      toast({
        title: "MonCash temporairement indisponible",
        description: "Pour le moment, nous allons traiter votre demande sans paiement."
      });

      // Fallback for development/testing: proceed without payment
      setTimeout(() => {
        // If we're in development mode or MonCash is unavailable, submit the form directly
        // Get the form data again since we're in a different scope
        const formData = location.state?.formData;
        if (formData) {
          navigate('/confirmation');
        }
      }, 2000);
    }
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
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="font-semibold text-green-700 mb-2">Payer avec MonCash</h3>
              <p className="text-sm text-green-600">
                En cliquant sur "Payer avec MonCash" ci-dessous, vous serez redirigé vers la plateforme de paiement sécurisée MonCash pour compléter votre transaction.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Traitement en cours...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" /> 
                Payer avec MonCash
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
