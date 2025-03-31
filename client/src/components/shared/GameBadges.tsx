import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

// Rozet tipleri
const BADGE_TYPES = {
  EXPLORER: 'explorer', // Model keşfetme
  LEARNER: 'learner',   // Öğrenme ve eğitim
  MASTER: 'master',     // Uzmanlaşma
  COLLECTOR: 'collector', // Koleksiyoncu
  TRANSLATOR: 'translator', // Çevirmen
};

// Başarılması gereken hedefler
interface BadgeRequirement {
  badgeType: string;
  level: number;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  color: string;
}

// Rozet ödüllerini tanımla
const BADGES: BadgeRequirement[] = [
  {
    badgeType: BADGE_TYPES.EXPLORER,
    level: 1,
    name: "Meraklı Gezgin",
    description: "5 farklı yapay zeka modelini dene",
    icon: "fas fa-compass",
    requirement: 5,
    color: "bg-blue-600",
  },
  {
    badgeType: BADGE_TYPES.EXPLORER,
    level: 2,
    name: "Model Kaşifi",
    description: "10 farklı yapay zeka modelini dene",
    icon: "fas fa-map-marked-alt",
    requirement: 10,
    color: "bg-blue-700",
  },
  {
    badgeType: BADGE_TYPES.LEARNER,
    level: 1,
    name: "Öğrenci",
    description: "Her kategoriden en az 1 model dene",
    icon: "fas fa-graduation-cap",
    requirement: 5,
    color: "bg-green-600",
  },
  {
    badgeType: BADGE_TYPES.MASTER,
    level: 1,
    name: "Uzman Adayı",
    description: "Aynı modeli 10 kez kullan",
    icon: "fas fa-star",
    requirement: 10,
    color: "bg-yellow-600",
  },
  {
    badgeType: BADGE_TYPES.COLLECTOR,
    level: 1,
    name: "Koleksiyoncu",
    description: "5 modeli favorilerine ekle",
    icon: "fas fa-heart",
    requirement: 5,
    color: "bg-pink-600",
  },
  {
    badgeType: BADGE_TYPES.TRANSLATOR,
    level: 1,
    name: "Çevirmen",
    description: "10 çeviri yap",
    icon: "fas fa-language",
    requirement: 10,
    color: "bg-purple-600",
  },
];

// Kullanıcının rozetlerini gösteren bileşen
export default function GameBadges() {
  const { user, isAuthenticated } = useAuth();
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [earnedBadges, setEarnedBadges] = useState<number>(0);
  
  // Kullanıcı ilerleme durumunu localStorage'dan yükle
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    const storedProgress = localStorage.getItem(`badge_progress_${user.id}`);
    if (storedProgress) {
      setUserProgress(JSON.parse(storedProgress));
    } else {
      // Başlangıç değerlerini ayarla
      const initialProgress: Record<string, number> = {};
      BADGES.forEach(badge => {
        initialProgress[badge.badgeType] = 0;
      });
      setUserProgress(initialProgress);
      localStorage.setItem(`badge_progress_${user.id}`, JSON.stringify(initialProgress));
    }
  }, [isAuthenticated, user?.id]);
  
  // Kazanılan rozet sayısını hesapla
  useEffect(() => {
    if (Object.keys(userProgress).length === 0) return;
    
    let earned = 0;
    BADGES.forEach(badge => {
      if ((userProgress[badge.badgeType] || 0) >= badge.requirement) {
        earned++;
      }
    });
    
    setEarnedBadges(earned);
  }, [userProgress]);
  
  if (!isAuthenticated) {
    return (
      <Card className="p-6 text-center bg-card border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Rozetler</h3>
        <div className="text-gray-400 mb-4">
          <i className="fas fa-lock text-3xl mb-2"></i>
          <p>Rozetleri görmek ve kazanmak için giriş yapın</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-card border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Rozetleriniz</h3>
        <Badge variant="outline" className="px-3 py-1 bg-primary/10">
          <i className="fas fa-trophy mr-2"></i>
          {earnedBadges} / {BADGES.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGES.map((badge, index) => {
          const current = userProgress[badge.badgeType] || 0;
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
    </Card>
  );
}