import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyBe8yR4Z8olO4fP4sMBKBZJKkgo21e6oDA",
  authDomain: "zekibot-d11e5.firebaseapp.com",
  projectId: "zekibot-d11e5",
  storageBucket: "zekibot-d11e5.firebasestorage.app",
  messagingSenderId: "721736660428",
  appId: "1:721736660428:web:8725684dce93538f70d969",
  measurementId: "G-GCTYSCWC8C"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Authentication servisi
const auth = getAuth(app);

// Google yetkilendirme sağlayıcısı
const googleProvider = new GoogleAuthProvider();

// Yönetici kullanıcısını oluşturma fonksiyonu
export async function createAdminUser() {
  try {
    // Yönetici kullanıcısının Firebase'de olup olmadığını kontrol et
    const email = "iletisimofisi@gmail.com";
    const password = "Zb1325*-";
    
    try {
      // Kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Yönetici kullanıcısı oluşturuldu:", userCredential.user);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error: any) {
      // Kullanıcı zaten varsa hata oluşacak, bu normal
      if (error.code === 'auth/email-already-in-use') {
        console.log("Yönetici kullanıcısı zaten var.");
        return { success: true, message: "Kullanıcı zaten var" };
      }
      throw error;
    }
  } catch (error) {
    console.error("Yönetici kullanıcısı oluşturulurken hata oluştu:", error);
    return {
      success: false,
      error
    };
  }
}

// Google ile giriş yapma fonksiyonu
export async function signInWithGoogle() {
  try {
    return await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Google ile giriş yaparken hata oluştu:", error);
    throw error;
  }
}

// Yönlendirme sonucunu işleme fonksiyonu
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    
    if (result) {
      // Kullanıcı verisi ve token erişimi
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      
      return {
        user,
        token,
        success: true
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error("Yönlendirme sonucunu işlerken hata oluştu:", error);
    return {
      success: false,
      error
    };
  }
}

// Auth nesnesini dışa aktar
export { auth };