import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { Users, Mic2, LayoutGrid } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { user } = useContext(AuthContext);

    // Menu logic: Define which roles see which tab
    const tabs = [
        {
            id: 'users',
            label: 'Users',
            icon: <Users size={20} />,
            roles: ['super_admin'] // Only Super Admin
        },
        {
            id: 'artists',
            label: 'Artists',
            icon: <Mic2 size={20} />,
            roles: ['super_admin', 'artist_manager'] // Admin and Manager
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] sticky top-16 flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-2 text-slate-400 mb-6 ml-2">
                    <LayoutGrid size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Management</span>
                </div>

                <nav className="space-y-2">
                    {tabs.map((tab) => {
                        // Check if current user role is allowed to see this tab
                        if (!tab.roles.includes(user?.role)) return null;

                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                {tab.icon}
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Profile Footer */}
            <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Active Session</p>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{user?.role.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;