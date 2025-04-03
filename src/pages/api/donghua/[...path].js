// API route untuk donghua
export default async function handler(req, res) {
  try {
    // Dapatkan path dari request
    const { path } = req.query;
    
    // Bangun URL API eksternal
    const DONGHUA_BASE_URL = process.env.DONGHUA_BASE_URL;
    const baseUrl = DONGHUA_BASE_URL.endsWith('/') ? DONGHUA_BASE_URL : `${DONGHUA_BASE_URL}/`;
    const apiUrl = `${baseUrl}${path.join('/')}`;
    
    // Dapatkan API key dari env
    const apiKey = process.env.API_KEY;
    
    // Buat options untuk fetch
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    };
    
    // Tambahkan body jika ada
    if (req.method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }
    
    // Fetch data dari API eksternal
    const response = await fetch(apiUrl, options);
    
    // Ambil data sebagai JSON
    const data = await response.json();
    
    // Kirim response ke client
    res.status(response.status).json(data);
  } catch (error) {
    // Tangani error
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
} 