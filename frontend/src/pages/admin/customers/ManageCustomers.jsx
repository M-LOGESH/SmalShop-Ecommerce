import React from 'react';
import { useAdminUsers } from '../../../context/AdminUsersContext.jsx';
import CustomersTable from './CustomersTable.jsx';

function ManageCustomers() {
    const { allUsers, loading, error } = useAdminUsers();

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
                <h1 className="text-2xl font-bold mb-6">Manage Customers</h1>
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
            <CustomersTable users={allUsers} />
        </div>
    );
}

export default ManageCustomers;