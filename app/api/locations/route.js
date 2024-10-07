import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), 'reports', 'locations.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: ['lat', 'lng'],
      skip_empty_lines: true
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error reading locations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}