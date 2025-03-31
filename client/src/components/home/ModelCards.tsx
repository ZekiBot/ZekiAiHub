import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

const mockModels = [
  {
    id: 1,
    name: "OpenAI GPT Türkçe",
    description: "Türkçe sohbet ve yaratıcı yazı desteği veren gelişmiş dil modeli.",
    category: "chat",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    tags: ["Türkçe Destekli", "Ücretsiz", "Kolay Kullanım"],
    buttonColor: "bg-primary hover:bg-primary/90",
    categoryColor: "bg-primary/90",
  },
  {
    id: 2,
    name: "Stable Diffusion Türkçe",
    description: "Türkçe komutlarla çalışan, muhteşem görseller üreten AI modeli.",
    category: "visual",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    rating: 4.0,
    tags: ["Türkçe Destekli", "Ücretsiz", "Hızlı Sonuç"],
    buttonColor: "bg-indigo-500 hover:bg-indigo-600",
    categoryColor: "bg-indigo-500/90",
  },
  {
    id: 3,
    name: "Code Helper Türkçe",
    description: "Türkçe açıklamalarla kod yazmanıza yardımcı olan yapay zeka.",
    category: "code",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    tags: ["Türkçe Destekli", "Ücretsiz", "Eğitim Amaçlı"],
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    categoryColor: "bg-pink-500/90",
  },
  {
    id: 4,
    name: "Matematik Çözücü",
    description: "Öğrenciler için adım adım matematik problemi çözücü.",
    category: "math",
    imageUrl: "https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    rating: 4.0,
    tags: ["Türkçe Destekli", "Ücretsiz", "Öğrenciler İçin"],
    buttonColor: "bg-green-600 hover:bg-green-700",
    categoryColor: "bg-green-500/90",
  },
  {
    id: 5,
    name: "AI Oyun Arkadaşı",
    description: "Çocuklar için güvenli, eğitici ve eğlenceli oyun arkadaşı.",
    category: "game",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    tags: ["Türkçe Destekli", "Ücretsiz", "Çocuk Dostu"],
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    categoryColor: "bg-yellow-500/90",
  },
  {
    id: 6,
    name: "Sesli Asistan",
    description: "Yaşlı kullanıcılar için kolay kullanımlı sesli yardımcı.",
    category: "chat",
    imageUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    tags: ["Türkçe Destekli", "Ücretsiz", "Yaşlı Dostu"],
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    categoryColor: "bg-blue-500/90",
  },
];

function CategoryLabel({ category, color }: { category: string; color: string }) {
  const categoryMapping = {
    visual: "Görsel",
    chat: "Sohbet",
    math: "Hesap",
    game: "Oyun",
    code: "Kod",
  };
  
  const categoryName = categoryMapping[category as keyof typeof categoryMapping] || category;
  
  return (
    <span className={`absolute top-3 right-3 ${color} text-white text-xs font-medium px-2 py-1 rounded-full`}>
      {categoryName}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  // Geçerli bir rating değerini garanti et
  const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  
  // Rating değerini 0-5 arasında sınırla
  const normalizedRating = Math.max(0, Math.min(5, validRating));
  
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Geçerli dizi uzunluklarını kontrol et
  const fullStarsArray = fullStars > 0 ? Array(fullStars).fill(0) : [];
  const emptyStarsArray = emptyStars > 0 ? Array(emptyStars).fill(0) : [];
  
  return (
    <span className="text-yellow-500">
      {fullStarsArray.map((_, i) => (
        <i key={`full-${i}`} className="fas fa-star"></i>
      ))}
      {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
      {emptyStarsArray.map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star"></i>
      ))}
    </span>
  );
}

export default function ModelCards() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  
  // Bu, gerçek bir API isteği olacak
  const { data: models = mockModels, isLoading } = useQuery({
    queryKey: ["/api/models"],
    // API anahtarını sonra ekleyeceğiz, şimdilik mock data kullanıyoruz
    enabled: false, 
  });
  
  const paginatedModels = models.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Popüler AI Modelleri</h2>
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center justify-center rounded-lg bg-card hover:bg-muted p-2 transition-colors"
              aria-label="Önceki model"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button 
              className="flex items-center justify-center rounded-lg bg-card hover:bg-muted p-2 transition-colors"
              aria-label="Sonraki model"
              onClick={() => setCurrentPage(Math.min(Math.ceil(models.length / itemsPerPage) - 1, currentPage + 1))}
              disabled={(currentPage + 1) * itemsPerPage >= models.length}
            >
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedModels.map((model) => (
            <div 
              key={model.id} 
              className="cursor-pointer" 
              onClick={() => window.location.href = `/models/${model.id}`}
            >
              <Card className="overflow-hidden shadow-lg border border-gray-800 hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] group">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-r from-primary/20 to-indigo-500/20">
                  <img 
                    src={model.imageUrl} 
                    alt={model.name} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <CategoryLabel category={model.category} color={model.categoryColor} />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{model.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{model.description}</p>
                  
                  {model.tags && model.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.tags.map((tag, index) => (
                        <span key={index} className="bg-muted text-xs text-gray-300 px-2 py-1 rounded-full hover:bg-gray-700 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <StarRating rating={model.rating} />
                      <span className="ml-2 text-sm text-gray-400">{model.rating}/5</span>
                    </div>
                    <Button className={model.buttonColor} size="sm">
                      Kullan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <span 
            className="cursor-pointer" 
            onClick={() => window.location.href = '/models'}
          >
            <Button variant="outline" className="px-6 py-6 h-auto text-base">
              Tüm Modelleri Göster
              <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
}
