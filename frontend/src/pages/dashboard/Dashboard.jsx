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
        <div className="flex min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex w-full pt-16">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;