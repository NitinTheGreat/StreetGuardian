import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'
const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_uri'

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  isAdmin: Boolean,
  rewardPoints: { type: Number, default: 0 },
  otp: String,
  otpCreatedAt: Date,
}, { timestamps: true })

// User Model
const User = mongoose.models.User || mongoose.model('User', UserSchema)

// Database connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return
  await mongoose.connect(MONGODB_URI)
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    await connectDB()

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ rewardPoints: user.rewardPoints }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user rewards:', error)
    return NextResponse.json({ message: 'Failed to fetch user rewards' }, { status: 500 })
  }
}

