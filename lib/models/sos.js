import mongoose from 'mongoose'

const SOSSchema = new mongoose.Schema({
  userLocation: {
    lat: Number,
    lng: Number,
  },
  nearestLocation: {
    lat: Number,
    lng: Number,
    name: String,
  },
  serviceType: String,
  timestamp: Date,
})

export default mongoose.models.SOS || mongoose.model('SOS', SOSSchema)