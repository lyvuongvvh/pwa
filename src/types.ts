export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentType = 'pdf' | 'html' | 'text';

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  textContent: string;
  htmlContent?: string;
  fileDataUrl?: string;
  summary?: string;
  tags: string[];
  category: string;
  authorId: string;
  authorEmail: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  searchTokens?: string[];
  pageCount?: number;
  wordCount?: number;
}

export interface ArticleItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  tags: string[];
  authorId: string;
  authorEmail: string;
  authorName: string;
  published: boolean;
  createdAt: number;
  updatedAt: number;
  searchTokens?: string[];
}

export interface SearchMatch {
  field: string;
  snippet: string;
  matchIndex: number;
}

export interface SearchResultItem {
  type: 'document' | 'article';
  item: DocumentItem | ArticleItem;
  matches: SearchMatch[];
  relevanceScore: number;
}
