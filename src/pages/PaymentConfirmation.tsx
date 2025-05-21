
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentConfirmation = () => {
  return (
    <div className="container mx-auto py-16 px-4 max-w-md text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">Paiement Réussi!</h1>
        
        <p className="text-gray-600 mb-8">
          Votre paiement de 1 000 HTG a été traité avec succès. Nous avons reçu votre demande de prêt
          et notre équipe va l'analyser dans les plus brefs délais.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg w-full text-left">
          <h3 className="font-bold mb-3">Prochaines étapes:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Envoyez votre carte d'identité nationale, 2 photos d'identité et une preuve d'adresse à <strong>documents@ayitiloan.ht</strong></li>
            <li>Notre équipe analysera votre dossier dans les 48 heures</li>
            <li>Vous recevrez une notification par email concernant la décision</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          Un email de confirmation a été envoyé à l'adresse que vous avez fournie.
        </p>
        
        <div className="flex space-x-4 mt-4">
          <Link to="/">
            <Button variant="outline">Retour à l'Accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
