import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connect from '../../../../lib/db' // Use your db connection
// import Admin from '../../../../lib/models/admin' // Admin model
import admin from '../../../lib/models/admin'
import admin from '../../../lib/models/admin'

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your_admin_secret_key';

export async function POST(request) {
  try {
    // Parse the request body
    const { username, password } = await request.json()

    // Connect to the database
    await connect()

    // Find admin by username
    const admin = await admin.findOne({ username })
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }

    // Check if the user is an admin
    if (!admin.isAdmin) {
      return NextResponse.json({ message: 'User is not an admin' }, { status: 403 })
    }

    // Generate JWT token valid for 30 minutes
    const token = jwt.sign({ adminId: admin._id, username: admin.username, isAdmin: admin.isAdmin }, JWT_SECRET, { expiresIn: '30m' })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ message: 'Admin login failed' }, { status: 500 })
  }
}