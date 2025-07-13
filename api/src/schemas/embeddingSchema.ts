import { z } from "zod";

export const EmbeddingSchema = {
  deleteDocument: z.object({
    id: z
      .string({ required_error: "Organisation ID is required" })
      .uuid("Invalid UUID format"),
  }),

  searchDocuments: z.object({
    organisationId: z
      .string({ required_error: "Organisation ID is required" })
      .uuid("Invalid organisation ID"),
    queryEmbedding: z
      .array(z.number())
      .nonempty("Query embedding must not be empty"),
    limit: z.number().min(1).max(100).optional(),
  }),

  storeEmbeddings: z.object({
    organisationId: z
      .string({ required_error: "Organisation ID is required" })
      .uuid("Invalid organisation ID"),
    title: z
      .string({ required_error: "Title is required" })
      .min(8, { message: "Title must be at least 8 characters long" }),
    content: z
      .string({ required_error: "Content is required" })
      .min(50, { message: "Content must be at least 50 characters long" }),
    embedding: z.array(z.number()).nonempty("Embedding must not be empty"),
  }),
};

export type DeleteDocumentType = z.infer<typeof EmbeddingSchema.deleteDocument>;
export type SearchDocumentsType = z.infer<
  typeof EmbeddingSchema.searchDocuments
>;
export type StoreEmbeddingsType = z.infer<
  typeof EmbeddingSchema.storeEmbeddings
>;
