import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Rozet tip sabitleri
const BADGE_TYPES = {
  EXPLORER: 'explorer', // Model keşfetme
  LEARNER: 'learner',   // Öğrenme ve eğitim
  MASTER: 'master',     // Uzmanlaşma
  COLLECTOR: 'collector', // Koleksiyoncu
  TRANSLATOR: 'translator', // Çevirmen
};

// Rozet tanımları
const BADGES = [
  {
    type: BADGE_TYPES.EXPLORER,
    level: 1,
    name: "Meraklı Gezgin",
    description: "5 farklı yapay zeka modelini dene",
    icon: "fas fa-compass",
    requirement: 5,
    color: "bg-blue-600",
  },
  {
    type: BADGE_TYPES.EXPLORER,
    level: 2,
    name: "Model Kaşifi",
    description: "10 farklı yapay zeka modelini dene",
    icon: "fas fa-map-marked-alt",
    requirement: 10,
    color: "bg-blue-700",
  },
  {
    type: BADGE_TYPES.LEARNER,
    level: 1,
    name: "Öğrenci",
    description: "Her kategoriden en az 1 model dene",
    icon: "fas fa-graduation-cap",
    requirement: 5,
    color: "bg-green-600",
  },
  {
    type: BADGE_TYPES.MASTER,
    level: 1,
    name: "Uzman Adayı",
    description: "Aynı modeli 10 kez kullan",
    icon: "fas fa-star",
    requirement: 10,
    color: "bg-yellow-600",
  },
  {
    type: BADGE_TYPES.COLLECTOR,
    level: 1,
    name: "Koleksiyoncu",
    description: "5 modeli favorilerine ekle",
    icon: "fas fa-heart",
    requirement: 5,
    color: "bg-pink-600",
  },
  {
    type: BADGE_TYPES.TRANSLATOR,
    level: 1,
    name: "Çevirmen",
    description: "10 çeviri yap",
    icon: "fas fa-language",
    requirement: 10,
    color: "bg-purple-600",
  },
];

export default function UserBadges() {
  const { user, isAuthenticated } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<number>(0);
  
  // Kullanıcı rozet verilerini getir
  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['userBadges', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return apiRequest<{ 
        badges?: {
          explorer: number,
          learner: number,
          master: number,
          collector: number,
          translator: number
        }
      }>(`/api/users/${user.id}/badges`);
    },
    enabled: !!user?.id && isAuthenticated,
  });
  
  // Veritabanı bağlantısı yapılana kadar localStorage ile çalış
  const userProgress = userBadges?.badges || {
    explorer: 0,
    learner: 0,
    master: 0,
    collector: 0,
    translator: 0
  };
  
  // Kazanılan rozet sayısını hesapla
  useEffect(() => {
    let earned = 0;
    
    BADGES.forEach(badge => {
      const progress = userProgress[badge.type as keyof typeof userProgress] || 0;
      if (progress >= badge.requirement) {
        earned++;
      }
    });
    
    setEarnedBadges(earned);
  }, [userProgress]);
  
  if (!isAuthenticated) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Rozetleriniz</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-400 flex flex-col items-center">
            <i className="fas fa-lock text-3xl mb-4"></i>
            <p>Rozetleri görmek ve kazanmak için giriş yapın</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Rozetleriniz</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-700 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 w-40 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Rozetleriniz</CardTitle>
          <Badge variant="outline" className="px-3 py-1 bg-primary/10">
            <i className="fas fa-trophy mr-2"></i>
            {earnedBadges} / {BADGES.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGES.map((badge, index) => {
            const current = userProgress[badge.type as keyof typeof userProgress] || 0;
            const isEarned = current >= badge.requirement;
            const progress = Math.min(100, Math.round((current / badge.requirement) * 100));
            
            return (
              <div 
                key={index} 
                className={`relative rounded-lg p-3 border ${
                  isEarned ? "border-primary bg-primary/10" : "border-gray-800 bg-muted/50"
                } flex items-center`}
              >
                <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  isEarned ? "animate-pulse" : "opacity-60"
                }`}>
                  <i className={`${badge.icon} text-white text-lg`}></i>
                </div>
                
                <div className="flex-grow overflow-hidden">
                  <div className="flex items-center">
                    <h4 className="font-medium text-white truncate">{badge.name}</h4>
                    {isEarned && (
                      <i className="fas fa-check-circle text-primary ml-2"></i>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1">{badge.description}</p>
                  <div className="mt-1.5 flex items-center">
                    <Progress value={progress} className="h-1.5" />
                    <span className="ml-2 text-xs text-gray-500">
                      {current}/{badge.requirement}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}