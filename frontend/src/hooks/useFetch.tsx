import { useState, useEffect } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function useFetch<T>(url: string, method: HttpMethod): { data: T | null; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const req = {
          method: method
        }
        const res = await fetch(url, req);
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
  }, [method, url]);

  return { data, error };
}

export default useFetch;