"use server";

import { userHashedId } from "@/features/auth/helpers";
import { CosmosDBContainer } from "@/features/common/cosmos";
import { uniqueId } from "@/features/common/util";
import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { SqlQuerySpec } from "@azure/cosmos";
import { AzureCogDocumentIndex, ensureIndexIsCreated, indexDocuments } from "./azure-cog-search/azure-cog-vector-store";
import { CHAT_DOCUMENT_ATTRIBUTE, ChatDocumentModel, ServerActionResponse } from "./models";
import { chunkDocumentWithOverlap } from "./text-chunk";
import { isNotNullOrEmpty } from "./utils";

const MAX_DOCUMENT_SIZE = 20000000;

export const UploadDocument = async (formData: FormData): Promise<ServerActionResponse<string[]>> => {
  console.log("UploadDocument: Starting file upload process");
  try {
    await ensureSearchIsConfigured();

    const { docs } = await LoadFile(formData);
    const splitDocuments = chunkDocumentWithOverlap(docs.join("\n"));

    console.log("UploadDocument: File upload and processing completed successfully");
    return {
      success: true,
      error: "",
      response: splitDocuments,
    };
  } catch (e) {
    console.error(`UploadDocument: Error - ${e.message}`);
    return {
      success: false,
      error: (e as Error).message,
      response: [],
    };
  }
};

const LoadFile = async (formData: FormData) => {
  console.log("LoadFile: Loading file");
  try {
    const file: File | null = formData.get("file") as unknown as File;
    if (file) {
      console.log(`LoadFile: File details: Name - ${file.name}, Size - ${file.size}`);

      if (file.size < MAX_DOCUMENT_SIZE) {
        const client = initDocumentIntelligence();

        const blob = new Blob([file], { type: file.type });

        const poller = await client.beginAnalyzeDocument("prebuilt-read", await blob.arrayBuffer());
        const { paragraphs } = await poller.pollUntilDone();

        const docs: Array<string> = [];

        if (paragraphs) {
          for (const paragraph of paragraphs) {
            docs.push(paragraph.content);
          }
        }

        console.log("LoadFile: Document analysis completed");
        return { docs };
      }
    }
  } catch (e) {
    const error = e as any;
    console.error(`LoadFile: Error - ${error.message}`);
    throw new Error(error.message);
  }

  throw new Error("Invalid file format or size. Only PDF files are supported.");
};

export const IndexDocuments = async (fileName: string, docs: string[], chatThreadId: string): Promise<ServerActionResponse<AzureCogDocumentIndex[]>> => {
  console.log("IndexDocuments: Starting document indexing");
  try {
    const documentsToIndex: AzureCogDocumentIndex[] = [];

    for (let index = 0; index < docs.length; index++) {
      console.log(`IndexDocuments: Indexing document ${index + 1} of ${docs.length}`);
      const doc = docs[index];
      const docToAdd: AzureCogDocumentIndex = {
        id: uniqueId(),
        chatThreadId,
        user: await userHashedId(),
        pageContent: doc,
        metadata: fileName,
        embedding: [],
      };

      documentsToIndex.push(docToAdd);
    }

    await indexDocuments(documentsToIndex);

    await UpsertChatDocument(fileName, chatThreadId);
    console.log("IndexDocuments: Document indexing completed successfully");
    return {
      success: true,
      error: "",
      response: documentsToIndex,
    };
  } catch (e) {
    console.error(`IndexDocuments: Error - ${e.message}`);
    return {
      success: false,
      error: (e as Error).message,
      response: [],
    };
  }
};

export const initDocumentIntelligence = () => {
  const client = new DocumentAnalysisClient(
    process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY)
  );

  return client;
};

export const FindAllChatDocuments = async (chatThreadID: string) => {
  const container = await CosmosDBContainer.getInstance().getContainer();

  const querySpec: SqlQuerySpec = {
    query:
      "SELECT * FROM root r WHERE r.type=@type AND r.chatThreadId = @threadId AND r.isDeleted=@isDeleted",
    parameters: [
      {
        name: "@type",
        value: CHAT_DOCUMENT_ATTRIBUTE,
      },
      {
        name: "@threadId",
        value: chatThreadID,
      },
      {
        name: "@isDeleted",
        value: false,
      },
    ],
  };

  const { resources } = await container.items
    .query<ChatDocumentModel>(querySpec)
    .fetchAll();

  return resources;
};

export const UpsertChatDocument = async (
  fileName: string,
  chatThreadID: string
) => {
  const modelToSave: ChatDocumentModel = {
    chatThreadId: chatThreadID,
    id: uniqueId(),
    userId: await userHashedId(),
    createdAt: new Date(),
    type: CHAT_DOCUMENT_ATTRIBUTE,
    isDeleted: false,
    name: fileName,
  };

  const container = await CosmosDBContainer.getInstance().getContainer();
  await container.items.upsert(modelToSave);
};

export const ensureSearchIsConfigured = async () => {
  var isSearchConfigured =
    isNotNullOrEmpty(process.env.AZURE_SEARCH_NAME) &&
    isNotNullOrEmpty(process.env.AZURE_SEARCH_API_KEY) &&
    isNotNullOrEmpty(process.env.AZURE_SEARCH_INDEX_NAME) &&
    isNotNullOrEmpty(process.env.AZURE_SEARCH_API_VERSION);

  if (!isSearchConfigured) {
    throw new Error("Azure search environment variables are not configured.");
  }

  var isDocumentIntelligenceConfigured =
    isNotNullOrEmpty(process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT) &&
    isNotNullOrEmpty(process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY);

  if (!isDocumentIntelligenceConfigured) {
    throw new Error(
      "Azure document intelligence environment variables are not configured."
    );
  }

  var isEmbeddingsConfigured = isNotNullOrEmpty(
    process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  );

  if (!isEmbeddingsConfigured) {
    throw new Error("Azure openai embedding variables are not configured.");
  }

  await ensureIndexIsCreated();
};
