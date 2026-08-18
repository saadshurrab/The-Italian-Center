import {
  LayoutDashboard,
  ScanBarcode,
  Eye,
  Package,
  Calculator,
  Users,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';

export type ModuleKey =
  | 'dashboard'
  | 'pos'
  | 'examinations'
  | 'orders'
  | 'inventory'
  | 'accounting'
  | 'hr'
  | 'crm';

export interface NavItem {
  key: ModuleKey;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  {
    key: 'dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    description: 'المؤشرات الرئيسية والإحصائيات',
  },
  {
    key: 'pos',
    label: 'الكاشير والباركود',
    icon: ScanBarcode,
    description: 'نقطة البيع بالباركود وسلة المشتريات',
  },
  {
    key: 'examinations',
    label: 'الفحوصات والأرشيف',
    icon: Eye,
    description: 'فحوصات النظر وأرشفة الوصفات',
  },
  {
    key: 'orders',
    label: 'طلبيات العملاء',
    icon: Package,
    description: 'متابعة مسار الطلبات والتسليم',
  },
  {
    key: 'inventory',
    label: 'المخزون بالباركود',
    icon: Package,
    description: 'إطارات، عدسات، ومستهلكات',
  },
  {
    key: 'accounting',
    label: 'المحاسبة والصندوق',
    icon: Calculator,
    description: 'تقفيل الصندوق، الذمم، والتقارير',
  },
  {
    key: 'hr',
    label: 'الموظفين والعمولات',
    icon: Users,
    description: 'الموظفين، الرواتب، والعمولات',
  },
  {
    key: 'crm',
    label: 'إدارة العملاء',
    icon: HeartPulse,
    description: 'سجلات المرضى والعلاقات',
  },
];
