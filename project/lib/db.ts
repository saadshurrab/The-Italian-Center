import { supabase } from './supabase';
import type { 
  Patient, 
  Product, 
  Order, 
  Employee, 
  Prescription, 
  ExpenseRecord 
} from './types';

// ==========================================
// 1. إدارة المرضى (Patients)
// ==========================================

export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('registeredAt', { ascending: false });

  if (error) {
    console.error('خطأ في جلب المرضى:', error.message);
    return [];
  }
  return data || [];
}

export async function addPatient(patient: Omit<Patient, 'id'>): Promise<Patient | null> {
  const newId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
  const { data, error } = await supabase
    .from('patients')
    .insert([{ ...patient, id: newId }])
    .select()
    .single();

  if (error) {
    console.error('خطأ في إضافة المريض:', error.message);
    return null;
  }
  return data;
}

// ==========================================
// 2. إدارة المنتجات والمخزون (Products)
// ==========================================

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('خطأ في جلب المنتجات:', error.message);
    return [];
  }
  return data || [];
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const newId = `PRD-${Math.floor(100 + Math.random() * 900)}`;
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, id: newId }])
    .select()
    .single();

  if (error) {
    console.error('خطأ في إضافة المنتج:', error.message);
    return null;
  }
  return data;
}

// ==========================================
// 3. إدارة الطلبات (Orders)
// ==========================================

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('خطأ في جلب الطلبات:', error.message);
    return [];
  }
  return data || [];
}

// ==========================================
// 4. إدارة الفحوصات والوصفات (Prescriptions)
// ==========================================

export async function getPrescriptions(): Promise<Prescription[]> {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('خطأ في جلب الوصفات:', error.message);
    return [];
  }
  return data || [];
}

// ==========================================
// 5. إدارة الموظفين (Employees)
// ==========================================

export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('خطأ في جلب الموظفين:', error.message);
    return [];
  }
  return data || [];
}

// ==========================================
// 6. إدارة المصروفات (Expenses)
// ==========================================

export async function getExpenses(): Promise<ExpenseRecord[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('خطأ في جلب المصروفات:', error.message);
    return [];
  }
  return data || [];
}
