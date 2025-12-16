import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

function getModel(modelName = 'gemini-2.5-flash') {
    if (!apiKey) {
        throw new Error('Missing Gemini API key. Set EXPO_PUBLIC_GEMINI_API_KEY.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: modelName });
}

function extractJsonBlock(text) {
    const match = text.match(/```json\n([\s\S]*?)```/);
    if (match) {
        return match[1];
    }
    return text;
}

export async function structureRecipeFromText(unstructuredText) {
    const model = getModel();
    const prompt = `You are a recipe data formatter. Take the user's unformatted recipe text and output a strict JSON object with keys: title (string), description (string), ingredients (array of strings), steps (array of strings), cuisine (one of: continental, north_indian, south_indian, english, american, chinese, japanese, mediterranean, mexican, thai), type (one of: veg, non_veg, vegan), course (one of: starter, appetizer, main_course, beverage, dessert, snack), nutrition (object with optional numeric calories, protein, carbs, fat), image (url string), link (string). No extra commentary.`;
    const result = await model.generateContent([
        { text: prompt },
        { text: `Recipe text: ${unstructuredText}` },
    ]);
    const text = result.response.text();
    const cleaned = extractJsonBlock(text);
    return JSON.parse(cleaned);
}

export async function generateRecipeFromPrompt(prompt) {
    const model = getModel('gemini-2.5-pro');
    const instruction = `Create a delicious recipe based on the user's prompt. Respond ONLY as JSON with keys: title, description, ingredients (array of strings), steps (array of strings), cuisine (one of: continental, north_indian, south_indian, english, american, chinese, japanese, mediterranean, mexican, thai), type (one of: veg, non_veg, vegan), course (one of: starter, appetizer, main_course, beverage, dessert, snack), nutrition (object with optional numeric calories, protein, carbs, fat), image (url string), link (string), tips (array of short strings).`;
    const result = await model.generateContent([
        { text: instruction },
        { text: `User prompt: ${prompt}` },
    ]);
    const text = result.response.text();
    const cleaned = extractJsonBlock(text);
    return JSON.parse(cleaned);
}
