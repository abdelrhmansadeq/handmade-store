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
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              Handmade Store 🎨
            </span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                            الرئيسية
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                            المنتجات
                        </Link>
                        <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-medium relative">
                            السلة 🛒
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
                            )}
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated && user ? (
                            <>
                <span className="text-gray-700 font-medium hidden sm:inline">
                  مرحباً، {user.name}
                </span>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        لوحة التحكم
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    خروج
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 font-medium"
                                >
                                    دخول
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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