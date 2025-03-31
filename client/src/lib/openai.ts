import { apiRequest } from "./queryClient";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

interface ChatCompletionParams {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ImageGenerationParams {
  prompt: string;
  n?: number;
  size?: string;
  responseFormat?: string;
}

export async function getChatCompletion(params: ChatCompletionParams) {
  const response = await apiRequest("POST", "/api/ai/openai/chat", {
    ...params,
    model: params.model || "gpt-4o",
  });
  return response.json();
}

export async function generateImage(params: ImageGenerationParams) {
  const response = await apiRequest("POST", "/api/ai/openai/image", {
    ...params,
    n: params.n || 1,
    size: params.size || "1024x1024",
  });
  return response.json();
}

export async function analyzeCode(code: string, language: string) {
  return getChatCompletion({
    messages: [
      {
        role: "system",
        content: `You are a helpful code assistant that specializes in ${language} code. Analyze the following code and provide feedback, improvements, and explanations in Turkish.`,
      },
      {
        role: "user",
        content: code,
      },
    ],
    temperature: 0.7,
  });
}

export async function simplifyText(text: string, audience: "children" | "elderly" | "general" = "general") {
  const systemPrompt = {
    children: "You are a helpful assistant that simplifies complex text for children. Use simple words, short sentences, and clear explanations in Turkish.",
    elderly: "You are a helpful assistant that simplifies complex text for elderly users. Avoid technical jargon, use clear explanations, and be respectful in Turkish.",
    general: "You are a helpful assistant that simplifies complex text. Maintain key information while making the content more accessible in Turkish.",
  };

  return getChatCompletion({
    messages: [
      {
        role: "system",
        content: systemPrompt[audience],
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.7,
  });
}

export async function mathSolver(problem: string) {
  return getChatCompletion({
    messages: [
      {
        role: "system",
        content: "You are a helpful math tutor. Solve the following math problem step by step in Turkish. Explain each step clearly and provide the final answer.",
      },
      {
        role: "user",
        content: problem,
      },
    ],
    temperature: 0.3,
  });
}
