import { NextResponse } from 'next/server';
import connect from '../../../lib/db';
import Report from '../../../lib/models/report';

export async function POST(request) {
  try {
    await connect();

    const { userId, location, images, comments, landmark } = await request.json();

    const newReport = new Report({
      userId,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      images,
      comments,
      landmark
    });

    await newReport.save();

    return NextResponse.json({ message: 'Report submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json({ message: 'Failed to submit report' }, { status: 500 });
  }
}