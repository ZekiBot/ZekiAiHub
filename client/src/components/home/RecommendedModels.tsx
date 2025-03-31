import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Model } from "@shared/schema";
import { getPersonalizedRecommendations } from "@/lib/recommendationEngine";
import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function RecommendedModels() {
  const { user, isAuthenticated } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendedModels() {
      try {
        setIsLoading(true);
        
        // Tüm modelleri al
        const allModels = await apiRequest("/api/models").then(res => res.json());
        
        // Kullanıcı oturum açmışsa kişiselleştirilmiş öneriler al
        if (isAuthenticated && user?.id) {
          const recommendedModels = getPersonalizedRecommendations(
            user.id, 
            allModels,
            4 // 4 model göster
          );
          setModels(recommendedModels);
        } else {
          // Kullanıcı oturum açmamışsa en popüler modelleri göster
          const popularModels = allModels
            .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
            .slice(0, 4);
          setModels(popularModels);
        }
      } catch (error) {
        console.error("Önerilen modelleri alma hatası:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecommendedModels();
  }, [user?.id, isAuthenticated]);
  
  function StarRating({ rating }: { rating: number }) {
    const stars = [];
    const roundedRating = Math.round(rating);
    
    for (let i = 1; i <= 5; i++) {
      const starClass = i <= roundedRating 
        ? "fas fa-star text-yellow-400" 
        : "far fa-star text-gray-400";
      stars.push(<i key={i} className={starClass}></i>);
    }
    
    return <div className="flex">{stars}</div>;
  }

  if (models.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            {isAuthenticated 
              ? "Sizin İçin Önerilen Modeller" 
              : "Popüler Modeller"}
          </h2>
          {isAuthenticated && (
            <Link href="/account/preferences">
              <Button variant="link" size="sm" className="text-primary">
                <i className="fas fa-cog mr-2"></i>
                Tercihlerinizi Ayarlayın
              </Button>
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardContent className="p-0">
                  <div className="h-32 bg-muted rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-muted rounded w-1/3 mt-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="overflow-hidden shadow-lg border border-gray-800 hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] group">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-r from-primary/20 to-indigo-500/20">
                  <img 
                    src={model.imageUrl || '/placeholder-model.jpg'} 
                    alt={model.name} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-primary/80 text-xs rounded-full px-2 py-1">
                    {model.category}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">{model.name}</h3>
                  <div className="flex items-center mb-3">
                    <StarRating rating={model.rating || 0} />
                    <span className="ml-2 text-xs text-gray-400">{model.rating || 0}/5</span>
                  </div>
                  <Link href={`/models/${model.id}`}>
                    <Button className="w-full" size="sm">
                      Kullan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}