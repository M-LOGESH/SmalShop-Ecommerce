import React, { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaCheck } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Cart({ isOpen, onClose }) {
    const { user, cart, updateCartQuantity, fetchWithAuth, setCart } = useAuth();
    const { refetchOrders } = useOrders(); 
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

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

    // Reset states when cart closes
    useEffect(() => {
        if (!isOpen) {
            setIsPlacingOrder(false);
            setOrderSuccess(false);
        }
    }, [isOpen]);

    const loadCart = async () => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/api/cart/`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Error loading cart:', err);
        }
    };

    const total = cart
        .filter((item) => item.product_detail?.stock_status !== 'out_of_stock')
        .reduce((sum, item) => sum + (item.product_detail?.selling_price || 0) * item.quantity, 0);

    const placeOrder = async () => {
        if (isPlacingOrder || orderSuccess) return;
        
        setIsPlacingOrder(true);
        setOrderSuccess(false);
        
        try {
            const res = await fetchWithAuth(`${API_BASE}/api/orders/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (res.ok) {
                const data = await res.json();
                
                // Show success state first
                setOrderSuccess(true);
                setIsPlacingOrder(false);
                
                setTimeout(() => {
                    toast.success(data.message || 'Order placed successfully!');
                    
                    // Update cart - remove only in-stock items
                    setCart((prevCart) =>
                        prevCart.filter((item) => item.product_detail?.stock_status === 'out_of_stock')
                    );
                    
                    refetchOrders();
                    
                    onClose();
                }, 1500); 
                
            } else {
                const err = await res.json();
                toast.error('Error: ' + (err.error || JSON.stringify(err)));
                setIsPlacingOrder(false);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
            setIsPlacingOrder(false);
        }
    };

    const inStockItems = cart.filter(
        (item) => item.product_detail?.stock_status !== 'out_of_stock'
    );
    const outOfStockItems = cart.filter(
        (item) => item.product_detail?.stock_status === 'out_of_stock'
    );

    const getButtonContent = () => {
        if (orderSuccess) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center justify-center">
                        <FaCheck className="text-white" size={18} />
                    </div>
                    Order Placed!
                </div>
            );
        }
        
        if (isPlacingOrder) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Placing Order...
                </div>
            );
        }
        
        return 'Place Order';
    };

    const getButtonClass = () => {
        if (orderSuccess) {
            return 'w-full rounded bg-green-600 py-2 text-white cursor-default flex items-center justify-center gap-2';
        }
        
        if (isPlacingOrder) {
            return 'w-full rounded bg-violet-700 py-2 text-white cursor-not-allowed flex items-center justify-center gap-2';
        }
        
        return 'w-full rounded bg-violet-900 py-2 text-white hover:bg-violet-800 transition-all duration-300 flex items-center justify-center';
    };

    return (
        <>
            {/* Dim background overlay with high z-index */}
            <div
                className={`fixed inset-0 z-[10000] bg-black transition-opacity duration-300 ${
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
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <img src="/img/emptycart.png"  alt="Empty Cart" loading="lazy" className="h-40 w-40" />
                            <p className="text-center text-lg font-semibold text-gray-600">
                                Your Cart Is Empty
                            </p>
                        </div>
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
                                            {p.image_url ? (
                                                <img
                                                    src={p.image_url}
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
                                                onClick={
                                                    () =>
                                                        updateCartQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                }
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <span className="min-w-[20px] text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={
                                                    () =>
                                                        updateCartQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
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
                                                    {p.image_url ? (
                                                        <img
                                                            src={p.image_url}
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
                        disabled={isPlacingOrder || orderSuccess || inStockItems.length === 0}
                        className={getButtonClass()}
                    >
                        {getButtonContent()}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Cart;