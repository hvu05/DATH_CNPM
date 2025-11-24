const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}

export async function getProducts(): Promise<Product[]> {
    return fetchJson<Product[]>(`${API_BASE}/products`);
}

export async function getProductById(id: string | number): Promise<Product | null> {
    try {
        return await fetchJson<Product>(`${API_BASE}/products/${id}`);
    } catch (e) {
        return null;
    }
}

export type Product = {
  id: number | string;
  name: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  category?: string;
  description?: string;
  specs?: string[];
  reviews?: any[];
};