import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-background to-muted relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Türkçe Yapay Zeka <span className="text-pink-500">Modellerine</span> Kolay Erişim
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            İngilizce bilmeseniz bile, tüm yaş grupları için kolay kullanımlı yapay zeka araçları.
            <span className="block mt-2 text-lg text-gray-400">Çocuklar ve yaşlılar dahil, herkes kullanabilir!</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/models">
              <Button className="relative overflow-hidden group text-lg font-medium h-12">
                <i className="fas fa-robot mr-2"></i>
                Modelleri Keşfet
                <div className="absolute inset-0 bg-white/[0.05] translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
              </Button>
            </Link>
            <Link href="/guides">
              <Button variant="outline" className="text-lg font-medium h-12">
                <i className="fas fa-question-circle mr-2"></i>
                Nasıl Kullanılır?
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-pink-500 blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-40 h-40 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
