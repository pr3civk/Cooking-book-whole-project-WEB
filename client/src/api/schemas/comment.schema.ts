import { z } from "zod";

// Update Comment
export const updateCommentRequestDto = z.object({
  content: z.string().min(1),
});

export const updateCommentResponseDto = z.object({
  id: z.number(),
  content: z.string(),
  recipeId: z.number(),
  authorId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Delete Comment
export const deleteCommentParamsDto = z.object({
  id: z.coerce.number(),
});

export const deleteCommentResponseDto = z.object({
  message: z.string(),
});

export type UpdateCommentRequestDto = z.infer<typeof updateCommentRequestDto>;
export type UpdateCommentResponseDto = z.infer<typeof updateCommentResponseDto>;
export type DeleteCommentParamsDto = z.infer<typeof deleteCommentParamsDto>;
export type DeleteCommentResponseDto = z.infer<typeof deleteCommentResponseDto>;
