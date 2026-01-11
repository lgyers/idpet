// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
}

// Subscription Types
export type SubscriptionTier = "free" | "premium";

export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  quotaMonth: number;
  quotaResetDate: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Template Types
export type TemplateCategory = "professional" | "culture" | "document";

export interface SceneTemplate {
  id: string;
  category: TemplateCategory;
  name: string;
  description: string;
  thumbnail: string;
  basePrompt: string;
  usageCount: number;
  createdAt: Date;
}

// Generation Types
export interface GenerationRecord {
  id: string;
  userId: string;
  uploadedPhotoUrl: string;
  templateId: string;
  resultImageUrl: string;
  generatedPrompt: string;
  generatedAt: Date;
  quotaUsed: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerateResponse {
  id: string;
  resultImageUrl: string;
  generatedAt: Date;
}
