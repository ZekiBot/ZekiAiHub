import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getTurkishModels } from "@/lib/huggingface";

// Kategori renklerini tanımla
const categoryColors = {
  "text-generation": {
    buttonColor: "bg-primary hover:bg-primary/90",
    categoryColor: "bg-primary/90",
  },
  "vision": {
    buttonColor: "bg-indigo-500 hover:bg-indigo-600",
    categoryColor: "bg-indigo-500/90",
  },
  "image-generation": {
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    categoryColor: "bg-pink-500/90",
  },
  "code": {
    buttonColor: "bg-green-600 hover:bg-green-700",
    categoryColor: "bg-green-500/90",
  },
  "translation": {
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    categoryColor: "bg-yellow-500/90",
  },
  "text": {
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    categoryColor: "bg-blue-500/90",
  },
  "speech": {
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    categoryColor: "bg-purple-500/90",
  },
  "default": {
    buttonColor: "bg-slate-600 hover:bg-slate-700",
    categoryColor: "bg-slate-500/90",
  }
};

const categories = [
  { id: "all", name: "Tümü", color: "bg-slate-600 hover:bg-slate-700" },
  { id: "text-generation", name: "Metin", color: "bg-primary hover:bg-primary/90" },
  { id: "vision", name: "Görsel", color: "bg-indigo-500 hover:bg-indigo-600" },
  { id: "image-generation", name: "Resim", color: "bg-pink-500 hover:bg-pink-600" },
  { id: "translation", name: "Çeviri", color: "bg-green-600 hover:bg-green-700" },
  { id: "code", name: "Kod", color: "bg-yellow-600 hover:bg-yellow-700" },
  { id: "speech", name: "Ses", color: "bg-purple-600 hover:bg-purple-700" },
];

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

export default function Models() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Helper fonksiyonlar
  const getModelImage = (model: any) => {
    const imageMap: Record<string, string> = {
      "text-generation": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "vision": "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "image-generation": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "code": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "translation": "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "speech": "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "text": "https://images.unsplash.com/photo-1500631195312-e3a9a5819f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    };
    
    return imageMap[model.category] || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
  };
  
  const getCategoryColor = (category: string) => {
    const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors["default"];
    return colors.categoryColor;
  };
  
  const getButtonColor = (category: string) => {
    const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors["default"];
    return colors.buttonColor;
  };
  
  const getModelRating = (model: any) => {
    // Model kalite puanlamaları
    const ratings: Record<string, number> = {
      "huggingface": 4.3,
      "gemini": 4.7,
      "deepseek": 4.4,
      "groq": 4.6,
    };
    return ratings[model.provider] || 4.0;
  };
  
  // API'den mevcut modelleri çek
  const { data, isLoading } = useQuery({
    queryKey: ["/api/models"],
    queryFn: async () => {
      const response = await getTurkishModels();
      return response.models || [];
    }
  });
  
  const models = data || [];
  
  // Her model için tag oluştur
  const getModelTags = (model: any) => {
    const tags = ["Türkçe Destekli", "Ücretsiz"];
    
    if (model.provider === "huggingface") {
      tags.push("Hugging Face");
    } else if (model.provider === "gemini") {
      tags.push("Google Yapay Zeka");
    } else if (model.provider === "deepseek") {
      tags.push("Deepseek AI");
    } else if (model.provider === "groq") {
      tags.push("Groq (Llama, Mixtral)");
    }
    
    return tags;
  };
  
  // Arama ve kategoriye göre modelleri filtrele
  const filteredModels = models.filter((model: any) => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6">Yapay Zeka Modelleri</h1>
            <p className="text-gray-300 mb-8 text-lg">
              Türkçe dil desteği ile herkesin kullanabileceği ücretsiz yapay zeka modelleri
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Input
                placeholder="Model ara..."
                className="max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    className={category.color}
                    size="sm"
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin text-primary">
                <i className="fas fa-spinner text-4xl"></i>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.length > 0 ? (
                filteredModels.map((model) => (
                  <Card key={model.id} className="overflow-hidden shadow-lg border border-gray-800 hover:border-primary/50 transition-all duration-300 group">
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-r from-primary/20 to-indigo-500/20">
                      <img 
                        src={getModelImage(model)} 
                        alt={model.name} 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 right-3 ${getCategoryColor(model.category)} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                        {categories.find(c => c.id === model.category)?.name || model.category}
                      </span>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{model.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{model.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getModelTags(model).map((tag, index) => (
                          <span key={index} className="bg-muted text-xs text-gray-300 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <StarRating rating={getModelRating(model)} />
                          <span className="ml-2 text-sm text-gray-400">{getModelRating(model)}/5</span>
                        </div>
                        <Button 
                          className={getButtonColor(model.category)} 
                          size="sm"
                          onClick={() => setLocation(`/models/${model.id}`)}
                        >
                          Kullan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="mb-4 text-gray-400">
                    <i className="fas fa-search text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Sonuç bulunamadı</h3>
                  <p className="text-gray-400">
                    Arama kriterlerinize uygun model bulunamadı. Lütfen farklı bir arama terimi deneyin veya filtrelerinizi değiştirin.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
