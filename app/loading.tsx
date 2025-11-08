export default function Loading() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Dog Logo */}
        <div className="mb-8 relative">
          <div className="text-6xl animate-bounce">🐕</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600">
          Fetching something tail-waggingly good
        </p>

        {/* Loading Dots Animation */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
