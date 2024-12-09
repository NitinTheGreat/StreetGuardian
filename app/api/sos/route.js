import { NextResponse } from 'next/server';
import connect from '../../../lib/db';
import SOS from '../../../lib/models/sos';

export async function POST(request) {
  try {
    const { location, serviceType, severity, description } = await request.json();

    console.log('Received SOS request:', { location, serviceType, severity, description });

    await connect();

    const newSOS = new SOS({
      location,
      serviceType,
      severity,
      description,
      timestamp: new Date(),
    });
    

    await newSOS.save();

    console.log('SOS request saved:', newSOS);

    return NextResponse.json({ message: 'SOS request saved successfully', data: newSOS }, { status: 200 });
  } catch (error) {
    console.error('SOS request error:', error);
    return NextResponse.json({ message: 'Failed to save SOS request' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connect();

    const sosRequests = await SOS.find().sort({ timestamp: -1 });
    console.log('SOS requests:', sosRequests);
    return NextResponse.json(sosRequests, { status: 200 });
  } catch (error) {
    console.error('Error fetching SOS requests:', error);
    return NextResponse.json({ message: 'Failed to fetch SOS requests' }, { status: 500 });
  }
}

