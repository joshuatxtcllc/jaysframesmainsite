
export interface ContentBlock {
  id: string;
  key: string;
  type: 'text' | 'image' | 'rich_text' | 'button' | 'link';
  title: string;
  value: string;
  description?: string;
  section: string;
  page: string;
  updatedAt: string;
  createdAt: string;
}

export interface ContentImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  alt: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ContentSection {
  page: string;
  section: string;
  title: string;
  description: string;
}

export type InsertContentBlock = Omit<ContentBlock, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContentBlock = Partial<Pick<ContentBlock, 'value' | 'title' | 'description'>>;
