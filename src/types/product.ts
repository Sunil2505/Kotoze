export interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  image: string;
  reviews: number;
  discount: string;
  quantity?: number;
}