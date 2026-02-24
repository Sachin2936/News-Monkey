export type NewsCategory =
  | 'general'
  | 'world'
  | 'politics'
  | 'sports'
  | 'technology'
  | 'business'
  | 'fintech'
  | 'entertainment'
  | 'science';

export interface RawArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string | Date;
  imageUrl?: string | null;
  category?: string;
}

export interface NormalizedArticle {
  title: string;
  content: string;
  sourceName: string;
  url: string;
  imageUrl: string | null;
  category: NewsCategory;
  publishedAt: Date;
}

export interface NewsSource {
  name: string;
  fetch(category: NewsCategory): Promise<RawArticle[]>;
}
