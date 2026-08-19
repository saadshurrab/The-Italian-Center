export function formatCurrency(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₪';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(date: string): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function daysUntil(date: string): number {
  if (!date) return 0;
  const targetDate = new Date(date).getTime();
  if (isNaN(targetDate)) return 0;
  const diff = targetDate - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0] || '').join('');
}
