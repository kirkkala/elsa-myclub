// Local development server
const app = require('./api/index.js');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
    server.close();
    app.listen(PORT + 1, () => {
      console.log(`Server running on http://localhost:${PORT + 1}`);
    });
  } else {
    console.error(err);
  }
});
