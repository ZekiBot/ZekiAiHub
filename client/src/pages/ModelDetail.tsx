import { useState } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

// HuggingFace
import { generateText, translateText, classifyImage, generateImage } from "@/lib/huggingface";
// Gemini
import { chatWithGemini, analyzeImageWithText } from "@/lib/gemini";
// Deepseek
import { chatCompletion as deepseekChatCompletion, generateCode } from "@/lib/deepseek";
// Groq
import { chatCompletion as groqChatCompletion } from "@/lib/groq";

// Tüm model detayları
const modelDetails: Record<string, any> = {
  "dbmdz/bert-base-turkish-cased": {
    name: "BERT Türkçe",
    description: "Türkçe metinler için optimize edilmiş BERT modeli",
    fullDescription: "BERT Türkçe (dbmdz/bert-base-turkish-cased), Türkçe dili için özel olarak eğitilmiş güçlü bir dil modelidir. Metin anlamlandırma, cümle analizi ve doğal dil işleme görevlerinde yüksek başarı sağlar. Özellikle Türkçe metinlerdeki dilbilgisel ve anlamsal yapıları daha iyi anlayabilmek için optimize edilmiştir.",
    category: "text",
    provider: "huggingface",
    imageUrl: "https://images.unsplash.com/photo-1500631195312-e3a9a5819f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "huggingface",
    modelId: "dbmdz/bert-base-turkish-cased",
    examples: [
      "Bu metin ne hakkında?",
      "Bu cümlede hangi duygular ifade ediliyor?",
      "Bu metinde geçen önemli kişiler kimler?",
      "Bu metinde bahsedilen ana konu nedir?",
      "Bu metni özetler misin?"
    ]
  },
  "Helsinki-NLP/opus-mt-en-tr": {
    name: "Opus-MT İng-Tr Çeviri",
    description: "İngilizce'den Türkçe'ye çeviri için özel model",
    fullDescription: "Helsinki-NLP/opus-mt-en-tr, İngilizce metinleri Türkçe'ye çeviren özel bir dil modelidir. Yüksek kaliteli çeviriler yapabilmesi için büyük çeviri veri setleriyle eğitilmiştir. Günlük konuşma dilinden teknik metinlere kadar geniş bir yelpazede çeviri yapabilir ve Türkçe dilinin özelliklerine uygun çıktılar üretir.",
    category: "translation",
    provider: "huggingface",
    imageUrl: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "huggingface", 
    modelId: "Helsinki-NLP/opus-mt-en-tr",
    examples: [
      "Hello, how are you doing today?",
      "The quick brown fox jumps over the lazy dog.",
      "Artificial intelligence is transforming our world.",
      "I would like to visit Istanbul next summer.",
      "Please translate this important document for me."
    ]
  },
  "stabilityai/stable-diffusion-2-1": {
    name: "Stable Diffusion",
    description: "Metin tanımlarından görüntüler oluşturan model",
    fullDescription: "Stable Diffusion, metin açıklamalarını temel alarak yüksek kaliteli görseller oluşturabilen güçlü bir yapay zeka modelidir. Türkçe istekleri anlayarak çeşitli sanatsal stillerde, fotoğraf gerçekliğinde veya soyut görselleştirmeler oluşturabilir. Özellikle kullanıcı dostu arayüzü ve hızlı sonuç üretme özelliğiyle çocuklar ve yaşlılar dahil herkes tarafından kolayca kullanılabilir.",
    category: "image-generation",
    provider: "huggingface",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "huggingface",
    modelId: "stabilityai/stable-diffusion-2-1",
    examples: [
      "Mavi gökyüzü altında çiçek tarlasında koşan mutlu bir çocuk",
      "Yağmurlu bir akşamda İstanbul manzarası, suluboya tarzında",
      "Eski bir Türk evinin içi, nostaljik atmosfer",
      "Uzayda seyahat eden bir Türk astronot, gerçekçi tarzda",
      "Kadim bir Anadolu medeniyetine ait fantastik bir tapınak"
    ]
  },
  "microsoft/speecht5_tts": {
    name: "SpeechT5",
    description: "Metinden konuşma oluşturan güçlü model",
    fullDescription: "Microsoft SpeechT5, metinleri doğal ve akıcı konuşmaya dönüştüren gelişmiş bir metin-konuşma modelidir. Türkçe dahil birçok dilde yüksek kaliteli ses üretebilir, farklı ses tonları ve konuşma hızları ayarlanabilir. Özellikle görme engelli kullanıcılar, yaşlılar ve okuma güçlüğü çekenler için metinlerin sesli olarak aktarılmasında idealdir.",
    category: "speech",
    provider: "huggingface",
    imageUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "huggingface",
    modelId: "microsoft/speecht5_tts",
    examples: [
      "Merhaba, nasılsınız? Bugün hava çok güzel.",
      "Yapay zeka teknolojileri hayatımızı kolaylaştırıyor.",
      "Bu metni lütfen doğal bir sesle oku.",
      "Küçük çocuk için bir ninni oku.",
      "Türkiye'nin tarihi ve kültürel zenginlikleri hakkında bir metin oku."
    ]
  },
  "bigscience/bloom-1b7": {
    name: "BLOOM 1.7B",
    description: "Çok dilli metin üretimi yapabilen yapay zeka modeli",
    fullDescription: "BLOOM 1.7B, 46 farklı dilde ve 13 programlama dilinde metin üretebilen çok dilli bir yapay zeka dil modelidir. Özellikle Türkçe dil desteği güçlü olan model, çeşitli konularda metin üretme, soru cevaplama, özetleme ve yaratıcı yazı yazma yeteneklerine sahiptir. Düşük kaynak gereksinimi ve etkileyici performansı ile dikkat çeker.",
    category: "text-generation",
    provider: "huggingface",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "huggingface",
    modelId: "bigscience/bloom-1b7",
    examples: [
      "Türkiye'nin başkenti neresidir?",
      "Bir çocuğa uzayı nasıl anlatabilirim?",
      "10 yaşında bir çocuk için bir masal yazar mısın?",
      "En sevdiğin yemeği nasıl yaparsın?",
      "Telefonumu düşürdüm ve ekranı çatladı. Ne yapmalıyım?"
    ]
  },
  "gemini-pro-1.5": {
    name: "Gemini Pro 1.5",
    description: "Google'ın gelişmiş çok amaçlı yapay zeka modeli",
    fullDescription: "Gemini Pro 1.5, Google'ın en son teknolojisiyle geliştirilmiş çok amaçlı bir yapay zeka modelidir. Uzun metinleri anlama ve detaylı cevaplar üretme yeteneği ile öne çıkar. Türkçe dil desteği oldukça güçlüdür ve hemen hemen her konuda bilgi sağlayabilir, sorulara cevap verebilir ve metin oluşturabilir. Eğitimden eğlenceye, bilimden sanata kadar çeşitli alanlarda kullanılabilir.",
    category: "text-generation",
    provider: "gemini",
    imageUrl: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "gemini",
    modelId: "gemini-pro-1.5",
    examples: [
      "Leonardo da Vinci hakkında bir makale yazar mısın?",
      "İklim değişikliğini çocuklara nasıl anlatabilirim?",
      "Türk mutfağının en ünlü yemekleri nelerdir?",
      "Bana öğrenmem gereken 5 yeni Türkçe kelime önerir misin?",
      "Evde yapılabilecek ilginç bilim deneyleri nelerdir?"
    ]
  },
  "gemini-1.5-pro-vision": {
    name: "Gemini Pro 1.5 Vision",
    description: "Görsel anlama ve analiz yeteneğine sahip yapay zeka modeli",
    fullDescription: "Gemini Pro 1.5 Vision, Google'ın görsel anlama ve analiz yeteneklerini içeren çok yönlü bir yapay zeka modelidir. Hem metin hem de görüntüleri birlikte işleyebilir, görsel içeriği tanımlayabilir ve hakkında detaylı bilgi verebilir. Fotoğrafları analiz edebilir, görsellerdeki yazıları okuyabilir ve görsel ile ilgili sorulara cevap verebilir. Özellikle görme engelli kullanıcılar ve görsel içeriği anlamak isteyen çocuklar için kullanışlıdır.",
    category: "vision",
    provider: "gemini",
    imageUrl: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "gemini",
    modelId: "gemini-1.5-pro-vision",
    examples: [
      "Bu fotoğrafta ne görüyorsun?",
      "Bu resimde kaç kişi var ve ne yapıyorlar?",
      "Bu tabloyu analiz eder misin?",
      "Bu metnin fotoğrafını çektim, içeriğini okuyabilir misin?",
      "Bu logonun hangi markaya ait olduğunu söyleyebilir misin?"
    ]
  },
  "deepseek-chat": {
    name: "Deepseek Chat",
    description: "Yüksek kaliteli metin üretimi yapabilen sohbet modeli",
    fullDescription: "Deepseek Chat, doğal dil anlama ve üretme konusunda üstün yeteneklere sahip bir yapay zeka sohbet modelidir. Kullanıcı sorularına ayrıntılı ve doğru yanıtlar verebilir, metinleri özetleyebilir, farklı diller arasında çeviri yapabilir ve yaratıcı içerik oluşturabilir. Türkçe dil desteği sayesinde yerel kullanıcılara özel deneyim sunar. Özellikle eğitim amaçlı kullanım ve bilgi edinme konularında idealdir.",
    category: "text-generation",
    provider: "deepseek",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "deepseek",
    modelId: "deepseek-chat",
    examples: [
      "Osmanlı İmparatorluğu'nun kuruluşu hakkında bilgi verir misin?",
      "Çocuklara matematik nasıl sevdirilir?",
      "En popüler Türk dizileri hangileri?",
      "Türkçe dilinin özellikleri nelerdir?",
      "Bana motivasyon verici bir konuşma metni yazar mısın?"
    ]
  },
  "deepseek-coder": {
    name: "Deepseek Coder",
    description: "Kod üretimi konusunda uzmanlaşmış yapay zeka modeli",
    fullDescription: "Deepseek Coder, programlama ve kod geliştirme konusunda uzmanlaşmış özel bir yapay zeka modelidir. Birçok programlama dilinde (Python, JavaScript, Java, C++, vb.) kod yazabilir, mevcut kodu analiz edebilir, hata ayıklayabilir ve iyileştirme önerileri sunabilir. Ayrıca kodla ilgili açıklamaları Türkçe olarak yapabilir ve programlama kavramlarını anlaşılır şekilde açıklayabilir. Özellikle programlama öğrenen gençler ve kod yardımına ihtiyaç duyan profesyoneller için idealdir.",
    category: "code",
    provider: "deepseek",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "deepseek",
    modelId: "deepseek-coder",
    examples: [
      "Python'da bir sayı tahmin oyunu kodu yazar mısın?",
      "Bu JavaScript kodundaki hatayı bulur musun?",
      "Basit bir web sitesi için HTML ve CSS kodu oluşturur musun?",
      "Veritabanından veri çeken bir SQL sorgusu nasıl yazılır?",
      "For döngüsü nedir ve nasıl kullanılır?"
    ]
  },
  "llama3-8b-8192": {
    name: "Llama 3 (8B)",
    description: "Meta'nın açık kaynaklı Llama 3 modeli, hızlı ve verimli",
    fullDescription: "Meta'nın geliştirdiği Llama 3, açık kaynaklı ve son derece etkili bir büyük dil modelidir. 8 milyar parametre büyüklüğündeki bu sürüm, Groq platformu üzerinden sunularak inanılmaz hızlı yanıt sürelerine ulaşır. Türkçe dahil birçok dilde metin üretebilir, soruları yanıtlayabilir, özetleme yapabilir ve yaratıcı içerik oluşturabilir. Açık kaynaklı yapısı sayesinde şeffaf ve güvenilirdir, aynı zamanda hız gerektiren uygulamalar için idealdir.",
    category: "text-generation",
    provider: "groq",
    imageUrl: "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "groq",
    modelId: "llama3-8b-8192",
    examples: [
      "Çocuklara bilimi sevdirmenin yolları nelerdir?",
      "Türk edebiyatında modernizm akımı nedir?",
      "Sağlıklı yaşam için 5 temel alışkanlık nedir?",
      "Kediler hakkında ilginç bilgiler nelerdir?",
      "İstanbul'da görülmesi gereken yerler nerelerdir?"
    ]
  },
  "mixtral-8x7b-32768": {
    name: "Mixtral 8x7B",
    description: "Mistral AI'ın güçlü karışık uzman modeli, geniş bağlam penceresi",
    fullDescription: "Mixtral 8x7B, Mistral AI tarafından geliştirilen ve Groq platformu üzerinden sunulan karma uzman (mixture of experts) mimarisine sahip güçlü bir dil modelidir. Geniş bağlam penceresi sayesinde uzun metinleri anlayabilir ve işleyebilir. Türkçe dil desteği sunar ve özellikle karmaşık konuların açıklanması, detaylı analizler yapılması ve uzun metinlerin işlenmesi konusunda üstün performans gösterir. Bilimsel araştırmalar, detaylı açıklamalar ve kapsamlı içerik oluşturma için idealdir.",
    category: "text-generation",
    provider: "groq",
    imageUrl: "https://images.unsplash.com/photo-1517373116369-9bdb8cdc9f62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "groq",
    modelId: "mixtral-8x7b-32768",
    examples: [
      "Kuantum fiziğinin temel prensiplerini anlaşılır şekilde açıklar mısın?",
      "Osmanlı İmparatorluğu'nun çöküş sebeplerini analiz eder misin?",
      "Küresel ısınmanın gelecekteki etkileri neler olabilir?",
      "Yapay zeka etiği hakkında bir makale yazar mısın?",
      "Türkiye'nin ekonomik kalkınma sürecini tarihsel olarak anlatır mısın?"
    ]
  },
  "gemma-7b-it": {
    name: "Gemma 7B-IT",
    description: "Google'ın Gemma modeli, küçük ve verimli yapay zeka",
    fullDescription: "Gemma 7B-IT, Google'ın geliştirdiği ve Groq platformu üzerinden sunulan hafif, verimli ve açık kaynaklı bir yapay zeka modelidir. Instruction-tuned (IT) sürümü, kullanıcı talimatlarını daha iyi anlayacak şekilde özel olarak eğitilmiştir. Türkçe desteği sunan model, günlük kullanım için pratik yanıtlar üretir ve düşük kaynak gereksinimiyle çalışır. Özellikle hızlı yanıt gerektiren uygulamalar ve temel yapay zeka görevleri için idealdir.",
    category: "text-generation",
    provider: "groq",
    imageUrl: "https://images.unsplash.com/photo-1551649446-7a3eab7ff6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    apiType: "groq",
    modelId: "gemma-7b-it",
    examples: [
      "Bugün hava nasıl olacak?",
      "Basit bir pasta tarifi verir misin?",
      "Telefonda depolama alanı nasıl boşaltılır?",
      "İngilizce öğrenmek için günlük 5 pratik öneri verir misin?",
      "Bu hafta sonu İstanbul'da ne yapabilirim?"
    ]
  }
};

