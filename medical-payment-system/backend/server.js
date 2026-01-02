// ============================================
// IoT-Blockchain Medical Payment System
// Backend Server - Node.js + Express
// ============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================
app.use(cors()); // Enable CORS for frontend integration
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================
// IN-MEMORY DATA STORAGE
// (For academic prototype - no database needed)
// ============================================
let users = []; // Store registered users (India)
let hospitals = []; // Store registered hospitals (US)
let energyData = []; // Store IoT energy readings

// ============================================
// API ENDPOINT: REGISTER USER (INDIA)
// ============================================
app.post('/register-user', (req, res) => {
  const { name, country, walletAddress } = req.body;

  // Validate input
  if (!name || !country) {
    return res.status(400).json({
      success: false,
      message: 'Name and country are required'
    });
  }

  // Create user object
  const user = {
    id: users.length + 1,
    name,
    country,
    walletAddress: walletAddress || `0x${Math.random().toString(16).substr(2, 40)}`,
    registeredAt: new Date().toISOString()
  };

  users.push(user);

  console.log('✅ USER REGISTERED:', user);

  res.json({
    success: true,
    message: 'User registered successfully',
    data: user
  });
});

// ============================================
// API ENDPOINT: REGISTER HOSPITAL (US)
// ============================================
app.post('/register-hospital', (req, res) => {
  const { name, country, address } = req.body;

  // Validate input
  if (!name || !country) {
    return res.status(400).json({
      success: false,
      message: 'Hospital name and country are required'
    });
  }

  // Create hospital object
  const hospital = {
    id: hospitals.length + 1,
    name,
    country,
    address: address || 'N/A',
    walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    registeredAt: new Date().toISOString()
  };

  hospitals.push(hospital);

  console.log('🏥 HOSPITAL REGISTERED:', hospital);

  res.json({
    success: true,
    message: 'Hospital registered successfully',
    data: hospital
  });
});

// ============================================
// API ENDPOINT: RECEIVE IOT ENERGY DATA
// ============================================
app.post('/iot/energy-data', (req, res) => {
  const { equipmentId, energyUsed, timestamp } = req.body;

  // Validate input
  if (!equipmentId || energyUsed === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Equipment ID and energy used are required'
    });
  }

  // Create energy data object
  const energyRecord = {
    id: energyData.length + 1,
    equipmentId,
    energyUsed: parseFloat(energyUsed),
    timestamp: timestamp || new Date().toISOString(),
    unit: 'kWh'
  };

  energyData.push(energyRecord);

  console.log('⚡ ENERGY DATA RECEIVED:', energyRecord);

  res.json({
    success: true,
    message: 'Energy data recorded successfully',
    data: energyRecord
  });
});

// ============================================
// API ENDPOINT: GET ENERGY REPORT
// ============================================
app.get('/energy-report', (req, res) => {
  // Calculate aggregated statistics
  const totalEnergy = energyData.reduce((sum, record) => sum + record.energyUsed, 0);
  const avgEnergy = energyData.length > 0 ? totalEnergy / energyData.length : 0;

  // Get latest 10 readings
  const latestReadings = energyData.slice(-10).reverse();

  // Group by equipment
  const byEquipment = {};
  energyData.forEach(record => {
    if (!byEquipment[record.equipmentId]) {
      byEquipment[record.equipmentId] = {
        equipmentId: record.equipmentId,
        totalEnergy: 0,
        readingCount: 0
      };
    }
    byEquipment[record.equipmentId].totalEnergy += record.energyUsed;
    byEquipment[record.equipmentId].readingCount++;
  });

  console.log('📊 ENERGY REPORT REQUESTED - Total Records:', energyData.length);

  res.json({
    success: true,
    data: {
      totalReadings: energyData.length,
      totalEnergy: totalEnergy.toFixed(2),
      averageEnergy: avgEnergy.toFixed(2),
      latestReadings,
      byEquipment: Object.values(byEquipment)
    }
  });
});

// ============================================
// API ENDPOINT: GET ALL REGISTERED USERS
// ============================================
app.get('/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// ============================================
// API ENDPOINT: GET ALL REGISTERED HOSPITALS
// ============================================
app.get('/hospitals', (req, res) => {
  res.json({
    success: true,
    count: hospitals.length,
    data: hospitals
  });
});

// ============================================
// ROOT ENDPOINT
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'IoT-Blockchain Medical Payment System API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'POST /register-user': 'Register a user (India)',
      'POST /register-hospital': 'Register a hospital (US)',
      'POST /iot/energy-data': 'Submit IoT energy data',
      'GET /energy-report': 'Get aggregated energy report',
      'GET /users': 'Get all registered users',
      'GET /hospitals': 'Get all registered hospitals'
    }
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   IoT-Blockchain Medical Payment System - Backend     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📡 Ready to receive requests...\n');
});
