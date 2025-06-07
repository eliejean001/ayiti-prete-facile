
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-primary text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={isMobile ? "text-center" : ""}>
            <h3 className="text-xl font-bold mb-4">AYITILOAN</h3>
            <p className="text-sm">
              Votre partenaire financier de confiance. Nous offrons des solutions de prêt rapides et flexibles pour tous vos besoins.
            </p>
          </div>
          <div className={isMobile ? "text-center" : ""}>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm mb-2">Email: contact@ayitiloan.com</p>
            <p className="text-sm mb-2">Téléphone: +509 3687 2957</p>
            <p className="text-sm mb-2">Natcash: +509 4035 3657</p>
            <p className="text-sm">Adresse: 4, rue Bethanie, Delmas 75 Carradeux</p>
          </div>
          <div className={isMobile ? "text-center" : ""}>
            <h3 className="text-lg font-bold mb-4">Liens Utiles</h3>
            <div className="space-y-2">
              <div>
                <Link 
                  to="/conditions" 
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Conditions Générales
                </Link>
              </div>
              <p className="text-sm">Lun - Ven: 8h30 - 16h30</p>
              <p className="text-sm">Sam: 9h00 - 13h00</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} AYITILOAN. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
