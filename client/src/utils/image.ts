/**
 * Normalizes image URL to handle both external URLs and relative paths.
 * - Full URLs (http/https) are used directly
 * - Paths containing embedded full URLs are extracted (e.g., /storage/https://...)
 * - Relative paths get the API base URL prepended
 */
export function normalizeImageUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return undefined;

  // Check if there's an embedded full URL anywhere in the path FIRST
  // This handles cases like /storage/https://example.com or storage/http://...
  const httpsIndex = trimmedUrl.indexOf('https://');
  const httpIndex = trimmedUrl.indexOf('http://');

  // If https:// found and it's not at the start, extract it
  if (httpsIndex > 0) {
    return trimmedUrl.substring(httpsIndex);
  }
  // If http:// found and it's not at the start, extract it
  if (httpIndex > 0) {
    return trimmedUrl.substring(httpIndex);
  }

  // If it's already a full URL at the start, use it directly
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Otherwise, treat as relative path and prepend API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  if (trimmedUrl.startsWith('/')) {
    return `${apiBaseUrl}${trimmedUrl}`;
  }

  return `${apiBaseUrl}/${trimmedUrl}`;
}
