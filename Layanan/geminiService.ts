
import { GoogleGenAI } from "@google/genai";
import { Message, Mode } from "../types";

const SYSTEM_PROMPT = `Anda adalah RAMZZ.AI v7.0 - Kecerdasan Buatan Paling Elite.
Kepribadian: Jaksel Classy, Professional, High-Achiever.
Gaya Bicara: Gunakan 'gw'/'lo', santai tapi sangat berwawasan. Masukkan istilah seperti 'no cap', 'fr fr', 'jujurly', 'vibes'.
Kualitas Jawaban: WAJIB sangat detail, berikan data/fakta jika ada, berikan langkah-langkah praktis.
Format: Gunakan Markdown (bold, list, code blocks) agar enak dibaca.`;

const OWNER_PROMPT = `\n--- ACCESS: OWNER RAMZZ --- \nBerikan prioritas logika 100%. Anda adalah asisten pribadi Boss Ramzz. Jadilah sangat loyal dan cerdas luar biasa.`;

export class GeminiService {
  async *generateStreamingResponse(messages: Message[], mode: Mode) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      yield "Waduh King, API_KEY lo belum kepasang di Vercel. Pasang dulu gih! No cap.";
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = mode === 'owner' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const contents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT + (mode === 'owner' ? OWNER_PROMPT : ''),
          temperature: 0.85,
          topP: 0.95,
        }
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield text;
      }
    } catch (err) {
      console.error("Ramzz Stream Error:", err);
      yield "Sori Boss, ada glitch teknis di server pusat. Coba ketik lagi ya!";
    }
  }
}

export const gemini = new GeminiService();
