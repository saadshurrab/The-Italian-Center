'use client';

import { useState } from 'react';
import { navItems, type ModuleKey } from '@/lib/navigation';
import { useData } from '@/hooks/useData';
import { getNotifications } from '@/lib/db';
import type { Notification } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Menu,
  Search,
  Settings,
  LogOut,
  User,
  Glasses,
  ChevronLeft,
  CircleDot,
} from 'lucide-react';

import { DashboardModule } from '@/components/modules/dashboard-module';
import { PosModule } from '@/components/modules/pos-module';
import { ExaminationsModule } from '@/components/modules/examinations-module';
import { OrdersModule } from '@/components/modules/orders-module';
import { InventoryModule } from '@/components/modules/inventory-module';
import { AccountingModule } from '@/components/modules/accounting-module';
import { HrModule } from '@/components/modules/hr-module';
import { CrmModule } from '@/components/modules/crm-module';

export function AppShell() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // إعطاء قيمة افتراضية مسبقة مأمنة لتفادي خطأ undefined أثناء التحميل
  const { data: notificationsData } = useData<Notification>(getNotifications);
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];

  const activeItem = navItems?.find((item) => item.key === activeModule) || navItems?.[0] || { label: '' };
  const unreadCount = notifications.filter((n) => n && !n.read).length;

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
          <Glasses className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold leading-tight">المركز الإيطالي</h1>
          <p className="text-xs text-white/60">للبصريات</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin px-3 py-4">
        {(navItems || []).map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveModule(item.key);
                setMobileNavOpen(false);
              }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              {Icon && <Icon className={cn('h-5 w-5 shrink-0 transition-transform', isActive && 'scale-110')} />}
              <div className="flex-1 text-right">
                <span className="block">{item.label}</span>
              </div>
              {isActive && <CircleDot className="h-3 w-3 text-white/80" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <Avatar className="h-10 w-10 border-2 border-primary/40">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
              م
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">مدير النظام</p>
            <p className="text-xs text-white/50 truncate">admin@optical.sa</p>
          </div>
          <Settings className="h-4 w-4 text-white/40" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden lg:flex w-64 shrink-0">
        <SidebarContent />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>القائمة</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">الرئيسية</span>
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold text-foreground">{activeItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث سريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 lg:w-64 rounded-lg border bg-secondary/50 pr-9 pl-3 text-sm outline-none transition-all focus:w-72 focus:bg-card focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>الإشعارات</span>
                  {unreadCount > 0 && <Badge variant="destructive">{unreadCount} جديد</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">لا يوجد إشعارات</div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-3">
                        <div className="flex w-full items-start gap-2">
                          <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-muted-foreground/30' : 'bg-primary')} />
                          <div className="flex-1">
                            <p className="text-sm leading-snug">{n.message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(n.time)}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">م</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="ml-2 h-4 w-4" /> الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem><Settings className="ml-2 h-4 w-4" /> الإعدادات</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="animate-fade-in p-4 lg:p-6">
            {activeModule === 'dashboard' && <DashboardModule />}
            {activeModule === 'pos' && <PosModule />}
            {activeModule === 'examinations' && <ExaminationsModule />}
            {activeModule === 'orders' && <OrdersModule />}
            {activeModule === 'inventory' && <InventoryModule />}
            {activeModule === 'accounting' && <AccountingModule />}
            {activeModule === 'hr' && <HrModule />}
            {activeModule === 'crm' && <CrmModule />}
          </div>
        </main>
      </div>
    </div>
  );
}
