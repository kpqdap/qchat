"use server"
import "server-only"
import {
  AudioConfig,
  SpeechRecognitionResult,
  CancellationDetails,
  CancellationReason,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
  AudioInputStream,
} from "microsoft-cognitiveservices-speech-sdk"
import { arrayBufferToBase64 } from "./chat-document-helper"
import { GetSpeechToken } from "../chat-ui/chat-speech/speech-service"
import { AudioOutputFormatImpl } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/sdk/Audio/AudioOutputFormat"
import { FileAudioSource } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/FileAudioSource"

export const speechToTextRecognizeOnce = async (formData: FormData): Promise<string[]> => {
  const speechToken = await GetSpeechToken()
  const apimUrl = new URL(speechToken.sttUrl)

  const speechConfig = SpeechConfig.fromEndpoint(apimUrl)
  speechConfig.speechRecognitionLanguage = "en-GB"
  speechConfig.authorizationToken = speechToken.token

  const file: File | null = formData.get("audio") as unknown as File

  const audioConfig = await audioConfigFromFile(file)
  if (speechToken.error) throw speechToken.errorMessage

  const recognizer = new SpeechRecognizer(speechConfig, audioConfig)

  const text = await startRecognition(recognizer)
  return text
}

async function _recognizeOnceFromFile(recognizer: SpeechRecognizer): Promise<string> {
  try {
    let recognisedText = ""

    const result = await new Promise<SpeechRecognitionResult>((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (res: SpeechRecognitionResult) => resolve(res),
        (err: unknown) => reject(err)
      )
    })

    if (result) {
      switch (result.reason) {
        case ResultReason.RecognizedSpeech:
          recognisedText = result.text
          break
        case ResultReason.NoMatch:
          break
        case ResultReason.Canceled:
          handleCanceledReason(result)
          break
      }
    }
    recognizer.close()

    return recognisedText
  } catch (e) {
    console.log(e)
    return ""
  }
}

const handleCanceledReason = (result: SpeechRecognitionResult): void => {
  const cancellation = CancellationDetails.fromResult(result)
  console.log(`CANCELED: Reason=${cancellation.reason}`)

  if (cancellation.reason === CancellationReason.Error) {
    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`)
    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`)
    console.log("CANCELED: Did you set the speech resource key and region values?")
  }
}

/**
 * The event recognised signals that a final recognition result is received.
 */
async function startRecognition(recognizer: SpeechRecognizer): Promise<string[]> {
  try {
    const texts: string[] = []
    await new Promise<string[]>((resolve, _reject) => {
      recognizer.recognized = (_s, e) => {
        if (e.result.reason == 3) {
          // console.log(e.result.text);
          texts.push(e.result.text)
        }
      }

      recognizer.canceled = (_s, _e) => {
        resolve(texts)
      }

      recognizer.startContinuousRecognitionAsync()
    })
    return texts
  } catch (e) {
    console.log(e)
    return []
  }
}

/**
 * Initialise audio configurations from file
 */
const audioConfigFromFile = async (file: File): Promise<AudioConfig> => {
  try {
    // Create Buffer
    const base64String = await arrayBufferToBase64(await file.arrayBuffer())
    const buffer = Buffer.from(base64String, "base64")

    // Audio Configurations
    const audioConfig = AudioConfig.fromWavFileInput(buffer, file.name)

    //File Audio Source - Throw error if wav is corrupted or not readable
    const audioSource = new FileAudioSource(buffer, file.name)
    ;(await audioSource.format).formatTag

    return audioConfig
  } catch (e) {
    throw new Error("Unsupported audio file. " + e)
  }
}

/**
 * Initialise audio configurations from Stream
 */
const _audioConfigFromStream = async (file: File): Promise<AudioConfig> => {
  try {
    // Get Default Format
    const audioFormat = AudioOutputFormatImpl.getDefaultInputFormat()

    // Create Stream
    const arrayBuffer = await file.arrayBuffer()
    const pushStream = AudioInputStream.createPushStream(audioFormat)
    pushStream.write(arrayBuffer)

    // Init Audio Config
    const audioConfig = AudioConfig.fromStreamInput(pushStream)

    return audioConfig
  } catch (e) {
    throw new Error("Unsupported audio file. " + e)
  }
}
