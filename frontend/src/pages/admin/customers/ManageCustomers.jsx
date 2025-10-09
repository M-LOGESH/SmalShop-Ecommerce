import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import CustomersTable from './CustomersTable.jsx';

function ManageCustomers() {
    const { fetchWithAuth, user } = useAuth();
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all users data
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchWithAuth('http://127.0.0.1:8000/api/users/all/');
                if (res.ok) {
                    const data = await res.json();
                    setUsersData(data);
                } else {
                    setError('Failed to load users data');
                }
            } catch (err) {
                console.error('Error loading users:', err);
                setError('Error loading users data');
            } finally {
                setLoading(false);
            }
        };
        
        loadUsers();
    }, [fetchWithAuth]);

    if (loading) {
        return (
            <div className="min-h-120 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-600">{error}</p>
                    <p className="text-sm text-red-500 mt-2">
                        Make sure your backend has an endpoint at /api/users/all/ that returns all users with their profiles.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Customers</h1>            
            <CustomersTable users={usersData} user={user} />
        </div>
    );
}

export default ManageCustomers;