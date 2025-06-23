const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // Standard TTL of 1 hour
  },
});

// TTL (Time To Live) Index for automatic deletion of expired tokens
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// If the model already exists, use it; otherwise, create a new one
const BlacklistedToken =
  mongoose.models.BlacklistedToken ||
  mongoose.model("BlacklistedToken", blacklistedTokenSchema);

module.exports = BlacklistedToken;