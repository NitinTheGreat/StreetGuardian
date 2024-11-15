// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function GET() {
//   try {
//     // Define the file path for the CSV file
//     const csvFilePath = path.join(process.cwd(), 'reports', 'locations.csv');

//     // Read the CSV file
//     const fileData = fs.readFileSync(csvFilePath, 'utf-8');

//     // Split the file by newlines to get each row
//     const rows = fileData.trim().split('\n');

//     // Parse each row into latitude and longitude objects
//     const locations = rows.map(row => {
//       const [lat, lng] = row.split(',');
//       return { lat: parseFloat(lat), lng: parseFloat(lng) };
//     });

//     // Return the locations as JSON
//     return NextResponse.json(locations);
//   } catch (error) {
//     console.error('Error reading CSV file:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import connect from '../../../lib/db';
import Report from '../../../lib/models/report'; // Ensure this path is correct

export async function GET() {
  try {
    // Connect to the database
    await connect();

    // Fetch all reports from the database
    const reports = await Report.find().lean();

    // Return the reports as JSON
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ message: 'Failed to fetch reports' }, { status: 500 });
  }
}
