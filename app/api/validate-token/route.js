// app/api/validate-token/route.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

export async function POST(request) {
  try {
    // Parse the request body to get the token
    const { token } = await request.json()

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET)

    // If token is valid, return success response
    return NextResponse.json({ valid: true, decoded }, { status: 200 })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ valid: false, message: 'Invalid token' }, { status: 401 })
  }
}
