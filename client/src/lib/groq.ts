import Groq from "groq-sdk";

// Groq API'sini yapılandır
const apiKey = import.meta.env.VITE_GROQ_API_KEY || "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";
const groq = new Groq({ 
  apiKey,
  dangerouslyAllowBrowser: true // Bu sadece demo için, gerçek uygulamada sunucu üzerinden çağrı yapın!
});

interface ChatCompletionParams {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface TextGenerationParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Groq ile metin oluşturma
 * 
 * Groq API'si hızlı yanıt veren güçlü modeller sağlar
 * ve LLama 3 dahil birçok model sunar.
 */
export async function generateText(params: TextGenerationParams) {
  try {
    const { prompt, model, maxTokens, temperature } = params;
    
    // Llama 3 veya Mixtral modelini kullan
    const defaultModel = "llama3-8b-8192";
    
    // Türkçe yanıt vermesi için yönlendirme yap
    const turkishPrompt = `Lütfen Türkçe dilinde yanıt ver: ${prompt}`;
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: turkishPrompt
        }
      ],
      model: model || defaultModel,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1024,
    });
    
    return { 
      text: response.choices[0]?.message?.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Groq text generation error:", error);
    return { 
      text: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Groq sohbet tamamlama
 * 
 * Groq API'si ile sohbet formatlı metin üretimi yapar.
 * Yüksek bir hızda sonuç döndürür.
 */
export async function chatCompletion(params: ChatCompletionParams) {
  try {
    const { messages, model, temperature, maxTokens } = params;
    
    // Türkçe yanıt tercih edildiğini belirten bir sistem mesajı ekleyin
    const systemMessage = messages.find(m => m.role === "system");
    const updatedMessages = systemMessage 
      ? messages 
      : [
          { 
            role: "system" as const, 
            content: "Sen yardımcı bir yapay zeka asistanısın. Lütfen Türkçe yanıt ver."
          },
          ...messages
        ];
    
    // Llama 3 veya Mixtral modelini kullan
    const defaultModel = "llama3-8b-8192";
    
    const response = await groq.chat.completions.create({
      messages: updatedMessages.map(m => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content
      })),
      model: model || defaultModel,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1024,
    });
    
    return { 
      reply: response.choices[0]?.message?.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Groq chat completion error:", error);
    return { 
      reply: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Bilgi sorgulama
 * 
 * Groq'un yüksek performanslı modelleri kullanarak sorularınızı yanıtlar
 */
export async function answerQuestion(question: string) {
  try {
    // Mixtral 8x7B modeli kullan (Groq üzerinden)
    const model = "mixtral-8x7b-32768";
    
    const response = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system" as const,
          content: "Sen yardımcı bir asistansın. Kullanıcıların sorularına doğru, bilgilendirici ve detaylı yanıtlar ver. Yanıtlarını Türkçe olarak ver."
        },
        {
          role: "user" as const,
          content: question
        }
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });
    
    return { 
      answer: response.choices[0]?.message?.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Groq question answering error:", error);
    return { 
      answer: "", 
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
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system" as const,
          content: "Aşağıdaki metni Türkçe olarak özetle. Önemli bilgileri koru ve 3-4 cümle kullan."
        },
        {
          role: "user" as const,
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 256,
    });
    
    return { 
      summary: response.choices[0]?.message?.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Groq summarization error:", error);
    return { 
      summary: "", 
      error: error.message, 
      success: false 
    };
  }
}

/**
 * Kod oluşturma
 * 
 * Groq üzerinden LLama 3 veya Mixtral modelleri ile kod oluştur
 */
export async function generateCode(prompt: string, language: string = "python") {
  try {
    // Llama 3 veya Mixtral modelini kullan
    const model = "mixtral-8x7b-32768"; // Kod oluşturma için Mixtral daha iyidir
    
    const response = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system" as const,
          content: `${language} programlama dilinde kod üretmeniz gerekiyor. Yazım standartlarına uygun, verimli ve açıklayıcı kod yazın. Açıklamaları Türkçe olarak ekleyin.`
        },
        {
          role: "user" as const,
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });
    
    return { 
      code: response.choices[0]?.message?.content || "", 
      success: true 
    };
  } catch (error: any) {
    console.error("Groq code generation error:", error);
    return { 
      code: "", 
      error: error.message, 
      success: false 
    };
  }
}