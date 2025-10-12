import React, { useState } from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaEdit,
    FaTrash,
    FaImage_url,
    FaBox,
    FaTags,
    FaInfoCircle,
} from 'react-icons/fa';
import ScrollableDropdown from '../../../components/common/ScrollableDropdown';

function ProductTable({ products, onEdit, onDelete, user }) {
    const [activeTable, setActiveTable] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSubcategory, setFilterSubcategory] = useState('');
    const [filterBrand, setFilterBrand] = useState('');

    const uniqueCategories = [...new Set(products.map((p) => p.category?.name).filter(Boolean))];
    const uniqueSubcategories = [
        ...new Set(products.flatMap((p) => p.subcategories?.map((sc) => sc.name) || [])),
    ];
    const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTable === 'default' && filterCategory) return p.category?.name === filterCategory;
        if (activeTable === 'subcategories' && filterSubcategory)
            return p.subcategories?.some((sc) => sc.name === filterSubcategory);
        if (activeTable === 'extra' && filterBrand) return p.brand === filterBrand;

        return true;
    });

    return (
        <div className="w-full">
            {/* Toggle Buttons - Alternative approach */}
            <div className="mb-6 flex gap-1 overflow-x-auto">
                {[
                    { key: 'default', label: 'Overview', icon: <FaBox /> },
                    { key: 'subcategories', label: 'Categories', icon: <FaTags /> },
                    { key: 'extra', label: 'Details', icon: <FaInfoCircle /> },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTable(tab.key)}
                        className={`flex flex-shrink-0 items-center gap-2 px-3 py-1 font-medium whitespace-nowrap sm:py-2 ${
                            activeTable === tab.key
                                ? 'border-b-2 border-violet-500 text-violet-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.icon}
                        {/* Desktop: always show text */}
                        <span className="hidden sm:inline">{tab.label}</span>
                        {/* Mobile: only show text when active with transition */}
                        <span
                            className={`overflow-hidden transition-all duration-300 sm:hidden ${
                                activeTable === tab.key
                                    ? 'max-w-[100px] opacity-100'
                                    : 'max-w-0 opacity-0'
                            }`}
                        >
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>
            {/* Search and Filters - Modern Design */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="min-w-[200px] flex-1 rounded border border-gray-400 px-3 py-1 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none sm:py-2"
                />

                {activeTable === 'default' && (
                    <ScrollableDropdown
                        options={uniqueCategories}
                        value={filterCategory}
                        onChange={setFilterCategory}
                        placeholder="Filter by Category"
                        buttonPadding="px-3 py-1 sm:py-2 rounded border border-gray-400"
                        itemPadding="px-3 py-1 sm:py-2"
                        maxHeight="12rem"
                    />
                )}

                {activeTable === 'subcategories' && (
                    <ScrollableDropdown
                        options={uniqueSubcategories}
                        value={filterSubcategory}
                        onChange={setFilterSubcategory}
                        placeholder="Filter by Subcategory"
                        buttonPadding="px-3 py-1 sm:py-2 rounded border border-gray-400"
                        itemPadding="px-3 py-1 sm:py-2"
                        maxHeight="12rem"
                    />
                )}

                {activeTable === 'extra' && (
                    <ScrollableDropdown
                        options={uniqueBrands}
                        value={filterBrand}
                        onChange={setFilterBrand}
                        placeholder="Filter by Brand"
                        buttonPadding="px-3 py-1 sm:py-2 rounded border border-gray-400"
                        itemPadding="px-3 py-1 sm:py-2"
                        maxHeight="12rem"
                    />
                )}
            </div>

            {/* Products Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
            </div>

            {/* Table - Modern Design */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                Product
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                Category
                            </th>

                            {activeTable === 'default' && (
                                <>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                        Cost
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                        Retail
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                        Selling
                                    </th>
                                </>
                            )}

                            {activeTable === 'subcategories' && (
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Subcategories
                                </th>
                            )}

                            {activeTable === 'extra' && (
                                <>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Brand
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Manufacturer
                                    </th>
                                </>
                            )}

                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                Stock
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                {/* Product Column */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {p.image_url ? (
                                                <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                                    <FaImage_url className="text-gray-400" size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {p.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{p.quantity}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {p.category?.name || '-'}
                                </td>

                                {/* Default View */}
                                {activeTable === 'default' && (
                                    <>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                            ₹{p.cost_price ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                                            ₹{p.retail_price ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">
                                            ₹{p.selling_price ?? '-'}
                                        </td>
                                    </>
                                )}

                                {/* Subcategories View */}
                                {activeTable === 'subcategories' && (
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {p.subcategories?.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {p.subcategories.map((sc) => (
                                                    <span
                                                        key={sc.id}
                                                        className="inline-flex items-center text-sm"
                                                    >
                                                        {sc.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                )}

                                {/* Extra Details View */}
                                {activeTable === 'extra' && (
                                    <>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            <div className="max-w-xs truncate">
                                                {p.description || '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {p.brand || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {p.manufacturer || '-'}
                                        </td>
                                    </>
                                )}

                                {/* Stock Status */}
                                <td className="px-4 py-3 text-center">
                                    {p.stock_status === 'in_stock' ? (
                                        <div className="inline-flex items-center text-green-700">
                                            <FaCheckCircle size={18} />
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center text-red-700">
                                            <FaTimesCircle size={18} />
                                        </div>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-center">
                                    <div className="inline-flex gap-1">
                                        <button
                                            onClick={() => {
                                                onEdit(p);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="inline-flex items-center gap-1 rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                                            title="Edit Product"
                                        >
                                            <FaEdit size={12} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => onDelete(p.id)}
                                            disabled={!user?.is_superuser}
                                            className={`inline-flex items-center gap-1 rounded px-3 py-1 text-sm text-white ${
                                                user?.is_superuser
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'cursor-not-allowed bg-gray-400'
                                            }`}
                                            title={
                                                user?.is_superuser
                                                    ? 'Delete Product'
                                                    : 'Only superusers can delete products'
                                            }
                                        >
                                            <FaTrash size={12} />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <FaBox className="mx-auto mb-2 text-4xl text-gray-300" />
                        <p>No products found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductTable;
