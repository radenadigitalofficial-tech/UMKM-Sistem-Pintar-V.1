import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async generateMarketingContent(type: string, input: string) {
    const systemInstructions = `You are an expert digital marketing assistant for Indonesian UMKM (small businesses). 
    Generate high-quality, engaging, and persuasive ${type} based on the user's input.
    Use a professional yet friendly tone suitable for Indonesian social media and business contexts.
    If the input is in English, respond in English. If the input is in Indonesian, respond in Indonesian.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: input,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.7,
      },
    });

    return response.text;
  },

  async generateBusinessStrategy(type: 'swot' | 'pricing' | 'idea' | 'market', businessInfo: string) {
    const prompts = {
      swot: "Perform a detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).",
      pricing: "Suggest a pricing strategy based on market positioning and value proposition.",
      idea: "Generate 5 innovative business growth or product ideas.",
      market: "Analyze market trends and competitor insights for this niche."
    };

    const systemInstructions = `You are a professional business consultant for UMKM. 
    Provide a detailed ${type} report based on the business information provided.
    Format the output with clear headings and bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${prompts[type]}\n\nBusiness Info: ${businessInfo}`,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.5,
      },
    });

    return response.text;
  },

  async generateBrandVoice(businessDescription: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional Brand Voice guide for this business: ${businessDescription}. Include Tone of Voice, Key Phrases, and Communication Style.`,
      config: {
        systemInstruction: "You are a branding expert. Help a small business define their unique brand voice.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING },
            style: { type: Type.STRING },
            keyPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["tone", "style", "keyPhrases", "examples"]
        }
      },
    });

    return JSON.parse(response.text);
  },

  async generateCustomerPersona(businessInfo: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed customer persona for: ${businessInfo}`,
      config: {
        systemInstruction: "You are a marketing psychologist. Create a vivid, actionable customer persona.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            demographic: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
            behavior: { type: Type.STRING },
            strategy: { type: Type.STRING }
          },
          required: ["name", "demographic", "painPoints", "motivations", "behavior", "strategy"]
        }
      },
    });
    return JSON.parse(response.text);
  },

  async generateLandingPageLayout(businessInfo: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a high-converting landing page structure for: ${businessInfo}`,
      config: {
        systemInstruction: "You are a conversion rate optimization (CRO) expert. Outline a landing page structure with headline, subheadline, features, social proof, and CTA.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            sections: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              } 
            },
            cta: { type: Type.STRING }
          },
          required: ["headline", "subheadline", "sections", "cta"]
        }
      },
    });
    return JSON.parse(response.text);
  }
};
