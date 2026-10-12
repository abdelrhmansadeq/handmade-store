import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Cart() {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="text-7xl mb-6">🛒</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    سلة التسوق فارغة
                </h2>
                <p className="text-gray-600 mb-8 text-lg">ابدأ التسوق دلوقتي واكتشف منتجاتنا</p>
                <Link
                    to="/products"
                    className="bg-orange-700 text-white px-8 py-4 rounded-full hover:bg-orange-800 transition inline-block font-bold shadow-lg hover:shadow-xl"
                >
                    تصفح المنتجات
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                سلة التسوق ({getTotalItems()} منتج)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition"
                        >
                            {/* Image */}
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl opacity-60">🏺</span>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="text-lg font-bold text-gray-900 hover:text-orange-700 transition block"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-orange-700 font-bold mt-1">
                                        {item.price.toFixed(2)} ج.م
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mt-3 flex-wrap">
                                    <div className="flex items-center border-2 border-gray-200 rounded-full">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 text-lg font-bold text-gray-700 hover:text-orange-700"
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="px-3 py-1 font-bold text-gray-900 min-w-[2rem] text-center border-x border-gray-200">
                      {item.quantity}
                    </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 text-lg font-bold text-gray-700 hover:text-orange-700"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                                    >
                                        🗑️ حذف
                                    </button>
                                </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right flex flex-col justify-between">
                                <span className="text-xs text-gray-500">الإجمالي</span>
                                <span className="font-bold text-gray-900 text-lg whitespace-nowrap">
                  {(item.price * item.quantity).toFixed(2)} ج.م
                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            ملخص الطلب
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>عدد المنتجات:</span>
                                <span className="font-medium">{getTotalItems()}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>الشحن:</span>
                                <span className="text-green-700 font-medium">مجاني</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">الإجمالي:</span>
                                <span className="text-2xl font-bold text-orange-700">
                  {getTotalPrice().toFixed(2)} ج.م
                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-orange-700 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-800 transition shadow-lg hover:shadow-xl"
                        >
                            إتمام الطلب
                        </button>

                        <Link
                            to="/products"
                            className="block text-center text-orange-700 hover:text-orange-800 font-medium mt-4 text-sm"
                        >
                            ← متابعة التسوق
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;