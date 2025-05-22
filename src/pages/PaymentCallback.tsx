
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { submitLoanApplication } from '@/services/loanService';

const PaymentCallback = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const processApplication = async () => {
      try {
        // Get loan application from session storage
        const loanApplicationString = sessionStorage.getItem('pendingLoanApplication');
        if (!loanApplicationString) {
          throw new Error('No pending loan application found');
        }

        const loanApplication = JSON.parse(loanApplicationString);
        console.log("Processing application with payment pending verification:", loanApplication);
          
        // Submit the loan application with payment status pending
        // Admin will manually verify the payment
        const application = await submitLoanApplication(loanApplication);
        
        console.log("Application submitted successfully:", application);
        
        // Remove pending application from session storage
        sessionStorage.removeItem('pendingLoanApplication');
        
        toast({
          title: "Demande Soumise",
          description: "Votre demande a été soumise et sera traitée après vérification du paiement."
        });
        
        // Navigate to confirmation page after a short delay
        setTimeout(() => {
          navigate('/confirmation');
        }, 1500);
      } catch (error) {
        console.error('Application submission error:', error);
        toast({
          title: "Erreur de Soumission",
          description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la soumission de votre demande.",
          variant: "destructive"
        });
        
        // Navigate back to application form
        navigate('/demande');
      }
    };

    processApplication();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto py-16 px-4 max-w-md text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-b-transparent"></span>
        </div>
        <h1 className="text-2xl font-bold">Traitement de votre demande...</h1>
        <p className="text-gray-600">
          Votre demande est en cours de traitement. Vous allez être redirigé automatiquement...
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;
