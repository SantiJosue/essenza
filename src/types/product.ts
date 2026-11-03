export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
};