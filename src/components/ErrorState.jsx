/**
 * Komponen untuk menampilkan pesan error
 * @param {Object} props
 * @param {string} props.message - Pesan error
 * @param {function} props.onRetry - Fungsi retry
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-300 mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
} 