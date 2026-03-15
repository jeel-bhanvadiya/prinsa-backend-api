const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

const signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, hobby } = req.body;
    if (!name || !email || !password || age == null || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, age and gender are required.',
      });
    }
    const existing = await SuperAdmin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await SuperAdmin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      age: Number(age),
      gender: gender.toLowerCase(),
      hobby: Array.isArray(hobby) ? hobby.map((h) => String(h).trim()).filter(Boolean) : [],
    });
    const token = jwt.sign(
      { userId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      message: 'Super admin created successfully.',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        age: admin.age,
        gender: admin.gender,
        hobby: admin.hobby,
        token,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const admin = await SuperAdmin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { userId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        age: admin.age,
        gender: admin.gender,
        hobby: admin.hobby,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { signup, login };
