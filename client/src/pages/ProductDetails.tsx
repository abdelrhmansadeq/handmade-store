import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';

function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productService.getById(Number(id));
                setProduct(response.data.product);
            } catch (err) {
                setError('المنتج غير موجود');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-xl text-gray-600">جاري التحميل...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-xl text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    العودة للمنتجات
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/products')}
                className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
            >
                ← العودة للمنتجات
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">

                    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <span className="text-8xl">🖼️</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {product.name}
                        </h1>

                        {product.category_name && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4 w-fit">
                {product.category_name}
              </span>
                        )}

                        <p className="text-gray-600 text-lg mb-6">
                            {product.description || 'لا يوجد وصف'}
                        </p>

                        <div className="border-t border-b border-gray-200 py-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">السعر:</span>
                                <span className="text-3xl font-bold text-blue-600">
                  {product.price} ج.م
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">المتوفر:</span>
                                <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} قطعة` : 'غير متوفر'}
                </span>
                            </div>
                        </div>

                        {product.vendor_name && (
                            <p className="text-gray-500 text-sm mb-6">
                                البائع: <span className="font-medium">{product.vendor_name}</span>
                            </p>
                        )}

                        <button
                            disabled={product.stock === 0}
                            onClick={async () => {
                                try {
                                    await addToCart({
                                        productId: Number(product.id),
                                        name: product.name,
                                        price: parseFloat(product.price),
                                        image_url: product.image_url,
                                    });
                                    alert('تمت الإضافة للسلة ✅');
                                } catch (err: any) {
                                    if (err.message === 'LOGIN_REQUIRED') {
                                        alert('يجب تسجيل الدخول أولاً');
                                        navigate('/login');
                                    } else {
                                        alert('حدث خطأ');
                                    }
                                }
                            }}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {product.stock === 0 ? 'غير متوفر' : 'أضف للسلة 🛒'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProductDetails;