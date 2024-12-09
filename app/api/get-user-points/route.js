import { NextResponse } from 'next/server'
 
import jwt from 'jsonwebtoken'
import connect from '../../../lib/db'
import User from '../../../lib/models/user'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

export async function GET() {
  try {
    // Connect to MongoDB
    await connect()
    

    const token = localStorage.getItem('token')

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    // Verify the token
    const decoded = jwt.verify(token.value, JWT_SECRET)
    const userId = decoded.userId

    // Find the user and get their reward points
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ points: user.rewardPoints }, { status: 200 })

  } catch (error) {
    console.error('Error fetching user points:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

