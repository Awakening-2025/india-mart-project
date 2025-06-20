// src/pages/ProfilePage.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
    // We get the user object and a way to update it from our AuthContext
    const { user, loading, updateUserContext } = useAuth();

    // If still loading auth state, show a loader
    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;
    }

    // If user is not authenticated, redirect them to the home page
    if (!user) {
        return <Navigate to="/" />;
    }

    const handleProfileUpdate = (updatedUserData) => {
        // This function updates the user data in the global AuthContext
        updateUserContext(updatedUserData);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 my-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <UpdateProfileForm user={user} onUpdate={handleProfileUpdate} />
                <ChangePasswordForm userId={user.id} />
            </div>
        </div>
    );
};

export default ProfilePage;