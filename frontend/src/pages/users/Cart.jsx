import React, { useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function Cart({ isOpen, onClose }) {
    const { user, fetchWithAuth, cart, setCart } = useAuth();

    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
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

    const total = cart
        .filter((item) => item.product_detail?.stock_status !== 'out_of_stock')
        .reduce((sum, item) => sum + (item.product_detail?.selling_price || 0) * item.quantity, 0);

    const placeOrder = async () => {
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/orders/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message || 'Order placed successfully!');

                // Update cart - remove only in-stock items
                setCart((prevCart) =>
                    prevCart.filter((item) => item.product_detail?.stock_status === 'out_of_stock')
                );
                onClose();
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || JSON.stringify(err)));
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        }
    };

    const inStockItems = cart.filter(
        (item) => item.product_detail?.stock_status !== 'out_of_stock'
    );
    const outOfStockItems = cart.filter(
        (item) => item.product_detail?.stock_status === 'out_of_stock'
    );

    return (
        <>
            {/* Dim background overlay with high z-index */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-[10000] ${
                    isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Cart sidebar with even higher z-index */}
            <div
                className={`fixed inset-y-0 right-0 z-[10001] w-full max-w-full transform transition-transform duration-300 sm:w-90 ${
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

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500">Your cart is empty.</p>
                    ) : (
                        <>
                            {/* In-stock items */}
                            {inStockItems.map((item) => {
                                const p = item.product_detail;
                                return (
                                    <div
                                        key={item.id}
                                        className="mb-2 flex items-center justify-between rounded bg-white p-2 text-xs"
                                    >
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

                                        <div className="flex flex-1 flex-col justify-center gap-0.5 px-2">
                                            <h3 className="truncate text-xs font-medium">
                                                {p.name}
                                            </h3>
                                            <p className="text-2xs text-gray-500">{p.quantity}</p>
                                            <span className="text-xs font-bold">
                                                ₹{p.selling_price ?? '-'}
                                            </span>
                                        </div>

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
                            })}

                            {/* Out-of-stock items below */}
                            {outOfStockItems.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="mb-2 ml-2 text-xs font-semibold text-gray-800">
                                        Out of Stock
                                    </h4>
                                    {outOfStockItems.map((item) => {
                                        const p = item.product_detail;
                                        return (
                                            <div
                                                key={item.id}
                                                className="mb-2 flex items-center justify-between rounded bg-gray-100 p-2 text-xs opacity-70"
                                            >
                                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded bg-gray-200">
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

                                                <div className="flex flex-1 flex-col justify-center gap-0.5 px-2">
                                                    <h3 className="truncate text-xs font-medium">
                                                        {p.name}
                                                    </h3>
                                                    <p className="text-2xs text-gray-500">
                                                        {p.quantity}
                                                    </p>
                                                    <span className="text-xs font-bold">
                                                        ₹{p.selling_price ?? '-'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 rounded bg-gray-400 px-2 py-1 text-white">
                                                    Out of Stock
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
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