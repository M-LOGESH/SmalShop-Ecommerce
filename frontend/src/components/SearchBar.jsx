import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex">
            <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-1 pr-10 focus:border-transparent focus:ring-0 focus:outline-none"
            />
            <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                <FiSearch className="h-5 w-5" />
            </button>
        </form>
    );
}

export default SearchBar;
