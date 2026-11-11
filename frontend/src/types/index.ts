export interface Category {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  display_order?: number;
}

export interface ProductVariant {
  id: number | string;
  sku: string;
  title: string;
  color?: string;
  size?: string;
  additional_price: string | number;
  price: number;
  stock: number;
  is_in_stock: boolean;
}

export interface ProductImage {
  id: number | string;
  image: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface Product {
  id: number | string;
  category: Category;
  title: string;
  slug: string;
  short_description?: string;
  description: string;
  base_price: number;
  sale_price?: number | null;
  effective_price: number;
  is_on_sale: boolean;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at?: string;
}

export interface CartItem {
  id: string;
  productId: number | string;
  productTitle: string;
  productSlug: string;
  variantId: number | string;
  variantTitle: string;
  sku: string;
  color?: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: OrderAddress;
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}
