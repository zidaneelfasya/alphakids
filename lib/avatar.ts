/**
 * DiceBear Moods Avatar Helper for Alpha Kids
 * Generates an expressive, playful, and kid-friendly avatar from DiceBear Moods
 * https://www.dicebear.com/styles/moods/
 */
export function getDicebearMoodsAvatar(seed?: string | null): string {
  const safeSeed = (seed && seed.trim()) || 'AlphaKids';
  return `https://api.dicebear.com/9.x/moods/svg?seed=${encodeURIComponent(safeSeed)}`;
}
