import axios from 'axios';
import type { Product, ApiResponse } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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

export default api;