
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AYITILOAN</h3>
            <p className="text-sm">
              Votre partenaire financier de confiance. Nous offrons des solutions de prêt rapides et flexibles pour tous vos besoins.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm mb-2">Email: contact@ayitiloan.ht</p>
            <p className="text-sm mb-2">Téléphone: +509 2946 7890</p>
            <p className="text-sm">Adresse: Port-au-Prince, Haïti</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Heures d'Ouverture</h3>
            <p className="text-sm mb-2">Lun - Ven: 8h30 - 16h30</p>
            <p className="text-sm">Sam: 9h00 - 13h00</p>
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
