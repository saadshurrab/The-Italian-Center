export type OrderStatus = 'pending' | 'in_lab' | 'ready' | 'fulfilled';

export type ProductCategory = 'frames' | 'lenses' | 'contacts' | 'solutions';

export type PrescriptionType = 'medical' | 'sunwear' | 'contacts';

export type PaymentMethod = 'cash' | 'card' | 'installments';

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: PrescriptionType;
  rightEye: EyeRx;
  leftEye: EyeRx;
  notes?: string;
  doctor: string;
}

export interface EyeRx {
  sph: number;
  cyl: number;
  axis: number;
  add: number;
  pd: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  registeredAt: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  notes?: string;
}

export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  prescriptionId?: string;
  items: OrderItem[];
  total: number;
  deposit: number;
  remaining: number;
  status: OrderStatus;
  paymentMethod: string;
  assignedStaff: string;
  createdAt: string;
  dueDate: string;
}

export interface OrderItem {
  name: string;
  type: string;
  price: number;
  qty: number;
  barcode?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  barcode: string;
  brand: string;
  color?: string;
  stock: number;
  minStock: number;
  cost: number;
  retail: number;
  supplier?: string;
  expiryDate?: string;
  diopter?: number;
  coating?: string;
  material?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  shift: string;
  phone: string;
  baseSalary: number;
  commission: number;
  totalSales: number;
  attendance: number;
  advances: number;
  deductions: number;
  status: 'active' | 'leave' | 'off';
  joinDate: string;
}

export interface CommissionRecord {
  orderId: string;
  patientName: string;
  amount: number;
  date: string;
  staffName: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'new_order' | 'ready_pickup' | 'expiry' | 'reminder';
  message: string;
  time: string;
  read: boolean;
}

export interface CartItem {
  product: Product;
  qty: number;
  discount: number;
}

export interface ExpenseRecord {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
}

export interface CashRegisterEntry {
  id: string;
  type: 'sale' | 'expense' | 'deposit';
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  time: string;
}

export interface DailyReport {
  date: string;
  cashSales: number;
  cardSales: number;
  installments: number;
  totalSales: number;
  expenses: number;
  netRevenue: number;
  outstandingReceivables: number;
}
