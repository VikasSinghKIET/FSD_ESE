import { useState, useCallback } from "react";

/**
 * Manages async operations with loading and error state.
 * @returns {{ execute, loading, error, reset }}
 */
const useAsync = (asyncFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        return await asyncFn(...args);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  const reset = () => setError(null);

  return { execute, loading, error, reset };
};

export default useAsync;
