import axios from 'axios';
import type { Product, ApiResponse } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor لإضافة الـ Token تلقائياً
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============= Products =============
export const productService = {
    getAll: async (params?: { search?: string; category?: string }) => {
        const response = await api.get<ApiResponse<{ products: Product[] }>>(
            '/products',
            { params }
        );
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<ApiResponse<{ product: Product }>>(
            `/products/${id}`
        );
        return response.data;
    },
};

// ============= Cart =============
export interface CartItem {
    id: number;
    quantity: number;
    product_id: number;
    name: string;
    price: string;
    image_url: string | null;
    stock: number;
}

export const cartService = {
    getAll: async () => {
        const response = await api.get<
            ApiResponse<{ cart: CartItem[] }> & { total: string }
        >('/cart');
        return response.data;
    },

    add: async (product_id: number, quantity = 1) => {
        const response = await api.post('/cart', { product_id, quantity });
        return response.data;
    },

    updateQuantity: async (id: number, quantity: number) => {
        const response = await api.put(`/cart/${id}`, { quantity });
        return response.data;
    },

    remove: async (id: number) => {
        const response = await api.delete(`/cart/${id}`);
        return response.data;
    },
};

export default api;