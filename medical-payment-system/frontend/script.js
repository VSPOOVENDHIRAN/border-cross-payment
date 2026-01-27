// ============================================
// IoT-Blockchain Medical Payment System
// Frontend JavaScript - API Integration
// ============================================

const API_BASE_URL = 'http://localhost:3001';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show status message with animation
 */
function showStatus(elementId, message, type = 'success') {
    const statusElement = document.getElementById(elementId);
    statusElement.textContent = message;
    statusElement.className = `status-message ${type} show`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 5000);
}

/**
 * Format timestamp to readable format
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Get status badge based on energy level
 */
function getEnergyStatusBadge(energyUsed) {
    if (energyUsed < 5) {
        return '<span class="badge badge-success">Low</span>';
    } else if (energyUsed < 10) {
        return '<span class="badge badge-pending">Medium</span>';
    } else {
        return '<span class="badge badge-error">High</span>';
    }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Register Hospital
 */
async function registerHospital() {
    const name = document.getElementById('hospitalName').value;
    const country = document.getElementById('hospitalCountry').value;
    const address = document.getElementById('hospitalAddress').value;

    // Validate input
    if (!name || !country) {
        showStatus('hospitalStatus', 'Please fill in all required fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register-hospital`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, country, address })
        });

        const data = await response.json();

        if (data.success) {
            showStatus('hospitalStatus', `✓ ${data.message}`, 'success');
            // Clear form
            document.getElementById('hospitalName').value = '';
            document.getElementById('hospitalAddress').value = '';
            console.log('Hospital registered:', data.data);
        } else {
            showStatus('hospitalStatus', `✗ ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error registering hospital:', error);
        showStatus('hospitalStatus', '✗ Failed to connect to server. Make sure backend is running.', 'error');
    }
}

/**
 * Register User
 */
async function registerUser() {
    const name = document.getElementById('userName').value;
    const country = document.getElementById('userCountry').value;

    // Validate input
    if (!name || !country) {
        showStatus('userStatus', 'Please fill in all required fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, country })
        });

        const data = await response.json();

        if (data.success) {
            showStatus('userStatus', `✓ ${data.message}`, 'success');
            // Clear form
            document.getElementById('userName').value = '';
            console.log('User registered:', data.data);
        } else {
            showStatus('userStatus', `✗ ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        showStatus('userStatus', '✗ Failed to connect to server. Make sure backend is running.', 'error');
    }
}

/**
 * Fetch Energy Report
 */
async function fetchEnergyReport() {
    try {
        const response = await fetch(`${API_BASE_URL}/energy-report`);
        const result = await response.json();

        if (result.success) {
            const data = result.data;

            // Update statistics
            document.getElementById('totalReadings').textContent = data.totalReadings;
            document.getElementById('totalEnergy').textContent = `${data.totalEnergy} kWh`;
            document.getElementById('avgEnergy').textContent = `${data.averageEnergy} kWh`;

            // Update table
            const tableBody = document.getElementById('energyTableBody');

            if (data.latestReadings.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="no-data">No data available. Start IoT simulator to see live data.</td></tr>';
            } else {
                tableBody.innerHTML = data.latestReadings.map(reading => `
                    <tr>
                        <td><strong>${reading.equipmentId}</strong></td>
                        <td>${reading.energyUsed.toFixed(2)} kWh</td>
                        <td>${formatTimestamp(reading.timestamp)}</td>
                        <td>${getEnergyStatusBadge(reading.energyUsed)}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error fetching energy report:', error);
        // Don't show error message to avoid cluttering UI during auto-refresh
    }
}

/**
 * Mock Payment Approval (for demonstration)
 */
function showPaymentMock() {
    showStatus('paymentMockStatus', '✓ Payment approved! (Mock transaction - no real ETH transferred)', 'success');

    // Update badge to success
    setTimeout(() => {
        const badge = document.querySelector('.payment-info .badge');
        if (badge) {
            badge.className = 'badge badge-success';
            badge.textContent = 'Completed';
        }
    }, 500);
}

// ============================================
// AUTO-REFRESH ENERGY DATA
// ============================================

/**
 * Start auto-refresh for energy data
 */
function startAutoRefresh() {
    // Fetch immediately on load
    fetchEnergyReport();

    // Then fetch every 3 seconds
    setInterval(() => {
        fetchEnergyReport();
    }, 3000);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   Medical Payment System - Frontend Initialized       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('🌐 Frontend ready');
    console.log('📡 Connecting to backend at:', API_BASE_URL);
    console.log('⚡ Auto-refresh enabled for energy data\n');

    // Start auto-refresh for energy data
    startAutoRefresh();

    // Test backend connection
    fetch(`${API_BASE_URL}/`)
        .then(response => response.json())
        .then(data => {
            console.log('✅ Backend connection successful');
            console.log('Backend status:', data);
        })
        .catch(error => {
            console.error('❌ Backend connection failed:', error);
            console.log('⚠️  Make sure to start the backend server first:');
            console.log('   cd backend && npm install && npm start');
        });
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (event) => {
    // Enter key in input fields triggers respective registration
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;

        if (activeElement.id === 'hospitalName' ||
            activeElement.id === 'hospitalCountry' ||
            activeElement.id === 'hospitalAddress') {
            registerHospital();
        } else if (activeElement.id === 'userName' ||
            activeElement.id === 'userCountry') {
            registerUser();
        }
    }
});
