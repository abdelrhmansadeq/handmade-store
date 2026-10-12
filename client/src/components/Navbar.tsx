import { Link } from 'react-router-dom';

function Navbar() {
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
                        <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-medium">
                            السلة 🛒
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-3">
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
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;