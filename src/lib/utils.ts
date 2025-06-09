import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Word lists for generating memorable event slugs
const adjectives = [
  'amazing', 'awesome', 'brilliant', 'creative', 'dynamic', 'epic', 'fantastic', 
  'great', 'incredible', 'innovative', 'inspiring', 'legendary', 'magnificent', 
  'outstanding', 'perfect', 'remarkable', 'spectacular', 'stellar', 'superb', 
  'ultimate', 'wonderful', 'bright', 'bold', 'clever', 'fast', 'fresh', 
  'global', 'modern', 'next', 'open', 'quick', 'smart', 'strong', 'swift', 
  'tech', 'future', 'digital', 'virtual', 'live', 'local', 'mega', 'micro',
  'blue', 'green', 'red', 'golden', 'silver', 'crystal', 'neon', 'cosmic'
];

const nouns = [
  'summit', 'conference', 'meetup', 'workshop', 'forum', 'expo', 'fest', 
  'gathering', 'symposium', 'congress', 'convention', 'session', 'bootcamp', 
  'hackathon', 'sprint', 'jam', 'lab', 'hub', 'space', 'zone', 'arena',
  'valley', 'mountain', 'river', 'ocean', 'forest', 'garden', 'bridge', 
  'tower', 'castle', 'palace', 'lighthouse', 'compass', 'rocket', 'star',
  'wave', 'storm', 'thunder', 'lightning', 'rainbow', 'sunrise', 'sunset',
  'code', 'data', 'cloud', 'edge', 'core', 'mesh', 'grid', 'flow'
];

/**
 * Generate a memorable event slug using two words with a hyphen
 * e.g., "amazing-summit", "tech-valley", "brilliant-workshop"
 */
export function generateEventSlug(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}-${noun}`;
}

/**
 * Generate a unique event slug by checking against existing events
 * Retries with different combinations if collision occurs
 */
export async function generateUniqueEventSlug(
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts: number = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const slug = generateEventSlug();
    const exists = await checkExists(slug);
    
    if (!exists) {
      return slug;
    }
  }
  
  // Fallback: add random number to ensure uniqueness
  const baseSlug = generateEventSlug();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${baseSlug}-${randomNum}`;
}

/**
 * Validate that a slug only contains lowercase letters, numbers, and hyphens
 */
export function isValidEventSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 50;
}

/**
 * Sanitize user input to create a valid event slug
 */
export function sanitizeEventSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .slice(0, 50); // Limit length
}
