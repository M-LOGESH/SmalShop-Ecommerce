import React, { useState, useEffect, useRef } from 'react';

function ScrollableDropdown({
    options = [],
    value,
    onChange,
    placeholder = 'Select',
    allLabel = 'All',
    className = 'w-40',
    disabled = false,
    buttonPadding = 'px-2 py-2',
    itemPadding = 'px-2 py-2',  
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
                className={`w-full border text-left ${buttonPadding} ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
            >
                {value || placeholder}
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
