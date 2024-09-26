import { NextResponse } from 'next/server'
import connect from '../../../lib/db' 
import User from '../../../lib/models/user' 

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    await connect()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 })
    }

    user.isVerified = true
    user.otp = null 
    await user.save()

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ message: 'OTP verification failed' }, { status: 500 })
  }
}
