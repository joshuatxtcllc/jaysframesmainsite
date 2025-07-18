const NotFoundSimple = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-teal-400 mb-4">404 - Page Not Found</h1>
        <p className="text-white/70 mb-8">
          Sorry, the page you were looking for doesn't exist.
        </p>
        <div className="space-y-4">
          <a href="/" className="inline-block bg-teal-400 text-black px-6 py-3 rounded-lg hover:bg-teal-300 transition-colors">
            Return to Home
          </a>
          <div className="space-x-4">
            <a href="/products" className="text-teal-400 hover:text-teal-300">Browse Products</a>
            <a href="/contact" className="text-teal-400 hover:text-teal-300">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundSimple;