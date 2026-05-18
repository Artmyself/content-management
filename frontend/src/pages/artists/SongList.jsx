import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi.js';
import { MusicService } from '../../api/musicService.js';
import Table from '../../components/Common/Table.jsx';
import Modal from '../../components/Common/Modal.jsx';
import { Music, Plus, ArrowLeft, Disc, Tag } from 'lucide-react';

const SongList = ({ artistId, artistName, onBack }) => {
    // If no artist selected, show a prompt
    if (!artistId) return (
        <div className="text-center p-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Music className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Please select an artist to view their music collection.</p>
            <button onClick={onBack} className="mt-4 text-blue-600 font-bold">Go to Artists</button>
        </div>
    );

    const { data, loading, refetch } = useApi(MusicService.getByArtist, [artistId]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', album_name: '', genre: 'rock', artist_id: artistId });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MusicService.create({ ...formData, artist_id: artistId });
            setModalOpen(false);
            setFormData({ title: '', album_name: '', genre: 'rock' });
            refetch();
        } catch (err) { alert("Error adding song"); }
    };

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'album_name', label: 'Album' },
        {
            key: 'genre',
            label: 'Genre',
            render: (r) => <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{r.genre}</span>
        }
    ];

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Artist List
            </button>

            <Table
                title={`Music Collection: ${artistName}`}
                columns={columns}
                data={data}
                loading={loading}
                onSearch={() => { }}
                actions={
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200">
                        <Plus size={18} /> Add Song
                    </button>
                }
            />

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Add Song for ${artistName}`}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Song Title</label>
                        <div className="relative">
                            <Music className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input required className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl" placeholder="Song Title" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Album Name</label>
                        <div className="relative">
                            <Disc className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input required className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl" placeholder="Album Name" onChange={e => setFormData({ ...formData, album_name: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Genre</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <select className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl appearance-none" onChange={e => setFormData({ ...formData, genre: e.target.value })}>
                                <option value="rnb">RnB</option>
                                <option value="country">Country</option>
                                <option value="classic">Classic</option>
                                <option value="rock">Rock</option>
                                <option value="jazz">Jazz</option>
                            </select>
                        </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200">
                        Add to Collection
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default SongList;