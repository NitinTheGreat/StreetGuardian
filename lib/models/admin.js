import mongoose from "mongoose";

// Create a user schema with validations for email, phone, and other fields
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true, // Removes extra spaces
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (v) {
        // Regex for validating email format
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    validate: {
      validator: function (v) {
        // Regex for validating phone number format (allows optional country code)
        return /^\+?[0-9]{10,15}$/.test(v); // Allows 10-15 digits with optional `+`
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  isAdmin: {
    type: Boolean,
    default: true, // Default is non-admin
  },
  otp: {
    type: String,
    default: null, // To store OTP if using OTP verification
  },
  otpCreatedAt: {
    type: Date,
    default: null, // To store when the OTP was created for expiry check
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Add indexes for email and phone to ensure uniqueness and speed up queries
AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ phone: 1 }, { unique: true });

// Export the User model or use an existing one if it exists
export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
