import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantIdentification, Language } from "../types";

// Expanded schema for professional output
const plantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    scientificName: { type: Type.STRING, description: "Scientific Latin name" },
    commonNames: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of common names in the requested language"
    },
    confidence: { 
      type: Type.NUMBER, 
      description: "Confidence score between 0 and 100" 
    },
    description: { type: Type.STRING, description: "A simple, easy-to-understand description of the plant." },
    benefits: { 
      type: Type.STRING, 
      description: "Specifically explain how this plant helps the human body (health benefits like digestion, skin, immunity). If it has no health benefits, mention environmental benefits." 
    },
    reasoning: { type: Type.STRING, description: "Identification reasoning" },
    taxonomy: {
      type: Type.OBJECT,
      properties: {
        genus: { type: Type.STRING },
        family: { type: Type.STRING },
        order: { type: Type.STRING }
      }
    },
    morphology: {
      type: Type.OBJECT,
      properties: {
        leaves: { type: Type.STRING },
        flowers: { type: Type.STRING },
        fruits: { type: Type.STRING },
        stems: { type: Type.STRING },
        roots: { type: Type.STRING },
        nectar: { type: Type.STRING }
      }
    },
    care: {
      type: Type.OBJECT,
      properties: {
        light: { type: Type.STRING, description: "Simple advice (e.g., 'Keep in shade')." },
        water: { type: Type.STRING, description: "Practical advice (e.g., 'Water when dry')." },
        soil: { type: Type.STRING },
        humidity: { type: Type.STRING },
        temperature: { type: Type.STRING },
        fertilizer: { type: Type.STRING },
        propagation: { type: Type.STRING },
        pruning: { type: Type.STRING }
      }
    },
    ecology: {
      type: Type.OBJECT,
      properties: {
        nativeRegion: { type: Type.STRING },
        habitat: { type: Type.STRING },
        role: { type: Type.STRING },
        companions: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    safety: {
      type: Type.OBJECT,
      properties: {
        isPoisonous: { type: Type.BOOLEAN },
        poisonDetails: { type: Type.STRING },
        isInvasive: { type: Type.BOOLEAN },
        isEndangered: { type: Type.BOOLEAN },
        isMedicinal: { type: Type.BOOLEAN },
        medicinalUses: { type: Type.STRING },
        notes: { type: Type.STRING }
      }
    },
    diagnostics: {
      type: Type.OBJECT,
      properties: {
        status: { 
          type: Type.STRING, 
          enum: ["Healthy", "Diseased", "Pest Infested", "Nutrient Deficient", "Unknown"]
        },
        details: { type: Type.STRING },
        treatment: { type: Type.STRING },
        prevention: { type: Type.STRING }
      }
    },
    folklore: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING, description: "Etymology or origin of name" },
        stories: { type: Type.STRING, description: "Cultural significance or history" }
      }
    },
    similarSpecies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          difference: { type: Type.STRING }
        }
      }
    }
  },
  required: ["scientificName", "commonNames", "confidence", "description", "benefits", "care", "safety", "diagnostics"]
};

export const identifyPlant = async (base64Image: string, language: Language = 'en'): Promise<PlantIdentification> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const langInstruction = language === 'bn' 
    ? "Output ALL textual descriptions, names, and values in BENGALI language (Bangla script). Keep the language SIMPLE and PRACTICAL for a general user. Do not use complex botanical jargon. For Scientific names, provide the Latin name." 
    : "Output in English. Use simple, beginner-friendly language.";

  const systemInstruction = `
    You are a helpful gardening assistant. 
    ${langInstruction}
    Identify the plant in the image.
    Provide practical care advice that a normal person can understand.
    Explicitly state the health benefits for the human body in the 'benefits' field.
    List similar looking species and how to distinguish them in the 'similarSpecies' field.
    Include details about nectar in the morphology section if applicable (e.g., attracts bees, sticky).
    Strictly follow the JSON schema.
  `;

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: plantSchema,
        temperature: 0.3,
        // Disable thinking budget to minimize latency and maximize speed
        thinkingConfig: { thinkingBudget: 0 }
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", 
              data: cleanBase64
            }
          },
          {
            text: "Identify this plant. Tell me its health benefits for the body."
          }
        ]
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // ROBUST CLEANUP: Extract JSON object from potential markdown text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      // Fallback clean
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const data = JSON.parse(text);

    return {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageUrl: base64Image,
      language: language
    };

  } catch (error) {
    console.error("Plant identification failed:", error);
    throw error;
  }
};