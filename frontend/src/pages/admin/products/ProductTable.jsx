import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from 'react-icons/fa';
import ScrollableDropdown from '../../../components/ScrollableDropdown';

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
        <div>
            {/* Toggle Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                {['default', 'subcategories', 'extra'].map((tab) => (
                    <button
                        key={tab}
                        className={`rounded px-3 py-1 ${
                            activeTable === tab ? 'bg-violet-500 text-white' : 'bg-gray-200'
                        }`}
                        onClick={() => setActiveTable(tab)}
                    >
                        {tab === 'default'
                            ? 'Default'
                            : tab === 'subcategories'
                              ? 'Subcategories'
                              : 'Detail'}
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <input
                    name="searchProducts"
                    type="text"
                    placeholder="Search"
                    className="min-w-31 max-w-60 flex-1 rounded border p-1 pl-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {activeTable === 'default' && (
                    <div className="ml-auto">
                        <ScrollableDropdown
                            options={uniqueCategories}
                            value={filterCategory}
                            onChange={setFilterCategory}
                            placeholder="Select Category"
                            buttonPadding="px-2 py-1 rounded"
                            itemPadding="px-2 py-1"
                            maxHeight="12rem"
                        />
                    </div>
                )}

                {activeTable === 'subcategories' && (
                    <div className="ml-auto">
                        <ScrollableDropdown
                            options={uniqueSubcategories}
                            value={filterSubcategory}
                            onChange={setFilterSubcategory}
                            placeholder="Select Subcategory"
                            buttonPadding="px-2 py-1 rounded"
                            itemPadding="px-2 py-1"
                            maxHeight="12rem"
                        />
                    </div>
                )}

                {activeTable === 'extra' && (
                    <div className="ml-auto">
                        <ScrollableDropdown
                            options={uniqueBrands}
                            value={filterBrand}
                            onChange={setFilterBrand}
                            placeholder="Select Brand"
                            buttonPadding="px-2 py-1 rounded"
                            itemPadding="px-2 py-1"
                            maxHeight="12rem"
                        />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Category</th>
                            {activeTable === 'default' && (
                                <>
                                    <th className="border p-2">Cost</th>
                                    <th className="border p-2">Retail</th>
                                    <th className="border p-2">Selling</th>
                                </>
                            )}
                            {activeTable === 'subcategories' && (
                                <th className="border p-2">Subcategories</th>
                            )}
                            {activeTable === 'extra' && (
                                <>
                                    <th className="border p-2">Description</th>
                                    <th className="border p-2">Brand</th>
                                    <th className="border p-2">Manufacturer</th>
                                </>
                            )}
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="border p-2">
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="mx-auto h-16 w-16 object-cover"
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td className="border p-2">
                                    {p.name}
                                    <br />
                                    {p.quantity}
                                </td>
                                <td className="border p-2">{p.category?.name}</td>

                                {activeTable === 'default' && (
                                    <>
                                        <td className="border p-2">{p.cost_price ?? '-'}</td>
                                        <td className="border p-2">{p.retail_price ?? '-'}</td>
                                        <td className="border p-2">{p.selling_price ?? '-'}</td>
                                    </>
                                )}

                                {activeTable === 'subcategories' && (
                                    <td className="border p-2">
                                        {p.subcategories?.map((sc) => sc.name).join(', ') || '-'}
                                    </td>
                                )}

                                {activeTable === 'extra' && (
                                    <>
                                        <td className="border p-2">{p.description ?? '-'}</td>
                                        <td className="border p-2">{p.brand ?? '-'}</td>
                                        <td className="border p-2">{p.manufacturer ?? '-'}</td>
                                    </>
                                )}

                                <td className="border p-2 text-center">
                                    {p.stock_status === 'in_stock' ? (
                                        <span className="text-xl text-green-600">
                                            <FaCheckCircle className="mx-auto" />
                                        </span>
                                    ) : (
                                        <span className="text-xl text-red-600">
                                            <FaTimesCircle className="mx-auto" />
                                        </span>
                                    )}
                                </td>

                                <td className="border p-2 text-center">
                                    <div className="inline-flex gap-2">
                                        <button
                                            onClick={() => {
                                                onEdit(p);
                                                window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top
                                            }}
                                            className="flex items-center gap-1 rounded bg-yellow-500 px-2 py-1 text-white"
                                        >
                                            <FaEdit />
                                            <span className="2md:inline hidden">Edit</span>
                                        </button>

                                        <button
                                            onClick={() => onDelete(p.id)}
                                            disabled={!user?.is_superuser}
                                            className={`flex items-center gap-1 rounded px-2 py-1 text-white ${
                                                user?.is_superuser
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'cursor-not-allowed bg-gray-400'
                                            }`}
                                        >
                                            <FaTrash />
                                            <span className="2md:inline hidden">Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductTable;
