import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connect from '../../../../lib/db' // Use your db connection
import Admin from '../../../../lib/models/admin' // Admin model

const JWT_SECRET = process.env.JWT_SECRET || 'your_admin_secret_key';

export async function POST(request) {
  try {
    // Parse the request body
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 400 })
    }

    // Verify the token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Connect to the database
    await connect()

    // Check if the admin exists and is still an admin
    const admin = await Admin.findOne({ _id: decoded.adminId })
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ message: 'Admin not found or no longer has admin privileges' }, { status: 403 })
    }

    return NextResponse.json({ 
      valid: true, 
      adminId: admin._id, 
      username: admin.username,
      isAdmin: admin.isAdmin
    }, { status: 200 })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ message: 'Token validation failed' }, { status: 500 })
  }
}