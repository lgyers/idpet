export interface GenerationOptions {
  imageUrl: string;
  template?: string;
  userPreferences?: Record<string, unknown>;
}

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
}

export async function generatePetPhoto(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { template, userPreferences } = options;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const basePrompt = template || 'high quality pet portrait, detailed, studio lighting';
    const promptParts = [basePrompt];
    const style = typeof userPreferences?.style === "string" ? userPreferences.style : undefined;
    const quality = typeof userPreferences?.quality === "string" ? userPreferences.quality : undefined;
    if (style) promptParts.push(`${style} style`);
    if (quality) promptParts.push(`${quality} quality`);
    const finalPrompt = promptParts.join(', ');
    const placeholderImages = [
      '/assets/pet-astronaut.jpg',
      '/assets/pet-business.jpg',
      '/assets/pet-chef.jpg',
      '/assets/pet-traditional.jpg',
    ];
    const imageUrlResult = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    return {
      success: true,
      imageUrl: imageUrlResult,
      prompt: finalPrompt,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to generate photo',
    };
  }
}
