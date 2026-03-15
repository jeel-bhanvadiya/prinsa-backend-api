const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

const createEmployee = async (req, res) => {
  try {
    const { name, email, password, age, gender, salary, joiningDate } = req.body;
    if (!name || !email || !password || age == null || !gender || salary == null || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, age, gender, salary and joiningDate are required.',
      });
    }
    const existing = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Employee with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await Employee.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      age: Number(age),
      gender: gender.toLowerCase(),
      salary: Number(salary),
      joiningDate: new Date(joiningDate),
      createdBy: req.superAdmin._id,
    });
    const { password: _, ...employeeData } = employee.toObject();
    res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: employeeData,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const listEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ createdBy: req.superAdmin._id })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      success: true,
      data: employees,
      count: employees.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, age, gender, salary, joiningDate } = req.body;
    const employee = await Employee.findOne({ _id: id, createdBy: req.superAdmin._id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    if (name !== undefined) employee.name = name.trim();
    if (email !== undefined) employee.email = email.toLowerCase().trim();
    if (password !== undefined && password.length >= 6) {
      employee.password = await bcrypt.hash(password, 10);
    }
    if (age !== undefined) employee.age = Number(age);
    if (gender !== undefined) employee.gender = gender.toLowerCase();
    if (salary !== undefined) employee.salary = Number(salary);
    if (joiningDate !== undefined) employee.joiningDate = new Date(joiningDate);
    await employee.save();
    const { password: _, ...employeeData } = employee.toObject();
    res.json({
      success: true,
      message: 'Employee updated successfully.',
      data: employeeData,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOneAndDelete({ _id: id, createdBy: req.superAdmin._id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const salaryList = async (req, res) => {
  try {
    const employees = await Employee.find({ createdBy: req.superAdmin._id })
      .select('name email age gender salary joiningDate')
      .sort({ salary: -1 })
      .lean();
    const totalSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
    res.json({
      success: true,
      data: employees,
      count: employees.length,
      totalSalary,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee,
  salaryList,
};
