import React from 'react';
import Select from 'react-select';
import ScrollableDropdown from '../../../components/common/ScrollableDropdown';
import { useAuth } from '../../../context/AuthContext';

function ProductForm({
    formData,
    categories,
    subcategories,
    newCategory,
    newSubcategory,
    selectedCategoryForSub,
    editingProduct,
    handleChange,
    handleSubmit,
    handleAddCategory,
    handleAddSubcategory,
    setNewCategory,
    setNewSubcategory,
    setSelectedCategoryForSub,
    setFormData,
    loading,
}) {
    const { user } = useAuth();
    const isSuperuser = user?.is_superuser;

    return (
        <form onSubmit={handleSubmit} className="mx-auto mb-6 max-w-6xl">
            {/* Row 1: Name, Quantity, Stock Status */}
            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name ?? ''}
                    onChange={handleChange}
                    className="flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    autoComplete="name"
                    required
                />

                <div className="flex flex-1 flex-row flex-wrap gap-3">
                    <input
                        name="quantity"
                        placeholder="Quantity"
                        value={formData.quantity ?? ''}
                        onChange={handleChange}
                        className="order-2 min-w-16 flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />

                    <ScrollableDropdown
                        options={['In Stock', 'Out of Stock']}
                        value={formData.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        onChange={(val) =>
                            handleChange({
                                target: {
                                    name: 'stock_status',
                                    value: val === 'In Stock' ? 'in_stock' : 'out_of_stock',
                                },
                            })
                        }
                        placeholder="Select Stock Status"
                        className="order-3 flex-1"
                        allLabel={null}
                    />
                </div>
            </div>

            {/* Row 2: Cost Price, Retail Price, Selling Price */}
            <div className="mt-3 flex flex-row flex-wrap gap-3">
                <input
                    type="number"
                    name="cost_price"
                    placeholder="Cost Price"
                    value={formData.cost_price ?? ''}
                    onChange={handleChange}
                    className="min-w-16 flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <input
                    type="number"
                    name="retail_price"
                    placeholder="Retail Price"
                    value={formData.retail_price ?? ''}
                    onChange={handleChange}
                    className="min-w-16 flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <input
                    type="number"
                    name="selling_price"
                    placeholder="Selling Price"
                    value={formData.selling_price ?? ''}
                    onChange={handleChange}
                    className="min-w-16 flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
            </div>

            {/* Row 3 & 4: Category and Subcategory sections */}
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
                {/* Category Section */}
                <div className="flex flex-1 flex-col gap-2">
                    <Select
                        options={categories.map((c) => ({ value: c.id, label: c.name }))}
                        value={
                            categories
                                .filter((c) => c.id === formData.category_id)
                                .map((c) => ({ value: c.id, label: c.name }))[0] || null
                        }
                        onChange={(selectedOption) =>
                            setFormData({
                                ...formData,
                                category_id: selectedOption?.value || null,
                            })
                        }
                        className="flex-1"
                        classNamePrefix="select"
                        placeholder="Select category..."
                        isSearchable
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                border: '1px solid black',
                                boxShadow: 'none',
                                '&:hover': {
                                    border: '1px solid #7c3aed',
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                borderRadius: '0.2rem',
                                marginTop: '4px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 9999,
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? '#7c3aed'
                                    : state.isFocused
                                      ? '#ede9fe'
                                      : 'white',
                                color: state.isSelected ? 'white' : '#374151',
                                cursor: 'pointer',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: '#111827',
                                fontWeight: 500,
                            }),
                        }}
                    />
                    <div className="flex gap-2">
                        <input
                            name="newCategory"
                            placeholder="Add new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={!isSuperuser}
                            className={`rounded px-4 py-2 text-white ${
                                isSuperuser
                                    ? 'bg-violet-500 hover:bg-violet-600'
                                    : 'cursor-not-allowed bg-gray-400'
                            }`}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Subcategory Section */}
                <div className="flex flex-1 flex-col gap-2">
                    <Select
                        isMulti
                        options={subcategories.map((sc) => ({
                            value: sc.id,
                            label: sc.name,
                        }))}
                        value={subcategories
                            .filter((sc) => formData.subcategories_ids.includes(sc.id))
                            .map((sc) => ({ value: sc.id, label: sc.name }))}
                        onChange={(selectedOptions) => {
                            setFormData({
                                ...formData,
                                subcategories_ids: selectedOptions.map((o) => o.value),
                            });
                        }}
                        className="flex-1"
                        classNamePrefix="select"
                        placeholder="Select subcategories..."
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                border: '1px solid black',
                                boxShadow: 'none',
                                '&:hover': {
                                    border: '1px solid #7c3aed',
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                borderRadius: '0.2rem',
                                marginTop: '4px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 9999,
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? '#7c3aed'
                                    : state.isFocused
                                      ? '#ede9fe'
                                      : 'white',
                                color: state.isSelected ? 'white' : '#374151',
                                cursor: 'pointer',
                            }),
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: '#ede9fe',
                                borderRadius: '0.3rem',
                                padding: '2px 4px',
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: '#7c3aed',
                                fontWeight: 500,
                            }),
                            multiValueRemove: (base) => ({
                                ...base,
                                color: '#7c3aed',
                                ':hover': {
                                    backgroundColor: '#7c3aed',
                                    color: 'white',
                                },
                            }),
                        }}
                    />
                    <div className="flex gap-2">
                        <input
                            name="newSubcategory"
                            placeholder="Add new subcategory"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            className="flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddSubcategory}
                            disabled={!isSuperuser}
                            className={`rounded px-4 py-2 text-white ${
                                isSuperuser
                                    ? 'bg-violet-500 hover:bg-violet-600'
                                    : 'cursor-not-allowed bg-gray-400'
                            }`}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Row 5: Brand, Manufacturer */}
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
                <input
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand ?? ''}
                    onChange={handleChange}
                    className="flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <input
                    name="manufacturer"
                    placeholder="Manufacturer"
                    value={formData.manufacturer ?? ''}
                    onChange={handleChange}
                    className="flex-1 rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
            </div>

            {/* Row 6: Description */}
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description ?? ''}
                onChange={handleChange}
                className="mt-3 w-full rounded border p-2 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />

            {/* Image Preview */}
            {editingProduct && editingProduct.image_url && !formData.image && (
                <div className="mt-3">
                    <p className="text-sm font-medium">Current Image:</p>
                    <img
                        src={editingProduct.image_url}
                        alt={editingProduct.name}
                        className="mt-2 h-24 w-24 object-cover rounded border"
                    />
                </div>
            )}

            {/* File Input */}
            <div className="mt-3">
                <label htmlFor="productImage" className="block text-sm font-medium mb-2">
                    {editingProduct ? 'Update Image' : 'Upload Image'}
                </label>
                <input 
                    type="file" 
                    name="image" 
                    onChange={handleChange} 
                    className="w-full border p-2 rounded"
                    accept="image/*"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, WebP. Max size: 1MB
                </p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isSuperuser || loading.submitting}
                className={`mt-3 rounded px-4 py-2 text-white sm:ml-3 ${
                    isSuperuser && !loading.submitting
                        ? 'bg-violet-700 hover:bg-violet-800'
                        : 'cursor-not-allowed bg-gray-400'
                }`}
            >
                {loading.submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>

            {editingProduct && (
                <button
                    type="button"
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                            name: '',
                            quantity: '',
                            cost_price: '',
                            retail_price: '',
                            selling_price: '',
                            stock_status: 'in_stock',
                            category_id: '',
                            subcategories_ids: [],
                            brand: '',
                            manufacturer: '',
                            description: '',
                            image: null,
                        });
                    }}
                    className="mt-3 ml-3 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                    Cancel Edit
                </button>
            )}
        </form>
    );
}

export default ProductForm;