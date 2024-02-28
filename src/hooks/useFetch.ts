import { useState, useEffect, useCallback } from "react";

type UseFetchReturn<Response> = {
  isPending: boolean;
  data: Response | null;
  error: string | null;
  refetch: () => Promise<Response>;
};

export const useFetch = <Response>(url: string): UseFetchReturn<Response> => {
  const [data, setData] = useState<Response | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsPending(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result.rates);
      setIsPending(false);
      return result.rates;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsPending(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();

    return () => {
      setData(null);
    };
  }, [url, fetchData]);

  return { isPending, error, data, refetch: fetchData };
};