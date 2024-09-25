import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connect from '../../../lib/db' // Using your custom connect function
import User from '../../../lib/models/user' // Assuming the User model is in the `lib/models/user.js`
import nodemailer from 'nodemailer'

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

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Create a new user with OTP (you can also save the OTP temporarily in a separate DB)
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      otp, // You can store the OTP temporarily for verification
    })

    // Save the new user to the database
    await newUser.save()

    // Send the OTP email using Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services as well like SendGrid, Mailgun, etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email account
        pass: process.env.EMAIL_PASSWORD, // Your email password (or App password)
      },
    })

    let mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your OTP Code',
      text: `Hello ${username},\n\nYour OTP code is ${otp}. It will expire in 10 minutes.\n\nThank you!`,
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}
