'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plus,
  Search,
  Package,
  Glasses,
  Eye as EyeIcon,
  Contact,
  Droplets,
  AlertTriangle,
  CalendarClock,
  Boxes,
} from 'lucide-react';
import { products } from '@/lib/mock-data';
import { formatCurrency, daysUntil } from '@/lib/format';
import type { Product, ProductCategory } from '@/lib/types';

const categoryConfig: Record<ProductCategory, { label: string; icon: typeof Glasses; color: string }> = {
  frames: { label: 'الإطارات', icon: Glasses, color: 'primary' },
  lenses: { label: 'العدسات', icon: EyeIcon, color: 'accent' },
  contacts: { label: 'العدسات اللاصقة', icon: Contact, color: 'warning' },
  solutions: { label: 'السوائل والمستهلكات', icon: Droplets, color: 'success' },
};

export function InventoryModule() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.includes(search) || p.sku.includes(search) || p.barcode.includes(search) || p.brand.includes(search);
      const matchCat = catFilter === 'all' || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [search, catFilter]);

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const expiringSoon = products.filter((p) => p.expiryDate && daysUntil(p.expiryDate) < 90);
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">إدارة المخزون</h2>
        <p className="text-sm text-muted-foreground">تتبع الإطارات، العدسات، والمستهلكات</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(Object.keys(categoryConfig) as ProductCategory[]).map((cat) => {
          const cfg = categoryConfig[cat];
          const Icon = cfg.icon;
          const count = products.filter((p) => p.category === cat).length;
          return (
            <Card key={cat} className="border-border/60 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-${cfg.color}/10`}>
                    <Icon className={`h-5 w-5 text-${cfg.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                    <p className="font-display text-xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Boxes className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي قيمة المخزون</p>
              <p className="font-display text-xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مخزون منخفض</p>
              <p className="font-display text-xl font-bold">{lowStock.length} صنف</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <CalendarClock className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">قرب انتهاء الصلاحية</p>
              <p className="font-display text-xl font-bold">{expiringSoon.length} صنف</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(lowStock.length > 0 || expiringSoon.length > 0) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {lowStock.length > 0 && (
            <Card className="border-warning/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                  <AlertTriangle className="h-4 w-4 text-warning" /> تنبيهات المخزون المنخفض
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/5 p-3">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-warning">{item.stock} متبقي</p>
                      <p className="text-xs text-muted-foreground">الحد الأدنى: {item.minStock}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {expiringSoon.length > 0 && (
            <Card className="border-destructive/30 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                  <CalendarClock className="h-4 w-4 text-destructive" /> قرب انتهاء الصلاحية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {expiringSoon.map((item) => {
                  const days = daysUntil(item.expiryDate!);
                  return (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-destructive">{days} يوم</p>
                        <p className="text-xs text-muted-foreground">ينتهي قريباً</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base font-bold">كتالوج المنتجات</CardTitle>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> إضافة منتج</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>إضافة منتج جديد</DialogTitle></DialogHeader>
              <AddProductForm onClose={() => setAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم، الباركود، SKU، أو العلامة التجارية..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pr-9"
              />
            </div>
            <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="الفئة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                <SelectItem value="frames">الإطارات</SelectItem>
                <SelectItem value="lenses">العدسات</SelectItem>
                <SelectItem value="contacts">العدسات اللاصقة</SelectItem>
                <SelectItem value="solutions">السوائل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">الباركود</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">المخزون</TableHead>
                  <TableHead className="text-right">التكلفة</TableHead>
                  <TableHead className="text-right">سعر البيع</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((p) => {
                  const cfg = categoryConfig[p.category];
                  const Icon = cfg.icon;
                  const stockPct = Math.min((p.stock / (p.minStock * 3)) * 100, 100);
                  const isLow = p.stock <= p.minStock;
                  return (
                    <TableRow key={p.id} className="cursor-pointer transition-colors hover:bg-secondary/30" onClick={() => setDetail(p)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${cfg.color}/10`}>
                            <Icon className={`h-4 w-4 text-${cfg.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.barcode}</TableCell>
                      <TableCell><Badge variant="outline" className={`border-${cfg.color}/30 text-${cfg.color}`}>{cfg.label}</Badge></TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={isLow ? 'font-bold text-warning' : 'font-medium'}>{p.stock}</span>
                            <span className="text-muted-foreground">/{p.minStock}</span>
                          </div>
                          <Progress value={stockPct} className={`h-1.5 ${isLow ? 'bg-warning/10' : ''}`} />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatCurrency(p.cost)}</TableCell>
                      <TableCell className="text-sm font-semibold">{formatCurrency(p.retail)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">تعديل</Button>
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

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && <ProductDetail product={detail} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const cfg = categoryConfig[product.category];
  const Icon = cfg.icon;
  const margin = ((product.retail - product.cost) / product.retail * 100).toFixed(0);
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${cfg.color}/10`}>
            <Icon className={`h-5 w-5 text-${cfg.color}`} />
          </div>
          {product.name}
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">الباركود</p><p className="font-mono text-sm font-medium">{product.barcode}</p></div>
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">SKU</p><p className="font-mono text-sm font-medium">{product.sku}</p></div>
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">العلامة التجارية</p><p className="text-sm font-medium">{product.brand}</p></div>
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">المخزون</p><p className="text-sm font-medium">{product.stock} قطعة</p></div>
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">الحد الأدنى</p><p className="text-sm font-medium">{product.minStock} قطعة</p></div>
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">التكلفة</p><p className="text-sm font-medium">{formatCurrency(product.cost)}</p></div>
        <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">سعر البيع</p><p className="text-sm font-medium">{formatCurrency(product.retail)}</p></div>
      </div>
      {product.supplier && <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">المورد</p><p className="text-sm font-medium">{product.supplier}</p></div>}
      {product.color && <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">اللون</p><p className="text-sm font-medium">{product.color}</p></div>}
      {product.coating && <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">الطلاء</p><p className="text-sm font-medium">{product.coating}</p></div>}
      {product.material && <div className="rounded-lg bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">المادة</p><p className="text-sm font-medium">{product.material}</p></div>}
      {product.expiryDate && <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"><p className="text-xs text-muted-foreground">تاريخ الانتهاء</p><p className="text-sm font-medium text-destructive">{product.expiryDate}</p></div>}
      <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
        <span className="text-sm text-muted-foreground">هامش الربح</span>
        <span className="font-display text-lg font-bold text-primary">{margin}%</span>
      </div>
    </div>
  );
}

function AddProductForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>اسم المنتج</Label><Input className="mt-1" placeholder="اسم المنتج" /></div>
        <div><Label>الباركود</Label><Input className="mt-1" placeholder="7290000000000" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>SKU</Label><Input className="mt-1" placeholder="رمز المنتج" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>الفئة</Label>
          <Select defaultValue="frames">
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="frames">الإطارات</SelectItem>
              <SelectItem value="lenses">العدسات</SelectItem>
              <SelectItem value="contacts">العدسات اللاصقة</SelectItem>
              <SelectItem value="solutions">السوائل</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>العلامة التجارية</Label><Input className="mt-1" placeholder="العلامة" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>المخزون</Label><Input type="number" className="mt-1" placeholder="0" /></div>
        <div><Label>الحد الأدنى</Label><Input type="number" className="mt-1" placeholder="0" /></div>
        <div><Label>التكلفة</Label><Input type="number" className="mt-1" placeholder="0" /></div>
      </div>
      <div><Label>سعر البيع</Label><Input type="number" className="mt-1" placeholder="0" /></div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={onClose}><Package className="ml-2 h-4 w-4" /> حفظ المنتج</Button>
      </div>
    </div>
  );
}
