import dbConnect from '../../../lib/db'; // Assumes you have a dbConnect utility to manage your MongoDB connection
import SOS from '../../../lib/models/sos'; // Your mongoose SOS model
import { NextResponse } from 'next/server';

// Handle POST requests
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json(); // Parse JSON from the request body
    const { location, serviceType, severity, description } = body;

    // Create a new SOS document
    const sosData = new SOS({
      userLocation: {
        type: 'Point',
        coordinates: [location.lng, location.lat], // Longitude, Latitude order
      },
      serviceType,
      severity,
      description,
      nearestLocation: {
        type: 'Point',
        coordinates: [0, 0], // Placeholder for now
        name: 'Unknown',
      },
    });

    await sosData.save(); // Save to the database

    return NextResponse.json({ success: true, data: sosData }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// Handle GET requests
export async function GET() {
  try {
    await dbConnect();

    const sosRecords = await SOS.find(); // Fetch all SOS records from the database

    return NextResponse.json({ success: true, data: sosRecords }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
