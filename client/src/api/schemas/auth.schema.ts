import { z } from "zod";

// Login
export const loginRequestDto = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const loginResponseDto = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.email(),
    name: z.string().optional(),
  }),
});

// Register
export const registerRequestDto = z.object({
  email: z.email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const registerResponseDto = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.email(),
    name: z.string().optional(),
  }),
});

// Forgot Password
export const forgotPasswordRequestDto = z.object({
  email: z.email(),
});

export const forgotPasswordResponseDto = z.object({
  status: z.string(),
});

// Reset Password
export const resetPasswordRequestDto = z.object({
  token: z.string(),
  email: z.email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
});

export const resetPasswordResponseDto = z.object({
  status: z.string(),
});

// Change Password
export const changePasswordRequestDto = z.object({
  current_password: z.string().min(1),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
});

export const changePasswordResponseDto = z.object({
  message: z.string(),
});

// User
export const userResponseSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().optional().nullable(),
  is_admin: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type LoginRequestDto = z.infer<typeof loginRequestDto>;
export type LoginResponseDto = z.infer<typeof loginResponseDto>;
export type RegisterRequestDto = z.infer<typeof registerRequestDto>;
export type RegisterResponseDto = z.infer<typeof registerResponseDto>;
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordRequestDto>;
export type ForgotPasswordResponseDto = z.infer<typeof forgotPasswordResponseDto>;
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordRequestDto>;
export type ResetPasswordResponseDto = z.infer<typeof resetPasswordResponseDto>;
export type ChangePasswordRequestDto = z.infer<typeof changePasswordRequestDto>;
export type ChangePasswordResponseDto = z.infer<typeof changePasswordResponseDto>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;
