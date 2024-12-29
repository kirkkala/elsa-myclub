const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up storage for uploaded files
const upload = multer({
  dest: 'uploads/' // Uploaded files are saved in the uploads folder
});

// Serve the frontend form
app.use(express.static('public')); // Serve the `index.html` form in the /public folder

// Endpoint to handle file upload and conversion
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path; // Path to the uploaded file
  const fileName = req.file.originalname; // Original file name
  const outputFileName = `MyClub_${fileName}`;
  const outputFilePath = path.join(__dirname, 'downloads', outputFileName);

  try {
    // 1. Read the uploaded ELSA Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 2. Transform the data to a MyClub-compatible format
    const transformedData = transformData(data); // A function for your custom transformations

    // 3. Write the transformed data to a new Excel file
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Schedule');
    XLSX.writeFile(newWorkbook, outputFilePath);

    // 4. Send the processed file as a download
    res.download(outputFilePath, outputFileName, (err) => {
      if (err) {
        console.error('Error during file download:', err);
        res.status(500).send('Error converting file');
      }

      // Clean up temporary files after download
      fs.unlinkSync(filePath); // Remove uploaded ELSA file
      fs.unlinkSync(outputFilePath); // Remove the converted MyClub file (optional)
    });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

/**
 * The data transformation function
 * @todo:
 * - Add custom event name values from the index.html form.
 * - Ensure correct time format
 * - Add custom field values from the index.html form.
 * - Add custom field values from the index.html form
 * - .....
 *
 * @param {*} data
 * @returns
 */
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

// Ensure downloads folder exists
if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
  fs.mkdirSync(path.join(__dirname, 'downloads'));
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
