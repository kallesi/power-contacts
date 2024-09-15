import { useState, useEffect } from 'react';

function useFetch<T>(url: string): { data: T | null; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err as Error);
      }
    }

    fetchData();
  }, [url]);

  return { data, error };
}

export default useFetch;