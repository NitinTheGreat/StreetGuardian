import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connect from '../../../lib/db' 
import User from '../../../lib/models/user'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { username, email, phone, password } = await request.json()

    
    await connect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      otp, 
    })

    await newUser.save()

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
      },
    })

    let mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email, 
      subject: 'Your OTP Code',
      text: `Hello ${username},\n\nYour OTP code is ${otp}. It will expire in 10 minutes.\n\nThank you!`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}
