import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useProducts } from '../../../context/ProductsContext.jsx'; // Import ProductsContext
import { toast } from 'react-toastify';
import { showConfirmToast } from '../../../utils/toastHelpers.jsx';
import ProductForm from './ProductForm.jsx';
import ProductTable from './ProductTable.jsx';

function ManageItems() {
    const { fetchWithAuth, user } = useAuth();
    const { allProducts, refetchProducts, loading: productsLoading } = useProducts(); // Use products from context
    const headingRef = useRef(null);

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

    const [loading, setLoading] = useState({
        categories: false,
        subcategories: false,
        submitting: false,
    });

    useEffect(() => {
        loadCategories();
        loadSubcategories();
    }, []);

    // Use products from context - no need to load separately
    const products = allProducts;

    const loadCategories = async () => {
        try {
            setLoading((prev) => ({ ...prev, categories: true }));
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/categories/');
            if (!res.ok) throw new Error('Failed to load categories');
            setCategories(await res.json());
        } catch (err) {
            toast.error('Error loading categories');
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, categories: false }));
        }
    };

    const loadSubcategories = async () => {
        try {
            setLoading((prev) => ({ ...prev, subcategories: true }));
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/subcategories/');
            if (!res.ok) throw new Error('Failed to load subcategories');
            setSubcategories(await res.json());
        } catch (err) {
            toast.error('Error loading subcategories');
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, subcategories: false }));
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading((prev) => ({ ...prev, submitting: true }));

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

            // Reset form
            resetForm();

            // Refresh products from context instead of local state
            refetchProducts();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };

    const resetForm = () => {
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

    const handleDelete = (id) => {
        showConfirmToast('Are you sure you want to delete this product?', async () => {
            try {
                await fetchWithAuth(`http://127.0.0.1:8000/api/products/${id}/`, {
                    method: 'DELETE',
                });
                toast.success('Product deleted!');
                // Refresh products from context
                refetchProducts();
            } catch (err) {
                toast.error('Error deleting product');
            }
        });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            category_id: product.category?.id || '',
            subcategories_ids: product.subcategories.map((s) => s.id),
            image: null,
        });

        // Scroll to heading
        headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div>
            {/* Heading with ref */}
            <h2 ref={headingRef} className="mb-4 text-xl font-bold">
                Manage Products
            </h2>

            {/* Form Component */}
            <ProductForm
                formData={formData}
                categories={categories}
                subcategories={subcategories}
                newCategory={newCategory}
                newSubcategory={newSubcategory}
                selectedCategoryForSub={selectedCategoryForSub}
                editingProduct={editingProduct}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleAddCategory={handleAddCategory}
                handleAddSubcategory={handleAddSubcategory}
                setNewCategory={setNewCategory}
                setNewSubcategory={setNewSubcategory}
                setSelectedCategoryForSub={setSelectedCategoryForSub}
                setFormData={setFormData}
                loading={loading}
            />

            <h2 className="mt-8 mb-4 text-xl font-bold">Products List</h2>

            {/* Show loading state for products */}
            {productsLoading ? (
                <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
                </div>
            ) : (
                /* Table Component */
                <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    user={user}
                />
            )}
        </div>
    );
}

export default ManageItems;
