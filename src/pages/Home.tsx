
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Home: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-white py-16 md:py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AYITILOAN</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Des solutions de prêt flexibles jusqu'à 500 000 HTG pour répondre à tous vos besoins financiers.
            </p>
            <Link to="/demande">
              <Button className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-6 py-3 md:px-8 md:py-6 text-base md:text-lg">
                Demander un Prêt Maintenant
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Pourquoi Choisir AYITILOAN?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-primary text-3xl md:text-4xl mb-4">⚡</div>
                <h3 className="text-lg md:text-xl font-bold mb-3">Traitement Rapide</h3>
                <p className="text-gray-600">Obtenez une décision sur votre demande de prêt en moins de 48 heures.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-primary text-3xl md:text-4xl mb-4">💰</div>
                <h3 className="text-lg md:text-xl font-bold mb-3">Taux Compétitifs</h3>
                <p className="text-gray-600">Des taux d'intérêt à partir de 3%, adaptés à votre profil.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-primary text-3xl md:text-4xl mb-4">🔒</div>
                <h3 className="text-lg md:text-xl font-bold mb-3">Sécurité Garantie</h3>
                <p className="text-gray-600">Vos informations personnelles sont protégées avec le plus haut niveau de sécurité.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Notre Processus</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-bold mb-2">Remplir le Formulaire</h3>
                <p className="text-gray-600">Complétez notre formulaire en ligne en quelques minutes.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-bold mb-2">Payer les Frais d'Analyse</h3>
                <p className="text-gray-600">Réglez les frais de 1 000 HTG pour l'analyse de votre dossier.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-bold mb-2">Analyse du Dossier</h3>
                <p className="text-gray-600">Notre équipe analyse votre demande en moins de 48 heures.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="font-bold mb-2">Obtenir votre Prêt</h3>
                <p className="text-gray-600">Si approuvé, recevez les fonds rapidement sur votre compte.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 px-4 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Prêt à Demander un Prêt?</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Remplissez notre formulaire en ligne et commencez votre processus de demande de prêt dès aujourd'hui.
            </p>
            <Link to="/demande">
              <Button className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-6 py-3 md:px-8 md:py-6 text-base md:text-lg">
                Commencer Ma Demande
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
