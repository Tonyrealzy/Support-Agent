import db from "../config/database/database";
import { DocumentReq } from "../models/requests";

export const EmbeddingService = {
  storeEmbeddings: async (document: DocumentReq) => {
    // Doing this: ${embedding}::vector to type-cast say, an array of floats
    // (e.g., [0.1, 0.4, -0.8, ...]) to a vector type that pgvector understands
    return await db.$executeRaw`
      INSERT INTO "Document" (id, organisationId, title, content, embedding)
      VALUES (gen_random_uuid(), ${document.organisationId}, ${document.title}, ${document.content}, ${document.embedding}::vector)
      `;
  },

  searchDocuments: async (
    organisationId: string,
    queryEmbedding: number[],
    limit = 5
  ) => {
    // ORDER BY embedding <#> '${JSON.stringify(queryEmbedding)}'::vector
    // This is the actual vector similarity search.
    return await db.$queryRaw(`
          SELECT id, content
          FROM "Document"
          WHERE "organisationId" = '${organisationId}'
          ORDER BY embedding <#> '${JSON.stringify(queryEmbedding)}'::vector
          LIMIT ${limit}
          `);
  },

  deleteDocumentById: async (id: string) => {
    return await db.$executeRaw`
    DELETE FROM "Document"
    WHERE id = ${id}
    `;
  },
};
