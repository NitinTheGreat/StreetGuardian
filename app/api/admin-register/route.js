import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connect from '../../../lib/db' // Use your db connection
// import Admin from '../../../../lib/models/admin' // Admin model
import admin from '../../../lib/models/admin'

export async function POST(request) {
  try {
    // Parse the request body
    const { username, email, phone, password } = await request.json()

    // Connect to the database
    await connect()

    // Check if email or phone number already exists
    const existingAdmin = await admin.findOne({ $or: [{ email }, { phone }] })
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin with this email or phone already exists' }, { status: 400 })
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new admin
    const newAdmin = new admin({
      username,
      email,
      phone,
      password: hashedPassword,
    })

    // Save the admin to the database
    await newAdmin.save()

    return NextResponse.json({ message: 'Admin registration successful' }, { status: 201 })
  } catch (error) {
    console.error('Admin registration error:', error)
    return NextResponse.json({ message: 'Admin registration failed' }, { status: 500 })
  }
}
