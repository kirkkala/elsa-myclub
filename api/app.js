const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');

const app = express();

// Better detection of Vercel environment
const isVercel = process.env.VERCEL === '1';

// Set up port for local use or use Vercel's port
const PORT = process.env.PORT || 3000;

// Use the public directory to serve static files (frontend form)
app.use(express.static('public')); // Simplified path for local development

// Set up Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage() // Always use memory storage
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Add root redirect to index.html for convenience
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Create the upload handler function
async function handleUpload(req, res) {
  try {
    console.log('Starting file processing');

    if (!req.file) {
      console.error('No file received');
      return res.status(400).send('No file uploaded.');
    }

    console.log(`File received: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Step 1: Read the uploaded ELSA Excel file from buffer
    console.log('Reading Excel file');
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`Parsed ${data.length} rows from Excel`);

    // Step 2: Transform the data to a MyClub-compatible format
    console.log('Transforming data');
    const transformedData = transformData(data);
    console.log(`Transformed ${transformedData.length} rows`);

    // Step 3: Create the new workbook and write to buffer
    console.log('Creating new workbook');
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Schedule');

    // Write to buffer instead of file
    console.log('Writing to buffer');
    const buffer = XLSX.write(newWorkbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true // Add compression to reduce size
    });

    console.log('Setting response headers');
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=MyClub_${req.file.originalname}`);

    console.log('Sending response');
    // Send the buffer directly
    res.send(buffer);
    console.log('Response sent successfully');
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send(`Error processing the file: ${err.message}`);
  }
}

// Use the handler for both endpoints
app.post('/api/upload', upload.single('file'), handleUpload);
app.post('/upload', upload.single('file'), handleUpload);

// Dummy transformation function (Replace with your logic)
function transformData(data) {
  // @TODO: create all mappings and the custom values from index.html.
  return data.map(row => {
    return {
      'Nimi': `${row['Koti']} - ${row['Vieras']}`, // Concatenate "Koti" and "Vieras" to "Nimi" - @TODO: add custom event name values from the index.html form.
      'Alkaa': `${row['Pvm']} ${row['Klo']}`, // Concatenate "Pvm" and "Klo" columns to MyClub "Alkaa" column. @todo: ensure correct time format
      'Tapahtumapaikka': row['Kenttä'],
    };
  });
}

// Check if running locally
if (!isVercel) {
  // Create directories only in local environment
  const uploadsDir = path.join(__dirname, '../uploads');
  const downloadsDir = path.join(__dirname, '../downloads');

  [uploadsDir, downloadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app as a serverless function for Vercel
module.exports = isVercel ? serverless(app) : app;
