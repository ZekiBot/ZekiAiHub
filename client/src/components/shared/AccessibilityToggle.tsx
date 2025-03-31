import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Erişilebilirlik modunu kontrol eden bileşen
 * 
 * Bu bileşen, farklı kullanıcı grupları için özelleştirilmiş erişilebilirlik modları sunar:
 * - Yaşlı kullanıcılar için büyük yazı tipi ve yüksek kontrast
 * - Çocuklar için basitleştirilmiş arayüz
 * - Standart mod
 * 
 * Seçilen mod otomatik olarak localStorage'da saklanır ve
 * sayfayı yeniden yüklerken korunur.
 */
export default function AccessibilityToggle() {
  const [activeMode, setActiveMode] = useState<"standard" | "elderly" | "children">("standard");

  // Sayfa yüklendiğinde localStorage'dan tercihi al
  useEffect(() => {
    const savedMode = localStorage.getItem("accessibility-mode");
    if (savedMode === "elderly" || savedMode === "children") {
      setActiveMode(savedMode);
      applyMode(savedMode);
    }
  }, []);

  // Modu uygula
  const applyMode = (mode: "standard" | "elderly" | "children") => {
    // Önceki tüm modları temizle
    document.documentElement.classList.remove("mode-elderly", "mode-children");

    if (mode !== "standard") {
      document.documentElement.classList.add(`mode-${mode}`);
    }

    // localStorage'a kaydet
    localStorage.setItem("accessibility-mode", mode);
    setActiveMode(mode);

    // CSS değişkenlerini güncelle
    if (mode === "elderly") {
      // Yaşlılar için büyük yazı tipi ve yüksek kontrast
      document.documentElement.style.setProperty("--font-size-multiplier", "1.25");
      document.documentElement.style.setProperty("--contrast-multiplier", "1.3");
    } else if (mode === "children") {
      // Çocuklar için hafif artırılmış yazı tipi ve basit arayüz
      document.documentElement.style.setProperty("--font-size-multiplier", "1.1");
      document.documentElement.style.setProperty("--contrast-multiplier", "1");
    } else {
      // Standart mod
      document.documentElement.style.setProperty("--font-size-multiplier", "1");
      document.documentElement.style.setProperty("--contrast-multiplier", "1");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <i className="fas fa-universal-access mr-2"></i>
          Erişilebilirlik
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className={activeMode === "standard" ? "bg-primary/20" : ""}
          onClick={() => applyMode("standard")}
        >
          <i className="fas fa-user mr-2"></i>
          Standart Mod
        </DropdownMenuItem>
        <DropdownMenuItem
          className={activeMode === "elderly" ? "bg-primary/20" : ""}
          onClick={() => applyMode("elderly")}
        >
          <i className="fas fa-user-plus mr-2"></i>
          Yaşlı Kullanıcı Modu
          <span className="ml-2 text-xs opacity-70">Büyük Yazı</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={activeMode === "children" ? "bg-primary/20" : ""}
          onClick={() => applyMode("children")}
        >
          <i className="fas fa-child mr-2"></i>
          Çocuk Kullanıcı Modu
          <span className="ml-2 text-xs opacity-70">Basit Arayüz</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // Okuyucu modunu aç/kapat
            if (document.body.classList.contains("reader-mode")) {
              document.body.classList.remove("reader-mode");
            } else {
              document.body.classList.add("reader-mode");
            }
          }}
        >
          <i className="fas fa-book-reader mr-2"></i>
          Okuyucu Modu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}