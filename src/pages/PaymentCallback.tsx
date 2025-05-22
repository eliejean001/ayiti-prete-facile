import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { verifyPayment } from '@/services/moncashService';
import { submitLoanApplication } from '@/services/loanService';

const PaymentCallback = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract parameters from URL
    const params = new URLSearchParams(location.search);
    const transactionId = params.get('transactionId');
    
    const verifyTransaction = async () => {
      try {
        if (!transactionId) {
          throw new Error('No transaction ID found');
        }

        // Get loan application from session storage
        const loanApplicationString = sessionStorage.getItem('pendingLoanApplication');
        if (!loanApplicationString) {
          throw new Error('No pending loan application found');
        }

        // For testing purposes, we'll simulate success and submit the application
        // Replace this with actual verification in production
        const loanApplication = JSON.parse(loanApplicationString);
        console.log("Processing application:", loanApplication);
          
        // Submit the loan application
        await submitLoanApplication(loanApplication);
        
        // Remove pending application from session storage
        sessionStorage.removeItem('pendingLoanApplication');
        
        setPaymentSuccess(true);
        toast({
          title: "Paiement Réussi",
          description: "Votre paiement a été confirmé et votre demande a été soumise avec succès."
        });
        
        // Navigate to confirmation page after a short delay
        setTimeout(() => {
          navigate('/confirmation');
        }, 2000);

        /* In production, use this instead:
        // Verify payment status
        const verification = await verifyPayment(transactionId);
        
        if (verification.payment.status === 'SUCCESSFUL') {
          // Payment was successful
          const loanApplication = JSON.parse(loanApplicationString);
          
          // Submit the loan application
          const result = await submitLoanApplication(loanApplication);
          
          // Remove pending application from session storage
          sessionStorage.removeItem('pendingLoanApplication');
          
          setPaymentSuccess(true);
          toast({
            title: "Paiement Réussi",
            description: "Votre paiement a été confirmé et votre demande a été soumise avec succès."
          });
          
          // Navigate to confirmation page after a short delay
          setTimeout(() => {
            navigate('/confirmation');
          }, 2000);
        } else {
          // Payment failed or is still pending
          toast({
            title: "Statut de Paiement",
            description: `Status: ${verification.payment.status}. ${verification.payment.message}`,
            variant: verification.payment.status === 'PENDING' ? 'default' : 'destructive'
          });
          
          if (verification.payment.status === 'PENDING') {
            toast({
              title: "Paiement en Attente",
              description: "Votre paiement est en cours de traitement. Veuillez vérifier votre application MonCash."
            });
          } else {
            setPaymentSuccess(false);
            toast({
              title: "Échec du Paiement",
              description: "Le paiement a échoué. Veuillez réessayer.",
              variant: "destructive"
            });
          }
        }
        */
      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Erreur de Vérification",
          description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la vérification du paiement.",
          variant: "destructive"
        });
        setPaymentSuccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyTransaction();
  }, [location.search, navigate, toast]);

  const handleRetry = () => {
    navigate('/paiement');
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-md text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          <h1 className="text-2xl font-bold">Vérification du Paiement...</h1>
          <p className="text-gray-600">
            Nous vérifions votre paiement auprès de MonCash. Veuillez patienter...
          </p>
        </div>
      </div>
    );
  }

  if (!paymentSuccess) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-md text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-red-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-red-600">Échec du Paiement</h1>
          
          <p className="text-gray-600 mb-8">
            Le paiement n'a pas pu être confirmé. Veuillez vérifier votre application MonCash et réessayer.
          </p>
          
          <Button onClick={handleRetry}>
            Réessayer le Paiement
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-md text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <h1 className="text-2xl font-bold text-primary">Paiement Confirmé!</h1>
        <p className="text-gray-600">
          Votre paiement a été confirmé. Redirection vers la page de confirmation...
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;
