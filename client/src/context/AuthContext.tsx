import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithGoogle as firebaseSignInWithGoogle, handleRedirectResult } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface User {
  id: string;
  username?: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  isLoginModalOpen: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Firebase kullanıcısından User nesnesine dönüştürme
const formatUser = (firebaseUser: FirebaseUser): User => {
  // Admin kullanıcı kontrolü
  const isAdmin = firebaseUser.email === "iletisimofisi@gmail.com";
  
  return {
    id: firebaseUser.uid,
    username: firebaseUser.displayName?.replace(/\s+/g, '').toLowerCase() || '',
    email: firebaseUser.email || undefined,
    fullName: firebaseUser.displayName || undefined,
    avatar: firebaseUser.photoURL || undefined,
    isAdmin,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { toast } = useToast();

  // Firebase auth durumunu izle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const formattedUser = formatUser(firebaseUser);
        setUser(formattedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Yönlendirme sonuçlarını kontrol et
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await handleRedirectResult();
        if (result.success && result.user) {
          toast({
            title: "Başarılı",
            description: "Google ile giriş yapıldı!",
          });
        }
      } catch (error) {
        console.error("Yönlendirme sonucunu işlerken hata:", error);
      }
    };

    checkRedirect();
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      closeLoginModal();
      toast({
        title: "Başarılı",
        description: "Giriş yapıldı!",
      });
    } catch (error: any) {
      console.error("Login failed", error);
      
      let errorMessage = "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Geçersiz e-posta veya şifre.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Bu e-posta ile kayıtlı kullanıcı bulunamadı.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Yanlış şifre.";
      }
      
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await firebaseSignInWithGoogle();
      closeLoginModal();
    } catch (error) {
      console.error("Google login failed", error);
      toast({
        title: "Hata",
        description: "Google ile giriş yapılamadı.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Başarılı",
        description: "Çıkış yapıldı!",
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        title: "Hata",
        description: "Çıkış yapılamadı.",
        variant: "destructive",
      });
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
