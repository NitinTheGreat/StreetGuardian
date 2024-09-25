// app/api/login/route.js
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connect from '../../../lib/db' // Use your db connection
import User from '../../../lib/models/user' // User model

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request) {
  try {
    // Parse the request body
    const { email, password } = await request.json()

    // Connect to the database
    await connect()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }

    // Generate JWT token valid for 30 minutes
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30m' })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}
