import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

function App() {
    return (
        <div className="min-h-screen bg-orange-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
            </Routes>
        </div>
    );
}

export default App;