import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connect from '../../../lib/db' // Use your db connection
// import Admin from '../../../../lib/models/admin' // Admin model
// import admin from '../../../lib/models/admin'
// import admin from '../../../lib/models/admin'
import admin from '../../../lib/models/admin'

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your_admin_secret_key';

export async function POST(request) {
  try {
    // Parse the request body
    const { username, password } = await request.json();

    // Connect to the database
    await connect();

    // Find admin by username
    const adminUser = await admin.findOne({ username });
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Verify if the user is an admin
    if (!adminUser.isAdmin) {
      return NextResponse.json({ message: 'Access forbidden: Not an admin' }, { status: 403 });
    }

    // Generate JWT token valid for 30 minutes
    const token = jwt.sign(
      { adminId: adminUser._id, username: adminUser.username, isAdmin: adminUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Admin login error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
