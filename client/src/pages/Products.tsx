import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import type { Product } from '../types';

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

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

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="inline-block w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600 mt-4">جاري التحميل...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
        <span className="inline-block bg-amber-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          🎨 تشكيلتنا
        </span>
                <h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    كل المنتجات
                </h1>
                <p className="text-lg text-gray-600">
                    {filteredProducts.length} منتج متاح
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث عن منتج..."
                        className="w-full px-6 py-4 pr-14 rounded-full border-2 border-gray-200 bg-white focus:outline-none focus:border-orange-600 transition text-gray-900"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </span>
                </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏜️</div>
                    <h2
                        className="text-2xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        لا توجد منتجات
                    </h2>
                    <p className="text-gray-600">
                        {search ? 'جرب كلمة بحث تانية' : 'قريباً هنضيف منتجات جديدة'}
                    </p>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:-translate-y-1"
                    >
                        {/* Image */}
                        <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden relative">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-7xl opacity-60">🏺</span>
                            )}

                            {product.stock === 0 && (
                                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  نفذ
                </span>
                            )}
                            {product.stock > 0 && product.stock < 5 && (
                                <span className="absolute top-3 right-3 bg-amber-400 text-gray-900 text-xs px-3 py-1 rounded-full font-medium">
                  آخر {product.stock} قطع
                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-5 bg-white">
                            <h3
                                className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-700 transition"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {product.description || 'منتج يدوي أصلي'}
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xl font-bold text-orange-700">
                  {parseFloat(product.price).toFixed(2)} ج.م
                </span>
                                <span className="text-sm text-green-700 font-medium group-hover:text-orange-700 transition">
                  اعرض ←
                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Products;