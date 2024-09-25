// import { NextResponse } from 'next/server'
// import nodemailer from 'nodemailer'

// export async function POST(request) {
//   const { username, email, phone, password } = await request.json()

//   // Here you would typically save the user data to your database
//   // For this example, we'll just generate an OTP and send it via email

//   const otp = Math.floor(100000 + Math.random() * 900000).toString()

//   // Save the OTP to your database or a temporary storage, associated with the email

//   // Send OTP via email
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   })

//   try {
//     await transporter.sendMail({
//       from: '"AO3 Extension" <noreply@ao3extension.com>',
//       to: email,
//       subject: "Verify your email",
//       text: `Your OTP is: ${otp}`,
//       html: `<b>Your OTP is: ${otp}</b>`,
//     })

//     return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 })
//   } catch (error) {
//     console.error('Error sending email:', error)
//     return NextResponse.json({ message: 'Error sending OTP' }, { status: 500 })
//   }
// }