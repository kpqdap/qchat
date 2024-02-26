import createClient, { ErrorResponseOutput, TranslatedTextItemOutput } from "@azure-rest/ai-translation-text";

export async function translator(input: string | string[]) {

  if (typeof input === 'string') {
    const normalizedInput = input.toLowerCase();
    const translatedText = await translateFunction([{ text: normalizedInput }], "en-GB", "en-US"); 
    const revertedText = revertCase(input, translatedText[0]);
    return revertedText;

} else if (Array.isArray(input)) {
    const normalizedInputArray = input.map(text => text.toLowerCase());
    const translatedTextArray = await Promise.all(normalizedInputArray.map(text => translateFunction([{ text }], "en-GB", "en-US")));
    const revertedTextArray = translatedTextArray.map((translatedText, index) => revertCase(input[index], translatedText[0]));
    return revertedTextArray;

} else {
    console.error("Invalid input type:", input);
    return input ?? null;
}
}

async function translateFunction(inputText: { text: string }[], translatedTo: string, translatedFrom: string) {
    
    const apiKey = "e5b27bf08d29406eaf51d3341dc5ae18";
    const endpoint = "https://qgaip-dev-translator.cognitiveservices.azure.com";
    const region = "australiaeast";
  
    const translateCredential = {
      key: apiKey,
      region,
    };
    const translationClient = createClient(endpoint,translateCredential);

    const translateResponse = await translationClient.path("/translate").post({
      body: inputText,
      queryParameters: {
        to: translatedTo,
        from: translatedFrom,
      },
    });
  
 
    const translations = translateResponse.body as TranslatedTextItemOutput[] | ErrorResponseOutput;
  
    if (Array.isArray(translations)) {
        const translatedStrings = translations.map(translation => translation.translations[0].text);
        console.log(`The translation result is: '${translatedStrings}'.`);
        return translatedStrings;
    } else {
      console.error("Translation error:", translations);
      return [];
    }
}

function revertCase(originalText: string, translatedText: string): string {
  return originalText
    .split('')
    .map((originalChar, index) =>
      originalChar === originalChar.toUpperCase()
        ? translatedText[index].toUpperCase()
        : translatedText[index]
    )
    .join('');
}
