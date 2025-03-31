import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <i className="fas fa-robot text-primary text-2xl"></i>
              <span className="font-bold text-[1.75rem] bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                ZekiBot
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Herkes için Türkçe yapay zeka çözümleri sunan platform. İngilizce bilmeseniz bile AI modelleriyle çalışabilirsiniz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Model Kategorileri</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/models?category=visual'}>Görsel Modeller</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/models?category=chat'}>Sohbet Modelleri</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/models?category=math'}>Hesaplama Modelleri</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/models?category=game'}>Oyun Modelleri</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/models?category=code'}>Kod Modelleri</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Yardım ve Destek</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Sıkça Sorulan Sorular</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Kullanım Rehberleri</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Video Eğitimler</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Topluluk Forumu</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>İletişim</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Yasal</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Kullanım Şartları</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Gizlilik Politikası</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Çerez Politikası</span></li>
              <li><span className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Telif Hakkı</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© 2023 ZekiBot. Tüm hakları saklıdır.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Yardım</span>
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Gizlilik</span>
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" onClick={() => window.location.href = '/help'}>Şartlar</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
