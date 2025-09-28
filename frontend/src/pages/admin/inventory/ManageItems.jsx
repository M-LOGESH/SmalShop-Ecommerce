import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function ManageItems() {
    const { fetchWithAuth } = useAuth();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [selectedCategoryForSub, setSelectedCategoryForSub] = useState('');

    const [formData, setFormData] = useState({
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

    useEffect(() => {
        loadProducts();
        loadCategories();
        loadSubcategories();
    }, []);

    const loadProducts = async () => {
        const res = await fetchWithAuth('http://127.0.0.1:8000/api/products/');
        const data = await res.json();
        setProducts(data);
    };

    const loadCategories = async () => {
        const res = await fetchWithAuth('http://127.0.0.1:8000/api/categories/');
        setCategories(await res.json());
    };

    const loadSubcategories = async () => {
        const res = await fetchWithAuth('http://127.0.0.1:8000/api/subcategories/');
        setSubcategories(await res.json());
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else if (name === 'subcategories_ids') {
            const options = [...e.target.selectedOptions].map((o) => o.value);
            setFormData({ ...formData, subcategories_ids: options });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/categories/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory, slug: newCategory.toLowerCase() }),
            });
            if (!res.ok) throw new Error('Failed to add category');
            toast.success('Category added!');
            setNewCategory('');
            loadCategories();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategory || !selectedCategoryForSub) return;
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/subcategories/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubcategory, category: selectedCategoryForSub }),
            });
            if (!res.ok) throw new Error('Failed to add subcategory');
            toast.success('Subcategory added!');
            setNewSubcategory('');
            setSelectedCategoryForSub('');
            loadSubcategories();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === 'subcategories_ids') {
                formData.subcategories_ids.forEach((id) => form.append('subcategories_ids', id));
            } else if (key === 'image') {
                if (formData.image instanceof File) form.append('image', formData.image);
            } else {
                form.append(key, formData[key] ?? '');
            }
        });

        const url = editingProduct
            ? `http://127.0.0.1:8000/api/products/${editingProduct.id}/`
            : 'http://127.0.0.1:8000/api/products/';
        const method = editingProduct ? 'PATCH' : 'POST';

        try {
            const res = await fetchWithAuth(url, { method, body: form });
            if (!res.ok) throw new Error('Error saving product');
            toast.success(editingProduct ? 'Product updated!' : 'Product added!');
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
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <div>
                    <p>Are you sure you want to delete this product?</p>
                    <div className="mt-2 flex gap-2">
                        <button
                            onClick={async () => {
                                try {
                                    await fetchWithAuth(
                                        `http://127.0.0.1:8000/api/products/${id}/`,
                                        { method: 'DELETE' }
                                    );
                                    toast.success('Product deleted!');
                                    loadProducts();
                                } catch (err) {
                                    toast.error('Error deleting product');
                                }
                                closeToast();
                            }}
                            className="rounded bg-red-600 px-3 py-1 text-white"
                        >
                            Yes
                        </button>
                        <button
                            onClick={closeToast}
                            className="rounded bg-gray-400 px-3 py-1 text-white"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false, closeOnClick: false, draggable: false }
        );
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            category_id: product.category?.id || '',
            subcategories_ids: product.subcategories.map((s) => s.id),
            image: null,
        });
    };

    return (
        <div className="p-6">
            <h2 className="mb-4 text-xl font-bold">Manage Products</h2>

            <form onSubmit={handleSubmit} className="mb-6 grid max-w-lg gap-3">
                <input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                    autoComplete="name"
                    required
                />
                <input
                    name="quantity"
                    placeholder="Quantity (e.g. 1kg, 500ml)"
                    value={formData.quantity ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="number"
                    name="cost_price"
                    placeholder="Cost Price"
                    value={formData.cost_price ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="number"
                    name="retail_price"
                    placeholder="Retail Price"
                    value={formData.retail_price ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="number"
                    name="selling_price"
                    placeholder="Selling Price"
                    value={formData.selling_price ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />

                <select
                    name="stock_status"
                    value={formData.stock_status ?? 'in_stock'}
                    onChange={handleChange}
                    className="border p-2"
                >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                </select>

                <select
                    name="category_id"
                    value={formData.category_id ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <div className="mt-1 flex gap-2">
                    <input
                        id="new-category"
                        name="newCategory"
                        placeholder="Add new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 border p-2"
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        onClick={handleAddCategory}
                        className="rounded bg-green-500 px-2 py-1 text-white"
                    >
                        Add
                    </button>
                </div>

                <select
                    name="subcategories_ids"
                    multiple
                    value={formData.subcategories_ids}
                    onChange={handleChange}
                    className="mt-2 border p-2"
                >
                    {subcategories.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                            {sc.name} ({sc.category?.name})
                        </option>
                    ))}
                </select>

                <div className="mt-1 flex gap-2">
                    <select
                        id="category-for-sub"
                        name="selectedCategoryForSub"
                        value={selectedCategoryForSub}
                        onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                        className="border p-2"
                        autoComplete="off"
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <input
                        id="new-subcategory"
                        name="newSubcategory"
                        placeholder="Add new subcategory"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        className="flex-1 border p-2"
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="rounded bg-green-500 px-2 py-1 text-white"
                    >
                        Add
                    </button>
                </div>

                <input
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    name="manufacturer"
                    placeholder="Manufacturer"
                    value={formData.manufacturer ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description ?? ''}
                    onChange={handleChange}
                    className="border p-2"
                />

                {editingProduct && editingProduct.image && !formData.image && (
                    <img
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        className="mb-2 h-24 w-24 object-cover"
                    />
                )}

                <input type="file" name="image" onChange={handleChange} className="border p-2" />

                <button type="submit" className="rounded bg-violet-600 px-4 py-2 text-white">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
            </form>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">Image</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Cost</th>
                        <th className="p-2">Retail</th>
                        <th className="p-2">Selling</th>
                        <th className="p-2">Stock</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="p-2">
                                {p.image ? (
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="h-16 w-16 object-cover"
                                    />
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{p.category?.name}</td>
                            <td className="p-2">{p.cost_price ?? '-'}</td>
                            <td className="p-2">{p.retail_price ?? '-'}</td>
                            <td className="p-2">{p.selling_price ?? '-'}</td>
                            <td className="p-2 text-center">
                                {p.stock_status === 'in_stock' ? (
                                    <span className="text-xl text-green-600">✅</span>
                                ) : (
                                    <span className="text-xl text-red-600">❌</span>
                                )}
                            </td>

                            <td className="flex gap-2 p-2">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="rounded bg-yellow-500 px-2 py-1 text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="rounded bg-red-500 px-2 py-1 text-white"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageItems;
