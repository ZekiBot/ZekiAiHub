import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin" }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, loginWithGoogle, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeLoginModal}>
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={closeLoginModal}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-3 mb-4">
            <i className="fas fa-robot text-primary text-2xl"></i>
            <span className="font-bold text-[1.75rem] bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              ZekiBot
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Hoş Geldiniz</h3>
          <p className="text-gray-400">Hesabınızla giriş yapın</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <Button 
            variant="outline" 
            className="flex items-center justify-center w-full bg-white text-gray-800 hover:bg-gray-100 h-12"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i> İşleniyor...
              </span>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                Google ile Giriş Yap
              </>
            )}
          </Button>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500">veya</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ornek@email.com" 
                        className="bg-muted border border-gray-700" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-muted border border-gray-700" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="text-sm text-gray-400">Beni hatırla</Label>
                </div>
                <a href="#" className="text-sm text-primary hover:text-primary/90">Şifremi unuttum</a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 h-auto relative overflow-hidden group" 
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Giriş Yapılıyor...
                  </span>
                ) : (
                  <>
                    Giriş Yap
                    <div className="absolute inset-0 bg-white/[0.05] translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            Hesabınız yok mu? <a href="#" className="text-primary hover:text-primary/90 font-medium">Kaydolun</a>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Giriş yaparak <a href="/terms" className="underline">Kullanım Şartlarını</a> ve 
            <a href="/privacy" className="underline"> Gizlilik Politikasını</a> kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
