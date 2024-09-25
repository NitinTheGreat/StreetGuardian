// app/api/signup/route.js
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db' // assuming you have a `db.js` for MongoDB connection
import User from '../../../lib/models/user' // assuming you have a User model in the `models` folder

export async function POST(request) {
  try {
    const { username, email, phone, password } = await request.json()

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

    await newUser.save()

    // Optionally, you can send OTP logic here
    // Send an email with OTP, and return a response to the client

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}
