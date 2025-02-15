export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
    stock: number;
    createdAt: string;
  }
  export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }
  
  export interface CartItem {
    productId: string;
    quantity: number;
  }
  
  export interface Order {
    userId: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: string;
  }
  
  export interface Payment {
    orderId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
  }
  
  export interface Review {
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    createdAt: string;
  }