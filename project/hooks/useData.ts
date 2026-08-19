import { useState, useEffect } from 'react';

export function useData<T>(fetchFn: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, error, refresh: loadData, setData };
}
