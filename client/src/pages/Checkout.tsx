import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Checkout() {
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { cart, getTotalPrice, getTotalItems, refreshCart } = useCart();
    const { isAuthenticated, token } = useAuth();

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="text-7xl mb-6">🛒</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    السلة فارغة
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-orange-700 text-white px-8 py-4 rounded-full hover:bg-orange-800 transition font-bold shadow-lg"
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
                { address, phone, notes },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                إتمام الطلب
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            📦 بيانات التوصيل
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    العنوان بالتفصيل
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900 resize-none"
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
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900"
                                    placeholder="01xxxxxxxxx"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    ملاحظات إضافية (اختياري)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900 resize-none"
                                    placeholder="أي ملاحظات للبائع (مثلاً: اتصلوا قبل التوصيل)"
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                <p className="text-amber-900 text-sm">
                                    💰 طريقة الدفع: <span className="font-bold">الدفع عند الاستلام</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-700 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-800 transition shadow-lg hover:shadow-xl disabled:bg-gray-400"
                            >
                                {loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            ملخص الطلب
                        </h2>

                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} × {item.quantity}
                  </span>
                                    <span className="text-gray-900 font-medium">
                    {(item.price * item.quantity).toFixed(2)} ج.م
                  </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-4">
                            <div className="flex justify-between text-gray-700 mb-2">
                                <span>عدد المنتجات:</span>
                                <span className="font-medium">{getTotalItems()}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>الشحن:</span>
                                <span className="text-green-700 font-medium">مجاني</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">الإجمالي:</span>
                                <span className="text-2xl font-bold text-orange-700">
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