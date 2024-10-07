import { NextResponse } from 'next/server';
import connect from '../../../lib/db';
import Report from '../../../lib/models/report';

export async function GET() {
  try {
    await connect();
    const reports = await Report.find().sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}