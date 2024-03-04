import createClient, { ErrorResponseOutput, TranslatedTextItemOutput } from "@azure-rest/ai-translation-text";

export function getBooleanEnv(variable: string): boolean {
    return process.env[variable]?.toLowerCase() === 'true';
}

export async function translator(input: string): Promise<string> {
    if (!getBooleanEnv('NEXT_PUBLIC_FEATURE_TRANSLATOR') || typeof input !== 'string') {
        return input;
    }

    const normalizedInput = input.toLowerCase();

    try {
        const translatedTexts = await translateFunction([{ text: normalizedInput }], "en-GB", "en-US");
        if (translatedTexts.length > 0) {
            return revertCase(input, translatedTexts[0]);
        }
    } catch (error) {
    }

    return input;
}

async function translateFunction(inputText: { text: string }[], translatedTo: string, translatedFrom: string): Promise<string[]> {
    const apiKey = process.env.AZURE_TRANSLATOR_KEY;
    const endpoint = process.env.AZURE_TRANSLATOR_URL;
    const region = process.env.AZURE_SPEECH_REGION;

    if (!apiKey || !endpoint || !region) {
        throw new Error('Missing configuration for Azure Translator.');
    }

    const translateCredential = { key: apiKey, region };
    const translationClient = createClient(endpoint, translateCredential);

    const translateResponse = await translationClient.path("/translate").post({
        body: inputText,
        queryParameters: { to: translatedTo, from: translatedFrom },
        headers: { "api-key": apiKey }
    });

    const translations = translateResponse.body as TranslatedTextItemOutput[] | ErrorResponseOutput;

    if (Array.isArray(translations)) {
        return translations.map(translation => translation.translations[0].text);
    } else {
        throw new Error('Translation API returned an error response.');
    }
}

function revertCase(originalText: string, translatedText: string): string {
    return originalText.split('').map((char, index) => 
        char.toUpperCase() === char ? translatedText.charAt(index)?.toUpperCase() : translatedText.charAt(index)
    ).join('');
};