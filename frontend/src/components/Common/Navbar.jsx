import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { LogOut, Music } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Music className="text-blue-400" />
                    <span>Artist Panel</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        {user?.role.replace('_', ' ')}: {user?.name}
                    </span>
                    <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;