import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: string;
    name: string;
    image_url: string | null;
}

interface Order {
    id: number;
    total_price: string;
    status: string;
    address: string;
    phone: string;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
}

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: 'قيد التنفيذ', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⏳' },
    shipped: { label: 'تم الشحن', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🚚' },
    delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' },
};

function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/my', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data.data.orders);
            } catch (err) {
                setError('حدث خطأ أثناء تحميل الطلبات');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, token, navigate]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="inline-block w-12 h-12 border-4 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
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

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="text-7xl mb-6">📦</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    ليس لديك طلبات بعد
                </h2>
                <p className="text-gray-600 mb-8 text-lg">ابدأ التسوق الآن!</p>
                <Link
                    to="/products"
                    className="bg-orange-700 text-white px-8 py-4 rounded-full hover:bg-orange-800 transition inline-block font-bold shadow-lg"
                >
                    تصفح المنتجات
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    طلباتي
                </h1>
                <p className="text-gray-600">لديك {orders.length} طلب</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => {
                    const statusInfo = statusLabels[order.status] || statusLabels.pending;
                    return (
                        <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">

                            {/* Header Bar */}
                            <div className="bg-gradient-to-r from-gray-50 to-orange-50/30 px-6 py-5 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">رقم الطلب</p>
                                        <p className="text-xl font-bold text-gray-900">#{order.id}</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-200"></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">التاريخ</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(order.created_at).toLocaleDateString('ar-EG', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${statusInfo.color}`}>
                  <span className="text-base">{statusInfo.icon}</span>
                                    {statusInfo.label}
                </span>
                            </div>

                            {/* Items */}
                            <div className="p-6 space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-amber-100">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl opacity-60">🏺</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/products/${item.product_id}`}
                                                className="font-bold text-gray-900 hover:text-orange-700 transition block truncate"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500 mt-1">
                                                الكمية: <span className="font-medium text-gray-700">{item.quantity}</span>
                                            </p>
                                        </div>
                                        <p className="font-bold text-gray-900 whitespace-nowrap">
                                            {(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)} ج.م
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Details */}
                            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0">📍</span>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">عنوان التوصيل</p>
                                            <p className="text-sm text-gray-800">{order.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0">📞</span>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
                                            <p className="text-sm text-gray-800 font-medium">{order.phone}</p>
                                        </div>
                                    </div>

                                    {order.notes && (
                                        <div className="flex items-start gap-3 md:col-span-2">
                                            <span className="text-lg flex-shrink-0">📝</span>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 mb-1">ملاحظاتك</p>
                                                <p className="text-sm text-gray-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
                                                    {order.notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Total Footer */}
                            <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
                                <span className="text-gray-600">الإجمالي المدفوع عند الاستلام:</span>
                                <span className="text-2xl font-bold text-orange-700">
                  {order.total_price} ج.م
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyOrders;