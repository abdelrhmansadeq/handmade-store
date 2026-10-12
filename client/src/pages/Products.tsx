import { useEffect, useState } from 'react';
import { productService } from '../services/api';
import type { Product } from '../types';

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAll();
                setProducts(response.data.products);
            } catch (err) {
                setError('حدث خطأ أثناء جلب المنتجات');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-xl text-gray-600">جاري التحميل...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    لا توجد منتجات حالياً
                </h2>
                <p className="text-gray-500">قريباً...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                المنتجات
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                    >
                        {/* Image */}
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl">🖼️</span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description || 'لا يوجد وصف'}
                            </p>
                            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  {product.price} ج.م
                </span>
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                                    أضف للسلة
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;