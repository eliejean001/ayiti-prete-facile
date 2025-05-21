
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
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
                        className="block py-2 hover:text-secondary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
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
        )}
      </div>
    </header>
  );
};

export default Header;
