'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Eye, Plus, FileDown, History, Search, Stethoscope, Glasses, Sun, Contact } from 'lucide-react';
import { prescriptions, patients } from '@/lib/mock-data';
import { formatDate } from '@/lib/format';
import type { Prescription, PrescriptionType } from '@/lib/types';

const typeConfig: Record<PrescriptionType, { label: string; icon: typeof Glasses; color: string }> = {
  medical: { label: 'إطار طبي', icon: Glasses, color: 'primary' },
  sunwear: { label: 'نظارة شمسية', icon: Sun, color: 'warning' },
  contacts: { label: 'عدسات لاصقة', icon: Contact, color: 'accent' },
};

function EyeRxField({ label, eye, onChange }: { label: string; eye: any; onChange: (field: string, value: number) => void }) {
  const fields = [
    { key: 'sph', label: 'SPH' },
    { key: 'cyl', label: 'CYL' },
    { key: 'axis', label: 'AXIS' },
    { key: 'add', label: 'ADD' },
    { key: 'pd', label: 'PD' },
  ];
  return (
    <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${label === 'العين اليمنى' ? 'primary' : 'accent'}/10 text-sm font-bold`}>
          {label === 'العين اليمنى' ? 'OD' : 'OS'}
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {fields.map((f) => (
          <div key={f.key}>
            <Label className="text-[10px] text-muted-foreground">{f.label}</Label>
            <Input
              type="number"
              step="0.25"
              value={eye[f.key]}
              onChange={(e) => onChange(f.key, parseFloat(e.target.value) || 0)}
              className="mt-1 h-9 text-center text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExaminationsModule() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return prescriptions.filter((rx) => {
      const matchSearch = rx.patientName.includes(search) || rx.id.includes(search);
      const matchType = typeFilter === 'all' || rx.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">قسم الفحوصات والوصفات الطبية</h2>
        <p className="text-sm text-muted-foreground">إدارة فحوصات النظر ووصفات العدسات</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(Object.keys(typeConfig) as PrescriptionType[]).map((type) => {
          const cfg = typeConfig[type];
          const Icon = cfg.icon;
          const count = prescriptions.filter((p) => p.type === type).length;
          return (
            <Card key={type} className="border-border/60 shadow-sm transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${cfg.color}/10`}>
                  <Icon className={`h-6 w-6 text-${cfg.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{cfg.label}</p>
                  <p className="font-display text-xl font-bold">{count} وصفة</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base font-bold">سجل الفحوصات</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> فحص جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>تسجيل فحص بصريات جديد</DialogTitle>
              </DialogHeader>
              <NewExamForm onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث باسم المريض أو رقم الوصفة..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pr-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="النوع" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="medical">إطار طبي</SelectItem>
                <SelectItem value="sunwear">نظارة شمسية</SelectItem>
                <SelectItem value="contacts">عدسات لاصقة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-right">رقم الوصفة</TableHead>
                  <TableHead className="text-right">المريض</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الطبيب</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((rx) => {
                  const cfg = typeConfig[rx.type];
                  const Icon = cfg.icon;
                  return (
                    <TableRow key={rx.id} className="transition-colors hover:bg-secondary/30">
                      <TableCell className="font-mono text-sm">{rx.id}</TableCell>
                      <TableCell className="font-medium">{rx.patientName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 border-${cfg.color}/30 text-${cfg.color}`}>
                          <Icon className="h-3 w-3" /> {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(rx.date)}</TableCell>
                      <TableCell className="text-sm">{rx.doctor}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRx(rx)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
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
              <p className="text-sm text-muted-foreground">
                صفحة {page + 1} من {totalPages} · {filtered.length} نتيجة
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>السابق</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>التالي</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRx} onOpenChange={(v) => !v && setSelectedRx(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRx && <PrescriptionDetail rx={selectedRx} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewExamForm({ onClose }: { onClose: () => void }) {
  const [patientId, setPatientId] = useState('');
  const [type, setType] = useState<PrescriptionType>('medical');
  const [doctor, setDoctor] = useState('');
  const [rightEye, setRightEye] = useState({ sph: 0, cyl: 0, axis: 0, add: 0, pd: 0 });
  const [leftEye, setLeftEye] = useState({ sph: 0, cyl: 0, axis: 0, add: 0, pd: 0 });
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>المريض</Label>
          <Select value={patientId} onValueChange={setPatientId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="اختر المريض" /></SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>النوع</Label>
          <Select value={type} onValueChange={(v) => setType(v as PrescriptionType)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">إطار طبي</SelectItem>
              <SelectItem value="sunwear">نظارة شمسية</SelectItem>
              <SelectItem value="contacts">عدسات لاصقة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>الطبيب المختص</Label>
        <Select value={doctor} onValueChange={setDoctor}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="اختر الطبيب" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="د. سارة المطيري">د. سارة المطيري</SelectItem>
            <SelectItem value="د. عمر الزهراني">د. عمر الزهراني</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EyeRxField label="العين اليمنى" eye={rightEye} onChange={(f, v) => setRightEye({ ...rightEye, [f]: v })} />
        <EyeRxField label="العين اليسرى" eye={leftEye} onChange={(f, v) => setLeftEye({ ...leftEye, [f]: v })} />
      </div>

      <div>
        <Label>ملاحظات</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." className="mt-1" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>إلغاء</Button>
        <Button onClick={onClose}><Stethoscope className="ml-2 h-4 w-4" /> حفظ الفحص</Button>
      </div>
    </div>
  );
}

function PrescriptionDetail({ rx }: { rx: Prescription }) {
  const cfg = typeConfig[rx.type];
  const Icon = cfg.icon;
  const eyeRows = [
    { label: 'SPH', right: rx.rightEye.sph, left: rx.leftEye.sph },
    { label: 'CYL', right: rx.rightEye.cyl, left: rx.leftEye.cyl },
    { label: 'AXIS', right: rx.rightEye.axis, left: rx.leftEye.axis },
    { label: 'ADD', right: rx.rightEye.add, left: rx.leftEye.add },
    { label: 'PD', right: rx.rightEye.pd, left: rx.leftEye.pd },
  ];

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 text-${cfg.color}`} />
          وصفة {rx.id}
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">المريض</p>
          <p className="font-semibold">{rx.patientName}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">التاريخ</p>
          <p className="font-semibold">{formatDate(rx.date)}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-right">المعيار</TableHead>
              <TableHead className="text-center text-primary">OD (اليمنى)</TableHead>
              <TableHead className="text-center text-accent">OS (اليسرى)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eyeRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-mono font-bold">{row.label}</TableCell>
                <TableCell className="text-center font-mono">{row.right}</TableCell>
                <TableCell className="text-center font-mono">{row.left}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {rx.notes && (
        <div className="rounded-lg border bg-warning/5 p-3">
          <p className="text-xs text-muted-foreground">ملاحظات</p>
          <p className="text-sm">{rx.notes}</p>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-2"><History className="h-4 w-4" /> السجل التاريخي</Button>
        <Button className="gap-2"><FileDown className="h-4 w-4" /> تصدير PDF</Button>
      </div>
    </div>
  );
}
