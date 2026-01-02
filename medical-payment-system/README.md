# 🏥 IoT-Assisted Blockchain-Based Cross-Country Emergency Medical Payment System

## 📌 Project Overview

This is an **academic prototype** demonstrating the integration of **IoT**, **Blockchain**, and **Web Technologies** for cross-country emergency medical payments. The system simulates energy monitoring of hospital surgical equipment and facilitates blockchain-based payments from India to US hospitals.

**Important Clarifications:**
- ⚡ **IoT** is used ONLY for energy measurement of hospital surgical equipment
- 🚨 **Emergency** refers to urgent surgery payment, NOT health sensing
- ⛓️ **Blockchain** is used ONLY for cross-country payment (India → US)
- 🎓 This is an **academic prototype** for final-year CSE project

---

## 🎯 Current Implementation Status: **25% Complete**

### ✅ What's Implemented (Working Code)

#### 1. **Backend Server (Node.js + Express)** ✓
- RESTful API with 6 endpoints
- In-memory data storage
- CORS enabled for frontend integration
- Real-time data processing

#### 2. **IoT Energy Simulator** ✓
- Simulates 5 hospital equipment units
- Generates random energy readings every 3 seconds
- Sends data to backend API automatically
- No hardware required

#### 3. **Blockchain Smart Contract (Solidity)** ✓
- Hospital registration function
- User registration function
- Emergency payment function
- Event logging for all transactions
- Academic prototype (no real ETH transfers)

#### 4. **Web3-Style Frontend** ✓
- MetaMask/Lovart-inspired design
- Dark theme with gradient accents
- 4 interactive dashboard cards
- Real-time energy data updates
- Smooth animations and hover effects
- Fully responsive design

### ❌ What's NOT Implemented (Remaining 75%)

- Real wallet integration (MetaMask)
- Actual ETH transfers
- User authentication & authorization
- Database integration
- Smart contract deployment to testnet
- Payment gateway integration
- Security features (encryption, JWT)
- Production deployment
- Advanced analytics & reporting
- Mobile application

---

## 📂 Project Structure

```
medical-payment-system/
├── backend/
│   ├── server.js              # Express server with REST APIs
│   ├── package.json           # Node.js dependencies
│   ├── routes/                # (Reserved for future)
│   └── controllers/           # (Reserved for future)
│
├── iot-simulator/
│   └── energySimulator.js     # IoT energy data simulator
│
├── blockchain/
│   └── EmergencyPayment.sol   # Solidity smart contract
│
├── frontend/
│   ├── index.html             # Main dashboard
│   ├── style.css              # Web3-style CSS
│   └── script.js              # API integration & UI logic
│
└── README.md                  # This file
```

---

## 🚀 How to Run the Project

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **Web Browser** (Chrome, Firefox, Edge)
- **Code Editor** (VS Code recommended)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - Request body parsing

### Step 2: Start the Backend Server

```bash
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║   IoT-Blockchain Medical Payment System - Backend     ║
╚════════════════════════════════════════════════════════╝
🚀 Server running on http://localhost:3000
📡 Ready to receive requests...
```

**Keep this terminal window open!**

### Step 3: Start the IoT Simulator (New Terminal)

Open a **new terminal window** and run:

```bash
cd iot-simulator
node energySimulator.js
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║         IoT Energy Simulator - STARTED                ║
╚════════════════════════════════════════════════════════╝
📡 Simulating 5 hospital equipment units
⏱️  Sending data every 3 seconds

✅ [OT_MACHINE_1] Sent: 14.23 kWh
✅ [VENTILATOR_1] Sent: 7.89 kWh
✅ [ANESTHESIA_UNIT_1] Sent: 4.56 kWh
...
```

**Keep this terminal window open too!**

### Step 4: Open the Frontend

Simply open the file in your browser:

```bash
cd frontend
# Then open index.html in your browser
```

**Or** double-click `frontend/index.html` to open it in your default browser.

---

