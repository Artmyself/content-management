import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch.js';
import Table from '../../components/Common/Table.jsx';
import Modal from '../../components/Common/Modal.jsx';
import api from '../../api/axiosInstance.js';
import { UserPlus, Edit, Mail, Lock, User as UserIcon, Trash2 } from 'lucide-react';

const UserList = () => {
    const { data, loading, refetch } = useFetch('/users');

    const [editId, setEditId] = useState(null);

    const [isModalOpen, setModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // 3. Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'artist_manager'
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Create User Logic (API Call)
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (editId) {
                // Triggers UserCtrl.update
                await api.put(`/users/${editId}`, formData);
                alert("User updated successfully!");
            } else {
                // Triggers UserCtrl.create
                await api.post('/users', formData);
                alert("User created successfully!");
            }

            closeModal();
            refetch(); // Refresh list to show changes
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create user account");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Delete Logic (Added for completeness)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/users/${id}`);
                refetch();
            } catch (err) {
                alert("Error deleting user");
            }
        }
    };
    const handleEditClick = (user) => {
        setEditId(user.id);
        setFormData({
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            password: '' // Keep password empty for updates unless changing it
        });
        setModalOpen(true);
    };

    const columns = [
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        {
            label: 'Role',
            render: (r) => (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-black uppercase">
                    {r.role.replace('_', ' ')}
                </span>
            )
        },
        {
            label: 'Actions',
            render: (r) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEditClick(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Table Header with Add Button */}
            <Table
                title={editId ? "Update User Account" : "New User Account"}
                columns={columns}
                data={data}
                loading={loading}
                onSearch={() => { }}
                actions={
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200"
                    >
                        <UserPlus size={18} /> Add User
                    </button>
                }
            />

            {/* Create User Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New User Account">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-3 text-slate-400" size={18} />
                            <input
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-slate-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
                                placeholder="Temporary password"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">System Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 font-medium"
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="artist_manager">Artist Manager</option>
                            <option value="artist">Artist</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="flex-1 py-3 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-slate-300"
                        >
                            {isSubmitting ? "Processing..." : editId ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserList;