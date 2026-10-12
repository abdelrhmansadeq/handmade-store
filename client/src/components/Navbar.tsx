import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { getTotalItems } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-3xl">🎨</span>
                        <span className="text-2xl font-bold text-orange-800 group-hover:text-orange-700 transition">
              Handmade
            </span>
                    </Link>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-gray-900 hover:text-orange-700 font-medium transition relative group"
                        >
                            الرئيسية
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-700 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-900 hover:text-orange-700 font-medium transition relative group"
                        >
                            المنتجات
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-700 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link
                            to="/cart"
                            className="text-gray-900 hover:text-orange-700 font-medium transition relative group flex items-center gap-1"
                        >
                            السلة
                            <span className="text-lg">🛒</span>
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-4 bg-orange-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
                            )}
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <>
                                <div className="hidden sm:flex flex-col items-end mr-2">
                                    <span className="text-xs text-gray-500">أهلاً</span>
                                    <span className="text-sm font-bold text-orange-800">{user.name}</span>
                                </div>
                                <Link
                                    to="/my-orders"
                                    className="text-gray-900 hover:text-orange-700 font-medium transition"
                                >
                                    طلباتي
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="text-gray-900 hover:text-orange-700 font-medium transition"
                                    >
                                        لوحة التحكم
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-full border border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white transition font-medium"
                                >
                                    خروج
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-900 hover:text-orange-700 font-medium transition"
                                >
                                    دخول
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-orange-700 text-white px-5 py-2 rounded-full hover:bg-orange-800 transition font-medium shadow-sm hover:shadow-md"
                                >
                                    تسجيل
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;