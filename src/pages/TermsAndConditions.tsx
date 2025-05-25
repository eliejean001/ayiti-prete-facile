
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const TermsAndConditions: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Conditions Générales d'Utilisation</h1>
      
      <div className="space-y-6 md:space-y-8">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">1. Objet</h2>
            <p className="text-gray-700 mb-4">
              Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation des services 
              de prêt proposés par AYITILOAN. En utilisant nos services, vous acceptez de vous conformer 
              à ces conditions.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">2. Conditions d'Éligibilité</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Pour être éligible à nos services de prêt, vous devez :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Être âgé de 18 ans minimum</li>
                <li>Résider en Haïti</li>
                <li>Avoir un revenu stable et vérifiable</li>
                <li>Fournir tous les documents requis</li>
                <li>Ne pas être inscrit sur une liste de défaillants</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">3. Processus de Demande</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Le processus de demande comprend :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Remplissage du formulaire de demande en ligne</li>
                <li>Paiement des frais d'analyse de 1 000 HTG (non remboursables)</li>
                <li>Soumission des documents justificatifs</li>
                <li>Évaluation de votre dossier par notre équipe</li>
                <li>Notification de la décision dans un délai de 48 heures</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">4. Frais et Taux d'Intérêt</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Frais d'analyse :</strong> 1 000 HTG (non remboursables, payés avant l'analyse)</p>
              <p><strong>Taux d'intérêt :</strong> À partir de 3% selon votre profil de crédit</p>
              <p><strong>Montant maximum :</strong> 500 000 HTG</p>
              <p><strong>Durée de remboursement :</strong> Variable selon les termes du prêt approuvé</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">5. Obligations de l'Emprunteur</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>En tant qu'emprunteur, vous vous engagez à :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Fournir des informations exactes et complètes</li>
                <li>Effectuer les remboursements selon l'échéancier convenu</li>
                <li>Notifier AYITILOAN de tout changement de situation</li>
                <li>Utiliser le prêt aux fins déclarées dans la demande</li>
                <li>Respecter toutes les conditions du contrat de prêt</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">6. Protection des Données</h2>
            <p className="text-gray-700 mb-4">
              AYITILOAN s'engage à protéger vos données personnelles conformément à la législation 
              haïtienne en vigueur. Vos informations ne seront partagées qu'avec votre consentement 
              explicite ou selon les exigences légales.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">7. Défaut de Paiement</h2>
            <p className="text-gray-700 mb-4">
              En cas de défaut de paiement, AYITILOAN se réserve le droit d'appliquer des frais 
              de retard et d'entamer des procédures de recouvrement conformément à la législation 
              en vigueur. Le défaut peut également affecter votre cote de crédit.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">8. Limitation de Responsabilité</h2>
            <p className="text-gray-700 mb-4">
              AYITILOAN ne saurait être tenu responsable des dommages indirects résultant de 
              l'utilisation de ses services. Notre responsabilité est limitée au montant du prêt accordé.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">9. Droit Applicable</h2>
            <p className="text-gray-700 mb-4">
              Les présentes conditions sont régies par le droit haïtien. Tout litige sera soumis 
              à la compétence exclusive des tribunaux haïtiens.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">10. Contact</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Pour toute question concernant ces conditions :</strong></p>
              <p>Email : contact@ayitiloan.com</p>
              <p>Téléphone : +509 3687 2957</p>
              <p>Adresse : 4, rue Bethanie, Delmas 75 Carradeux</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
