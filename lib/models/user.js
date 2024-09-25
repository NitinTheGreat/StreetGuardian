import mongoose from "mongoose";

// Create a user schema with validations for email, phone, and other fields
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Regex for validating phone number format (adapt if needed)
        return /^[0-9]{10}$/.test(v); // Assuming 10 digits for phone number
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Admin will always be false
  },
  rewardPoints: {
    type: Number,
    default: 0, // Default reward points set to 0
  },
});

// Export the User model or use an existing one if it exists
export default mongoose.models.User || mongoose.model("User", UserSchema);
