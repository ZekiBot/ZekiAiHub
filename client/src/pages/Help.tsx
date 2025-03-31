import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Yardım Merkezi
          </h1>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="faq">Sık Sorulanlar</TabsTrigger>
              <TabsTrigger value="guide">Kullanım Kılavuzu</TabsTrigger>
              <TabsTrigger value="contact">İletişim</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <Card className="border-gray-800">
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border-gray-800">
                      <AccordionTrigger className="text-lg font-medium">
                        ZekiBot nedir?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 py-3">
                        ZekiBot, farklı yapay zeka modellerini tek bir platformda toplayan, 
                        özellikle Türkçe konuşan kullanıcılar için tasarlanmış bir yapay zeka 
                        modellerine erişim platformudur. Platform, teknik bilgisi olmayan kullanıcılar 
                        için de anlaşılır ve kullanımı kolaydır.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-gray-800">
                      <AccordionTrigger className="text-lg font-medium">
                        Hangi yapay zeka modellerini kullanabilirim?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 py-3">
                        ZekiBot, Hugging Face, Google Gemini, Deepseek AI ve Groq gibi farklı 
                        yapay zeka sağlayıcılarının modellerine erişim sunmaktadır. Metin üretme, 
                        görselleri anlama, kod yazma ve dil çevirisi gibi çeşitli yapay zeka 
                        yeteneklerine erişebilirsiniz.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-gray-800">
                      <AccordionTrigger className="text-lg font-medium">
                        Kullanmak için ücret ödemem gerekiyor mu?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 py-3">
                        ZekiBot'un temel özellikleri tamamen ücretsizdir. Platform, ücretsiz 
                        API sağlayan yapay zeka modellerini kullanarak hizmet vermektedir.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border-gray-800">
                      <AccordionTrigger className="text-lg font-medium">
                        Hesap oluşturmam gerekiyor mu?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 py-3">
                        Temel özellikleri kullanmak için hesap oluşturmanız gerekmez. Ancak, 
                        favori modellerinizi kaydetmek, kişiselleştirilmiş öneriler almak ve 
                        rozet sisteminden yararlanmak için ücretsiz bir hesap oluşturabilirsiniz.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border-gray-800">
                      <AccordionTrigger className="text-lg font-medium">
                        Verilerim güvende mi?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 py-3">
                        Evet, ZekiBot kullanıcı gizliliğine önem vermektedir. Kişisel verileriniz 
                        güvenli bir şekilde saklanır ve üçüncü taraflarla paylaşılmaz. Modellerle 
                        yaptığınız etkileşimler sadece hizmet kalitesini artırmak için kullanılabilir.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guide" className="space-y-6">
              <Card className="border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Başlangıç</h2>
                  <p className="text-gray-300 mb-4">
                    ZekiBot'a hoş geldiniz! Platformumuzu kullanmaya başlamak için aşağıdaki 
                    adımları izleyebilirsiniz:
                  </p>
                  <ol className="space-y-3 text-gray-300 list-decimal pl-5">
                    <li>
                      Ana sayfada bulunan kategoriler arasından ilgilendiğiniz bir kategoriyi seçin 
                      (Metin, Görsel, Kod, vb.)
                    </li>
                    <li>
                      Size önerilen modellerden birini seçin veya tüm modellere göz atın
                    </li>
                    <li>
                      Seçtiğiniz modelin detay sayfasında, modelin özelliklerini görebilir ve 
                      hemen kullanmaya başlayabilirsiniz
                    </li>
                    <li>
                      Türkçe sorularınızı yazabilir veya görseller yükleyebilirsiniz
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Modelleri Kullanma</h2>
                  <p className="text-gray-300 mb-4">
                    ZekiBot'ta farklı yeteneklere sahip yapay zeka modellerini kullanabilirsiniz:
                  </p>
                  <div className="space-y-4">
                    <div className="border border-gray-800 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2 flex items-center">
                        <i className="fas fa-comment-alt text-primary mr-2"></i>
                        Metin Modelleri
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Sorular sorabilir, metin oluşturabilir ve çeviriler yapabilirsiniz. 
                        Türkçe diline özel olarak optimize edilmiş modeller bulunmaktadır.
                      </p>
                    </div>

                    <div className="border border-gray-800 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2 flex items-center">
                        <i className="fas fa-image text-primary mr-2"></i>
                        Görsel Modelleri
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Görselleri tanımlayabilir, analiz edebilir veya metinden görsel 
                        oluşturabilirsiniz.
                      </p>
                    </div>

                    <div className="border border-gray-800 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2 flex items-center">
                        <i className="fas fa-code text-primary mr-2"></i>
                        Kod Modelleri
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Kod yazmak, hata ayıklamak veya mevcut kodu açıklamak için 
                        kullanabilirsiniz.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">İpuçları</h2>
                  <ul className="space-y-3 text-gray-300 list-disc pl-5">
                    <li>
                      <span className="font-medium text-white">Net sorular sorun:</span> Yapay 
                      zeka modellerine mümkün olduğunca açık ve net sorular sorarak daha iyi 
                      yanıtlar alabilirsiniz
                    </li>
                    <li>
                      <span className="font-medium text-white">Tek tıkla çeviri:</span> Herhangi 
                      bir modelin yanıtını farklı bir dile çevirmek için çeviri butonunu 
                      kullanabilirsiniz
                    </li>
                    <li>
                      <span className="font-medium text-white">Favorilere ekleyin:</span> Sık 
                      kullandığınız modelleri favorilere ekleyerek daha hızlı erişebilirsiniz
                    </li>
                    <li>
                      <span className="font-medium text-white">Geribildirim verin:</span> Model 
                      yanıtlarına geribildirim vererek platformun iyileştirilmesine katkıda 
                      bulunabilirsiniz
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card className="border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Bize Ulaşın</h2>
                  <p className="text-gray-300 mb-6">
                    Sorularınız, önerileriniz veya geri bildirimleriniz için aşağıdaki kanallardan
                    bize ulaşabilirsiniz:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-800 rounded-lg p-4 transition-all hover:border-primary/50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-envelope text-primary"></i>
                        </div>
                        <h3 className="font-medium text-white">E-posta</h3>
                      </div>
                      <p className="text-gray-300 text-sm ml-13">
                        destek: zekibot
                      </p>
                    </div>

                    <div className="border border-gray-800 rounded-lg p-4 transition-all hover:border-primary/50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <i className="fab fa-twitter text-primary"></i>
                        </div>
                        <h3 className="font-medium text-white">Twitter</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        @ZekiBotAI
                      </p>
                    </div>

                    <div className="border border-gray-800 rounded-lg p-4 transition-all hover:border-primary/50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <i className="fab fa-discord text-primary"></i>
                        </div>
                        <h3 className="font-medium text-white">Discord</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        discord.gg/zekibot
                      </p>
                    </div>

                    <div className="border border-gray-800 rounded-lg p-4 transition-all hover:border-primary/50">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <i className="fab fa-github text-primary"></i>
                        </div>
                        <h3 className="font-medium text-white">GitHub</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        github.com/ZekiBotAI
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium text-white mb-3">Çalışma Saatleri</h3>
                    <p className="text-gray-300">
                      Destek ekibimiz hafta içi 09:00 - 18:00 saatleri arasında sorularınızı 
                      yanıtlamak için hazırdır. Genellikle e-postalara 24 saat içinde 
                      yanıt verilmektedir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}