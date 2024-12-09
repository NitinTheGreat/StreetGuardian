import dbConnect from '../../../lib/db'
import SOS from '../../../lib/models/sos'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'POST') {
    try {
      const { location, serviceType, severity, description } = req.body

      const sosData = new SOS({
        userLocation: {
          type: 'Point',
          coordinates: [location.lat, location.lng] // Note the order: [longitude, latitude]
        },
        serviceType,
        severity,
        description,
        // nearestLocation will be populated later, perhaps by a separate process
        nearestLocation: {
          type: 'Point',
          coordinates: [0, 0], // placeholder
          name: 'Unknown'
        }
      })

      await sosData.save()
      res.status(201).json({ success: true, data: sosData })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}

