'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ScanBarcode,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Wallet,
  Printer,
  X,
  Package,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { getProducts, getPatients, getPrescriptions } from '@/lib/db';
import { formatCurrency } from '@/lib/format';
import type { Product, CartItem, PaymentMethod, Patient, Prescription } from '@/lib/types';

export function PosModule() {
  const { data: products = [], loading: loadingProducts } = useData<Product>(getProducts);
  const { data: patients = [] } = useData<Patient>(getPatients);
  const { data: prescriptions = [] } = useData<Prescription>(getPrescriptions);

  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedRx, setSelectedRx] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [lastScanned, setLastScanned] = useState<Product | null>(null);
  const [scanError, setScanError] = useState('');
  const barcodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const patientRx = useMemo(() => {
    if (!selectedPatient) return [];
    return prescriptions.filter((rx) => rx.patientId === selectedPatient);
  }, [selectedPatient, prescriptions]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) =>
      p.name?.includes(search) || p.barcode?.includes(search) || p.sku?.includes(search)
    );
  }, [search, products]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.retail || 0) * item.qty * (1 - (item.discount || 0) / 100), 0);
  }, [cart]);

  const dep = parseFloat(deposit) || 0;
  const remaining = Math.max(0, total - dep);

  function handleBarcodeScan(value: string) {
    if (!value) return;
    const product = products.find((p) => p.barcode === value.trim());
    if (product) {
      addToCart(product);
      setLastScanned(product);
      setScanError('');
    } else {
      setScanError(`لم يتم العثور على منتج بالباركود: ${value}`);
      setTimeout(() => setScanError(''), 3000);
    }
    setBarcodeInput('');
    barcodeRef.current?.focus();
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { product, qty: 1, discount: 0 }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c
        )
        .filter((c) => c.qty > 0)
    );
  }

  function updateDiscount(productId: string, discount: number) {
    const validDiscount = isNaN(discount) ? 0 : Math.max(0, Math.min(100, discount));
    setCart((prev) =>
      prev.map((c) =>
        c.product.id === productId ? { ...c, discount: validDiscount } : c
      )
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  }

  function handleCheckout() {
    setInvoiceOpen(true);
  }

  function resetTransaction() {
    setCart([]);
    setSelectedPatient('');
    setSelectedRx('');
    setDeposit('');
    setPaymentMethod('cash');
    setInvoiceOpen(false);
    setTimeout(() => barcodeRef.current?.focus(), 100);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">نظام الكاشير والباركود</h2>
        <p className="text-sm text-muted-foreground">مسح الباركود وإدارة سلة المشتريات والدفع</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Barcode + Product Search */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barcode Scanner */}
          <Card className="border-primary/30 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <ScanBarcode className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">ماسح الباركود - جاهز للمسح</Label>
                  <input
                    ref={barcodeRef}
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleBarcodeScan(barcodeInput);
                    }}
                    placeholder="امسح أو أدخل الباركود هنا..."
                    className="mt-1 h-11 w-full rounded-lg border-2 border-primary/20 bg-primary/5 px-4 text-lg font-mono outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              {scanError && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 p-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{scanError}</p>
                </div>
              )}
              {lastScanned && !scanError && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2 animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm text-emerald-600">تم إضافة: {lastScanned.name} ({formatCurrency(lastScanned.retail)})</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Search */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-bold">البحث اليدوي عن المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم، الباركود، أو SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
              {loadingProducts ? (
                <p className="py-8 text-center text-sm text-muted-foreground">جاري تحميل المنتجات...</p>
              ) : (
                <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto scrollbar-thin sm:grid-cols-2">
                  {filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="flex items-center gap-3 rounded-lg border p-3 text-right transition-all hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{p.barcode}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-primary">{formatCurrency(p.retail)}</p>
                        <p className="text-[10px] text-muted-foreground">مخزون: {p.stock}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Cart + Checkout */}
        <div className="space-y-4">
          {/* Patient + Rx Link */}
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div>
                <Label className="text-xs">ربط بالعميل (اختياري)</Label>
                <Select value={selectedPatient} onValueChange={(v) => { setSelectedPatient(v); setSelectedRx(''); }}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="اختر العميل" /></SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPatient && patientRx.length > 0 && (
                <div>
                  <Label className="text-xs">ربط بفحص طبي</Label>
                  <Select value={selectedRx} onValueChange={setSelectedRx}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="اختر الوصفة" /></SelectTrigger>
                    <SelectContent>
                      {patientRx.map((rx) => (
                        <SelectItem key={rx.id} value={rx.id}>
                          {rx.id} - {rx.date} ({rx.type === 'medical' ? 'طبي' : rx.type === 'sunwear' ? 'شمسي' : 'لاصق'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cart */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-base font-bold">
                <ShoppingCart className="h-5 w-5 text-primary" />
                السلة ({cart.length})
              </CardTitle>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setCart([])} className="text-destructive">
                  <Trash2 className="h-4 w-4" /> تفريغ
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 opacity-30" />
                  <p className="text-sm">السلة فارغة - امسح منتج لإضافته</p>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto scrollbar-thin">
                  {cart.map((item) => (
                    <div key={item.product.id} className="rounded-lg border p-3 animate-slide-in">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.product.retail)} × {item.qty}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-destructive hover:text-destructive/70">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.product.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.product.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            placeholder="خصم %"
                            value={item.discount === 0 ? '' : item.discount}
                            onChange={(e) => updateDiscount(item.product.id, parseFloat(e.target.value))}
                            className="h-7 w-16 text-center text-xs"
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                        <span className="mr-auto text-sm font-bold text-primary">
                          {formatCurrency((item.product.retail || 0) * item.qty * (1 - (item.discount || 0) / 100))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          {cart.length > 0 && (
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الإجمالي</span>
                  <span className="font-bold">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">الدفعة الأولى (₪)</Label>
                    <Input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="0"
                      className="mt-1 h-9"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">طريقة الدفع</Label>
                    <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                      <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقداً</SelectItem>
                        <SelectItem value="card">بطاقة ائتمان</SelectItem>
                        <SelectItem value="installments">تقسيط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5 rounded-xl bg-secondary/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">صافي الإجمالي</span>
                    <span className="font-bold">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المدفوع</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(dep)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-1.5">
                    <span className="font-semibold">المتبقي</span>
                    <span className="font-display text-lg font-bold text-destructive">{formatCurrency(remaining)}</span>
                  </div>
                </div>
                <Button className="w-full gap-2 h-11" onClick={handleCheckout}>
                  <Printer className="h-4 w-4" /> إتمام البيع وطباعة الفاتورة
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-md">
          <InvoiceModal
            cart={cart}
            total={total}
            deposit={dep}
            remaining={remaining}
            paymentMethod={paymentMethod}
            patientName={patients.find((p) => p.id === selectedPatient)?.name || 'عميل نقدي'}
            rxId={selectedRx || undefined}
            onClose={resetTransaction}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceModal({
  cart,
  total,
  deposit,
  remaining,
  paymentMethod,
  patientName,
  rxId,
  onClose,
}: {
  cart: CartItem[];
  total: number;
  deposit: number;
  remaining: number;
  paymentMethod: PaymentMethod;
  patientName: string;
  rxId?: string;
  onClose: () => void;
}) {
  const PayIcon = paymentMethod === 'cash' ? Banknote : paymentMethod === 'card' ? CreditCard : Wallet;
  const payLabel = paymentMethod === 'cash' ? 'نقداً' : paymentMethod === 'card' ? 'بطاقة ائتمان' : 'تقسيط';

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5 text-primary" />
          فاتورة ضريبية
        </DialogTitle>
      </DialogHeader>

      <div className="rounded-xl border-2 border-dashed border-border p-4">
        <div className="text-center">
          <h3 className="font-display text-lg font-bold">شركة الرؤيا النقية لمستلزمات مراكز البصريات</h3>
          <p className="text-xs text-muted-foreground">فاتورة ضريبية - رقم: INV-{Date.now().toString().slice(-6)}</p>
          <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-GB')}</p>
        </div>

        <div className="mt-4 space-y-1 border-y py-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">العميل:</span>
            <span className="font-medium">{patientName}</span>
          </div>
          {rxId && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">الوصفة الطبية:</span>
              <span className="font-medium">{rxId}</span>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.product.retail)} × {item.qty}
                  {item.discount > 0 && ` (خصم ${item.discount}%)`}
                </p>
              </div>
              <span className="font-medium">
                {formatCurrency((item.product.retail || 0) * item.qty * (1 - (item.discount || 0) / 100))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الإجمالي</span>
            <span className="font-bold">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الدفعة الأولى</span>
            <span className="font-bold text-emerald-600">{formatCurrency(deposit)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">المتبقي عند التسليم</span>
            <span className="font-bold text-destructive">{formatCurrency(remaining)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">طريقة الدفع</span>
            <span className="flex items-center gap-1 font-medium">
              <PayIcon className="h-4 w-4" /> {payLabel}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 text-center">
          <p className="text-xs text-muted-foreground">ضمان الإطار: سنة واحدة من تاريخ الشراء</p>
          <p className="text-xs text-muted-foreground">ضمان العدسات: 6 أشهر من تاريخ الشراء</p>
          <p className="mt-2 text-xs font-medium">شكراً لتعاملكم معنا</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> طباعة
        </Button>
        <Button className="flex-1 gap-2" onClick={onClose}>
          <CheckCircle2 className="h-4 w-4" /> تأكيد وإغلاق
        </Button>
      </div>
    </div>
  );
}
