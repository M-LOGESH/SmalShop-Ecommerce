import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { showConfirmToast } from '../../../utils/toastHelpers.jsx';
import ProductForm from './ProductForm.jsx';
import ProductTable from './ProductTable.jsx';

function ManageItems() {
    const { fetchWithAuth, user } = useAuth();

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
        setProducts(await res.json());
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
            await fetchWithAuth(`http://127.0.0.1:8000/api/products/${id}/`, { method: 'DELETE' });
            toast.success('Product deleted!');
            loadProducts();
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
    };

    return (
        <div>
            <h2 className="mb-4 text-xl font-bold">Manage Products</h2>

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
            />

            {/* Table Component */}
            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={null}
                user={user}
            />
        </div>
    );
}

export default ManageItems;
