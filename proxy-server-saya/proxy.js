const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const app = express();

// Pengaturan proxy
const proxyOptions = {
  target: 'https://suitmedia-backend.suitdev.com',
  changeOrigin: true, // untuk mengubah host header ke target URL
};

// Tambahkan middleware proxy
app.use('/api', createProxyMiddleware(proxyOptions));

// Menambahkan middleware untuk mengatasi CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Mengizinkan permintaan dari semua domain, sebaiknya diatur sesuai kebutuhan
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route untuk mengakses API
app.get('/ideas', async (req, res) => {
  try {
    // Ambil parameter query dari request
    const { page = 1, size = 10, sort = '-published_at' } = req.query;

    console.log(`Request Params - Page: ${page}, Size: ${size}, Sort: ${sort}`); // Log parameter

    const response = await axios.get('https://suitmedia-backend.suitdev.com/api/ideas', {
      params: {
        'page[number]': page,
        'page[size]': size,
        'append[]': 'small_image',
        'append[]': 'medium_image',
        'sort': sort,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengakses API' });
  }
});

// Port server
const port = 3000;

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
