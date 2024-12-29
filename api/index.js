import * as XLSX from 'xlsx/xlsx.mjs';

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
};

async function handleUpload(formData) {
  try {
    const file = formData.get('file');
    if (!file) {
      throw new Error('No file uploaded');
    }

    const buffer = await file.arrayBuffer();
    console.log(`Processing file: ${file.name}`);

    // Process Excel file
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`Parsed ${data.length} rows from Excel`);

    // Transform data
    const transformedData = data.map(row => ({
      'Nimi': `${row['Koti']} - ${row['Vieras']}`,
      'Alkaa': `${row['Pvm']} ${row['Klo']}`,
      'Tapahtumapaikka': row['Kenttä'],
    }));

    // Create new workbook
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Schedule');

    // Generate buffer
    const outputBuffer = XLSX.write(newWorkbook, {
      type: 'array',
      bookType: 'xlsx'
    });

    // Return response
    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=MyClub_${file.name}`,
        'Content-Length': outputBuffer.length
      }
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return new Response(JSON.stringify({
      error: 'Error processing file',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const formData = await req.formData();
  return handleUpload(formData);
}
