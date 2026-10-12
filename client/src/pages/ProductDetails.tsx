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
    const [quantity, setQuantity] = useState(1);

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
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="inline-block w-12 h-12 border-4 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600 mt-4">جاري التحميل...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <p className="text-xl text-red-600 mb-6">{error || 'المنتج غير موجود'}</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-orange-700 text-white px-6 py-3 rounded-full hover:bg-orange-800 transition"
                >
                    العودة للمنتجات
                </button>
            </div>
        );
    }

    const handleAddToCart = async () => {
        try {
            await addToCart({
                productId: Number(product.id),
                name: product.name,
                price: parseFloat(product.price),
                image_url: product.image_url,
            }, quantity);
            alert('تمت الإضافة للسلة ✅');
        } catch (err: any) {
            if (err.message === 'LOGIN_REQUIRED') {
                alert('يجب تسجيل الدخول أولاً');
                navigate('/login');
            } else {
                alert('حدث خطأ');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <button
                onClick={() => navigate('/products')}
                className="text-orange-700 hover:text-orange-800 mb-8 flex items-center gap-2 font-medium"
            >
                ← العودة للمنتجات
            </button>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">

                    {/* Image */}
                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-[10rem] opacity-60">🏺</span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        {product.category_name && (
                            <span className="inline-block bg-amber-100 text-orange-800 text-sm px-4 py-1 rounded-full mb-4 w-fit font-medium">
                {product.category_name}
              </span>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                            {product.description || 'منتج يدوي أصلي'}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-200 py-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600">السعر:</span>
                                <span className="text-3xl font-bold text-orange-700">
                  {parseFloat(product.price).toFixed(2)} ج.م
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">المتوفر:</span>
                                <span className={`font-bold ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} قطعة` : 'غير متوفر'}
                </span>
                            </div>
                        </div>

                        {product.vendor_name && (
                            <p className="text-gray-600 text-sm mb-6">
                                البائع: <span className="font-medium text-orange-800">{product.vendor_name}</span>
                            </p>
                        )}

                        {/* Quantity + Add to Cart */}
                        {product.stock > 0 && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border-2 border-gray-200 rounded-full">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-5 py-3 text-xl font-bold text-gray-700 hover:text-orange-700 transition"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-3 font-bold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-5 py-3 text-xl font-bold text-gray-700 hover:text-orange-700 transition"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-orange-700 text-white py-4 px-8 rounded-full text-lg font-bold hover:bg-orange-800 transition shadow-lg hover:shadow-xl"
                                >
                                    أضف للسلة 🛒
                                </button>
                            </div>
                        )}

                        {product.stock === 0 && (
                            <button
                                disabled
                                className="bg-gray-300 text-gray-600 py-4 px-8 rounded-full text-lg font-bold cursor-not-allowed"
                            >
                                غير متوفر حالياً
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProductDetails;