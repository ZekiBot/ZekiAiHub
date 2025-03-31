import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface TranslationOptions {
  to?: string; // Hedef dil
  from?: string; // Kaynak dil
  autoDetect?: boolean;
}

/**
 * Metin çevirisi için kullanılan React hook'u
 * 
 * Tek tıklama ile içeriği çevirebilir, otomatik dil algılama yapabilir,
 * ve çevirinin durumunu (loading, error) izleyebilirsiniz.
 * 
 * @example
 * const { translate, translatedText, isTranslating, error } = useTranslation();
 * 
 * // Metni çevirmek için
 * <button onClick={() => translate("Hello world", { to: "tr" })}>Çevir</button>
 * {translatedText && <p>{translatedText}</p>}
 */
export function useTranslation() {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<string | null>(null);
  
  // Varsayılan hedef dili Türkçe olarak ayarla
  const DEFAULT_TARGET_LANG = "tr";
  
  /**
   * Metni çevir
   */
  const translate = async (
    text: string, 
    options: TranslationOptions = {}
  ) => {
    if (!text) return;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      const targetLanguage = options.to || DEFAULT_TARGET_LANG;
      setTargetLang(targetLanguage);
      
      // Çeviri API'sine istek gönder
      const response = await apiRequest("POST", "/api/ai/huggingface/translation", {
        text,
        model: options.from && options.to 
          ? `Helsinki-NLP/opus-mt-${options.from}-${options.to}`
          : "Helsinki-NLP/opus-mt-en-tr", // Varsayılan: İngilizce -> Türkçe
      });
      
      const data = await response.json();
      
      if (data.translation) {
        setTranslatedText(data.translation);
        return data.translation;
      } else {
        throw new Error("Çeviri yapılamadı");
      }
    } catch (err: any) {
      console.error("Çeviri hatası:", err);
      setError(err.message || "Çeviri sırasında bir hata oluştu");
      return null;
    } finally {
      setIsTranslating(false);
    }
  };
  
  /**
   * Çeviriyi sıfırla
   */
  const resetTranslation = () => {
    setTranslatedText(null);
    setError(null);
    setSourceLang(null);
    setTargetLang(null);
  };
  
  return {
    translate,
    resetTranslation,
    translatedText,
    isTranslating,
    error,
    sourceLang,
    targetLang
  };
}