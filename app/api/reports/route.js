import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Define the file path for the CSV file
    const csvFilePath = path.join(process.cwd(), 'reports', 'locations.csv');

    // Read the CSV file
    const fileData = fs.readFileSync(csvFilePath, 'utf-8');

    // Split the file by newlines to get each row
    const rows = fileData.trim().split('\n');

    // Parse each row into latitude and longitude objects
    const locations = rows.map(row => {
      const [lat, lng] = row.split(',');
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    });

    // Return the locations as JSON
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
