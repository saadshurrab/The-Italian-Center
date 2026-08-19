'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Users,
  Clock,
  Wrench,
  PackageCheck,
  CheckCircle2,
  Plus,
  FileText,
  Boxes,
  ArrowLeft,
  AlertTriangle,
  CalendarClock,
  ScanBarcode,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/format';
import { useData } from '@/hooks/useData';
import { getOrders, getProducts, getEmployees, getPrescriptions } from '@/lib/db';
import type { Order, Product, Employee, Prescription } from '@/lib/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// البيانات المؤقتة الخاصة بالرسوم البيانية محلياً تجنباً لخطأ المستوردات
const revenueData = [
  { day: 'السبت', revenue: 3200 },
  { day: 'الأحد', revenue: 4500 },
  { day: 'الإثنين', revenue: 5100 },
  { day: 'الثلاثاء', revenue: 4800 },
  { day: 'الأربعاء', revenue: 6200 },
  { day: 'الخميس', revenue: 7500 },
  { day: 'الجمعة', revenue: 4100 },
];

const orderPipelineData = [
  { stage: 'قيد الانتظار', count: 5, color: 'warning' },
  { stage: 'في المختبر', count: 8, color: 'primary' },
  { stage: 'جاهز', count: 4, color: 'accent' },
  { stage: 'مكتمل', count: 12, color: 'success' },
];

export function DashboardModule() {
  const { data: orders = [] } = useData<Order>(getOrders);
  const { data: products = [] } = useData<Product>(getProducts);
  const { data: employees = [] } = useData<Employee>(getEmployees);
  const { data: prescriptions = [] } = useData<Prescription>(getPrescriptions);

  const todayRevenue = orders.reduce((sum, o) => sum + (o.deposit || 0), 0);
  const pendingLabOrders = orders.filter((o) => o.status === 'in_lab').length;
  const todayExams = prescriptions.length;
  const activeStaff = employees.filter((e) => e.status === 'active').length;
  const lowStockItems = products.filter((p) => p.stock <= p.minStock);

  const kpis = [
    {
      label: 'إيرادات اليوم',
      value: formatCurrency(todayRevenue),
      change: '+12.5%',
      trend: 'up' as 'up' | 'down' | 'neutral',
      icon: DollarSign,
      color: 'primary',
    },
    {
      label: 'طلبات في المختبر',
      value: formatNumber(pendingLabOrders),
      change: '+2 اليوم',
      trend: 'up' as 'up' | 'down' | 'neutral',
      icon: Wrench,
      color: 'warning',
    },
    {
      label: 'فحوصات اليوم',
      value: formatNumber(todayExams),
      change: '+1 من الأمس',
      trend: 'up' as 'up' | 'down' | 'neutral',
      icon: Eye,
      color: 'accent',
    },
    {
      label: 'موظفون في الخدمة',
      value: formatNumber(activeStaff),
      change: `من ${employees.length}`,
      trend: 'neutral' as 'up' | 'down' | 'neutral',
      icon: Users,
      color: 'success',
    },
  ];

  const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: { label: 'قيد الانتظار', icon: Clock, color: 'warning' },
    in_lab: { label: 'في المختبر', icon: Wrench, color: 'primary' },
    ready: { label: 'جاهز للاستلام', icon: PackageCheck, color: 'accent' },
    fulfilled: { label: 'مكتمل', icon: CheckCircle2, color: 'success' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">لوحة التحكم الرئيسية</h2>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء النظام اليوم</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="relative overflow-hidden border-border/60 shadow-sm transition-all hover:shadow-md">
              <div className={`absolute left-0 top-0 h-full w-1 bg-${kpi.color}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${kpi.color}/10`}>
                    <Icon className={`h-6 w-6 text-${kpi.color}`} />
                  </div>
                  {kpi.trend === 'up' && (
                    <Badge className="bg-success/10 text-success hover:bg-success/10">
                      <TrendingUp className="ml-1 h-3 w-3" />
                      {kpi.change}
                    </Badge>
                  )}
                  {kpi.trend === 'down' && (
                    <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">
                      <TrendingDown className="ml-1 h-3 w-3" />
                      {kpi.change}
                    </Badge>
                  )}
                  {kpi.trend === 'neutral' && (
                    <Badge variant="secondary">{kpi.change}</Badge>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-display text-base font-bold">الإيرادات الأسبوعية</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> +18% هذا الأسبوع
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base font-bold">حالة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderPipelineData.map((stage) => {
                const total = orderPipelineData.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? (stage.count / total) * 100 : 0;
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{stage.stage}</span>
                      <span className="font-bold">{stage.count}</span>
                    </div>
                    <Progress value={pct} className={`mt-1.5 h-2 bg-${stage.color}/10`} />
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={orderPipelineData}>
                  <XAxis dataKey="stage" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis hide />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                    {orderPipelineData.map((entry, idx) => (
                      <Cell key={idx} fill={`hsl(var(--${entry.color}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
              <AlertTriangle className="h-4 w-4 text-warning" />
              تنبيهات المخزون
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/5 p-3">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">المتبقي: {item.stock} | الحد الأدنى: {item.minStock}</p>
                </div>
                <Badge className="bg-warning/15 text-warning hover:bg-warning/15">منخفض</Badge>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد تنبيهات للمخزون حالياً</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-bold">آخر الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.slice(0, 4).map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={order.id} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${cfg.color}/10`}>
                    <StatusIcon className={`h-4 w-4 text-${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{order.patientName}</p>
                    <p className="text-xs text-muted-foreground">{order.id} · {formatCurrency(order.total)}</p>
                  </div>
                  <Badge variant="outline" className={`border-${cfg.color}/30 text-${cfg.color}`}>{cfg.label}</Badge>
                </div>
              );
            })}
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد طلبات حتى الآن</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-bold">الموظفون النشطون</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employees.filter((e) => e.status === 'active').slice(0, 4).map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {emp.name.split(' ')[1]?.[0] || emp.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.role} · {emp.shift}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>
            ))}
            {employees.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">لا يوجد موظفون في الخدمة حالياً</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-base font-bold">شريط الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> فحص جديد
            </Button>
            <Button variant="secondary" className="gap-2">
              <ScanBarcode className="h-4 w-4" /> كاشير الباركود
            </Button>
            <Button variant="secondary" className="gap-2">
              <FileText className="h-4 w-4" /> إنشاء فاتورة
            </Button>
            <Button variant="secondary" className="gap-2">
              <Boxes className="h-4 w-4" /> إضافة مخزون
            </Button>
            <Button variant="secondary" className="gap-2">
              <CalendarClock className="h-4 w-4" /> موعد متابعة
            </Button>
            <Button variant="outline" className="gap-2 mr-auto">
              عرض كل التقارير <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
