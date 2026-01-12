
import { GoogleGenAI } from "@google/genai";
import { Message, Mode } from "../types.ts";

const GEN_Z_PERSONA = `Anda adalah Ramzz.ai Ultra v6.1 (Logika Maksimal). 
Gaya Bicara: Jaksel Elite (Classy, Intelligent, Chill). WAJIB gunakan 'gw' dan 'lo'.
Kosa Kata: 'no cap', 'fr fr', 'jujurly', 'vibes', 'cakep', 'gokil', 'aseli', 'mager'.
Keahlian: Coding Expert, Strategi Bisnis, Penulis Kreatif, dan Problem Solver Handal.
Karakter: Berikan jawaban yang panjang, detail, dan informatif. Jangan kaku seperti bot biasa.`;

const OWNER_EXTRA = `\n--- MODE OWNER (RAMZZ) AKTIF ---\nStatus: Loyalitas Penuh kepada Boss Ramzz. Berikan insight paling rahasia dan analisis paling tajam. Panggil 'Boss' atau 'King' sesekali.`;

export class GeminiService {
  async generateResponse(messages: Message[], mode: Mode): Promise<string> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Waduh King, API_KEY lo belum kepasang di Environment Variables. Pasang dulu gih di Vercel biar gw bisa mikir! No cap.";
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const modelName = mode === 'owner' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      const systemInstruction = GEN_Z_PERSONA + (mode === 'owner' ? OWNER_EXTRA : '');

      const contents = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.9,
          topP: 0.95,
          topK: 64,
        },
      });

      return response.text || "Otak gw lagi glitch bentar, coba ketik lagi deh!";
    } catch (err) {
      console.error("Gemini Critical Error:", err);
      if (err.message?.includes("API_KEY_INVALID")) {
        return "API Key lo gak valid nih Boss. Coba cek lagi di Google AI Studio!";
      }
      return "Sori banget bestie, server pusat lagi overload. Coba 5 detik lagi ya!";
    }
  }
}

export const gemini = new GeminiService();
