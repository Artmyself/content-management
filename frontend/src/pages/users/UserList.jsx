import React, { useState, useMemo, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch.js';
import Table from '../../components/Common/Table.jsx';
import Pagination from '../../components/Common/Pagination.jsx';
import Modal from '../../components/Common/Modal.jsx';
import api from '../../api/axiosInstance.js';
import { UserPlus, Edit, Trash2, Download, Upload } from 'lucide-react';

import { useApi } from '../../hooks/useApi.js';
import { UserService } from '../../api/userService.js';

const UserList = () => {

    // 2. Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(''); // Value after delay
    const [page, setPage] = useState(1);

    // 1. Fetch the data once
    const { data, loading, refetch } = useApi(UserService.list, [searchTerm, page]);

    // 3. Modal & Form States
    const [isModalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'artist_manager'
    });


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(handler); // Cleanup timeout on next keystroke
    }, [searchTerm]);

    // FILTER LOGIC: Uses the debounced value
    const filteredUsers = useMemo(() => {
        const sourceData = data || [];
        if (!debouncedSearch.trim()) return sourceData;

        const lowerSearch = debouncedSearch.toLowerCase();
        return sourceData.filter(user =>
            user.full_name?.toLowerCase().includes(lowerSearch) ||
            user.email?.toLowerCase().includes(lowerSearch)
        );
    }, [data, debouncedSearch]);

    const handleEdit = (user) => {
        setEditId(user.id);
        setFormData({ full_name: user.full_name, email: user.email, role: user.role, password: '' });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await api.delete(`/users/${id}`);
            refetch();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) await api.put(`/users/${editId}`, formData);
            else await api.post('/users', formData);

            setModalOpen(false);
            setEditId(null);
            setFormData({ full_name: '', email: '', password: '', role: 'artist_manager' });
            refetch();
        } catch (err) {
            alert(err.response?.data?.error || "Action failed");
        }
    };

    const columns = [
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email Address' },
        {
            label: 'Role',
            render: (r) => (
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {r.role.replace('_', ' ')}
                </span>
            )
        },
        {
            label: 'Actions',
            render: (user) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    // --- LOGIC: Export ---
    // const handleExport = async () => {
    //     try {
    //         const response = await UserService.exportCSV();
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'system_users.csv');
    //         document.body.appendChild(link);
    //         link.click();
    //     } catch (err) { alert("Export failed"); }
    // };

    // // --- LOGIC: Import ---
    // const handleImport = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const formData = new FormData();
    //     formData.append('file', file);

    //     try {
    //         await UserService.importCSV(formData);
    //         alert("Users imported successfully");
    //         refetch();
    //     } catch (err) { alert("Import failed: " + err.response?.data?.error); }
    // };


    return (
        <div className="space-y-6">
            {/* The Table component receives the filteredData and the setter for search */}
            <Table
                title="User Management"
                columns={columns}
                data={filteredUsers} // Use filtered list
                loading={loading}
                onSearch={(val) => setSearchTerm(val)}
                actions={
                    <div className="flex gap-2">
                        {/* Export Button */}
                        {/* <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
                        >
                            <Download size={18} /> Export
                        </button>

                        <label className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 transition-all cursor-pointer">
                            <Upload size={18} /> Import
                            <input type="file" className="hidden" accept=".csv" onChange={handleImport} />
                        </label> */}

                        {/* Add User Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                        >
                            <UserPlus size={18} /> Add User
                        </button>
                    </div>
                }
            />

            <Pagination
                current={page}
                totalPages={Math.ceil((data.total || 0) / 10)}
                onChange={(p) => setPage(p)}
            />
            {/* <Table
                title="System User Management"
                columns={columns}
                data={filteredData} // IMPORTANT: Use filteredData instead of data
                loading={loading}
                onSearch={(value) => setSearchTerm(value)} // Wire up search input
                actions={
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100"
                    >
                        <UserPlus size={18} /> Add User
                    </button>
                }
            /> */}

            {/* Modal for Create/Edit */}
            <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setEditId(null); }} title={editId ? "Edit User Account" : "Register New User"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                        <input
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                        />
                    </div>
                    {!editId && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="artist_manager">Artist Manager</option>
                            <option value="artist">Artist</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-700 transition-colors">
                        {editId ? "Save Changes" : "Create Account"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default UserList;