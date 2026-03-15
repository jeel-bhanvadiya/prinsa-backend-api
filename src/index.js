require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Set it in .env for production.');
}
if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set.');
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
