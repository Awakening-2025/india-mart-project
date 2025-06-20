// src/components/profile/UpdateProfileForm.jsx
import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/apiService';
import { Loader2 } from 'lucide-react';

const UpdateProfileForm = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = await authService.updateProfile(user.id, formData);
            onUpdate(updatedUser.data); // Update the user state in the parent and AuthContext
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            showToast('Failed to update profile.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>First Name</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                </div>
                <div>
                    <label>Last Name</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                </div>
            </div>
            <div>
                <label>Phone Number</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full p-2 border rounded" rows="3"></textarea>
            </div>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </button>
        </form>
    );
};

export default UpdateProfileForm;