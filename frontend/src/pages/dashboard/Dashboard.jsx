import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import Navbar from '../../components/Common/Navbar.jsx';
import Sidebar from '../../components/Common/Sidebar.jsx';
import UserList from '../users/UserList.jsx';
import ArtistList from '../artists/ArtistList.jsx';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // Set initial tab based on role
    // Super admin starts at Users, Manager starts at Artists
    const [activeTab, setActiveTab] = useState(
        user?.role === 'super_admin' ? 'users' : 'artists'
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserList />;
            case 'artists':
                return <ArtistList />;
            default:
                return <div className="p-10 text-slate-400">Select an option from the sidebar</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-black text-slate-800 capitalize">
                                {activeTab} Management
                            </h1>
                            <p className="text-slate-500 text-sm">
                                View and manage system {activeTab} records.
                            </p>
                        </div>

                        {/* Page Content */}
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;