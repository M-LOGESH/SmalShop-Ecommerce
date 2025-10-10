function Loading() {
    return (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-80 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export default Loading;