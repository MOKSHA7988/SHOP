export type ProductCategory = 
  | 'Electronics'
  | 'Fashion – Men'
  | 'Fashion – Women'
  | 'Fashion – Kids'
  | 'Home & Kitchen'
  | 'Beauty & Personal Care'
  | 'Grocery & Essentials'
  | 'Sports & Fitness'
  | 'Books & Stationery'
  | 'Toys & Baby Products'
  | 'Automotive'
  | 'Health & Wellness'
  | 'Footwear'
  | 'Jewellery & Accessories'
  | 'Pet Supplies'
  | string;

export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  _id?: string; // MongoDB convention
  name: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  subcategory?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  ratingCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  isTrending?: boolean;
  isFeatured?: boolean;
  isDeal?: boolean;
  isNewArrival?: boolean;
  badge?: string;
  iconName?: string;
  bgGradient?: string;
  image?: string;
  images?: string[];
  reviews: Review[];
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  _id?: string;
  name: ProductCategory;
  slug: string;
  description: string;
  icon: string;
  itemCount: number;
  gradient?: string;
  image?: string;
  bannerImage?: string;
  subcategories: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentMethodType = 'cod' | 'card' | 'upi';

export interface ShippingAddress {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Pending' | 'Paid' | 'Cash on Delivery';
  orderStatus: OrderStatus;
  trackingNumber: string;
  carrier: string;
  createdAt: string;
  estimatedDelivery: string;
  timeline: OrderTimelineStep[];
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatarColor?: string;
  savedAddresses: ShippingAddress[];
  joinedAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  reason: 'Initial Seed' | 'Restock' | 'Customer Order' | 'Admin Adjustment' | 'Return';
  timestamp: string;
  performedBy: string;
}

export interface MongoQueryPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  collection: string;
  queryCode: string;
  equivalentSql: string;
  explanation: string;
}
