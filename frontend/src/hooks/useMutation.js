import { useState, useCallback } from 'react';
import apiClient from '../services/api.js';

/**
 * useMutation — hook for POST / PATCH / DELETE requests.
 *
 * Returns { mutate, loading, error, data, reset }
 *
 * Only use for non-idempotent operations (POST, PATCH, DELETE).
 * This hook never retries automatically.
 */
function useMutation(method = 'post') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  const mutate = useCallback(
    async (url, payload = null, config = {}) => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (method === 'delete') {
          response = await apiClient.delete(url, config);
        } else {
          response = await apiClient[method](url, payload, config);
        }
        setData(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        const msg = err.userMessage || err.message || 'An error occurred.';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [method]
  );

  return { mutate, loading, error, data, reset };
}

export default useMutation;
