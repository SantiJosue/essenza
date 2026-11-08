export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  image: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
};