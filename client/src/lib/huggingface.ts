import { apiRequest } from "./queryClient";
import { HfInference } from "@huggingface/inference";

// Hugging Face Inference API anahtarı (frontend'de import.meta.env kullanıyoruz)
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY || "");

interface TextGenerationParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ImageClassificationParams {
  imageUrl: string;
  model?: string;
}

interface ImageGenerationParams {
  prompt: string;
  negative_prompt?: string;
}

interface TextToSpeechParams {
  text: string;
  voice?: string;
}

// Metin Oluşturma (Text Generation)
export async function generateText(params: TextGenerationParams) {
  try {
    const { prompt, model, maxTokens, temperature } = params;
    
    // Türkçe dil modelleri için tercih edilen modeller
    const defaultModel = "bigscience/bloom-1b7"; // BLOOM çok dilli bir model
    
    const result = await hf.textGeneration({
      model: model || defaultModel,
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens || 100,
        temperature: temperature || 0.7,
        return_full_text: false,
      }
    });
    
    return { text: result.generated_text, success: true };
  } catch (error: any) {
    console.error("Text generation error:", error);
    return { text: "", error: error.message, success: false };
  }
}

// Görüntü Sınıflandırma (Image Classification)
export async function classifyImage(params: ImageClassificationParams) {
  try {
    const { imageUrl, model } = params;
    
    // Görüntü sınıflandırma için önerilen model
    const defaultModel = "microsoft/beit-base-patch16-224";
    
    const result = await hf.imageClassification({
      model: model || defaultModel,
      data: await (await fetch(imageUrl)).blob(),
    });
    
    return { classifications: result, success: true };
  } catch (error: any) {
    console.error("Image classification error:", error);
    return { classifications: [], error: error.message, success: false };
  }
}

// Metin Çevirisi (Translation) - İngilizce'den Türkçe'ye
export async function translateText(text: string, targetLang: string = "tr") {
  try {
    // Helsinki-NLP Opus MT modelleri çeviri için en iyi seçeneklerden biri
    const model = targetLang === "tr" 
      ? "Helsinki-NLP/opus-mt-en-tr" 
      : "Helsinki-NLP/opus-mt-tr-en";
    
    const result = await hf.translation({
      model: model,
      inputs: text,
    });
    
    return { translation: result.translation_text, success: true };
  } catch (error: any) {
    console.error("Translation error:", error);
    return { translation: "", error: error.message, success: false };
  }
}

// Metin Özetleme (Summarization)
export async function summarizeText(text: string) {
  try {
    // Metin özetleme için uygun model
    const model = "facebook/bart-large-cnn";
    
    const result = await hf.summarization({
      model: model,
      inputs: text,
      parameters: {
        max_length: 100,
      }
    });
    
    return { summary: result.summary_text, success: true };
  } catch (error: any) {
    console.error("Summarization error:", error);
    return { summary: "", error: error.message, success: false };
  }
}

