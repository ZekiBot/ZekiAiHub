import { Model } from "@shared/schema";

interface UserPreference {
  userId: string;
  modelUsage: Record<number, number>; // modelId -> kullanım sayısı
  categoryPreferences: Record<string, number>; // category -> skor
  recentlyUsed: number[]; // son kullanılan model ID'leri
}

// Kullanıcı tercihleri için in-memory depolama
const userPreferences: Record<string, UserPreference> = {};

/**
 * Model kullanımını kaydet
 */
export function trackModelUsage(userId: string, modelId: number, model: Model) {
  if (!userId) return;

  if (!userPreferences[userId]) {
    userPreferences[userId] = {
      userId,
      modelUsage: {},
      categoryPreferences: {},
      recentlyUsed: []
    };
  }

  const preferences = userPreferences[userId];
  
  // Model kullanımını arttır
  preferences.modelUsage[modelId] = (preferences.modelUsage[modelId] || 0) + 1;
  
  // Kategori tercihini arttır
  preferences.categoryPreferences[model.category] = 
    (preferences.categoryPreferences[model.category] || 0) + 1;
  
  // Son kullanılan modelleri güncelle (en fazla 10 tane)
  preferences.recentlyUsed = [
    modelId, 
    ...preferences.recentlyUsed.filter(id => id !== modelId)
  ].slice(0, 10);
}

/**
 * Kullanıcı için kişiselleştirilmiş öneriler oluştur
 */
export function getPersonalizedRecommendations(
  userId: string, 
  allModels: Model[], 
  limit: number = 6
): Model[] {
  if (!userId || !userPreferences[userId]) {
    // Kullanıcı için henüz tercih kaydı yoksa popüler modelleri göster
    return getPopularModels(allModels, limit);
  }

  const preferences = userPreferences[userId];
  const scoredModels = allModels.map(model => {
    let score = 0;
    
    // Kullanıcının kategori tercihlerine göre puan ekle
    if (preferences.categoryPreferences[model.category]) {
      score += preferences.categoryPreferences[model.category] * 2;
    }
    
    // Daha önce kullanım sayısına göre puan ekle
    if (preferences.modelUsage[model.id]) {
      score += preferences.modelUsage[model.id];
    }
    
    // Son kullanılan modellere bonus puan
    if (preferences.recentlyUsed.includes(model.id)) {
      score += 3;
    }
    
    // Genel popülerlik puanını da ekle
    score += (model.usageCount || 0) * 0.1;
    
    // Derecelendirmeyi ekle
    score += (model.rating || 0) * 0.5;
    
    return {
      model,
      score
    };
  });
  
  // Skorlara göre sırala ve en yüksek skorlu modelleri döndür
  return scoredModels
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.model);
}

/**
 * En popüler modelleri getir
 */
function getPopularModels(allModels: Model[], limit: number = 6): Model[] {
  return [...allModels]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}

/**
 * Benzer kategorideki modelleri getir
 */
export function getSimilarModels(
  model: Model,
  allModels: Model[],
  limit: number = 3
): Model[] {
  return allModels
    .filter(m => m.id !== model.id && m.category === model.category)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

/**
 * Yaşlılar ve çocuklar için basitleştirilmiş model önerileri
 */
export function getAccessibleRecommendations(
  allModels: Model[],
  userType: 'elderly' | 'children',
  limit: number = 4
): Model[] {
  let filteredModels = allModels;
  
  // Yaşlı kullanıcılar için daha basit arayüzleri olan modelleri öner
  if (userType === 'elderly') {
    filteredModels = allModels.filter(model => 
      !model.modelId.includes('complex') && 
      !model.description.includes('gelişmiş')
    );
  }
  
  // Çocuklar için eğitim odaklı ve uygun içerikli modelleri öner
  if (userType === 'children') {
    filteredModels = allModels.filter(model => 
      model.description.includes('eğitim') || 
      model.description.includes('çocuk') ||
      model.description.includes('öğrenme')
    );
  }
  
  return filteredModels
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}