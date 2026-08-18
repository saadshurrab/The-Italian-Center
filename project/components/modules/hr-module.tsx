'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  Users,
  Plus,
  Search,
  UserCog,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Wallet,
  ArrowDownCircle,
  Percent,
  Phone,
  Award,
} from 'lucide-react';
import { employees, commissionRecords } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Employee } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'نشط', color: 'success' },
  leave: { label: 'إجازة', color: 'warning' },
  off: { label: 'غير نشط', color: 'muted-foreground' },
};

export function HrModule() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch = e.name.includes(search) || e.role.includes(search);
      const matchRole = roleFilter === 'all' || e.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [search, roleFilter]);

  const roles = Array.from(new Set(employees.map((e) => e.role)));
  const totalPayroll = employees.reduce((s, e) => s + e.baseSalary + e.commission, 0);
  const totalCommission = employees.reduce((s, e) => s + e.commission, 0);
  const totalAdvances = employees.reduce((s, e) => s + e.advances, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">الموارد البشرية والعمولات</h2>
        <p className="text-sm text-muted-foreground">إدارة الموظفين، العمولات، والرواتب</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الرواتب</p>
              <p className="font-display text-xl font-bold">{formatCurrency(totalPayroll)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Percent className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي العمولات</p>
              <p className="font-display text-xl font-bold">{formatCurrency(totalCommission)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <ArrowDownCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">السلف والخصومات</p>
              <p className="font-display text-xl font-bold">{formatCurrency(totalAdvances)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="directory">دليل الموظفين</TabsTrigger>
          <TabsTrigger value="commissions">سجل العمولات</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base font-bold">قائمة الموظفين</CardTitle>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4" /> إضافة موظف</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>إضافة موظف جديد</DialogTitle></DialogHeader>
                  <AddEmployeeForm onClose={() => setAddOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو الوظيفة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="الوظيفة" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الوظائف</SelectItem>
                    {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((emp) => {
                  const cfg = statusConfig[emp.status];
                  return (
                    <Card key={emp.id} className="cursor-pointer border-border/60 transition-all hover:shadow-md hover:border-primary/30" onClick={() => setDetail(emp)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {emp.name.split(' ')[1]?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.role}</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <Badge variant="outline" className={`border-${cfg.color}/30 text-${cfg.color}`}>{cfg.label}</Badge>
                              <span className="text-xs text-muted-foreground">{emp.shift}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1.5 border-t pt-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">الراتب الأساسي</span>
                            <span className="font-medium">{formatCurrency(emp.baseSalary)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">العمولة</span>
                            <span className="font-medium text-accent">{formatCurrency(emp.commission)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">إجمالي المبيعات</span>
                            <span className="font-medium">{formatCurrency(emp.totalSales)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                <Award className="h-5 w-5 text-accent" /> سجل العمولات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">المريض</TableHead>
                      <TableHead className="text-right">مبلغ العمولة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionRecords.map((rec) => (
                      <TableRow key={rec.orderId} className="transition-colors hover:bg-secondary/30">
                        <TableCell className="font-mono text-sm">{rec.orderId}</TableCell>
                        <TableCell className="font-medium">{rec.patientName}</TableCell>
                        <TableCell className="font-bold text-accent">{formatCurrency(rec.amount)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(rec.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && <EmployeeDetail employee={detail} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmployeeDetail({ employee: emp }: { employee: Employee }) {
  const cfg = statusConfig[emp.status];
  const netSalary = emp.baseSalary + emp.commission - emp.advances - emp.deductions;
  const attendancePct = (emp.attendance / 26) * 100;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {emp.name.split(' ')[1]?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{emp.name}</p>
            <p className="text-sm font-normal text-muted-foreground">{emp.role}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">الهاتف</p><p className="text-sm font-medium">{emp.phone}</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">تاريخ الانضمام</p><p className="text-sm font-medium">{formatDate(emp.joinDate)}</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <UserCog className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">الوردية</p><p className="text-sm font-medium">{emp.shift}</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <Badge variant="outline" className={`border-${cfg.color}/30 text-${cfg.color}`}>{cfg.label}</Badge>
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">الحضور هذا الشهر</span>
          <span className="font-bold">{emp.attendance}/26 يوم</span>
        </div>
        <Progress value={attendancePct} className="h-2" />
      </div>

      <div className="space-y-2 rounded-xl bg-secondary/50 p-4">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">الراتب الأساسي</span><span className="font-bold">{formatCurrency(emp.baseSalary)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">العمولة</span><span className="font-bold text-accent">+ {formatCurrency(emp.commission)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">السلف</span><span className="font-bold text-warning">- {formatCurrency(emp.advances)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">الخصومات</span><span className="font-bold text-destructive">- {formatCurrency(emp.deductions)}</span></div>
        <div className="mt-2 flex justify-between border-t pt-2"><span className="font-semibold">صافي الراتب</span><span className="font-display text-lg font-bold text-primary">{formatCurrency(netSalary)}</span></div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">إجمالي المبيعات هذا الشهر</span>
        <span className="mr-auto font-display text-lg font-bold text-primary">{formatCurrency(emp.totalSales)}</span>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-2"><DollarSign className="h-4 w-4" /> تسجيل سلفة</Button>
        <Button>تعديل البيانات</Button>
      </div>
    </div>
  );
}

function AddEmployeeForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>الاسم</Label><Input className="mt-1" placeholder="اسم الموظف" /></div>
        <div><Label>الهاتف</Label><Input className="mt-1" placeholder="05xxxxxxxx" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>الوظيفة</Label>
          <Select defaultValue="sales">
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor">طبيب بصريات</SelectItem>
              <SelectItem value="sales">أخصائي مبيعات</SelectItem>
              <SelectItem value="lab">فني مختبر</SelectItem>
              <SelectItem value="reception">موظف استقبال</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>الوردية</Label>
          <Select defaultValue="morning">
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">صباحي</SelectItem>
              <SelectItem value="evening">مسائي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><Label>الراتب الأساسي</Label><Input type="number" className="mt-1" placeholder="0" /></div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={onClose}><Users className="ml-2 h-4 w-4" /> حفظ الموظف</Button>
      </div>
    </div>
  );
}
