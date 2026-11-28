export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  category: string;
  image: string;
}
