import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import api from '../../api/axiosInstance.js';
import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login({ name: data.name, role: data.role }, data.token);
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h1>
                <p className="text-slate-500 mb-8">Manage your artists and songs collection.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input type="email" required className="w-full p-3 border rounded-xl" onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input type="password" required className="w-full p-3 border rounded-xl" onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-slate-300">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                    <p className="text-center text-slate-500 text-sm">
                        New user? <Link to="/register" className="text-blue-600 font-bold">Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default Login;