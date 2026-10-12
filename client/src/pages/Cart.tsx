import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Cart() {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-700 mb-4">
                    سلة التسوق فارغة 🛒
                </h2>
                <p className="text-gray-500 mb-8">ابدأ التسوق دلوقتي!</p>
                <Link
                    to="/products"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
                >
                    تصفح المنتجات
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                سلة التسوق ({getTotalItems()} منتج)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* قائمة المنتجات */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                        >
                            {/* صورة */}
                            <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    <span className="text-3xl">🖼️</span>
                                )}
                            </div>

                            {/* التفاصيل */}
                            <div className="flex-1">
                                <Link
                                    to={`/products/${item.productId}`}
                                    className="text-lg font-bold text-gray-800 hover:text-blue-600"
                                >
                                    {item.name}
                                </Link>
                                <p className="text-blue-600 font-bold mt-1">
                                    {item.price.toFixed(2)} ج.م
                                </p>

                                <div className="flex items-center gap-4 mt-3">
                                    {/* تعديل الكمية */}
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-1 border-x border-gray-300">
                      {item.quantity}
                    </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        🗑️ حذف
                                    </button>
                                </div>
                            </div>

                            {/* الإجمالي */}
                            <div className="text-right">
                                <p className="text-gray-500 text-sm">الإجمالي</p>
                                <p className="font-bold text-gray-800">
                                    {(item.price * item.quantity).toFixed(2)} ج.م
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ملخص الطلب */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            ملخص الطلب
                        </h2>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>عدد المنتجات:</span>
                                <span>{getTotalItems()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>الشحن:</span>
                                <span className="text-green-600">مجاني</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">الإجمالي:</span>
                                <span className="text-2xl font-bold text-blue-600">
                  {getTotalPrice().toFixed(2)} ج.م
                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            إتمام الطلب
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;