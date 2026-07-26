export type Role = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
}

export interface PlatformSettings {
  id: number;
  target_amount: number;
  raised_amount: number;
  hero_title: string;
  hero_subtitle: string | null;
  child_name: string | null;
  about_text: string | null;
  currency: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_name: string | null;
  email: string | null;
  amount: number;
  currency: string;
  message: string | null;
  is_anonymous: boolean;
  payment_gateway: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id: string | null;
  user_id: string | null;
  created_at: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  is_verified: boolean;
  uploaded_by: string | null;
  created_at: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_at: string;
  author_id: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}
