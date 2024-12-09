import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connect from '../../../lib/db';
import admin from '../../../lib/models/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your_admin_secret_key';
const TOKEN_EXPIRATION = '30m';

// POST method: Admin login functionality
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    await connect();

    const adminUser = await admin.findOne({ username });
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    if (!adminUser.isAdmin) {
      return NextResponse.json({ message: 'Access forbidden: Not an admin' }, { status: 403 });
    }

    const token = jwt.sign(
      { adminId: adminUser._id, username: adminUser.username, isAdmin: adminUser.isAdmin },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Admin login error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET method: Admin verification and restricted access
export async function GET(request) {
  try {
    console.log('Admin verification request:', request.headers.get('authorization'));
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Token missing' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded.isAdmin) {
        return NextResponse.json({ message: 'Access forbidden: Not an admin' }, { status: 403 });
      }

      return NextResponse.json({ message: 'Access granted', admin: decoded }, { status: 200 });
    } catch (error) {
      console.error('Admin verification error:', error.message);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin verification error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
