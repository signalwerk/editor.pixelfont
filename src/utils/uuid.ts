/**
 * Generate a UUID v4
 * Simple implementation without external dependencies
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create a persistent UUID for this user
 * Stored separately from the font data to persist across clears
 */
export function getUserUUID(): string {
  const STORAGE_KEY = 'signalwerk.pixelfont.userId';
  
  // Try to get existing UUID
  let uuid = localStorage.getItem(STORAGE_KEY);
  
  // If none exists, generate and store new one
  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem(STORAGE_KEY, uuid);
  }
  
  return uuid;
}

