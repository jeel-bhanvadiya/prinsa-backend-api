const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    age: { type: Number, required: true, min: 1 },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    salary: { type: Number, required: true, min: 0 },
    joiningDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin', required: true },
  },
  { timestamps: true }
);

employeeSchema.index({ email: 1 });
employeeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
