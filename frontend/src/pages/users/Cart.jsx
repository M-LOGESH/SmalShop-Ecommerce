import React, { useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function Cart({ isOpen, onClose }) {
    const { user, fetchWithAuth, cart, setCart } = useAuth();

    // Lock/unlock background scroll
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`; // prevent layout shift
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && user?.access) loadCart();
    }, [isOpen, user]);

    const loadCart = async () => {
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/cart/');
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Error loading cart:', err);
        }
    };

    const updateCartQuantity = async (id, quantity) => {
        try {
            if (quantity < 1) {
                const res = await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${id}/`, {
                    method: 'DELETE',
                });
                if (res.ok) setCart((prev) => prev.filter((item) => item.id !== id));
            } else {
                const res = await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setCart((prev) =>
                        prev.map((item) =>
                            item.id === id ? { ...item, quantity: data.quantity } : item
                        )
                    );
                }
            }
        } catch (err) {
            console.error('Error updating cart:', err);
        }
    };

    const total = cart.reduce(
        (sum, item) => sum + (item.product_detail?.selling_price || 0) * item.quantity,
        0
    );
    const placeOrder = async () => {
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/orders/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}), // backend creates order from cart
            });
            if (res.ok) {
                alert('Order placed successfully!');
                setCart([]); // clear cart on frontend
                onClose();
            } else {
                const err = await res.json();
                alert('Error: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <>
            {/* Dim background overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Cart sidebar */}
            <div
                className={`fixed inset-y-0 right-0 z-[9999] w-full max-w-full transform transition-transform duration-300 sm:w-90 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } flex flex-col bg-zinc-200 shadow-lg`}
            >
                <div className="flex items-center justify-between bg-violet-600 px-4 py-3 text-white shadow">
                    <button onClick={onClose} className="flex items-center">
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-medium">My Cart</h1>
                    <span className="w-5" />
                </div>

                {/* Cart items (hidden scrollbar) */}
                <div className="flex-1 overflow-y-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500">Your cart is empty.</p>
                    ) : (
                        cart.map((item) => {
                            const p = item.product_detail;
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded bg-white p-2 text-xs"
                                >
                                    {/* Product image */}
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                                        {p.image ? (
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="h-full w-auto object-contain"
                                            />
                                        ) : (
                                            'No Img'
                                        )}
                                    </div>

                                    {/* Product details */}
                                    <div className="flex flex-1 flex-col justify-center gap-0.5 px-2">
                                        <h3 className="truncate text-xs font-medium">{p.name}</h3>
                                        <p className="text-2xs text-gray-500">{p.quantity}</p>
                                        <div className="mt-0.5">
                                            {p.retail_price && p.retail_price > p.selling_price ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs font-bold">
                                                        ₹{p.selling_price}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 line-through">
                                                        ₹{p.retail_price}
                                                    </span>
                                                    <span className="rounded bg-green-300/20 px-1 text-[10px] font-semibold text-green-600">
                                                        {Math.round(
                                                            ((p.retail_price - p.selling_price) /
                                                                p.retail_price) *
                                                                100
                                                        )}
                                                        % OFF
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    ₹{p.selling_price ?? '-'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-1 rounded bg-violet-500 px-2 py-1 text-white">
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(item.id, item.quantity - 1)
                                            }
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="min-w-[20px] text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(item.id, item.quantity + 1)
                                            }
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="border-t border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="mb-3 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                    <button
                        onClick={placeOrder}
                        className="w-full rounded bg-violet-900 py-2 text-white hover:bg-violet-800"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </>
    );
}

export default Cart;
