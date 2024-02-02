import { OpenAIEmbeddingInstance } from "@/features/common/openai";

export interface AzureCogDocumentIndex {
  id: string;
  pageContent: string;
  embedding?: number[];
  user: string;
  chatThreadId: string;
  metadata: string;
}

interface DocumentSearchResponseModel<TModel> {
  value: TModel[];
}

type DocumentSearchModel = {
  "@search.score": number;
};

type DocumentDeleteModel = {
  id: string;
  "@search.action": "delete";
};

export interface AzureCogDocument {}

type AzureCogVectorField = {
  vector: number[];
  fields: string;
  k: number;
  kind: string;
};

type AzureCogFilter = {
  search?: string;
  facets?: string[];
  filter?: string;
  top?: number;
};

type AzureCogRequestObject = {
  search: string;
  facets: string[];
  filter: string;
  top: number;
  vectorQueries: AzureCogVectorField[];
};

export const simpleSearch = async (
  filter?: AzureCogFilter
): Promise<Array<AzureCogDocumentIndex & DocumentSearchModel>> => {
  const url = `${baseIndexUrl()}/docs/search?api-version=${process.env.AZURE_SEARCH_API_VERSION}`;

  const searchBody: AzureCogRequestObject = {
    search: filter?.search || "*",
    facets: filter?.facets || [],
    filter: filter?.filter || "",
    top: filter?.top || 10,
    vectorQueries: []
  };

  const resultDocuments = (await fetcher(url, {
    method: "POST",
    body: JSON.stringify(searchBody),
  })) as DocumentSearchResponseModel<AzureCogDocumentIndex & DocumentSearchModel>;

  return resultDocuments.value;
};


export const similaritySearchVectorWithScore = async (
  query: string,
  k: number,
  filter?: AzureCogFilter
): Promise<Array<AzureCogDocumentIndex & DocumentSearchModel>> => {
  const openai = OpenAIEmbeddingInstance();

  const embeddings = await openai.embeddings.create({
    input: query,
    model: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  });

  const url = `${baseIndexUrl()}/docs/search?api-version=${process.env.AZURE_SEARCH_API_VERSION}`;

  type AzureCogRequestObject = {
    search: string;
    facets: string[];
    filter: string;
    top: number;
    vectorQueries?: AzureCogVectorField[];
  };

  const searchBody: AzureCogRequestObject = {
    search: filter?.search || "*",
    facets: filter?.facets || [],
    filter: filter?.filter || "",
    top: filter?.top || k,
    vectorQueries: [
      { vector: embeddings.data[0].embedding, fields: "embedding", k: k, kind: "vector" },
    ],
  };

  const resultDocuments = (await fetcher(url, {
    method: "POST",
    body: JSON.stringify(searchBody),
  })) as DocumentSearchResponseModel<AzureCogDocumentIndex & DocumentSearchModel>;

  return resultDocuments.value;
};

export const indexDocuments = async (
  documents: Array<AzureCogDocumentIndex>
): Promise<void> => {
  const url = `${baseIndexUrl()}/docs/index?api-version=${process.env.AZURE_SEARCH_API_VERSION}`;

  await embedDocuments(documents);
  const documentIndexRequest: DocumentSearchResponseModel<AzureCogDocumentIndex> = {
    value: documents,
  };

  await fetcher(url, {
    method: "POST",
    body: JSON.stringify(documentIndexRequest),
  });
};

export const deleteDocuments = async (chatThreadId: string): Promise<void> => {
// find all documents for chat thread
  const documentsInChat = await simpleSearch({
    filter: `chatThreadId eq '${chatThreadId}'`,
  });

  const documentsToDelete: DocumentDeleteModel[] = [];
  documentsInChat.forEach(async (document: { id: string }) => {
    const doc: DocumentDeleteModel = {
    "@search.action": "delete",
    id: document.id,
  };
    documentsToDelete.push(doc);
  });

  // delete the documents
  await fetcher(
    `${baseIndexUrl()}/docs/index?api-version=${process.env.AZURE_SEARCH_API_VERSION}`,
    {
    method: "POST",
    body: JSON.stringify({ value: documentsToDelete }),
  }
  );
};

export const embedDocuments = async (
  documents: Array<AzureCogDocumentIndex>
) => {
  const openai = OpenAIEmbeddingInstance();

try {
  const contentsToEmbed = documents.map((d) => d.pageContent);
  const embeddings = await openai.embeddings.create({
    input: contentsToEmbed,
    model: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  });

  embeddings.data.forEach((embedding, index) => {
    documents[index].embedding = embedding.embedding;
  });
} catch (e) {
    console.log(e);
    const error = e as any;
    throw new Error(`${e} with code ${error.status}`);
  }
};

const baseUrl = (): string => {
  return `${process.env.QGAIP_APIM_BASE}/indexes`;
};

const baseIndexUrl = (): string => {
  return `${process.env.QGAIP_APIM_BASE}/indexes/${process.env.AZURE_SEARCH_INDEX_NAME}`;
};

const fetcher = async (url: string, init?: RequestInit) => {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.AZURE_SEARCH_API_KEY,
    },
  });

  if (!response.ok) {
if (response.status === 400) {
      const err = await response.json();
      throw new Error(err.error.message);
    } else {
    throw new Error(`Azure Cog Search Error: ${response.statusText}`);
}
  }

  return await response.json();
};
