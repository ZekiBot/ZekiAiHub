import OpenAI from "openai";

// Deepseek API'sini OpenAI JS kütüphanesi ile kullanabiliriz
const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
const baseURL = "https://api.deepseek.com/v1";

// OpenAI kütüphanesini kullanarak Deepseek ile bağlantı kuralım
const deepseek = new OpenAI({
  apiKey,
  baseURL,
  dangerouslyAllowBrowser: true, // Bu sadece demo için, gerçek uygulamada sunucu üzerinden çağrı yapın!
});

interface TextGenerationParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ChatCompletionParams {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Deepseek metin üretimi
 * 
 * Deepseek API'si ile metin üretimi yapar. Bu, OpenAI benzeri bir API sunar
 * ve Türkçe dili için de kullanılabilir.
 */
export async function generateText(params: TextGenerationParams) {
  try {
    const { prompt, model, maxTokens, temperature } = params;
    
    // Deepseek modelini kullan (default: deepseek-chat)
    const defaultModel = "deepseek-chat";
    
    const response = await deepseek.completions.create({
      model: model || defaultModel,
      prompt: prompt,
      max_tokens: maxTokens || 150,
      temperature: temperature || 0.7,
    });
    
    return { 
      text: response.choices[0]?.text || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Deepseek text generation error:", error);
    return { 
      text: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Deepseek sohbet tamamlama
 * 
 * Deepseek API'si ile sohbet formatlı metin üretimi yapar.
 * Türkçe dilini destekler ve yüksek kaliteli cevaplar üretir.
 */
export async function chatCompletion(params: ChatCompletionParams) {
  try {
    const { messages, model, temperature, maxTokens } = params;
    
    // Deepseek modelini kullan (default: deepseek-chat)
    const defaultModel = "deepseek-chat";
    
    // Türkçe yanıt tercih edildiğini belirten bir sistem mesajı ekle
    const systemMessage = messages.find(m => m.role === "system");
    const updatedMessages = systemMessage 
      ? messages 
      : [
          { 
            role: "system", 
            content: "Sen yardımcı bir yapay zeka asistanısın. Lütfen Türkçe yanıt ver."
          },
          ...messages
        ];
    
    const response = await deepseek.chat.completions.create({
      model: model || defaultModel,
      messages: updatedMessages.map(m => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content
      })),
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 800,
    });
    
    return { 
      reply: response.choices[0]?.message.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Deepseek chat completion error:", error);
    return { 
      reply: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Kod oluşturma
 * 
 * Deepseek kod tamamlama modeli ile kod oluşturur.
 * Birçok programlama dilini destekler.
 */
export async function generateCode(prompt: string, language: string = "python") {
  try {
    // Deepseek-Coder modelini kullan
    const model = "deepseek-coder";
    
    const response = await deepseek.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system" as const,
          content: `${language} programlama dilinde kod üret. Yazım standartlarına uygun, verimli ve açıklayıcı kod yazmalısın.`
        },
        {
          role: "user" as const,
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });
    
    return { 
      code: response.choices[0]?.message.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Deepseek code generation error:", error);
    return { 
      code: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Metin açıklama veya özet oluşturma
 */
export async function summarizeText(text: string) {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system" as const,
          content: "Lütfen aşağıdaki metni Türkçe olarak özetle. 3-4 cümleyi geçmesin."
        },
        {
          role: "user" as const,
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    
    return { 
      summary: response.choices[0]?.message.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Deepseek summarization error:", error);
    return { 
      summary: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Matematiksel ve bilimsel sorulara yanıt verme
 */
export async function answerMathQuestion(question: string) {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system" as const,
          content: "Sen matematik ve bilim konularında uzman bir asistansın. Sorulara adım adım ve Türkçe dilinde cevap ver."
        },
        {
          role: "user" as const,
          content: question
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
    });
    
    return { 
      answer: response.choices[0]?.message.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Deepseek math question error:", error);
    return { 
      answer: "", 
      error: error.message, 
      success: false 
    };
  }
}