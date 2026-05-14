import type { Sermon, Post, AboutPage, Homepage, StrapiListResponse, StrapiSingleResponse } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(path, STRAPI_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

async function strapiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function getSermons(query?: string): Promise<StrapiListResponse<Sermon>> {
  const params: Record<string, string> = {
    'populate[image][fields][0]': 'url',
    'populate[image][fields][1]': 'alternativeText',
    'populate[image][fields][2]': 'width',
    'populate[image][fields][3]': 'height',
    'populate[image][fields][4]': 'formats',
    'sort[0]': 'publishedAt:desc',
  };

  if (query) {
    params['filters[$or][0][title][$containsi]'] = query;
    params['filters[$or][1][summary][$containsi]'] = query;
  }

  const url = buildUrl('/api/sermons', params);
  return strapiGet<StrapiListResponse<Sermon>>(url);
}

export async function getSermon(documentId: string): Promise<StrapiSingleResponse<Sermon>> {
  const params: Record<string, string> = {
    'populate[image][fields][0]': 'url',
    'populate[image][fields][1]': 'alternativeText',
    'populate[image][fields][2]': 'width',
    'populate[image][fields][3]': 'height',
    'populate[image][fields][4]': 'formats',
  };

  const url = buildUrl(`/api/sermons/${documentId}`, params);
  return strapiGet<StrapiSingleResponse<Sermon>>(url);
}

export async function getHomepage(): Promise<StrapiSingleResponse<Homepage>> {
  const params: Record<string, string> = {
    'populate[hero_image][fields][0]': 'url',
    'populate[hero_image][fields][1]': 'alternativeText',
    'populate[hero_image][fields][2]': 'width',
    'populate[hero_image][fields][3]': 'height',
  };
  return strapiGet<StrapiSingleResponse<Homepage>>(buildUrl('/api/homepage', params));
}

export async function getAboutPage(): Promise<StrapiSingleResponse<AboutPage>> {
  const params: Record<string, string> = {
    'populate[photo][fields][0]': 'url',
    'populate[photo][fields][1]': 'alternativeText',
    'populate[photo][fields][2]': 'width',
    'populate[photo][fields][3]': 'height',
  };
  return strapiGet<StrapiSingleResponse<AboutPage>>(buildUrl('/api/about-page', params));
}

export async function getPosts(
  query?: string,
  page = 1,
  pageSize = 6,
): Promise<StrapiListResponse<Post>> {
  const params: Record<string, string> = {
    'populate[image][fields][0]': 'url',
    'populate[image][fields][1]': 'alternativeText',
    'populate[image][fields][2]': 'width',
    'populate[image][fields][3]': 'height',
    'sort[0]': 'date:desc',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
  };
  if (query) {
    params['filters[$or][0][title][$containsi]'] = query;
    params['filters[$or][1][body][$containsi]'] = query;
  }
  return strapiGet<StrapiListResponse<Post>>(buildUrl('/api/posts', params));
}

export async function getPost(documentId: string): Promise<StrapiSingleResponse<Post>> {
  const params: Record<string, string> = {
    'populate[image][fields][0]': 'url',
    'populate[image][fields][1]': 'alternativeText',
    'populate[image][fields][2]': 'width',
    'populate[image][fields][3]': 'height',
  };
  return strapiGet<StrapiSingleResponse<Post>>(buildUrl(`/api/posts/${documentId}`, params));
}

export function getStrapiMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${STRAPI_URL}${url}`;
}
