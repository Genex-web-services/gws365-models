const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  userType: { type: String, enum: ['single', 'org'], default: 'single' },
  isActive: { type: Boolean, default: true },
  roleId: { type: String, default: 'orgAdmin'  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  is_user_partner:{ type: Boolean, default: false },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default:'6841fb36dd9a2cc544c35a13' }, // referred by a user (optional)
}, {
  timestamps: true
});

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = userSchema;
