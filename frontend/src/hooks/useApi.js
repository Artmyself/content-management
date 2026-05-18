import { useState, useEffect, useCallback } from 'react';

/**
 * @param {Function} apiFunc - Reference to the Service function (e.g., UserService.list)
 * @param {Array} params - Arguments to pass to that function
 */
export const useApi = (apiFunc, params = []) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        setLoading(true);
        try {
            // We spread the params array into the function call
            const response = await apiFunc(...params);

            // Standardizing for your backend which returns result.rows
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "An API error occurred");
        } finally {
            setLoading(false);
        }
    }, [apiFunc, JSON.stringify(params)]); // Dependency check on stringified params

    useEffect(() => {
        execute();
    }, [execute]);

    return { data, loading, error, refetch: execute };
};