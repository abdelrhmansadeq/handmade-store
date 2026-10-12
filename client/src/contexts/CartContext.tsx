import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    image_url: string | null;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    loading: boolean;
    addToCart: (item: { productId: number; name: string; price: number; image_url: string | null }, quantity?: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    clearCart: () => void;
    refreshCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const refreshCart = async () => {
        if (!isAuthenticated) {
            setCart([]);
            return;
        }
        try {
            setLoading(true);
            const response = await cartService.getAll();
            const items = response.data.cart.map((item) => ({
                id: item.id,
                productId: item.product_id,
                name: item.name,
                price: parseFloat(item.price),
                image_url: item.image_url,
                quantity: item.quantity,
            }));
            setCart(items);
        } catch (error) {
            console.error('Failed to load cart', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const addToCart = async (
        item: { productId: number; name: string; price: number; image_url: string | null },
        quantity = 1
    ) => {
        if (!isAuthenticated) {
            throw new Error('LOGIN_REQUIRED');
        }
        await cartService.add(item.productId, quantity);
        await refreshCart();
    };

    const removeFromCart = async (cartItemId: number) => {
        await cartService.remove(cartItemId);
        await refreshCart();
    };

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        if (quantity < 1) return;
        await cartService.updateQuantity(cartItemId, quantity);
        await refreshCart();
    };

    const clearCart = () => setCart([]);

    const getTotalItems = () =>
        cart.reduce((sum, item) => sum + item.quantity, 0);

    const getTotalPrice = () =>
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                refreshCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}