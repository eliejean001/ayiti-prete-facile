
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Phone } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const handleContinue = () => {
    // Since the payment is now manual, just navigate to a confirmation page
    // explaining that the application is pending review and payment verification
    navigate('/payment-callback?transactionId=pending');
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
            Veuillez choisir votre méthode de paiement pour les frais d'analyse de dossier.
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

          {/* Payment Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center">Options de Paiement</h3>
            
            {/* MonCash Payment */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3 text-center">MonCash</h4>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 border rounded-lg shadow-sm">
                  <img 
                    src="/lovable-uploads/c164f657-192e-4bc4-9534-e8e2622bde50.png"
                    alt="Code QR MonCash"
                    className="w-full h-auto max-w-[200px]"
                  />
                </div>
                <p className="text-center text-sm font-semibold mt-2">Scannez ce code avec votre application MonCash</p>
                
                <div className="mt-3 bg-blue-50 p-3 rounded-md border border-blue-100 text-sm w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Pas de QR? Envoyez à:</span>
                  </div>
                  <p className="font-bold text-center text-lg">+509 3687 2957</p>
                </div>
              </div>
            </div>

            {/* Natcash Payment */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3 text-center">Natcash</h4>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 border rounded-lg shadow-sm">
                  <img 
                    src="/lovable-uploads/21b917e6-0beb-4dd3-9e6f-885325fdf624.png"
                    alt="Code QR Natcash"
                    className="w-full h-auto max-w-[200px]"
                  />
                </div>
                <p className="text-center text-sm font-semibold mt-2">Scannez ce code avec votre application Natcash</p>
                
                <div className="mt-3 bg-green-50 p-3 rounded-md border border-green-100 text-sm w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Pas de QR? Envoyez à:</span>
                  </div>
                  <p className="font-bold text-center text-lg">+509 4035 3657</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm">
              <p className="font-medium mb-1">⚠️ Important:</p>
              <p>Utilisez exactement le même nom lors du paiement: <strong>{formData.fullName}</strong></p>
              <p className="mt-2">Si vous ne pouvez pas scanner les codes QR, envoyez simplement l'argent aux numéros indiqués ci-dessus.</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleContinue} 
            className="w-full"
          >
            <QrCode className="mr-2 h-4 w-4" /> J'ai effectué le paiement
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Vos paiements seront traités par MonCash (Digicel) ou Natcash.
        Un administrateur vérifiera votre paiement avant d'approuver votre demande.
      </p>
    </div>
  );
};

export default Payment;
