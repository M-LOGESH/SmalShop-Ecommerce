import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaEnvelope, FaPhone, FaVenusMars,  FaEye } from 'react-icons/fa';
import ScrollableDropdown from '../../../components/ScrollableDropdown';

function CustomersTable({ users, user: currentUser }) {
    const navigate = useNavigate();
    const [activeMode, setActiveMode] = useState('users'); // 'users' or 'staff'
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Filter users based on active mode - FIXED: properly separate users and staff
    const filteredUsers = users.filter((user) => {
        if (activeMode === 'staff') {
            return user.is_staff || user.is_superuser;
        } else {
            // Only show non-staff, non-superuser in users tab
            return !user.is_staff && !user.is_superuser;
        }
    });

    // Calculate age from date of birth
    const calculateAge = (dobString) => {
        if (!dobString) return '-';
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Search and filter logic
    let displayUsers = filteredUsers.filter((user) => {
        const username = user.username?.toLowerCase() || '';
        const fullName = user.profile?.full_name?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        
        return (
            username.includes(searchTerm.toLowerCase()) ||
            fullName.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase())
        );
    });

    // Sorting logic
    if (sortBy === 'name-asc') {
        displayUsers = [...displayUsers].sort((a, b) => 
            (a.profile?.full_name || a.username).localeCompare(b.profile?.full_name || b.username)
        );
    } else if (sortBy === 'name-desc') {
        displayUsers = [...displayUsers].sort((a, b) => 
            (b.profile?.full_name || b.username).localeCompare(a.profile?.full_name || a.username)
        );
    } else if (sortBy === 'age-asc') {
        displayUsers = [...displayUsers].sort((a, b) => 
            calculateAge(a.profile?.dob) - calculateAge(b.profile?.dob)
        );
    } else if (sortBy === 'age-desc') {
        displayUsers = [...displayUsers].sort((a, b) => 
            calculateAge(b.profile?.dob) - calculateAge(a.profile?.dob)
        );
    } else if (sortBy === 'date-asc') {
        displayUsers = [...displayUsers].sort((a, b) => 
            new Date(a.date_joined) - new Date(b.date_joined)
        );
    } else if (sortBy === 'date-desc') {
        displayUsers = [...displayUsers].sort((a, b) => 
            new Date(b.date_joined) - new Date(a.date_joined)
        );
    }


const handleViewUser = (user) => {
    navigate(`/admin/customers/${user.id}`, { 
        state: { customer: user } 
    });
};

    if (!filteredUsers.length) {
        return (
            <div className="text-center p-8 text-gray-500">
                <div className="text-4xl mb-2">
                    {activeMode === 'users' ? <FaUser /> : <FaUserShield />}
                </div>
                <p>No {activeMode} found.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Mode Toggle Buttons */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setActiveMode('users')}
                    className={`flex items-center gap-2 px-4 py-2 font-medium ${
                        activeMode === 'users'
                            ? 'border-b-2 border-violet-500 text-violet-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaUser />
                    Users ({users.filter(u => !u.is_staff && !u.is_superuser).length})
                </button>
                <button
                    onClick={() => setActiveMode('staff')}
                    className={`flex items-center gap-2 px-4 py-2 font-medium ${
                        activeMode === 'staff'
                            ? 'border-b-2 border-purple-500 text-purple-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaUserShield />
                    Staff ({users.filter(u => u.is_staff || u.is_superuser).length})
                </button>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="Search by username, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-[200px] rounded border border-gray-400 px-3 py-1 sm:py-2 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />

                <ScrollableDropdown
                    options={[
                        'Name: A to Z',
                        'Name: Z to A',
                        'Age: Low to High',
                        'Age: High to Low',
                        'Newest First',
                        'Oldest First'
                    ]}
                    value={
                        sortBy === 'name-asc' ? 'Name: A to Z' :
                        sortBy === 'name-desc' ? 'Name: Z to A' :
                        sortBy === 'age-asc' ? 'Age: Low to High' :
                        sortBy === 'age-desc' ? 'Age: High to Low' :
                        sortBy === 'date-desc' ? 'Newest First' :
                        sortBy === 'date-asc' ? 'Oldest First' : ''
                    }
                    onChange={(val) => {
                        if (val === 'Name: A to Z') setSortBy('name-asc');
                        else if (val === 'Name: Z to A') setSortBy('name-desc');
                        else if (val === 'Age: Low to High') setSortBy('age-asc');
                        else if (val === 'Age: High to Low') setSortBy('age-desc');
                        else if (val === 'Newest First') setSortBy('date-desc');
                        else if (val === 'Oldest First') setSortBy('date-asc');
                        else setSortBy('');
                    }}
                    placeholder="Sort by"
                    buttonPadding="px-3 py-1 sm:py-2 rounded border border-gray-300"
                    itemPadding="px-3 py-1 sm:py-2"
                    maxHeight="12rem"
                />
            </div>

            {/* Users Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {displayUsers.length} of {filteredUsers.length} {activeMode}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Full Name</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Gender</th>
                            <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-900">Age</th>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                            <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {displayUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        {user.is_superuser ? (
                                            <FaUserShield className="text-red-500" title="Superuser" />
                                        ) : user.is_staff ? (
                                            <FaUserShield className="text-purple-500" title="Staff" />
                                        ) : (
                                            <FaUser className="text-violet-500" title="User" />
                                        )}
                                        {user.username}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                    {user.profile?.full_name || '-'}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-gray-400" size={12} />
                                        {user.email || '-'}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                    {user.profile?.mobile ? (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400" size={12} />
                                            {user.profile.mobile}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                    {user.profile?.gender ? (
                                        <div className="flex items-center gap-2 capitalize">
                                            <FaVenusMars className="text-gray-400" size={12} />
                                            {user.profile.gender}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-900">
                                    {user.profile?.dob ? (
                                        <div className="flex items-center justify-center gap-1">
                                            <span>{calculateAge(user.profile.dob)}</span>
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        user.is_superuser 
                                            ? 'bg-red-100 text-red-800'
                                            : user.is_staff
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                        title="View User Details"
                                    >
                                        <FaEye size={12} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {displayUsers.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                        No {activeMode} found matching your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomersTable;