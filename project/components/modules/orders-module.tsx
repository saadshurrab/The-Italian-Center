'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Clock,
  Wrench,
  PackageCheck,
  CheckCircle2,
  Plus,
  Search,
  ShoppingCart,
  CreditCard,
  Banknote,
  Wallet,
} from 'lucide-react';
import { orders, patients, products } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Order, OrderStatus } from '@/lib/types';

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; color: string; step: number }> = {
  pending: { label: 'قيد الانتظار', icon: Clock, color: 'warning', step: 0 },
  in_lab: { label: 'في المختبر', icon: Wrench, color: 'primary', step: 1 },
  ready: { label: 'جاهز للاستلام', icon: PackageCheck, color: 'accent', step: 2 },
  fulfilled: { label: 'مكتمل', icon: CheckCircle2, color: 'success', step: 3 },
};

const paymentIcons: Record<string, typeof CreditCard> = {
  'بطاقة ائتمان': CreditCard,
  'نقداً': Banknote,
  'تحويل بنكي': Wallet,
  'تقسيط': CreditCard,
};

export function OrdersModule() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = o.patientName.includes(search) || o.id.includes(search);
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const pipelineStages = (['pending', 'in_lab', 'ready', 'fulfilled'] as OrderStatus[]).map((s) => ({
    ...statusConfig[s],
    count: orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">قسم الطلبات والفواتير</h2>
        <p className="text-sm text-muted-foreground">نقطة البيع ومتابعة مسار الطلبات</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {pipelineStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <Card key={stage.label} className="border-border/60 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-${stage.color}/10`}>
                    <Icon className={`h-5 w-5 text-${stage.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stage.label}</p>
                    <p className="font-display text-xl font-bold">{stage.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base font-bold">قائمة الطلبات</CardTitle>
          <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> طلب جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>إنشاء طلب جديد</DialogTitle></DialogHeader>
              <NewOrderForm onClose={() => setNewOrderOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث باسم المريض أو رقم الطلب..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pr-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="in_lab">في المختبر</SelectItem>
                <SelectItem value="ready">جاهز للاستلام</SelectItem>
                <SelectItem value="fulfilled">مكتمل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">المريض</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">المدفوع</TableHead>
                  <TableHead className="text-right">المتبقي</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((order) => {
                  const cfg = statusConfig[order.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <TableRow key={order.id} className="cursor-pointer transition-colors hover:bg-secondary/30" onClick={() => setDetailOrder(order)}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.patientName}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                      <TableCell className="text-sm text-success">{formatCurrency(order.deposit)}</TableCell>
                      <TableCell className="text-sm text-destructive">{formatCurrency(order.remaining)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 border-${cfg.color}/30 text-${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" /> {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">تفاصيل</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">صفحة {page + 1} من {totalPages} · {filtered.length} نتيجة</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>السابق</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>التالي</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detailOrder} onOpenChange={(v) => !v && setDetailOrder(null)}>
        <DialogContent className="max-w-2xl">
          {detailOrder && <OrderDetail order={detailOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderDetail({ order }: { order: Order }) {
  const cfg = statusConfig[order.status];
  const StatusIcon = cfg.icon;
  const PayIcon = paymentIcons[order.paymentMethod] || CreditCard;
  const stages = (['pending', 'in_lab', 'ready', 'fulfilled'] as OrderStatus[]);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          طلب {order.id}
        </DialogTitle>
      </DialogHeader>

      <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
        {stages.map((s, i) => {
          const sc = statusConfig[s];
          const SIcon = sc.icon;
          const isPassed = cfg.step >= i;
          const isCurrent = cfg.step === i;
          return (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${isPassed ? `bg-${sc.color} text-white` : 'bg-muted text-muted-foreground'} ${isCurrent ? 'ring-4 ring-' + sc.color + '/20' : ''}`}>
                  <SIcon className="h-4 w-4" />
                </div>
                <span className={`text-[10px] ${isPassed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{sc.label}</span>
              </div>
              {i < stages.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 rounded ${cfg.step > i ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">المريض</p>
          <p className="font-semibold">{order.patientName}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">الموظف المسؤول</p>
          <p className="font-semibold">{order.assignedStaff}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-right">الصنف</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.type}</TableCell>
                <TableCell className="text-sm">{formatCurrency(item.price)}</TableCell>
                <TableCell className="text-sm">{item.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <PayIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">طريقة الدفع</p>
            <p className="text-sm font-medium">{order.paymentMethod}</p>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">تاريخ التسليم</p>
          <p className="text-sm font-medium">{formatDate(order.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-secondary/50 p-4">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">الإجمالي</span><span className="font-bold">{formatCurrency(order.total)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">الدفعة الأولى</span><span className="font-bold text-success">{formatCurrency(order.deposit)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">المتبقي</span><span className="font-bold text-destructive">{formatCurrency(order.remaining)}</span></div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">طباعة الفاتورة</Button>
        <Button>تحديث الحالة</Button>
      </div>
    </div>
  );
}

function NewOrderForm({ onClose }: { onClose: () => void }) {
  const [patientId, setPatientId] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('نقداً');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const total = selectedProducts.reduce((sum, id) => {
    const p = products.find((x) => x.id === id);
    return sum + (p?.retail || 0);
  }, 0);
  const dep = parseFloat(deposit) || 0;

  return (
    <div className="space-y-4">
      <div>
        <Label>المريض</Label>
        <Select value={patientId} onValueChange={setPatientId}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="اختر المريض" /></SelectTrigger>
          <SelectContent>
            {patients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>الأصناف</Label>
        <div className="mt-1 max-h-40 space-y-2 overflow-y-auto rounded-lg border p-3 scrollbar-thin">
          {products.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-secondary/50">
              <input
                type="checkbox"
                checked={selectedProducts.includes(p.id)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedProducts([...selectedProducts, p.id]);
                  else setSelectedProducts(selectedProducts.filter((x) => x !== p.id));
                }}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="flex-1 text-sm">{p.name}</span>
              <span className="text-sm font-medium">{formatCurrency(p.retail)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>الدفعة الأولى</Label>
          <Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0" className="mt-1" />
        </div>
        <div>
          <Label>طريقة الدفع</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="نقداً">نقداً</SelectItem>
              <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
              <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
              <SelectItem value="تقسيط">تقسيط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-secondary/50 p-4">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">الإجمالي</span><span className="font-bold">{formatCurrency(total)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">المدفوع</span><span className="font-bold text-success">{formatCurrency(dep)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">المتبقي</span><span className="font-bold text-destructive">{formatCurrency(total - dep)}</span></div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={onClose}><ShoppingCart className="ml-2 h-4 w-4" /> إنشاء الطلب</Button>
      </div>
    </div>
  );
}
