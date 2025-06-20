// src/components/profile/ChangePasswordForm.jsx
import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/apiService';
import { Loader2 } from 'lucide-react';

const ChangePasswordForm = ({ userId }) => {
    const [passwords, setPasswords] = useState({ old_password: '', new_password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new_password.length < 8) {
            showToast('New password must be at least 8 characters long.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await authService.changePassword(userId, passwords);
            showToast('Password changed successfully!', 'success');
            setPasswords({ old_password: '', new_password: '' }); // Reset form
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to change password.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold">Change Password</h3>
            <div>
                <label>Old Password</label>
                <input type="password" name="old_password" value={passwords.old_password} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
                <label>New Password</label>
                <input type="password" name="new_password" value={passwords.new_password} onChange={handleChange} required className="mt-1 w-full p-2 border rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
            </button>
        </form>
    );
};

export default ChangePasswordForm;