import React from 'react';
import { useFetch } from '../../hooks/useFetch.js';
import Table from '../../components/Common/Table.jsx';
import { Plus, Music2 } from 'lucide-react';

const SongList = ({ artistId, artistName, onBack }) => {
    const { data, loading } = useFetch(`/music/${artistId}`);

    const columns = [
        { key: 'title', label: 'Song Title' },
        { key: 'album_name', label: 'Album' },
        { key: 'genre', label: 'Genre' },
        { key: 'created_at', label: 'Added Date' }
    ];

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-blue-600 font-bold">← Back to Artists</button>
            <Table
                title={`Songs by ${artistName}`}
                columns={columns}
                data={data}
                loading={loading}
                onSearch={() => { }}
                actions={<button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold"><Plus size={18} /> New Song</button>}
            />
        </div>
    );
};
export default SongList;