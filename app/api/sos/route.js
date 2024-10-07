import { NextResponse } from 'next/server'
import connect from '../../../lib/db'
import SOS from '../../../lib/models/sos'

export async function POST(request) {
  try {
    const { userLocation, nearestLocation, serviceType } = await request.json()

    await connect()

    const newSOS = new SOS({
      userLocation,
      nearestLocation,
      serviceType,
      timestamp: new Date(),
    })

    await newSOS.save()

    return NextResponse.json({ message: 'SOS request saved successfully' }, { status: 200 })
  } catch (error) {
    console.error('SOS request error:', error)
    return NextResponse.json({ message: 'Failed to save SOS request' }, { status: 500 })
  }
}