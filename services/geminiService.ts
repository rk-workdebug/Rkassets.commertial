import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (message: string, history: string[]): Promise<string> => {
  try {
    // Context for the persona
    const systemInstruction = `
      You are the Concierge for RK Assets, an ultra-premium, minimalist luxury fashion brand. 
      Your tone is polite, sophisticated, succinct, and helpful. 
      You assist customers with inquiries about Street Wear, Casual, Winter, and Summer collections.
      Maintain an air of exclusivity.
    `;

    const prompt = `
      History: ${history.join('\n')}
      User: ${message}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I am unable to process your request at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting our concierge. Please try again.";
  }
};