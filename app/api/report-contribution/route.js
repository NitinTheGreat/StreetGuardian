import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '@/../../../StreetGuardian2.0/lib/models/user'

export async function POST(request) {
  try {
    const { category, points } = await request.json()

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)

    // For demonstration purposes, we'll use a hardcoded user ID
    // In a real application, you'd get the user ID from the session
    const userId = '64a1b2c3d4e5f6g7h8i9j0k1'

    // Find the user and update their reward points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { rewardPoints: points } },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ newPoints: user.rewardPoints }, { status: 200 })
  } catch (error) {
    console.error('Error reporting contribution:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect()
  }
}

