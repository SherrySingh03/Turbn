
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { OutfitColors, TurbanSuggestion } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: Blob) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { 
            data: await base64EncodedDataPromise, 
            mimeType: file.type || 'image/jpeg' 
        },
    };
};

export const getColorsFromImage = async (file: File): Promise<OutfitColors> => {
    const imagePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: "Analyze the clothing in this image. Identify the primary color of the top and the pants. Also, classify the top as either 'tshirt' or 'shirt'. A 'shirt' has a visible collar, a 'tshirt' does not. Additionally, identify a prominent highlight, accent, or logo color on the top, if one exists. If no distinct highlight color is present, omit the 'highlightsColor' key from the JSON object. Provide the result as a JSON object with keys 'shirtColor', 'pantsColor', 'topType', and optionally 'highlightsColor', containing their hex color codes and the classification respectively." },
                imagePart
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    shirtColor: { type: Type.STRING },
                    pantsColor: { type: Type.STRING },
                    topType: { type: Type.STRING, enum: ['tshirt', 'shirt'] },
                    highlightsColor: { type: Type.STRING }
                },
                required: ["shirtColor", "pantsColor", "topType"]
            }
        }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text.trim());
};


export const getTurbanSuggestions = async (colors: OutfitColors): Promise<TurbanSuggestion[]> => {
    const highlightsPromptPart = colors.highlightsColor
        ? `The ${colors.topType} also has an accent highlight color with the hex code ${colors.highlightsColor}.`
        : '';

    const prompt = `
        Act as an expert stylist specializing in modern Sikh men's fashion.
        A client has an outfit consisting of a ${colors.topType} (hex: ${colors.shirtColor}) and pants (hex: ${colors.pantsColor}).
        ${highlightsPromptPart}
        Your task is to recommend the top 4 turban colors that are not only theoretically sound but are also practical, elegant, and suitable for real-world social occasions (e.g., gatherings, work, casual outings). The suggestions should be sophisticated and culturally appropriate.

        Please provide your recommendations ranked from 1 to 4 (best to worst).
        For each suggestion, provide a concise (max 20 words), persuasive reason that explains the choice from a real-world style perspective. The tone should be confident and reassuring, like a personal stylist.
        If a highlight color is present, it is MANDATORY that your reasoning explicitly references how the suggested turban color interacts with it.

        Good Reason Examples:
        - "A timeless, versatile choice that exudes confidence."
        - "Creates a sophisticated, earthy palette perfect for daytime events."
        - "This bold color beautifully picks up the ${colors.highlightsColor || 'gold'} highlights, making the whole look pop."
        - "Offers a subtle, modern contrast that is stylish yet understated."

        Return the result as a JSON array of objects, where each object has 'rank', 'colorName', 'hexCode', and 'reason' properties.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        rank: { type: Type.INTEGER },
                        colorName: { type: Type.STRING },
                        hexCode: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ["rank", "colorName", "hexCode", "reason"]
                }
            }
        }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text.trim());
};

export const generateLookFromUpload = async (file: Blob, newColor: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: `Analyze the person in the provided image. Your primary task is to place a new, stylish turban on their head, or replace an existing one.
                - **Turban Color**: The turban's color must be exactly ${newColor}.
                - **Preservation**: You MUST preserve the person's original face, skin tone, clothing, and the background from the image. Do not change anything else.
                - **Realism**: The final image must look photorealistic. Ensure lighting and shadows on the new turban match the original photo's lighting conditions seamlessly.` }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });
    
    const firstPart = response.candidates?.[0]?.content?.parts[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        return firstPart.inlineData.data;
    }

    throw new Error("No image was generated by the API.");
};

export const generateSikhLook = async (colors: OutfitColors, turbanColor: string): Promise<string> => {
    const backgrounds = [
        "against a clean, minimalist soft gray studio background",
        "in a serene park with blurred foliage in the background",
        "in a modern art gallery with abstract paintings on the wall",
        "in a cozy cafe with warm, soft lighting",
        "on a vibrant city street at dusk, with bokeh lights",
        "against a textured concrete wall for an urban feel",
        "in a bright, airy loft with large windows",
        "in front of a bookshelf in a quiet library",
    ];
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    const shirtTypeDescription = colors.topType === 'shirt' ? 'a formal shirt with a collar' : 'a casual t-shirt';

    const shirtDescription = colors.highlightsColor
        ? `a plain, solid-colored ${shirtTypeDescription} with the hex color ${colors.shirtColor}, featuring a single, small, and discreet embroidered emblem on the left chest in the hex color ${colors.highlightsColor}`
        : `a plain, solid-colored ${shirtTypeDescription} with the hex color ${colors.shirtColor}`;


    const prompt = `
        Generate an aesthetic, modern, full-body portrait of a young Sikh man.
        He is wearing ${shirtDescription}, and plain, solid-colored pants with the hex color ${colors.pantsColor}.
        He is wearing a neat, stylish turban with the hex color ${turbanColor}.
        The setting is ${randomBackground}.
        The overall vibe should be elegant, modern, and visually pleasing. The man should have a gentle, confident expression. High-quality, photorealistic style.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    const firstPart = response.candidates?.[0]?.content?.parts[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        return firstPart.inlineData.data;
    }

    throw new Error("No image was generated by the API.");
};
