import { useState, useMemo } from 'react';

export const useSearch = (data, searchKey) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item =>
            item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm, searchKey]);

    return { searchTerm, setSearchTerm, filteredData };
};