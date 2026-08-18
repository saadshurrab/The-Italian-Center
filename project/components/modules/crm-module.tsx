'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Plus,
  Search,
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  Eye,
  MessageCircle,
  Bell,
  Clock,
  DollarSign,
  FileText,
  UserPlus,
} from 'lucide-react';
import { patients, prescriptions, orders } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Patient } from '@/lib/types';

export function CrmModule() {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState<Patient | null>(null);

  const filtered = useMemo(() => {
    return patients.filter((p) =>
      p.name.includes(search) || p.phone.includes(search) || p.id.includes(search)
    );
  }, [search]);

  const totalPatients = patients.length;
  const totalRevenue = patients.reduce((s, p) => s + p.totalSpent, 0);
  const avgVisits = (patients.reduce((s, p) => s + p.totalVisits, 0) / totalPatients).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">إدارة العلاقات والعملاء</h2>
        <p className="text-sm text-muted-foreground">سجلات المرضى، التاريخ الطبي، والتواصل</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المرضى</p>
              <p className="font-display text-xl font-bold">{totalPatients}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <DollarSign className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <p className="font-display text-xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Calendar className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط الزيارات</p>
              <p className="font-display text-xl font-bold">{avgVisits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base font-bold">سجلات المرضى</CardTitle>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><UserPlus className="h-4 w-4" /> مريض جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>تسجيل مريض جديد</DialogTitle></DialogHeader>
              <AddPatientForm onClose={() => setAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم، الهاتف، أو رقم المريض..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-right">المريض</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الزيارات</TableHead>
                  <TableHead className="text-right">إجمالي الإنفاق</TableHead>
                  <TableHead className="text-right">آخر زيارة</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer transition-colors hover:bg-secondary/30" onClick={() => setDetail(p)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {p.name.split(' ')[1]?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.phone}</TableCell>
                    <TableCell><Badge variant="secondary">{p.totalVisits}</Badge></TableCell>
                    <TableCell className="font-semibold">{formatCurrency(p.totalSpent)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(p.lastVisit)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setDetail(p)}>عرض</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detail && <PatientDetail patient={detail} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PatientDetail({ patient: p }: { patient: Patient }) {
  const patientRx = prescriptions.filter((rx) => rx.patientId === p.id);
  const patientOrders = orders.filter((o) => o.patientId === p.id);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {p.name.split(' ')[1]?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{p.name}</p>
            <p className="text-sm font-normal text-muted-foreground">{p.id}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">الهاتف</p><p className="text-sm font-medium">{p.phone}</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">البريد</p><p className="text-sm font-medium truncate">{p.email}</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">العنوان</p><p className="text-sm font-medium">{p.address}</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div><p className="text-xs text-muted-foreground">تاريخ التسجيل</p><p className="text-sm font-medium">{formatDate(p.registeredAt)}</p></div>
        </div>
      </div>

      {p.notes && (
        <div className="rounded-lg border bg-warning/5 p-3">
          <p className="text-xs text-muted-foreground">ملاحظات</p>
          <p className="text-sm">{p.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">الزيارات</p>
          <p className="font-display text-xl font-bold text-primary">{p.totalVisits}</p>
        </div>
        <div className="rounded-xl bg-accent/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">الوصفات</p>
          <p className="font-display text-xl font-bold text-accent">{patientRx.length}</p>
        </div>
        <div className="rounded-xl bg-success/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">إجمالي الإنفاق</p>
          <p className="font-display text-xl font-bold text-success">{formatCurrency(p.totalSpent)}</p>
        </div>
      </div>

      <Tabs defaultValue="prescriptions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prescriptions" className="gap-1"><Eye className="h-3.5 w-3.5" /> الوصفات</TabsTrigger>
          <TabsTrigger value="orders" className="gap-1"><ShoppingBag className="h-3.5 w-3.5" /> الطلبات</TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions" className="mt-3">
          <div className="space-y-2">
            {patientRx.length > 0 ? patientRx.map((rx) => (
              <div key={rx.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{rx.id}</p>
                  <p className="text-xs text-muted-foreground">{rx.doctor} · {formatDate(rx.date)}</p>
                </div>
                <Badge variant="outline">{rx.type === 'medical' ? 'طبي' : rx.type === 'sunwear' ? 'شمسي' : 'لاصق'}</Badge>
              </div>
            )) : <p className="py-4 text-center text-sm text-muted-foreground">لا توجد وصفات</p>}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-3">
          <div className="space-y-2">
            {patientOrders.length > 0 ? patientOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.items.length} أصناف</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">{formatCurrency(o.total)}</p>
                  <p className="text-xs text-muted-foreground">{o.status === 'fulfilled' ? 'مكتمل' : o.status === 'in_lab' ? 'في المختبر' : o.status === 'ready' ? 'جاهز' : 'معلق'}</p>
                </div>
              </div>
            )) : <p className="py-4 text-center text-sm text-muted-foreground">لا توجد طلبات</p>}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-2 border-t pt-3">
        <Button variant="outline" className="gap-2"><MessageCircle className="h-4 w-4 text-success" /> رسالة واتساب</Button>
        <Button variant="outline" className="gap-2"><Bell className="h-4 w-4 text-primary" /> تذكير فحص</Button>
        <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> تصدير السجل</Button>
        <Button className="gap-2"><Plus className="h-4 w-4" /> فحص جديد</Button>
      </div>
    </div>
  );
}

function AddPatientForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>الاسم</Label><Input className="mt-1" placeholder="اسم المريض" /></div>
        <div><Label>الهاتف</Label><Input className="mt-1" placeholder="05xxxxxxxx" /></div>
      </div>
      <div><Label>البريد الإلكتروني</Label><Input type="email" className="mt-1" placeholder="email@example.com" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>تاريخ الميلاد</Label><Input type="date" className="mt-1" /></div>
        <div><Label>العنوان</Label><Input className="mt-1" placeholder="المدينة، الحي" /></div>
      </div>
      <div><Label>ملاحظات</Label><Textarea className="mt-1" placeholder="ملاحظات إضافية..." /></div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={onClose}><Plus className="ml-2 h-4 w-4" /> حفظ المريض</Button>
      </div>
    </div>
  );
}
