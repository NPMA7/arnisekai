// Konfigurasi URL API untuk internal Next.js
// URL asli hanya diakses dari server-side
export const API_ROUTES = {
  anime: '/api/anime',
  donghua: '/api/donghua'
};

// Memastikan URL diakhiri dengan '/'
export const getAnimeUrl = (endpoint) => {
  // Jangan tambahkan slash tambahan jika endpoint sudah diawali dengan slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_ROUTES.anime}/${formattedEndpoint}`;
};

export const getDonghuaUrl = (endpoint) => {
  // Jangan tambahkan slash tambahan jika endpoint sudah diawali dengan slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_ROUTES.donghua}/${formattedEndpoint}`;
}; 