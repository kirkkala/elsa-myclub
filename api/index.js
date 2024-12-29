const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

// Better detection of Vercel environment
const isVercel = process.env.VERCEL === '1';

// Set up port for local use or use Vercel's port
const PORT = process.env.PORT || 3000;

// Use the public directory to serve static files (frontend form)
app.use(express.static('public'));

// Set up Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage()
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

    console.log('Writing to buffer');
    const buffer = XLSX.write(newWorkbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true
    });

    console.log('Setting response headers');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=MyClub_${req.file.originalname}`);

    console.log('Sending response');
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
  return data.map(row => {
    return {
      'Nimi': `${row['Koti']} - ${row['Vieras']}`,
      'Alkaa': `${row['Pvm']} ${row['Klo']}`,
      'Tapahtumapaikka': row['Kenttä'],
    };
  });
}

// Export the serverless handler
module.exports = serverless(app);
