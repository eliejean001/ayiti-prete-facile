
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold">
          AYITILOAN
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-secondary transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-secondary transition-colors">
                À Propos
              </Link>
            </li>
            <li>
              <Link to="/demande" className="hover:text-secondary transition-colors">
                Demander un Prêt
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-secondary transition-colors">
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
