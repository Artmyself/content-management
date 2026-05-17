import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance.js';
import Table from '../../components/Common/Table.jsx';
import { useSearch } from '../../hooks/useSearch.js';
import { Download, Upload, Plus } from 'lucide-react';

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const { searchTerm, setSearchTerm, filteredData } = useSearch(artists, 'name');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        const res = await api.get('/artists');
        setArtists(res.data);
    };

    const handleExport = async () => {
        const response = await api.get('/artists/export', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'artists.csv');
        document.body.appendChild(link);
        link.click();
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'dob', label: 'D.O.B' },
        { key: 'gender', label: 'Gender' },
        { key: 'no_of_albums_released', label: 'Albums' },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <button className="text-blue-600 hover:underline">View Songs</button>
            )
        }
    ];

    return (
        <Table
            title="Artist Management"
            columns={columns}
            data={filteredData}
            onSearch={setSearchTerm}
            actions={
                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded text-sm">
                        <Download size={16} /> Export
                    </button>
                    <label className="flex items-center gap-1 bg-orange-500 text-white px-3 py-2 rounded text-sm cursor-pointer">
                        <Upload size={16} /> Import
                        <input type="file" className="hidden" onChange={(e) => {/* Handle CSV Upload */ }} />
                    </label>
                    <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded text-sm">
                        <Plus size={16} /> Add Artist
                    </button>
                </div>
            }
        />
    );
};

export default ArtistList;