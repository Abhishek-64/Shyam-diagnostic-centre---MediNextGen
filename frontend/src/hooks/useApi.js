import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../services/api.js';

/**
 * useApi — generic hook for GET requests with loading/error/data state.
 *
 * @param {string} url - API endpoint path
 * @param {object} params - Optional query parameters
 * @param {boolean} immediate - Whether to fetch on mount (default: true)
 */
function useApi(url, params = {}, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetch = useCallback(
    async (overrideParams = {}) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(url, {
          params: { ...params, ...overrideParams },
          signal: abortControllerRef.current.signal,
        });
        setData(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.userMessage || err.message || 'An error occurred.');
        }
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  );

  useEffect(() => {
    if (immediate) {
      fetch();
    }
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetch, immediate]);

  return { data, loading, error, refetch: fetch };
}

export default useApi;