// Görüntü Oluşturma (Image Generation) - Stable Diffusion
export async function generateImage(params: ImageGenerationParams) {
  try {
    const { prompt, negative_prompt } = params;
    
    // Stable Diffusion 2.1 veya benzeri modeller
    const model = "stabilityai/stable-diffusion-2-1";
    
    const result = await hf.textToImage({
      model: model,
      inputs: prompt,
      parameters: {
        negative_prompt: negative_prompt || "low quality, bad anatomy, blurry",
      }
    });
    
    // Blob'u veri URL'sine dönüştür
    const blob = new Blob([result], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    
    return { imageUrl, success: true };
  } catch (error: any) {
    console.error("Image generation error:", error);
    return { imageUrl: "", error: error.message, success: false };
  }
}

// Metinden Konuşmaya (Text-to-Speech)
export async function textToSpeech(params: TextToSpeechParams) {
  try {
    const { text, voice } = params;
    
    // Microsoft'un SpeechT5 modeli
    const model = "microsoft/speecht5_tts";
    
    const result = await hf.textToSpeech({
      model: model,
      inputs: text,
      parameters: {
        speaker_embeddings: voice || undefined
      }
    });
    
    // Blob'u veri URL'sine dönüştür
    const blob = new Blob([result], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(blob);
    
    return { audioUrl, success: true };
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return { audioUrl: "", error: error.message, success: false };
  }
}

// Kod Üretimi (Code Generation)
export async function generateCode(prompt: string, language: string = "python") {
  try {
    // Kod üretimi için 
    const model = "bigcode/starcoder";
    
    const result = await hf.textGeneration({
      model: model,
      inputs: `${language} kodu yaz: ${prompt}`,
      parameters: {
        max_new_tokens: 250,
        return_full_text: false,
      }
    });
    
    return { code: result.generated_text, success: true };
  } catch (error) {
    console.error("Code generation error:", error);
    return { code: "", error: error.message, success: false };
  }
}

// Soru-Cevap (Question Answering)
export async function answerQuestion(question: string, context: string) {
  try {
    const model = "deepset/roberta-base-squad2";
    
    const result = await hf.questionAnswering({
      model: model,
      inputs: {
        question: question,
        context: context
      }
    });
    
    return { answer: result.answer, score: result.score, success: true };
  } catch (error) {
    console.error("Question answering error:", error);
    return { answer: "", score: 0, error: error.message, success: false };
  }
}

// Tüm AI Modellerini Getir
export async function getTurkishModels() {
  try {
    // Tüm modelleri içeren listeyi döndür
    return {
      models: [
        // Hugging Face Modelleri
        {
          id: "dbmdz/bert-base-turkish-cased",
          name: "BERT Türkçe",
          description: "Türkçe metinler için optimize edilmiş BERT modeli",
          category: "text",
          provider: "huggingface"
        },
        {
          id: "Helsinki-NLP/opus-mt-en-tr",
          name: "Opus-MT İng-Tr Çeviri",
          description: "İngilizce'den Türkçe'ye çeviri için özel model",
          category: "translation",
          provider: "huggingface"
        },
        {
          id: "Helsinki-NLP/opus-mt-tr-en",
          name: "Opus-MT Tr-İng Çeviri",
          description: "Türkçe'den İngilizce'ye çeviri için özel model",
          category: "translation",
          provider: "huggingface"
        },
        {
          id: "stabilityai/stable-diffusion-2-1",
          name: "Stable Diffusion",
          description: "Metin tanımlarından görüntüler oluşturan model",
          category: "image-generation",
          provider: "huggingface"
        },
        {
          id: "microsoft/speecht5_tts",
          name: "SpeechT5",
          description: "Metinden konuşma oluşturan güçlü model",
          category: "speech",
          provider: "huggingface"
        },
        {
          id: "bigscience/bloom-1b7",
          name: "BLOOM 1.7B",
          description: "Çok dilli metin üretimi yapabilen yapay zeka modeli",
          category: "text-generation",
          provider: "huggingface"
        },
        
        // Gemini Modelleri
        {
          id: "gemini-pro-1.5",
          name: "Gemini Pro 1.5",
          description: "Google'ın gelişmiş çok amaçlı yapay zeka modeli",
          category: "text-generation",
          provider: "gemini"
        },
        {
          id: "gemini-1.5-pro-vision",
          name: "Gemini Pro 1.5 Vision",
          description: "Görsel anlama ve analiz yeteneğine sahip yapay zeka modeli",
          category: "vision",
          provider: "gemini"
        },
        
        // Deepseek Modelleri
        {
          id: "deepseek-chat",
          name: "Deepseek Chat",
          description: "Yüksek kaliteli metin üretimi yapabilen sohbet modeli",
          category: "text-generation",
          provider: "deepseek"
        },
        {
          id: "deepseek-coder",
          name: "Deepseek Coder",
          description: "Kod üretimi konusunda uzmanlaşmış yapay zeka modeli",
          category: "code",
          provider: "deepseek"
        },
        
        // Groq Modelleri
        {
          id: "llama3-8b-8192",
          name: "Llama 3 (8B)",
          description: "Meta'nın açık kaynaklı Llama 3 modeli, hızlı ve verimli",
          category: "text-generation",
          provider: "groq"
        },
        {
          id: "mixtral-8x7b-32768",
          name: "Mixtral 8x7B",
          description: "Mistral AI'ın güçlü karışık uzman modeli, geniş bağlam penceresi",
          category: "text-generation",
          provider: "groq"
        },
        {
          id: "gemma-7b-it",
          name: "Gemma 7B-IT",
          description: "Google'ın Gemma modeli, küçük ve verimli yapay zeka",
          category: "text-generation",
          provider: "groq"
        }
      ],
      success: true
    };
  } catch (error: any) {
    console.error("Error fetching AI models:", error);
    return { models: [], error: error.message, success: false };
  }
}
