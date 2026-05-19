import React, { useState } from 'react';
import Sidebar from '../../components/Common/Sidebar.jsx';
import Navbar from '../../components/Common/Navbar.jsx';
import UserList from '../users/UserList.jsx';
import ArtistList from '../artists/ArtistList.jsx';
import SongList from '../artists/SongList.jsx';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('artists');
    const [selectedArtist, setSelectedArtist] = useState(null);

    // Function to navigate from Artist list to Song list
    const handleViewSongs = (artist) => {
        setSelectedArtist(artist);
        setActiveTab('songs');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserList />;
            case 'artists':
                return <ArtistList onViewSongs={handleViewSongs} />;
            case 'songs':
                return (
                    <SongList
                        artistId={selectedArtist?.id}
                        artistName={selectedArtist?.name}
                        onBack={() => setActiveTab('artists')}
                    />
                );
            default:
                return null;
        }
    };

    return (

        <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
            <Navbar />
            <div className="flex flex-1 flex-row overflow-hidden">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;