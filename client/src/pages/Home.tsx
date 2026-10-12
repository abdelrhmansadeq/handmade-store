function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                    Handmade Store 🎨
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    أول متجر مصري للمنتجات اليدوية
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
                    تصفح المنتجات
                </button>
            </div>
        </div>
    );
}

export default Home;