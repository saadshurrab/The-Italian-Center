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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calculator,
  Banknote,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  FileBarChart,
  AlertCircle,
} from 'lucide-react';
import { orders, expenses, cashRegisterEntries, dailyReports } from '@/lib/mock-data';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import type { PaymentMethod } from '@/lib/types';
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

export function AccountingModule() {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  const totalCashSales = cashRegisterEntries
    .filter((e) => e.type === 'sale' && e.paymentMethod === 'cash')
    .reduce((s, e) => s + e.amount, 0);
  const totalCardSales = cashRegisterEntries
    .filter((e) => e.type === 'sale' && e.paymentMethod === 'card')
    .reduce((s, e) => s + e.amount, 0);
  const totalDeposits = cashRegisterEntries
    .filter((e) => e.type === 'deposit')
    .reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const outstandingReceivables = orders
    .filter((o) => o.status !== 'fulfilled')
    .reduce((s, o) => s + o.remaining, 0);
  const netRevenue = totalCashSales + totalCardSales + totalDeposits - totalExpenses;

  const kpis = [
    {
      label: 'مبيعات نقدية',
      value: formatCurrency(totalCashSales),
      icon: Banknote,
      color: 'success',
    },
    {
      label: 'مبيعات بطاقة',
      value: formatCurrency(totalCardSales),
      icon: CreditCard,
      color: 'primary',
    },
    {
      label: 'الذمم المدينة',
      value: formatCurrency(outstandingReceivables),
      icon: AlertCircle,
      color: 'destructive',
    },
    {
      label: 'صافي الإيراد',
      value: formatCurrency(netRevenue),
      icon: TrendingUp,
      color: netRevenue >= 0 ? 'success' : 'destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">القسم المحاسبي والمالي</h2>
        <p className="text-sm text-muted-foreground">تقفيل الصندوق، الذمم، المصاريف، والتقارير المالية</p>
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
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 font-display text-xl font-bold">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="cashRegister">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="cashRegister">تقفيل الصندوق</TabsTrigger>
          <TabsTrigger value="receivables">الذمم والديون</TabsTrigger>
          <TabsTrigger value="reports">التقارير المالية</TabsTrigger>
        </TabsList>

        {/* Cash Register */}
        <TabsContent value="cashRegister" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                    <Banknote className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الصندوق النقدي</p>
                    <p className="font-display text-xl font-bold text-success">{formatCurrency(totalCashSales)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي بطاقات الائتمان</p>
                    <p className="font-display text-xl font-bold text-primary">{formatCurrency(totalCardSales)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                    <PiggyBank className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الدفعات المقدمة</p>
                    <p className="font-display text-xl font-bold text-accent">{formatCurrency(totalDeposits)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                <Receipt className="h-5 w-5 text-primary" />
                سجل حركة الصندوق اليومي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">طريقة الدفع</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الوقت</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashRegisterEntries.map((entry) => {
                      const typeConfig = {
                        sale: { label: 'بيع', icon: ArrowUpCircle, color: 'success' },
                        expense: { label: 'مصروف', icon: ArrowDownCircle, color: 'destructive' },
                        deposit: { label: 'دفعة', icon: PiggyBank, color: 'accent' },
                      }[entry.type];
                      const TypeIcon = typeConfig.icon;
                      const payIcon = entry.paymentMethod === 'cash' ? Banknote : entry.paymentMethod === 'card' ? CreditCard : Wallet;
                      const PayIcon = payIcon;
                      return (
                        <TableRow key={entry.id} className="transition-colors hover:bg-secondary/30">
                          <TableCell>
                            <Badge variant="outline" className={`gap-1 border-${typeConfig.color}/30 text-${typeConfig.color}`}>
                              <TypeIcon className="h-3 w-3" /> {typeConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{entry.description}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <PayIcon className="h-3.5 w-3.5" />
                              {entry.paymentMethod === 'cash' ? 'نقداً' : entry.paymentMethod === 'card' ? 'بطاقة' : 'تحويل'}
                            </span>
                          </TableCell>
                          <TableCell className={`font-bold ${entry.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(Math.abs(entry.amount))}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDateTime(entry.time)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receivables */}
        <TabsContent value="receivables" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                <AlertCircle className="h-5 w-5 text-destructive" />
                سجل الذمم المدينة (الأرصدة المستحقة)
              </CardTitle>
              <Badge variant="destructive" className="text-sm">
                الإجمالي: {formatCurrency(outstandingReceivables)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">المدفوع</TableHead>
                      <TableHead className="text-right">المتبقي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter((o) => o.status !== 'fulfilled' && o.remaining > 0)
                      .map((order) => (
                        <TableRow key={order.id} className="transition-colors hover:bg-secondary/30">
                          <TableCell className="font-mono text-sm">{order.id}</TableCell>
                          <TableCell className="font-medium">{order.patientName}</TableCell>
                          <TableCell className="text-sm">{formatCurrency(order.total)}</TableCell>
                          <TableCell className="text-sm text-success">{formatCurrency(order.deposit)}</TableCell>
                          <TableCell className="font-bold text-destructive">{formatCurrency(order.remaining)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              order.status === 'pending' ? 'border-warning/30 text-warning' :
                              order.status === 'in_lab' ? 'border-primary/30 text-primary' :
                              'border-accent/30 text-accent'
                            }>
                              {order.status === 'pending' ? 'قيد الانتظار' :
                               order.status === 'in_lab' ? 'في المعمل' : 'جاهز للتسليم'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(order.dueDate)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base font-bold">التدفق المالي اليومي</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyReports} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '13px',
                      }}
                    />
                    <Area type="monotone" dataKey="totalSales" name="المبيعات" stroke="hsl(var(--success))" strokeWidth={2.5} fill="url(#accGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base font-bold">المصاريف مقابل المبيعات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyReports}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '13px',
                      }}
                    />
                    <Bar dataKey="totalSales" name="المبيعات" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} barSize={18} />
                    <Bar dataKey="expenses" name="المصاريف" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Expense Log */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                <FileBarChart className="h-5 w-5 text-primary" />
                سجل المصاريف
              </CardTitle>
              <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4" /> تسجيل مصروف</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>تسجيل مصروف جديد</DialogTitle></DialogHeader>
                  <AddExpenseForm onClose={() => setAddExpenseOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">طريقة الدفع</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((exp) => (
                      <TableRow key={exp.id} className="transition-colors hover:bg-secondary/30">
                        <TableCell className="text-sm font-medium">{exp.description}</TableCell>
                        <TableCell><Badge variant="secondary">{exp.category}</Badge></TableCell>
                        <TableCell className="font-bold text-destructive">- {formatCurrency(exp.amount)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {exp.paymentMethod === 'cash' ? 'نقداً' : 'بطاقة'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(exp.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* P&L Summary */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-base font-bold">ملخص الأرباح والخسائر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between rounded-lg bg-success/5 p-3">
                  <span className="text-sm font-medium">إجمالي المبيعات (نقد + بطاقة)</span>
                  <span className="font-bold text-success">{formatCurrency(totalCashSales + totalCardSales)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-accent/5 p-3">
                  <span className="text-sm font-medium">الدفعات المقدمة</span>
                  <span className="font-bold text-accent">{formatCurrency(totalDeposits)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-destructive/5 p-3">
                  <span className="text-sm font-medium">إجمالي المصاريف</span>
                  <span className="font-bold text-destructive">- {formatCurrency(totalExpenses)}</span>
                </div>
                <div className="flex justify-between rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                  <span className="font-display font-bold">صافي الإيراد</span>
                  <span className={`font-display text-2xl font-bold ${netRevenue >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(netRevenue)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddExpenseForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>وصف المصروف</Label>
        <Input className="mt-1" placeholder="مثال: إيجار المحل" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>الفئة</Label>
          <Select defaultValue="rent">
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">إيجار</SelectItem>
              <SelectItem value="utilities">مرافق</SelectItem>
              <SelectItem value="inventory">مخزون</SelectItem>
              <SelectItem value="salaries">رواتب</SelectItem>
              <SelectItem value="maintenance">صيانة</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>المبلغ (₪)</Label>
          <Input type="number" className="mt-1" placeholder="0" />
        </div>
      </div>
      <div>
        <Label>طريقة الدفع</Label>
        <Select defaultValue="cash">
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">نقداً</SelectItem>
            <SelectItem value="card">بطاقة</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={onClose}><DollarSign className="ml-2 h-4 w-4" /> حفظ المصروف</Button>
      </div>
    </div>
  );
}
