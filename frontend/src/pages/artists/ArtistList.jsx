import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { ArtistService } from '../../api/artistService.js';
import Table from '../../components/Common/Table.jsx';
import Modal from '../../components/Common/Modal.jsx';
import Pagination from '../../components/Common/Pagination.jsx';
import { Plus, Mic2, Calendar, MapPin, User, Music } from 'lucide-react';

const ArtistList = ({ onViewSongs }) => {
    const { user } = useContext(AuthContext);

    // States for Search and Pagination
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Debounce Search: Only triggers API hit after 600ms of no typing
    const debouncedSearch = useDebounce(search, 600);

    // 2. API Call: useApi will automatically refetch when debouncedSearch or page changes
    const { data, loading, refetch } = useApi(ArtistService.list, [debouncedSearch, page]);

    // 3. Form State for New Artist
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: 'm',
        address: '',
        first_release_year: new Date().getFullYear(),
        no_of_albums_released: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ArtistService.create(formData);
            alert("Artist record created successfully!");
            setModalOpen(false);
            setFormData({ name: '', dob: '', gender: 'm', address: '', first_release_year: 2024, no_of_albums_released: 0 });
            refetch();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create artist");
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Artist Name' },
        {
            key: 'dob',
            label: 'Date of Birth',
            render: (r) => r.dob ? new Date(r.dob).toLocaleDateString() : 'N/A'
        },
        {
            key: 'gender',
            label: 'Gender',
            render: (r) => <span className="capitalize">{r.gender === 'm' ? 'Male' : r.gender === 'f' ? 'Female' : 'Other'}</span>
        },
        { key: 'first_release_year', label: 'Debut Year' },
        { key: 'no_of_albums_released', label: 'Albums' },
        {
            label: 'Actions',
            render: (r) => (
                <button
                    onClick={() => onViewSongs(r)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-tight transition-colors"
                >
                    <Music size={14} /> View Songs
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <Table
                title="Artist Management"
                columns={columns}
                data={data.data || []}
                loading={loading}
                // Input updates 'search' instantly, but useApi waits for 'debouncedSearch'
                onSearch={(val) => { setSearch(val); setPage(1); }}
                actions={
                    user?.role === 'artist_manager' && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Add Artist
                        </button>
                    )
                }
            />

            {/* Pagination Component */}
            <Pagination
                current={page}
                totalPages={Math.ceil((data.total || 0) / 10)}
                onChange={(p) => setPage(p)}
            />

            {/* Create Artist Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Register New Artist">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Artist Name</label>
                            <div className="relative">
                                <Mic2 className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" placeholder="Stage Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="date" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 appearance-none" onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="m">Male</option>
                                    <option value="f">Female</option>
                                    <option value="o">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" placeholder="Current Address" onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Debut Year</label>
                            <input type="number" required className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" value={formData.first_release_year} onChange={e => setFormData({ ...formData, first_release_year: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Albums Released</label>
                            <input type="number" required className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" value={formData.no_of_albums_released} onChange={e => setFormData({ ...formData, no_of_albums_released: e.target.value })} />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button disabled={isSubmitting} type="submit" className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            {isSubmitting ? "Processing..." : "Create Artist Record"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ArtistList;