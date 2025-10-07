import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function ScrollableDropdown({
    options = [],
    value,
    onChange,
    placeholder = 'Select',
    allLabel = 'All',
    className = 'min-w-40 max-w-50',
    disabled = false,
    buttonPadding = 'px-2 py-2',
    itemPadding = 'px-2 py-1',  
    maxHeight = '10rem',       
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
                className={`w-full border flex items-center rounded justify-between ${buttonPadding} ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
            >
                <span>{value || placeholder}</span>
                <FaChevronDown className={`ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 w-full overflow-y-auto rounded border bg-white shadow-md"
                    style={{ maxHeight }}
                >
                    <li
                        className={`cursor-pointer ${itemPadding} hover:bg-violet-200`}
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
                            className={`cursor-pointer ${itemPadding} hover:bg-violet-200`}
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
