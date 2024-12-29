const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http'); // Required for Vercel

const app = express();

// Set up port for local use or use Vercel's port
const PORT = process.env.PORT || 3000;

// Use the public directory to serve static files (frontend form)
app.use(express.static(path.join(__dirname, '../public'))); // Adjusted for public folder location

// Set up Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage() // Use memory storage instead of file system
});

// Endpoint to handle file upload and conversion
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Step 1: Read the uploaded ELSA Excel file from buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Step 2: Transform the data to a MyClub-compatible format
    const transformedData = transformData(data);

    // Step 3: Create the new workbook and write to buffer
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Schedule');

    // Write to buffer instead of file
    const buffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=MyClub_${req.file.originalname}`);

    // Send the buffer directly
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing the file.');
  }
});

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

// Check if running locally or in Vercel
if (!process.env.IS_VERCEL) {
  // Ensure downloads folder exists locally
  if (!fs.existsSync(path.join(__dirname, '../downloads'))) {
    fs.mkdirSync(path.join(__dirname, '../downloads'));
  }

  // Start the server locally
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app as a serverless function for Vercel
module.exports = process.env.IS_VERCEL ? serverless(app) : app;
