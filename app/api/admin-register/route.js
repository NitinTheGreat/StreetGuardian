import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connect from '../../../lib/db'
import admin from '../../../lib/models/admin'

export async function POST(request) {
  try {
    
    const { username, email, phone, password } = await request.json()

    await connect()

    const existingAdmin = await admin.findOne({ $or: [{ email }, { phone }] })
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin with this email or phone already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = new admin({
      username,
      email,
      phone,
      password: hashedPassword,
    })

    await newAdmin.save()

    return NextResponse.json({ message: 'Admin registration successful' }, { status: 201 })
  } catch (error) {
    console.error('Admin registration error:', error)
    return NextResponse.json({ message: 'Admin registration failed' }, { status: 500 })
  }
}
