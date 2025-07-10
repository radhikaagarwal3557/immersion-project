require('dotenv').config();           // Load env vars
const express = require('express');   // Express app
const cors = require('cors');          // Enable CORS
const mongoose = require('mongoose');  // MongoDB
const app = express();


app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/teacher_dashboard';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


const authRoutes = require('./routes/auth');           
const studentRoutes = require('./routes/students');     
const assignmentRoutes = require('./routes/assignments'); 

//  Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assignments', assignmentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Teacher Dashboard API is up and running 🎉');
});

//  Error handling for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
