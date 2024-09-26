
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

export async function POST(request) {
  try {
    
    const { token } = await request.json()

    
    const decoded = jwt.verify(token, JWT_SECRET)

    return NextResponse.json({ valid: true, decoded }, { status: 200 })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ valid: false, message: 'Invalid token' }, { status: 401 })
  }
}
