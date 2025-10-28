
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
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const getColorsFromImage = async (file: File): Promise<OutfitColors> => {
    const imagePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                parts: [
                    { text: "Analyze the clothing in this image. Identify the primary color of the shirt and the pants. Ignore any logos or graphics. Provide the result as a JSON object with keys 'shirtColor' and 'pantsColor', containing their hex color codes." },
                    imagePart
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    shirtColor: { type: Type.STRING },
                    pantsColor: { type: Type.STRING }
                },
                required: ["shirtColor", "pantsColor"]
            }
        }
    });

    const text = response.text.trim();
    return JSON.parse(text);
};


export const getTurbanSuggestions = async (colors: OutfitColors): Promise<TurbanSuggestion[]> => {
    const highlightsPromptPart = colors.highlightsColor
        ? `The shirt also has accent highlights with the hex color ${colors.highlightsColor}.`
        : '';

    const prompt = `
        An outfit consists of a shirt with the hex color ${colors.shirtColor} and pants with the hex color ${colors.pantsColor}.
        ${highlightsPromptPart}
        Based on this complete outfit, suggest the top 4 best matching turban colors using color theory. The suggestions must harmonize with all colors, including the highlights if present.
        Rank them from 1 to 4 (best to worst).
        For each suggestion, provide a concise, persuasive, and stylish reason (max 12 words) for why it's a great match. The tone should be like a fashion advisor.
        Crucially, if highlights are present, your reason must mention how the suggested turban color interacts with the highlight color.
        Examples of reasons: "Creates a bold, high-contrast statement.", "An elegant monochromatic look.", "Picks up the gold highlights perfectly."
        Return the result as a JSON array of objects, where each object has 'rank', 'colorName', 'hexCode', and 'reason' properties.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
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

    const text = response.text.trim();
    return JSON.parse(text);
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
    
    const shirtDescription = colors.highlightsColor
        ? `a plain, solid-colored t-shirt with the hex color ${colors.shirtColor}, featuring subtle, stylish embroidery or pattern highlights in the hex color ${colors.highlightsColor}`
        : `a plain, solid-colored t-shirt with the hex color ${colors.shirtColor}`;


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
