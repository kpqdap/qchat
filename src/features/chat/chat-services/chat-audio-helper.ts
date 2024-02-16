"use server";
import "server-only";
import { AudioConfig, SpeechRecognitionResult, CancellationDetails, CancellationReason, ResultReason, SpeechConfig, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import { arrayBufferToBase64 } from "./chat-document-helper";
import { GetSpeechToken } from "../chat-ui/chat-speech/speech-service";

export async function speechToTextRecognizeOnce(formData: FormData) {
    try {
        const speechToken = await GetSpeechToken();
        const apimUrl = new URL(speechToken.sttUrl);

        // Speech Configurations
        const speechConfig = SpeechConfig.fromEndpoint(
            apimUrl
        );
        speechConfig.speechRecognitionLanguage = "en-GB";
        speechConfig.authorizationToken = speechToken.token;

        /**Convert File to Buffer**/
        const file: File | null = formData.get('audio') as unknown as File;
        const base64String = await arrayBufferToBase64(await file.arrayBuffer());
        const buffer = Buffer.from(base64String, 'base64');

        // Audio Configurations
        const audioConfig = AudioConfig.fromWavFileInput(buffer);

        // Speech recognizer config
        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

        // Final result
        const text = await startRecognition(recognizer);

        return text;
    } catch (e) {
        console.log(e);
        return [];
    }
}

/**
 * Starts speech recognition, and stops after the first utterance is recognized. The task returns the recognition text as result. Note: RecognizeOnceAsync() returns when the first utterance has been recognized, so it is suitable only for single shot recognition like command or query.
 */
async function recognizeOnceFromFile(recognizer: SpeechRecognizer): Promise<string> {
    try {
        let recognisedText = "";

        // Call recognizeOnceAsync and wait for its completion
        const result = await new Promise<SpeechRecognitionResult>((resolve, reject) => {
            recognizer.recognizeOnceAsync(
                (res: SpeechRecognitionResult) => resolve(res),
                (err: any) => reject(err)
            );
        });

        if (result) {
            switch (result.reason) {
                case ResultReason.RecognizedSpeech:
                    // console.log(`RECOGNIZED: Text=${result.text}`);
                    recognisedText = result.text;
                    break;
                case ResultReason.NoMatch:
                    console.log("NOMATCH: Speech could not be recognized.");
                    break;
                case ResultReason.Canceled:
                    const cancellation = CancellationDetails.fromResult(result);
                    console.log(`CANCELED: Reason=${cancellation.reason}`);

                    if (cancellation.reason === CancellationReason.Error) {
                        console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                        console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                        console.log("CANCELED: Did you set the speech resource key and region values?");
                    }
                    break;
            }
        } else {
            console.log("Recognition result is null or undefined.");
        }

        // Close the recognizer
        recognizer.close();

        return recognisedText;
    } catch (e) {
        console.log(e);
        return "";
    }
}

/**
 * The event recognised signals that a final recognition result is received.
 */
async function startRecognition(recognizer: SpeechRecognizer): Promise<string[]> {
    try {
        let texts: string[] = [];
        const result = await new Promise<string[]>((resolve, reject) => {
            recognizer.recognized = (s, e) => {
                if (e.result.reason == 3) {
                    // console.log(e.result.text);
                    texts.push(e.result.text)
                }
            };

            recognizer.canceled = (s, e) => {
                resolve(texts);
            };

            recognizer.startContinuousRecognitionAsync();
        });
        return texts;
    } catch (e) {
        console.log(e);
        return [];
    }

}