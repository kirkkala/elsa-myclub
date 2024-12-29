import * as XLSX from 'xlsx/xlsx.mjs';

/**
 * Formats the event name from the elsa sheet, comabining team names and division as prefix.
 * @param {*} row
 *   The row from the elsa sheet
 * @returns
 *   The formatted event name
 */
function createEventName(row) {
  const division = row['Sarja']
    .replace(/.*(I divisioona|II divisioona|III divisioona).*/, '$1')
    .replace('divisioona', 'div');

  return `${division}. ${row['Koti']} - ${row['Vieras']}`;
}

/**
 * Creates a Date object from the row's date and time fields.
 *
 * This is seriously overengineered because the format in Elsa is in whatnot format...
 *
 * @param {*} row
 *   The row from the elsa sheet
 * @returns
 *   Date object representing the event time
 */
function getDateTime(row) {
  try {
    if (!row['Pvm'] || !row['Klo']) {
      throw new Error(`Missing date or time: Pvm=${row['Pvm']}, Klo=${row['Klo']}`);
    }

    // Convert to string and ensure proper format
    const dateStr = row['Pvm'].toString().trim();
    const timeStr = row['Klo'].toString().trim();

    // Parse date parts, expecting "DD.MM." format
    const dateParts = dateStr.split('.');
    if (dateParts.length < 2) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    const day = dateParts[0].padStart(2, '0');
    const month = dateParts[1].padStart(2, '0');

    // Construct the date string with correct order: YYYY.MM.DD
    const date = `2025.${month}.${day} ${timeStr}`;

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date/time: ${date}`);
    }

    return dateObj;
  } catch (error) {
    console.error('Error in getDateTime:', error);
    console.error('Input row:', row);
    throw error;
  }
}

/**
 * Formats the start time from the elsa sheet by combining date and time.
 * @param {*} row
 *   The row from the elsa sheet
 * @returns
 *   The formatted start time
 */
function createStartTime(row) {
  const startDateTime = getDateTime(row);
  const date = startDateTime.toLocaleDateString('fi-FI');
  const time = startDateTime.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${date} ${time}`;
}

/**
 * Formats the end time from the elsa sheet by adding 75 minutes to the start time.
 * @param {*} row
 *   The row from the elsa sheet
 * @param {number} duration
 *   Duration in minutes from the form
 * @returns
 *   The formatted end time
 */
function createEndTime(row, duration) {
  const startDateTime = getDateTime(row);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000); // Add selected duration in milliseconds

  const endDate = endDateTime.toLocaleDateString('fi-FI');
  const endTime = endDateTime.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return `${endDate} ${endTime}`;
}

export const config = {
  runtime: 'edge',
};

async function handleUpload(formData) {
  try {
    const file = formData.get('file');
    const duration = parseInt(formData.get('duration'), 10);

    if (!file) {
      throw new Error('No file uploaded');
    }
    if (!duration) {
      throw new Error('Pelin kesto on pakollinen');
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
      'Nimi': createEventName(row),
      'Alkaa': createStartTime(row),
      'Päättyy': createEndTime(row, duration),
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
        'Content-Disposition': `attachment; filename=myclub-${file.name}`,
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