## 🌐 Using the Dashboard

### 1️⃣ **Hospital Registration Card**
- Enter hospital name (e.g., "Mayo Clinic")
- Country is pre-filled as "United States"
- Click "Register Hospital"
- Success message will appear

### 2️⃣ **User Registration Card**
- Enter patient name (e.g., "Rajesh Kumar")
- Country is pre-filled as "India"
- Click "Register User"
- Success message will appear

### 3️⃣ **Live Energy Usage Monitor**
- Automatically updates every 3 seconds
- Shows total readings, total energy, and average usage
- Displays latest 10 equipment readings
- Color-coded status badges (Low/Medium/High)

### 4️⃣ **Emergency Payment Status**
- Shows mock surgery details
- Displays estimated cost
- "Approve Payment" button (mock transaction)
- No real ETH is transferred

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Register User (India)
```http
POST /register-user
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "country": "India",
  "walletAddress": "0x..." (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Rajesh Kumar",
    "country": "India",
    "walletAddress": "0x...",
    "registeredAt": "2025-12-25T17:46:12.000Z"
  }
}
```

#### 2. Register Hospital (US)
```http
POST /register-hospital
Content-Type: application/json

{
  "name": "Mayo Clinic",
  "country": "United States",
  "address": "Rochester, MN" (optional)
}
```

#### 3. Submit IoT Energy Data
```http
POST /iot/energy-data
Content-Type: application/json

{
  "equipmentId": "OT_MACHINE_1",
  "energyUsed": 14.23,
  "timestamp": "2025-12-25T17:46:12.000Z" (optional)
}
```

#### 4. Get Energy Report
```http
GET /energy-report
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReadings": 150,
    "totalEnergy": "1234.56",
    "averageEnergy": "8.23",
    "latestReadings": [...],
    "byEquipment": [...]
  }
}
```

#### 5. Get All Users
```http
GET /users
```

#### 6. Get All Hospitals
```http
GET /hospitals
```

---

## ⛓️ Blockchain Smart Contract

### Contract: `EmergencyPayment.sol`

**Location:** `blockchain/EmergencyPayment.sol`

**Solidity Version:** ^0.8.0

### Key Functions

#### 1. Register Hospital
```solidity
function registerHospital(string memory _name, string memory _country) public
```

#### 2. Register User
```solidity
function registerUser(string memory _name, string memory _country) public
```

#### 3. Emergency Payment
```solidity
function emergencyPayment(
    address _receiver,
    uint256 _amount,
    string memory _surgeryId
) public
```

### Events
- `HospitalRegistered`
- `UserRegistered`
- `EmergencyPaymentProcessed`

