export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    stock: number;
    image_url: string | null;
    category_id: number | null;
    vendor_id: number | null;
    category_name: string | null;
    vendor_name: string | null;
    created_at: string;
}

export interface ApiResponse<T> {
    status: string;
    results?: number;
    data: T;
}