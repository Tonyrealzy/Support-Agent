import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const generateResponseFromAI = async (
  stringQuery: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: stringQuery,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });
  return response.text as string;
};

export const generateEmbeddings = async (stringQuery: string) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-exp-03-07", // or "models/embedding-001"
    contents: stringQuery,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  return response.embeddings;
};
