import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function CallToAction() {
  const { isAuthenticated, openLoginModal } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-pink-500/10 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Yapay Zeka Dünyasını Keşfetmeye Başlayın</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          ZekiBot ile yapay zekanın gücünü keşfedin. Hemen ücretsiz hesap oluşturun ve Türkçe AI modellerini kullanmaya başlayın.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          {!isAuthenticated && (
            <Button 
              onClick={openLoginModal}
              className="relative overflow-hidden group text-lg font-medium flex-1 h-12"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Ücretsiz Kaydol
              <div className="absolute inset-0 bg-white/[0.05] translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
            </Button>
          )}
          <Button 
            variant="outline" 
            className="text-lg font-medium flex-1 h-12"
            onClick={() => window.location.href = "/help"}
          >
            <i className="fas fa-info-circle mr-2"></i>
            Daha Fazla Bilgi
          </Button>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-primary blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-60 h-60 rounded-full bg-pink-500 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
