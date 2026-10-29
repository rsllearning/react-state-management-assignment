export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutResult {
  id: string | number;
  items: CartItem[];
  total: number;
  createdAt?: string;
}
