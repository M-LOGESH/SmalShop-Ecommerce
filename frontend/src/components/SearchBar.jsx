import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex">
            <input
                type="text"
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="border border-gray-300 rounded-2xl px-3 py-1 pr-10 bg-white w-full focus:outline-none focus:ring-0 focus:border-transparent"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                <FiSearch className="h-5 w-5" />
            </button>
        </form>
    );
}

export default SearchBar;
