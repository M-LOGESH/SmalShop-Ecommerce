import React, { useState, useEffect, useRef } from 'react';

function ScrollableDropdown({
    options = [],
    value,
    onChange,
    placeholder = 'Select',
    allLabel = 'All',
    className = 'w-48',
    disabled = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full border px-2 py-2 text-left ${
                    disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'
                }`}
            >
                {value || placeholder}
            </button>

            {isOpen && (
                <ul className="absolute z-10 max-h-40 w-full overflow-y-auto rounded border bg-white shadow-md">
                    <li
                        className="cursor-pointer px-2 hover:bg-violet-200"
                        onClick={() => {
                            onChange('');
                            setIsOpen(false);
                        }}
                    >
                        {allLabel}
                    </li>
                    {options.map((opt, idx) => (
                        <li
                            key={idx}
                            className="cursor-pointer p-2 hover:bg-violet-200"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ScrollableDropdown;
