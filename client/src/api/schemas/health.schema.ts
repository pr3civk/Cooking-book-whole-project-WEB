import { z } from "zod";

export const healthResponseDto = z.object({
  status: z.string(),
  timestamp: z.iso.datetime(),
});

export type HealthResponseDto = z.infer<typeof healthResponseDto>;
