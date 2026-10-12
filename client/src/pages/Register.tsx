import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }

        if (password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
            });

            const { user, token } = response.data.data;
            login(user, token);
            navigate('/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'حدث خطأ، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">✨</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        إنشاء حساب جديد
                    </h2>
                    <p className="text-gray-600">
                        انضم إلينا وابدأ التسوق
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            الاسم
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900"
                            placeholder="أدخل اسمك"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900"
                            placeholder="••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            تأكيد كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-700 transition text-gray-900"
                            placeholder="••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-700 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-800 transition shadow-lg hover:shadow-xl disabled:bg-gray-400"
                    >
                        {loading ? 'جاري التسجيل...' : 'تسجيل'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    عندك حساب بالفعل؟{' '}
                    <Link to="/login" className="text-orange-700 hover:text-orange-800 font-bold">
                        سجل دخول
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;