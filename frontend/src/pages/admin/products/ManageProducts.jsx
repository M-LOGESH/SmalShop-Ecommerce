import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useProducts } from '../../../context/ProductsContext.jsx';
import { toast } from 'react-toastify';
import { showConfirmToast } from '../../../utils/toastHelpers.jsx';
import ProductForm from './ProductForm.jsx';
import ProductTable from './ProductTable.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ManageItems() {
    const { fetchWithAuth, user } = useAuth();
    const { allProducts, refetchProducts, loading: productsLoading } = useProducts();
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

    const products = allProducts;

    const loadCategories = async () => {
        try {
            setLoading((prev) => ({ ...prev, categories: true }));
            const res = await fetchWithAuth(`${API_BASE}/api/categories/`);
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
            const res = await fetchWithAuth(`${API_BASE}/api/subcategories/`);
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

    const uploadProductImage = async (productId, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            
            const res = await fetchWithAuth(`${API_BASE}/api/products/${productId}/upload-image/`, {
                method: 'POST',
                body: formData,
            });
            
            if (!res.ok) throw new Error('Failed to upload image');
            return await res.json();
        } catch (error) {
            console.error('Image upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading((prev) => ({ ...prev, submitting: true }));

        const form = new FormData();

        // Add all product fields
        Object.keys(formData).forEach((key) => {
            if (key === 'subcategories_ids') {
                formData.subcategories_ids.forEach((id) => form.append('subcategories_ids', id));
            } else if (key === 'image') {
                if (formData.image instanceof File) {
                    // Use 'file' as the key to match backend expectation
                    form.append('file', formData.image);
                }
            } else {
                form.append(key, formData[key] ?? '');
            }
        });

        // Debug: log FormData contents
        for (let [key, value] of form.entries()) {
            console.log(key, value);
        }

        const url = editingProduct
            ? `${API_BASE}/api/products/${editingProduct.id}/`
            : `${API_BASE}/api/products/`;
        const method = editingProduct ? 'PATCH' : 'POST';

        try {
            const res = await fetchWithAuth(url, { method, body: form });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Error saving product');
            }

            const productData = await res.json();
            
            // If creating new product and image upload failed during creation, try separate upload
            if (!editingProduct && formData.image instanceof File && !productData.image_url) {
                try {
                    await uploadProductImage(productData.id, formData.image);
                    toast.success('Product added with image!');
                } catch (imageError) {
                    toast.success('Product added but image upload failed');
                }
            } else {
                toast.success(editingProduct ? 'Product updated!' : 'Product added!');
            }

            resetForm();
            refetchProducts();
        } catch (err) {
            toast.error(err.message);
            console.error('Submit error:', err);
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
            const res = await fetchWithAuth(`${API_BASE}/api/categories/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory, slug: newCategory.toLowerCase().replace(/\s+/g, '-') }),
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
        if (!newSubcategory) return;
        try {
            const res = await fetchWithAuth(`${API_BASE}/api/subcategories/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubcategory }),
            });
            if (!res.ok) throw new Error('Failed to add subcategory');
            toast.success('Subcategory added!');
            setNewSubcategory('');
            loadSubcategories();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = (id) => {
        showConfirmToast('Are you sure you want to delete this product?', async () => {
            try {
                await fetchWithAuth(`${API_BASE}/api/products/${id}/`, {
                    method: 'DELETE',
                });
                toast.success('Product deleted!');
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

        headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div>
            <h2 ref={headingRef} className="mb-4 text-xl font-bold">
                Manage Products
            </h2>

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

            {productsLoading ? (
                <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
                </div>
            ) : (
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