export default function ModelDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // In a real app, this would fetch the model details from the API
  const { data: model } = useQuery({
    queryKey: [`/api/models/${id}`],
    enabled: false, // Disable for now as we're using mock data
  });

  // Model detaylarını al
  const modelData = modelDetails[id as string] || {
    id: "0",
    name: "Model Bulunamadı",
    description: "Bu model mevcut değil veya kaldırılmış olabilir.",
    fullDescription: "Bu model mevcut değil veya kaldırılmış olabilir. Lütfen başka bir model seçin.",
    category: "unknown",
    imageUrl: "",
    provider: "",
    apiType: "",
    modelId: "",
    examples: []
  };
  
  // Sabit değerler
  const getTags = () => {
    const baseTags = ["Türkçe Destekli", "Ücretsiz"];
    if (modelData.provider === "huggingface") {
      baseTags.push("Hugging Face");
    } else if (modelData.provider === "gemini") {
      baseTags.push("Google Yapay Zeka");
    } else if (modelData.provider === "deepseek") {
      baseTags.push("Deepseek AI");
    } else if (modelData.provider === "groq") {
      baseTags.push("Groq (Llama, Mixtral)");
    }
    return baseTags;
  };
  
  const usageCount = Math.floor(Math.random() * 10000) + 5000;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setResult(null);
    setImageUrl(null);
    
    try {
      if (modelData.apiType === 'huggingface') {
        if (modelData.category === 'translation') {
          // Hugging Face çeviri
          const result = await translateText(input);
          setResult(result.translation);
        } else if (modelData.category === 'image-generation') {
          // Hugging Face görsel üretimi
          const result = await generateImage({ prompt: input });
          setImageUrl(result.imageUrl);
        } else {
          // Hugging Face metin üretimi
          const result = await generateText({ prompt: input, model: modelData.modelId });
          setResult(result.text);
        }
      } else if (modelData.apiType === 'gemini') {
        if (modelData.category === 'vision') {
          setResult("Görsel analizi için lütfen bir resim yükleyin ve açıklama yazın.");
        } else {
          // Gemini metin üretimi
          const result = await chatWithGemini([{ role: "user", content: input }]);
          setResult(result.text);
        }
      } else if (modelData.apiType === 'deepseek') {
        if (modelData.category === 'code') {
          // Kod üretimi
          const result = await generateCode(input);
          setResult(result.code);
        } else {
          // Deepseek metin üretimi
          const result = await deepseekChatCompletion({
            messages: [
              { role: "system", content: "Sen yardımcı bir Türk asistansın. Yanıtlarını Türkçe olarak ver." },
              { role: "user", content: input }
            ]
          });
          setResult(result.reply);
        }
      } else if (modelData.apiType === 'groq') {
        // Groq üzerinden LLama veya Mixtral
        const result = await groqChatCompletion({
          messages: [
            { role: "system", content: "Sen yardımcı bir Türk asistansın. Yanıtlarını Türkçe olarak ver." },
            { role: "user", content: input }
          ],
          model: modelData.modelId
        });
        setResult(result.reply);
      } else {
        // Desteklenmeyen API türü
        setResult("Bu model şu anda aktif değil. Lütfen başka bir model deneyin.");
      }
    } catch (error) {
      console.error("API request failed:", error);
      setResult("Bir hata oluştu. API anahtarları eksik olabilir veya model şu anda kullanılamıyor olabilir.");
    } finally {
      setIsProcessing(false);
    }
  };

  const setExampleInput = (example: string) => {
    setInput(example);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4"
              onClick={() => setLocation("/models")}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Tüm Modellere Dön
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="rounded-xl overflow-hidden mb-4">
                  <img 
                    src={modelData.imageUrl || "https://via.placeholder.com/400x300"} 
                    alt={modelData.name} 
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-2">{modelData.name}</h1>
                    <p className="text-gray-400 mb-4">{modelData.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getTags().map((tag, index) => (
                        <span key={index} className="bg-muted text-xs text-gray-300 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 text-sm">Kategori:</span>
                        <span className="ml-2 text-white capitalize">{modelData.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Kullanım Sayısı:</span>
                        <span className="ml-2 text-white">{usageCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">API Tipi:</span>
                        <span className="ml-2 text-white">{modelData.apiType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Model ID:</span>
                        <span className="ml-2 text-white">{modelData.modelId}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Model Hakkında</h2>
                    <p className="text-gray-300">{modelData.fullDescription}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Modeli Deneyin</h2>
                    
                    <div className="mb-6">
                      <div className="text-gray-400 mb-2">Örnekler:</div>
                      <div className="flex flex-wrap gap-2">
                        {modelData.examples.map((example, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            size="sm"
                            onClick={() => setExampleInput(example)}
                          >
                            {example.length > 30 ? example.substring(0, 30) + "..." : example}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      {modelData.category === 'visual' ? (
                        <Textarea
                          placeholder="Oluşturmak istediğiniz görseli Türkçe olarak açıklayın..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="h-32"
                        />
                      ) : (
                        <Textarea
                          placeholder="Modelimize sormak istediğiniz soruyu Türkçe olarak yazın..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="h-32"
                        />
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleFormSubmit} 
                      disabled={isProcessing || !input.trim()} 
                      className="w-full relative overflow-hidden group"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <i className="fas fa-spinner fa-spin mr-2"></i> İşleniyor...
                        </span>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Gönder
                          <div className="absolute inset-0 bg-white/[0.05] translate-y-[100%] group-hover:translate-y-0 transition-transform"></div>
                        </>
                      )}
                    </Button>
                    
                    {(result || imageUrl) && (
                      <div className="mt-8 border border-gray-700 rounded-lg p-4">
                        <div className="text-gray-400 mb-2">Sonuç:</div>
                        {imageUrl ? (
                          <div className="mt-2">
                            <img src={imageUrl} alt="Generated" className="w-full rounded-lg" />
                          </div>
                        ) : (
                          <div className="bg-muted p-4 rounded whitespace-pre-wrap">{result}</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
