import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function CartWrapper({ setCartOpen }) {
    const { cart, user } = useAuth();

    useEffect(() => {
        if (!user || (user && !user.is_staff)) {
            setCartOpen(true);
        }
        
        return () => {
            setCartOpen(false);
        };
    }, [setCartOpen, user]);

    return null; 
}

export default CartWrapper;