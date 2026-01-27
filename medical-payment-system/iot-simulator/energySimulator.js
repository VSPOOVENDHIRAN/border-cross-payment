// ============================================
// IoT Energy Simulator
// Simulates hospital surgical equipment energy usage
// ============================================

const http = require('http');

// ============================================
// CONFIGURATION
// ============================================
const BACKEND_URL = 'http://localhost:3000';
const SEND_INTERVAL = 3000; // Send data every 3 seconds

// Simulated hospital equipment
const EQUIPMENT_LIST = [
    { id: 'OT_MACHINE_1', name: 'Operating Theater Machine 1', baseEnergy: 15 },
    { id: 'VENTILATOR_1', name: 'Ventilator Unit 1', baseEnergy: 8 },
    { id: 'ANESTHESIA_UNIT_1', name: 'Anesthesia Unit 1', baseEnergy: 5 },
    { id: 'SURGICAL_LIGHT_1', name: 'Surgical Light System 1', baseEnergy: 3 },
    { id: 'MONITOR_SYSTEM_1', name: 'Patient Monitor System 1', baseEnergy: 2 }
];

// ============================================
// GENERATE RANDOM ENERGY VALUE
// ============================================
function generateEnergyReading(equipment) {
    // Generate random energy usage around base value (±30% variation)
    const variation = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3
    const energyUsed = equipment.baseEnergy * (1 + variation);
    return parseFloat(energyUsed.toFixed(2));
}

// ============================================
// SEND ENERGY DATA TO BACKEND
// ============================================
function sendEnergyData(equipmentId, energyUsed) {
    const data = JSON.stringify({
        equipmentId,
        energyUsed,
        timestamp: new Date().toISOString()
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/iot/energy-data',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(`✅ [${equipmentId}] Sent: ${energyUsed} kWh`);
            } else {
                console.log(`❌ [${equipmentId}] Error: ${res.statusCode}`);
            }
        });
    });

    req.on('error', (error) => {
        console.error(`❌ Connection Error: ${error.message}`);
        console.log('⚠️  Make sure the backend server is running on http://localhost:3000');
    });

    req.write(data);
    req.end();
}

// ============================================
// SIMULATE ENERGY READINGS
// ============================================
function startSimulation() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         IoT Energy Simulator - STARTED                ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`📡 Simulating ${EQUIPMENT_LIST.length} hospital equipment units`);
    console.log(`⏱️  Sending data every ${SEND_INTERVAL / 1000} seconds\n`);

    // Send initial readings immediately
    EQUIPMENT_LIST.forEach(equipment => {
        const energyUsed = generateEnergyReading(equipment);
        sendEnergyData(equipment.id, energyUsed);
    });

    // Continue sending readings at regular intervals
    setInterval(() => {
        console.log(`\n⚡ [${new Date().toLocaleTimeString()}] Generating new readings...`);

        EQUIPMENT_LIST.forEach(equipment => {
            const energyUsed = generateEnergyReading(equipment);
            sendEnergyData(equipment.id, energyUsed);
        });
    }, SEND_INTERVAL);
}

// ============================================
// START SIMULATOR
// ============================================
console.log('🔌 IoT Energy Simulator Initializing...');
console.log('⏳ Waiting 2 seconds before starting...\n');

setTimeout(() => {
    startSimulation();
}, 2000);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGINT', () => {
    console.log('\n\n🛑 Simulator stopped by user');
    process.exit(0);
});
