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
  dest: process.env.IS_VERCEL ? '/tmp/' : 'uploads/' // Use /tmp/ on Vercel, 'uploads/' locally
});

// Endpoint to handle file upload and conversion
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path; // Path to the uploaded file
  const fileName = req.file.originalname; // Original file name
  const outputFileName = `MyClub_${fileName}`;
  const outputFilePath = process.env.IS_VERCEL
    ? path.join('/tmp/', outputFileName) // Use /tmp/ on Vercel
    : path.join(__dirname, '../downloads', outputFileName); // Use 'downloads/' locally

  try {
    // Step 1: Read the uploaded ELSA Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Process the first sheet
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Step 2: Transform the data to a MyClub-compatible format
    const transformedData = transformData(data); // Replace with your transformation function

    // Step 3: Write transformed data to a new Excel file
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Schedule');
    XLSX.writeFile(newWorkbook, outputFilePath);

    // Send the file as a response to the client
    res.download(outputFilePath, outputFileName, () => {
      // Clean up temporary files after response
      fs.unlinkSync(filePath); // Delete the uploaded file
      fs.unlinkSync(outputFilePath); // Delete the generated file
    });
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
