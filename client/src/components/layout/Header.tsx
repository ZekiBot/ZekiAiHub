import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/auth/LoginModal";
import AccessibilityToggle from "@/components/shared/AccessibilityToggle";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative bg-background shadow-md">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="fas fa-robot text-primary text-2xl"></i>
            <span className="font-bold text-[1.75rem] bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent cursor-pointer" onClick={() => handleNavigation('/')}>
              ZekiBot
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-lg">
            <span className="text-white font-medium hover:text-primary transition-colors cursor-pointer" onClick={() => handleNavigation('/')}>
              Anasayfa
            </span>
            <span className="text-gray-300 hover:text-primary transition-colors cursor-pointer" onClick={() => handleNavigation('/models')}>
              Modeller
            </span>
            <span className="text-gray-300 hover:text-primary transition-colors cursor-pointer" onClick={() => handleNavigation('/about')}>
              Hakkımızda
            </span>
            <span className="text-gray-300 hover:text-primary transition-colors cursor-pointer" onClick={() => handleNavigation('/help')}>
              Yardım
            </span>
            {user?.isAdmin && (
              <span className="text-gray-300 hover:text-primary transition-colors cursor-pointer" onClick={() => handleNavigation('/admin')}>
                Yönetim
              </span>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Erişilebilirlik butonu daha sonra eklenecek */}
            {/* <div className="hidden md:block">
              <AccessibilityToggle />
            </div> */}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.avatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                )}
                <Button 
                  variant="default" 
                  className="hidden sm:flex items-center relative overflow-hidden group"
                  onClick={() => logout()}
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  <span>Çıkış Yap</span>
                  <div className="absolute inset-0 bg-white/[0.05] translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                className="hidden sm:flex items-center relative overflow-hidden group"
                onClick={openLoginModal}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                <span>Giriş Yap</span>
                <div className="absolute inset-0 bg-white/[0.05] translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
              </Button>
            )}
            
            <button 
              className="md:hidden text-gray-200 hover:text-white focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-muted z-50">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <div className="block py-2 text-white font-medium cursor-pointer" onClick={() => handleNavigation('/')}>
              Anasayfa
            </div>
            <div className="block py-2 text-gray-300 cursor-pointer" onClick={() => handleNavigation('/models')}>
              Modeller
            </div>
            <div className="block py-2 text-gray-300 cursor-pointer" onClick={() => handleNavigation('/about')}>
              Hakkımızda
            </div>
            <div className="block py-2 text-gray-300 cursor-pointer" onClick={() => handleNavigation('/help')}>
              Yardım
            </div>
            {user?.isAdmin && (
              <div className="block py-2 text-gray-300 cursor-pointer" onClick={() => handleNavigation('/admin')}>
                Yönetim
              </div>
            )}
            
            {isAuthenticated ? (
              <Button 
                variant="default" 
                className="flex w-full items-center justify-center mt-4"
                onClick={() => logout()}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                <span>Çıkış Yap</span>
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="flex w-full items-center justify-center mt-4"
                onClick={openLoginModal}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                <span>Giriş Yap</span>
              </Button>
            )}
          </div>
        </div>
      )}

      <LoginModal />
    </header>
  );
}
