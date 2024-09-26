// lib/models/report.js
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: Object,
    required: true,
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  images: {
    type: [String], // Store image URLs or paths
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
  },
  comments: {
    type: String,
    default: '',
  },
  landmark: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Limit images to 3
function arrayLimit(val) {
  return val.length <= 3;
}

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
