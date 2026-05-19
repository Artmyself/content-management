import React from 'react';
import { useApi } from '../../hooks/useApi.js';
import Table from '../../components/Common/Table.jsx';
import { Users, Mic2, Music } from 'lucide-react';

const Overview = () => {
    const { data, loading } = useApi(() => api.get('/dashboard/stats'));

    const stats = [
        { label: 'Total Users', value: data?.users, icon: <Users />, color: 'bg-blue-500' },
        { label: 'Total Artists', value: data?.artists, icon: <Mic2 />, color: 'bg-emerald-500' },
        { label: 'Total Songs', value: data?.songs, icon: <Music />, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(s => (
                    <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className={`${s.color} p-4 rounded-2xl text-white`}>{s.icon}</div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase">{s.label}</p>
                            <p className="text-3xl font-black text-slate-800">{loading ? '...' : s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Table
                title="Recently Added Music"
                columns={[
                    { key: 'title', label: 'Song' },
                    { key: 'artist_name', label: 'Artist' },
                    { key: 'genre', label: 'Genre' },
                    { key: 'created_at', label: 'Date', render: r => new Date(r.created_at).toLocaleDateString() }
                ]}
                data={data?.latestSongs || []}
                loading={loading}
                onSearch={() => { }}
            />
        </div>
    );
};
export default Overview;