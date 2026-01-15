import { clsx, type ClassValue } from "clsx"
import { twJoin, twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function cnJ(...inputs: ClassValue[]) {
    return twJoin(clsx(inputs))
  }
  