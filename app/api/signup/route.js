import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connect from '../../../lib/db' // Using your custom connect function
import User from '../../../lib/models/user' // Assuming the User model is in the `lib/models/user.js`

export async function POST(request) {
  try {
    // Parse the request body
    const { username, email, phone, password } = await request.json()

    // Connect to the database
    await connect()

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    })

    // Save the new user to the database
    await newUser.save()

    // Optionally, send an OTP or other logic
    // Here you could add logic to send an email with OTP for verification

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}