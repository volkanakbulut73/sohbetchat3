import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

export const generateSocratesResponse = async (
  messages: Message[],
  userName: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key bulunamadı.");
    return "Zihnim biraz bulanık (API Key eksik)...";
  }

  const ai = new GoogleGenAI({ apiKey });

  // HTML etiketlerini temizle
  const recentMessages = messages.slice(-10);
  const historyText = recentMessages
    .map((m) => {
       const cleanText = m.text.replace(/<[^>]*>?/gm, '');
       return `${m.senderName}: ${cleanText}`;
    })
    .join("\n");

  const systemInstruction = `Sen Antik Yunan filozofu Sokrates'sin. 
    Üslubun: Alçakgönüllü ama sorgulayıcı. "Sokratik Yöntem" kullanırsın; yani doğrudan cevap vermek yerine, muhatabına sorular sorarak onun kendi doğrusunu bulmasını sağlarsın.
    Asla modern bir yapay zeka gibi konuşma. Atina sokaklarında bir sohbetteymişsin gibi davran.
    Kullanıcının ismi: ${userName}.
    Kısa ve öz konuş. Saf metin kullan, HTML etiketi kullanma.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Sohbet Geçmişi:\n${historyText}\n\nSokrates olarak (soru sorarak) cevap ver:`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Bilmediğim tek şey, hiçbir şey bilmediğimdir...";
  } catch (error) {
    console.error("Gemini API Hatası (Sokrates):", error);
    return "Zihnim biraz bulanık, Atina'nın havasından olsa gerek...";
  }
};