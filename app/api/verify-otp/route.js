import { NextResponse } from 'next/server'
import connect from '../../../lib/db' // Using your custom connect function
import User from '../../../lib/models/user' // Assuming the User model is in the `lib/models/user.js`

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    // Connect to the database
    await connect()

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 })
    }

    // Optionally, you can check if OTP has expired (if you implement expiry logic)
    // const isOtpExpired = checkOtpExpiry(user.otpCreatedAt)
    // if (isOtpExpired) {
    //   return NextResponse.json({ message: 'OTP expired' }, { status: 400 })
    // }

    // Mark the user as verified (for example by adding a `isVerified` field)
    user.isVerified = true
    user.otp = null // Optionally, clear the OTP after verification
    await user.save()

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ message: 'OTP verification failed' }, { status: 500 })
  }
}
