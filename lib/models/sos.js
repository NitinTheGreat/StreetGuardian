import mongoose from 'mongoose'

const SOSSchema = new mongoose.Schema({
  userLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  serviceType: {
    type: String,
    enum: ['hospital', 'police', 'fire', 'ambulance'],
    required: true
  },
  severity: {
    type: String,
    enum: ['urgent', 'critical', 'warning'],
    required: true
  },
  nearestLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    name: String
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

// Add a 2dsphere index on the userLocation field
SOSSchema.index({ userLocation: '2dsphere' });

// Add a 2dsphere index on the nearestLocation field
SOSSchema.index({ nearestLocation: '2dsphere' });

export default mongoose.models.SOS || mongoose.model('SOS', SOSSchema)

