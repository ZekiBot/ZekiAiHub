import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Hakkımızda
          </h1>
          
          <div className="space-y-8">
            <Card className="overflow-hidden border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">ZekiBot Nedir?</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  ZekiBot, yapay zeka teknolojilerini herkes için erişilebilir kılma vizyonuyla 
                  kurulmuş bir Türk platformudur. Misyonumuz, farklı yapay zeka modellerini tek bir 
                  çatı altında toplayarak, özellikle Türkçe konuşanlar ve teknik bilgisi 
                  olmayan kullanıcılar için kolay ve anlaşılır bir deneyim sunmaktır.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Platformumuz, yaşlılar, çocuklar ve teknoloji konusunda yeterli bilgisi 
                  olmayanlar dahil olmak üzere her kesimden kullanıcının yapay zeka modellerini 
                  kolayca keşfedebilmesi, anlayabilmesi ve kullanabilmesi için özel olarak tasarlanmıştır.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">Vizyonumuz</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Yapay zeka teknolojilerini Türkçe konuşan topluluk için daha erişilebilir 
                  kılarak dijital eşitsizliği azaltmak ve herkesin bu teknolojiden 
                  yararlanmasını sağlamak için çalışıyoruz.
                </p>
                <ul className="space-y-3 text-gray-300 list-disc pl-5">
                  <li>
                    <span className="font-medium text-white">Kapsayıcılık:</span> Yaş, teknik 
                    bilgi düzeyi veya engel durumu ne olursa olsun herkesin kullanabileceği 
                    bir platform oluşturmak
                  </li>
                  <li>
                    <span className="font-medium text-white">Türkçe Odaklı:</span> Yapay zeka 
                    modellerini Türkçe dil desteği ile sunarak dil bariyerini ortadan kaldırmak
                  </li>
                  <li>
                    <span className="font-medium text-white">Eğitim Odaklı:</span> Kullanıcıların 
                    yapay zeka kavramlarını ve kullanım alanlarını eğlenceli ve etkileşimli bir 
                    şekilde öğrenmelerini sağlamak
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">Ekibimiz</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  ZekiBot, yapay zeka tutkunu, kullanıcı deneyimi uzmanı ve yazılım geliştiricilerden 
                  oluşan bir ekip tarafından geliştirilmiştir. Türkiye'nin farklı şehirlerinden 
                  bir araya gelen ekibimiz, teknolojiyi herkes için erişilebilir kılma ortak 
                  hedefiyle çalışmaktadır.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-pink-500 mx-auto flex items-center justify-center">
                      <i className="fas fa-brain text-white text-2xl"></i>
                    </div>
                    <h3 className="font-medium mt-2 text-white">Yapay Zeka Uzmanları</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-primary mx-auto flex items-center justify-center">
                      <i className="fas fa-code text-white text-2xl"></i>
                    </div>
                    <h3 className="font-medium mt-2 text-white">Yazılım Geliştiricileri</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mx-auto flex items-center justify-center">
                      <i className="fas fa-users text-white text-2xl"></i>
                    </div>
                    <h3 className="font-medium mt-2 text-white">Kullanıcı Deneyimi Tasarımcıları</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">İletişim</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  ZekiBot hakkında daha fazla bilgi almak, işbirliği yapmak veya geri 
                  bildirimde bulunmak için bizimle iletişime geçebilirsiniz.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <span className="text-gray-300">iletisim@zekibot.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                    </div>
                    <span className="text-gray-300">İstanbul, Türkiye</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <i className="fab fa-twitter text-primary"></i>
                    </div>
                    <span className="text-gray-300">@ZekiBotAI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <i className="fab fa-github text-primary"></i>
                    </div>
                    <span className="text-gray-300">github.com/ZekiBotAI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}