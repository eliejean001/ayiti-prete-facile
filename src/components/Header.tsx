
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold">
          AYITILOAN
        </Link>
        
        {isMobile ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-primary/80"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            
            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-primary z-50 py-4 shadow-md">
                <nav>
                  <ul className="flex flex-col space-y-4 px-4">
                    <li>
                      <Link 
                        to="/" 
                        className="block py-2 hover:text-secondary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/about" 
                        className="block py-2 hover:text-secondary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        À Propos
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/demande" 
                        className="block py-2 hover:text-secondary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Demander un Prêt
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin" 
                        className="flex items-center py-2 hover:text-secondary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield size={16} className="mr-1" /> Admin
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center">
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
            </ul>
            <div className="ml-6 flex items-center">
              <Link 
                to="/admin" 
                className="flex items-center text-white bg-primary/80 hover:bg-primary/60 px-3 py-1 rounded-md transition-colors"
              >
                <Shield size={16} className="mr-1" /> Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
