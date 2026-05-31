export interface Product {
  id: string;
  name: string;
  emoji: string;
  expiryDate: string; // ISO string
  category: 'perishable' | 'long-term';
}

export type UserProfile = 'planner' | 'flexible' | 'emergency';

export interface AIResponse {
  message: string;
  recipe?: {
    title: string;
    steps: string[];
    urgencyLevel: 'low' | 'medium' | 'high';
  };
}