**Note:** This contract is for academic purposes. To deploy it:
1. Use [Remix IDE](https://remix.ethereum.org/)
2. Copy the contract code
3. Compile with Solidity 0.8.0+
4. Deploy to a testnet (Sepolia, Goerli)

---

## 🎨 Frontend Design Features

### Design Inspiration
- **MetaMask** - Wallet-style header and connection UI
- **Lovart** - Card-based layout and gradient aesthetics

### Key Features
- ✨ Dark theme with purple/blue gradients
- 🎴 Card-based component design
- 🌊 Smooth animations and transitions
- 🎯 Hover effects on interactive elements
- 📱 Fully responsive layout
- ⚡ Real-time data updates
- 🎨 Color-coded status badges

### Color Palette
- Primary: Purple-Blue Gradient (#667eea → #764ba2)
- Success: Cyan Gradient (#4facfe → #00f2fe)
- Background: Dark Navy (#0f0f23, #1a1a2e)
- Text: White with varying opacity

---

## 🧪 Testing the System

### Test Scenario 1: Complete Registration Flow
1. Start backend server
2. Open frontend
3. Register a hospital (e.g., "Mayo Clinic")
4. Register a user (e.g., "Rajesh Kumar")
5. Check browser console for success logs
6. Verify success messages appear

### Test Scenario 2: IoT Energy Monitoring
1. Start backend server
2. Start IoT simulator
3. Open frontend
4. Watch the "Live Energy Usage" card update automatically
5. Verify statistics change every 3 seconds
6. Check different equipment readings

### Test Scenario 3: API Testing
Use **Postman** or **curl** to test APIs:

```bash
# Register User
curl -X POST http://localhost:3000/register-user \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","country":"India"}'

# Get Energy Report
curl http://localhost:3000/energy-report
```

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js + Express | REST API server |
| **Frontend** | HTML + CSS + JavaScript | User interface |
| **Blockchain** | Solidity | Smart contracts |
| **IoT Simulation** | Node.js | Energy data generation |
| **Styling** | Vanilla CSS | Web3-style design |
| **Data Storage** | In-memory (Arrays) | Temporary storage |

---

## 📊 IoT Equipment Simulated

| Equipment ID | Name | Base Energy (kWh) |
|--------------|------|-------------------|
| OT_MACHINE_1 | Operating Theater Machine 1 | 15 |
| VENTILATOR_1 | Ventilator Unit 1 | 8 |
| ANESTHESIA_UNIT_1 | Anesthesia Unit 1 | 5 |
| SURGICAL_LIGHT_1 | Surgical Light System 1 | 3 |
| MONITOR_SYSTEM_1 | Patient Monitor System 1 | 2 |

**Note:** Energy values vary ±30% randomly to simulate real-world usage.

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to server"
**Solution:** Make sure the backend server is running on port 3000
```bash
cd backend
npm start
```

### Issue: "No energy data showing"
**Solution:** Start the IoT simulator
```bash
cd iot-simulator
node energySimulator.js
```

### Issue: "Port 3000 already in use"
**Solution:** Kill the process using port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: "npm install fails"
**Solution:** Clear npm cache and retry
```bash
npm cache clean --force
npm install
```

---

## 📚 Learning Resources

### For Blockchain Development
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org/)
- [Ethereum Testnet Faucets](https://faucets.chain.link/)

### For Web3 Development
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

### For Node.js
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🎓 Academic Context

### Project Type
Final-year Computer Science Engineering project

### Complexity Level
Intermediate to Advanced

### Key Concepts Demonstrated
1. **Full-Stack Development** - Frontend + Backend integration
2. **IoT Simulation** - Energy monitoring without hardware
3. **Blockchain Basics** - Smart contracts and events
4. **RESTful APIs** - CRUD operations
5. **Real-time Updates** - Auto-refresh functionality
6. **Modern UI/UX** - Web3-style design patterns

### Suitable For
- Final-year projects
- Hackathons
- Learning blockchain integration
- Portfolio demonstrations

---

## 🔮 Future Enhancements (Remaining 75%)

### Phase 2 (Next 25%)
- [ ] Real MetaMask wallet integration
- [ ] Deploy smart contract to testnet
- [ ] User authentication (JWT)
- [ ] Database integration (MongoDB)

### Phase 3 (Next 25%)
- [ ] Real payment processing
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] PDF report generation

### Phase 4 (Final 25%)
- [ ] Mobile app (React Native)
- [ ] Production deployment
- [ ] Security hardening
- [ ] Load testing & optimization

---

## 👥 Credits

**Developed for:** Computer Science Engineering Final-Year Project

**Technologies Used:** Node.js, Express, Solidity, HTML5, CSS3, JavaScript

**Design Inspiration:** MetaMask, Lovart, Modern Web3 Dashboards

---

## 📄 License

This is an academic project for educational purposes only.

---

## 🤝 Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review the code comments (heavily documented)
3. Test each component individually
4. Check browser console for error messages

---

## 🎉 Quick Start Summary

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - IoT Simulator
cd iot-simulator
node energySimulator.js

# Browser - Frontend
Open frontend/index.html in your browser
```

**That's it! Your system is now running! 🚀**

---

**Made with ❤️ for academic excellence**
