import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        <div>
              <span className="inline-block bg-amber-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                ✨ منتجات يدوية أصلية
              </span>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                                فنّ <span className="text-orange-700">بإيديك</span>
                                <br />
                                لبيتك
                            </h1>
                            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                                اكتشف مجموعة من المنتجات اليدوية الأصلية من أفضل الصنّاع المصريين.
                                كل قطعة قصة، وكل تفصيلة فنا.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-800 transition shadow-lg hover:shadow-xl"
                                >
                                    تصفح المنتجات
                                </Link>
                                <Link
                                    to="/register"
                                    className="border-2 border-orange-700 text-orange-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-700 hover:text-white transition"
                                >
                                    كن بائعاً
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-amber-300 to-orange-500 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
                                <span className="text-[12rem]">🏺</span>
                            </div>
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200/40 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-300/40 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            ليه <span className="text-orange-700">Handmade</span>؟
                        </h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            إحنا بنوصل الفنّانين بالبيوت المصرية
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🤝"
                            title="دعم الصنّاع"
                            description="كل عملية شراء بتدعم صانع مصري حقيقي"
                        />
                        <FeatureCard
                            icon="✨"
                            title="جودة أصلية"
                            description="منتجات يدوية أصلية مختارة بعناية"
                        />
                        <FeatureCard
                            icon="🚚"
                            title="توصيل سريع"
                            description="توصيل لجميع محافظات مصر"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        جاهز تبدأ التسوق؟
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        اكتشف آلاف المنتجات اليدوية الأصيلة
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-amber-400 text-gray-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-amber-300 transition"
                    >
                        ابدأ الآن 🛒
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-200 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700">{description}</p>
        </div>
    );
}

export default Home;