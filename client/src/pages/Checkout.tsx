import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Checkout() {
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { cart, getTotalPrice, getTotalItems, refreshCart } = useCart();
    const { isAuthenticated, token } = useAuth();

    // لو مش مسجل دخول
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // لو السلة فاضية
    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    السلة فارغة
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    تصفح المنتجات
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(
                'http://localhost:5000/api/orders',
                { address, phone },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await refreshCart();
            alert('تم إرسال طلبك بنجاح ✅');
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'حدث خطأ، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                إتمام الطلب
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* نموذج البيانات */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            بيانات التوصيل
                        </h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    العنوان بالتفصيل
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="المحافظة، المدينة، الشارع، رقم المبنى، رقم الشقة"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    رقم الهاتف
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="01xxxxxxxxx"
                                />
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 text-sm">
                                    💰 طريقة الدفع: <span className="font-bold">الدفع عند الاستلام</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                            >
                                {loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ملخص الطلب */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            ملخص الطلب
                        </h2>

                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} × {item.quantity}
                  </span>
                                    <span className="text-gray-800 font-medium">
                    {(item.price * item.quantity).toFixed(2)} ج.م
                  </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between text-gray-600 mb-2">
                                <span>عدد المنتجات:</span>
                                <span>{getTotalItems()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 mb-2">
                                <span>الشحن:</span>
                                <span className="text-green-600">مجاني</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">الإجمالي:</span>
                                <span className="text-2xl font-bold text-blue-600">
                  {getTotalPrice().toFixed(2)} ج.م
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;