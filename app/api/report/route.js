// app/api/report/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connect from '../../../lib/db';
import Report from '../../../lib/models/report';
import User from '../../../lib/models/user';
import fs from 'fs';
import path from 'path';

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

    // Save the report to the database
    await newReport.save();

    // Fetch the user and update their reward points
    const user = await User.findById(userId);
    if (user) {
      user.rewardPoints += 100; // Add 100 points
      await user.save();
    }

    // Extract latitude and longitude from the location (assuming it's structured)
    const { lat, lng} = location;

    // Define the file path for the CSV file
    const csvDirectory = path.join(process.cwd(), 'reports');
    const csvFilePath = path.join(csvDirectory, 'locations.csv');

    // Ensure the reports directory exists, if not create it
    if (!fs.existsSync(csvDirectory)) {
      fs.mkdirSync(csvDirectory, { recursive: true });
    }

    // Create the CSV row with latitude and longitude
    const csvRow = `${lat},${lng}\n`;

    // Append the latitude and longitude to the CSV file
    fs.appendFile(csvFilePath, csvRow, (err) => {
      if (err) {
        console.error('Error writing to CSV file:', err);
      } else {
        console.log('Latitude and longitude added to CSV file');
      }
    });

    return NextResponse.json({ message: 'Report submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ message: 'Report submission failed' }, { status: 500 });
  }
}
