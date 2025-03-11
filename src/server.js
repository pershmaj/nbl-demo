// server.js
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment variable or default to 3000

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Send index.html for any unmatched routes (for single-page apps if needed)
// If you don't want this, remove this block
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling for server startup
app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Static file server listening on port ${port}`);
    console.log(`Serving files from: ${path.join(__dirname, 'public')}`);
    console.log(`Access files in your browser at: http://localhost:${port}`);
  }
});