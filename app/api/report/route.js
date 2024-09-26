// app/api/report/route.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connect from '../../../lib/db'
import Report from '../../../lib/models/report'
import User from '../../../lib/models/user'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request) {
  try {
    const { token, location, images, comments, landmark } = await request.json();

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const { userId } = decoded;

    // Connect to the database
    await connect();

    // Create a new report
    const newReport = new Report({
      userId,
      location,
      images,
      comments,
      landmark,
    });

    // Save the report
    await newReport.save();

    // Find the user and update their reward points
    const user = await User.findById(userId);
    if (user) {
      user.rewardPoints += 100; // Add 100 points
      await user.save();
    }

    return NextResponse.json({ message: 'Report submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ message: 'Report submission failed' }, { status: 500 });
  }
}
