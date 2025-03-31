import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Erişilebilirlik ayarları
  const [accessibilityModeEnabled, setAccessibilityModeEnabled] = useState(false);
  const [simplifiedUIEnabled, setSimplifiedUIEnabled] = useState(false);
  const [largerTextEnabled, setLargerTextEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);

  // Model ayarları
  const [models, setModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  // Kullanıcı ayarları
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Yalnızca admin kontrolü
    if (isAuthenticated && user) {
      if (!user.isAdmin) {
        toast({
          title: "Yetkisiz Erişim",
          description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
          variant: "destructive",
        });
        navigate("/");
      }
      setLoading(false);
    } else if (!isAuthenticated) {
      toast({
        title: "Giriş Yapmalısınız",
        description: "Bu sayfaya erişmek için giriş yapmalısınız.",
        variant: "destructive",
      });
      navigate("/");
    }

    // Örnek veriler (ileride API'dan alınacak)
    setTimeout(() => {
      setModels([
        { id: 1, name: "Gemini Pro 1.5", isActive: true, usageCount: 1250 },
        { id: 2, name: "Hugging Face Türkçe", isActive: true, usageCount: 850 },
        { id: 3, name: "DeepSeek", isActive: false, usageCount: 320 },
        { id: 4, name: "Gemini Vision", isActive: true, usageCount: 720 },
      ]);
      setLoadingModels(false);

      setUsers([
        { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", lastActive: "2023-04-15", badges: 3 },
        { id: 2, name: "Ayşe Kaya", email: "ayse@example.com", lastActive: "2023-04-16", badges: 5 },
        { id: 3, name: "Mehmet Demir", email: "mehmet@example.com", lastActive: "2023-04-14", badges: 1 },
      ]);
      setLoadingUsers(false);
    }, 1000);
  }, [isAuthenticated, user, navigate, toast]);

  // Model durumunu değiştiren fonksiyon
  const toggleModelStatus = (id: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, isActive: !model.isActive } : model
    ));
    
    toast({
      title: "Model Durumu Güncellendi",
      description: `Model durumu başarıyla güncellendi.`,
    });
  };

  // Erişilebilirlik ayarlarını kaydet
  const saveAccessibilitySettings = () => {
    toast({
      title: "Ayarlar Kaydedildi",
      description: "Erişilebilirlik ayarlarınız başarıyla kaydedildi.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-2">
            Yönetici Paneli
          </h1>
          <p className="text-gray-400 mb-6">
            Hoş geldiniz, {user?.fullName || user?.email}. Buradan platformu yönetebilirsiniz.
          </p>
        </div>

        <Tabs defaultValue="accessibility" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="accessibility">Erişilebilirlik</TabsTrigger>
            <TabsTrigger value="models">AI Modelleri</TabsTrigger>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          </TabsList>

          {/* Erişilebilirlik Ayarları */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Erişilebilirlik Ayarları</CardTitle>
                <CardDescription>
                  Platformun erişilebilirlik özelliklerini yapılandırın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="accessibility-mode">Erişilebilirlik Modu</Label>
                    <Switch 
                      id="accessibility-mode" 
                      checked={accessibilityModeEnabled}
                      onCheckedChange={setAccessibilityModeEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="simplified-ui">Basitleştirilmiş Arayüz</Label>
                    <Switch 
                      id="simplified-ui" 
                      checked={simplifiedUIEnabled}
                      onCheckedChange={setSimplifiedUIEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="larger-text">Büyük Yazı Tipi</Label>
                    <Switch 
                      id="larger-text" 
                      checked={largerTextEnabled}
                      onCheckedChange={setLargerTextEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="high-contrast">Yüksek Kontrast</Label>
                    <Switch 
                      id="high-contrast" 
                      checked={highContrastEnabled}
                      onCheckedChange={setHighContrastEnabled}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={saveAccessibilitySettings}>
                  Ayarları Kaydet
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AI Modelleri */}
          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Modelleri Yönetimi</CardTitle>
                <CardDescription>
                  Platformdaki AI modellerini etkinleştirin veya devre dışı bırakın
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingModels ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {models.map((model) => (
                      <div key={model.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-gray-700">
                        <div>
                          <h3 className="font-medium">{model.name}</h3>
                          <div className="text-sm text-gray-400">Kullanım: {model.usageCount}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            {model.isActive ? 
                              <span className="text-green-400">Aktif</span> : 
                              <span className="text-red-400">Devre Dışı</span>
                            }
                          </div>
                          <Switch 
                            checked={model.isActive}
                            onCheckedChange={() => toggleModelStatus(model.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Kullanıcılar */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
                <CardDescription>
                  Platformdaki kullanıcıları görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-2">Kullanıcı Adı</th>
                          <th className="text-left p-2">E-posta</th>
                          <th className="text-left p-2">Son Aktif</th>
                          <th className="text-left p-2">Rozetler</th>
                          <th className="text-right p-2">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-700">
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.lastActive}</td>
                            <td className="p-2">{user.badges}</td>
                            <td className="p-2 text-right">
                              <Button variant="outline" size="sm">Görüntüle</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}