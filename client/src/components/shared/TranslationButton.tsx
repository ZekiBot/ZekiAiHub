import { Button, ButtonProps } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface TranslationButtonProps extends ButtonProps {
  text: string;
  targetLanguage?: string;
  children?: React.ReactNode;
  onTranslated?: (translatedText: string) => void;
  showResultInTooltip?: boolean;
}

/**
 * Tek tıklamayla çeviri yapan buton bileşeni
 * 
 * Bu bileşen, herhangi bir metni tek tıklamayla çevirebilen bir buton sunar.
 * Çeviri işlemi sırasında yükleme göstergesi görüntülenir ve sonuç tooltip veya
 * callback ile döndürülebilir.
 * 
 * @example
 * <TranslationButton 
 *   text="Hello world"
 *   targetLanguage="tr"
 *   onTranslated={(translated) => setTranslatedText(translated)}
 * >
 *   Türkçe'ye Çevir
 * </TranslationButton>
 */
export function TranslationButton({
  text,
  targetLanguage = "tr",
  children,
  onTranslated,
  showResultInTooltip = true,
  ...buttonProps
}: TranslationButtonProps) {
  const { translate, isTranslating, translatedText, error } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleTranslate = async () => {
    try {
      const result = await translate(text, { to: targetLanguage });
      if (result && onTranslated) {
        onTranslated(result);
      }
      
      if (showResultInTooltip) {
        setIsOpen(true);
        // 5 saniye sonra tooltip'i kapat
        setTimeout(() => setIsOpen(false), 5000);
      }
    } catch (error) {
      console.error("Çeviri hatası:", error);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip open={isOpen && showResultInTooltip && !!translatedText} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
            {...buttonProps}
          >
            {isTranslating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Çevriliyor...
              </>
            ) : (
              <>
                {children || (
                  <>
                    <i className="fas fa-language mr-2"></i>
                    {targetLanguage === "tr" ? "Türkçe'ye Çevir" : "Çevir"}
                  </>
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {error ? (
            <div className="text-red-500">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {error}
            </div>
          ) : (
            <div className="max-w-md">
              <Badge variant="secondary" className="mb-1">Çeviri</Badge>
              <p>{translatedText}</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}