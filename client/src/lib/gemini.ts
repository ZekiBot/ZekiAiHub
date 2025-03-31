import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Gemini Pro 2.5 API'sini kullanmak için
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

interface TextGenerationParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ImageGenerationParams {
  prompt: string;
  negative_prompt?: string;
}

// Metin Oluşturma (Text Generation)
export async function generateText(params: TextGenerationParams) {
  try {
    const { prompt, maxTokens, temperature } = params;
    
    // Gemini Pro 2.5 modelini kullan
    const model = genAI.getGenerativeModel({ model: "gemini-pro-1.5" });

    // Güvenlik ayarları
    const generationConfig = {
      temperature: temperature || 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: maxTokens || 1024,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Türkçe yanıt vermesi için yönlendirme yap
    const turkishPrompt = `Lütfen Türkçe dilinde yanıt ver: ${prompt}`;
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: turkishPrompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    const text = response.text();
    
    return { text, success: true };
  } catch (error: any) {
    console.error("Gemini text generation error:", error);
    return { 
      text: "", 
      error: error.message, 
      success: false 
    };
  }
}

// Çoklu Turlu Sohbet
export async function chatWithGemini(messages: Array<{role: string, content: string}>) {
  try {
    // Gemini Pro 2.5 modelini kullan
    const model = genAI.getGenerativeModel({ model: "gemini-pro-1.5" });

    // Chat oturumu başlat
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      history: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    // Sistemin Türkçe cevap vermesini sağla
    const result = await chat.sendMessage("Lütfen Türkçe dilinde yanıt ver.");

    return { 
      text: result.response.text(), 
      success: true 
    };
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    return { 
      text: "", 
      error: error.message, 
      success: false 
    };
  }
}

// Çoklu modalite (Metin + Görüntü) işleme
export async function analyzeImageWithText(imageUrl: string, prompt: string) {
  try {
    // Gemini Pro Vision modelini kullan
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });

    // Görüntüyü getir
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const base64EncodedImage = await blobToBase64(imageBlob);

    // Türkçe yanıt vermesi için yönlendirme yap
    const turkishPrompt = `Bu görüntüyü analiz et ve Türkçe dilinde açıkla. ${prompt}`;
    
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: turkishPrompt },
            {
              inlineData: {
                mimeType: imageBlob.type,
                data: base64EncodedImage,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    return { 
      analysis: response.text(), 
      success: true 
    };
  } catch (error: any) {
    console.error("Gemini image analysis error:", error);
    return { 
      analysis: "", 
      error: error.message, 
      success: false 
    };
  }
}

// Yardımcı fonksiyon - Blob'u Base64'e dönüştür
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        // Base64 URL'sini alıp sadece base64 kısmını çıkar (data:image/jpeg;base64, kısmını at)
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Metin açıklama veya özet oluşturma
export async function summarizeTextWithGemini(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-1.5" });
    
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Lütfen aşağıdaki metni Türkçe olarak özetle:\n\n${text}` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 150,
      },
    });

    const response = result.response;
    return { 
      summary: response.text(), 
      success: true 
    };
  } catch (error: any) {
    console.error("Gemini summarization error:", error);
    return { 
      summary: "", 
      error: error.message, 
      success: false 
    };
  }
}