
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const About: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">À Propos de AYITILOAN</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Notre Mission</h2>
            <p className="text-gray-700 mb-4">
              Chez AYITILOAN, notre mission est de fournir des solutions de financement accessibles
              et transparentes aux Haïtiens. Nous croyons que chacun mérite une chance de réaliser 
              ses projets personnels et professionnels grâce à un accès équitable au crédit.
            </p>
            <p className="text-gray-700">
              Nous nous engageons à offrir des prêts avec des conditions claires et des taux d'intérêt
              compétitifs, tout en accompagnant nos clients à chaque étape du processus.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Notre Vision</h2>
            <p className="text-gray-700 mb-4">
              Nous aspirons à devenir le leader du financement personnel en Haïti, reconnu pour notre 
              intégrité, notre innovation et notre engagement envers la satisfaction client.
            </p>
            <p className="text-gray-700">
              Notre vision est de contribuer au développement économique d'Haïti en permettant aux 
              individus et aux petites entreprises de prospérer grâce à nos services financiers.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8 md:mb-12">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Notre Histoire</h2>
            <p className="text-gray-700 mb-4">
              Fondé en 2023, AYITILOAN est né de la volonté de combler un vide dans le secteur 
              financier haïtien. Face aux difficultés rencontrées par de nombreux Haïtiens pour 
              obtenir des prêts, nos fondateurs ont décidé de créer une alternative moderne, 
              accessible et centrée sur le client.
            </p>
            <p className="text-gray-700">
              Depuis notre création, nous avons aidé des centaines de personnes à financer leurs 
              projets, qu'il s'agisse de l'éducation de leurs enfants, du lancement d'une petite 
              entreprise ou de la rénovation de leur maison.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        <Card className="shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="text-primary text-3xl md:text-4xl mb-4">⚖️</div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Transparence</h3>
            <p className="text-gray-600">
              Nous croyons à une communication claire et honnête. Pas de frais cachés, pas de 
              surprises désagréables.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="text-primary text-3xl md:text-4xl mb-4">🤝</div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Confiance</h3>
            <p className="text-gray-600">
              Construire des relations durables avec nos clients basées sur la confiance mutuelle 
              et le respect.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg sm:col-span-2 md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="text-primary text-3xl md:text-4xl mb-4">💼</div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Excellence</h3>
            <p className="text-gray-600">
              Nous nous efforçons d'offrir un service de la plus haute qualité à chacun de nos clients.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
