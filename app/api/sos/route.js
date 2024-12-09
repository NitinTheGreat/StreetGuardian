import dbConnect from '../../../lib/db';
import SOS from '../../../lib/models/sos';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json(); // Parse JSON from the request body
    const { location, serviceType, severity, description } = body;

    const sosData = new SOS({
      userLocation: {
        type: 'Point',
        coordinates: [location.lat, location.lng], // Note the order: [longitude, latitude]
      },
      serviceType,
      severity,
      description,
      // nearestLocation will be populated later, perhaps by a separate process
      nearestLocation: {
        type: 'Point',
        coordinates: [0, 0], // placeholder
        name: 'Unknown',
      },
    });

    await sosData.save();
    return NextResponse.json({ success: true, data: sosData }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ success: true }, { status: 200 });
}

export const runtime = 'edge'; // Optional: To use Edge Runtime for faster responses
