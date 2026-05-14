export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  name: string;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  mime: string;
  name: string;
}

export interface Sermon {
  id: number;
  documentId: string;
  title: string;
  date: string | null;
  summary: string;
  image: StrapiMedia | null;
  youtube_url: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface AboutPage {
  pastor_name: string;
  pastor_title: string;
  quote: string | null;
  photo: StrapiMedia | null;
  bio: string;
  roles: string | null;
  section_pharaoh: string | null;
  section_ebenezer: string | null;
  section_loins: string | null;
  credentials: string | null;
  publishedAt: string;
}

export interface Homepage {
  hero_title: string;
  hero_subtitle: string | null;
  hero_cta_text: string | null;
  hero_cta_url: string | null;
  hero_image: StrapiMedia | null;
  publishedAt: string;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  date: string | null;
  body: string;
  image: StrapiMedia | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
