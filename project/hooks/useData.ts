import { useState, useEffect, useCallback } from 'react';

export function useData<T>(fetchFn: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // استخدام useCallback لمنع إعادة تعريف الدالة تلقائياً عند كل Render
  const loadData = useCallback(async () => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      if (isMounted) {
        setData(result || []);
      }
    } catch (err: any) {
      if (isMounted) {
        setError(err?.message || 'حدث خطأ أثناء تحميل البيانات');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [fetchFn]);

  useEffect(() => {
    let active = true;

    async function execute() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn();
        if (active) {
          setData(result || []);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'حدث خطأ أثناء تحميل البيانات');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    execute();

    return () => {
      active = false;
    };
  }, [fetchFn]);

  return { data, loading, error, refresh: loadData, setData };
}
