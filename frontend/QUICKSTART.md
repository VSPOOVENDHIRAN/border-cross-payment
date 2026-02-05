# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend Server

```bash
cd c:\Users\Prabanjan M\Desktop\ccp_2\border-cross-payment
npm start
```

The server should start on `http://localhost:5000`

### Step 2: Open the Frontend

**Option A: Direct File Access**
1. Navigate to `c:\Users\Prabanjan M\Desktop\ccp_2\border-cross-payment\frontend`
2. Double-click `index.html`

**Option B: Local Server (Recommended)**
```bash
cd c:\Users\Prabanjan M\Desktop\ccp_2\border-cross-payment\frontend

# Using Python
python -m http.server 8000

# OR using Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser

### Step 3: Explore the Application

1. **Landing Page** - Overview of the platform
2. **Register Hospital** - Submit a registration request
3. **Admin Panel** - Approve the registration
4. **Login** - Access the dashboard
5. **Dashboard** - Create emergency cases and manage accounts

---

## 📋 Complete User Flow

### 1. Hospital Registration
1. Click **"Register Hospital"** in navigation
2. Fill in all required fields:
   - Hospital name: "Mayo Clinic"
   - Type: "General Hospital"
   - Country: "United States"
   - Email: "admin@mayoclinic.com"
   - etc.
3. Upload a registration certificate (any PDF or image)
4. Check the consent box
5. Click **"Submit Registration Request"**
6. Note the Request ID shown in the success modal

### 2. Admin Approval
1. Navigate to **"Admin"** panel
2. You'll see the pending request
3. Click **"View Certificate"** to see the uploaded file
4. Click **"Approve"** to approve the hospital
5. Confirm the approval

### 3. Login
1. Go to **"Login"** page
2. Enter the email used during registration
3. Enter the password (from Supabase auth)
4. Click **"Login"**
5. You'll be redirected to the dashboard

### 4. Create Emergency Case
1. On the dashboard, you're on the **"Create Emergency Case"** tab by default
2. Fill in the emergency case form:
   - Source Country: "India"
   - Destination Country: "United States"
   - Destination Hospital Ref Code: (from approved hospital)
   - Patient details (age, gender, nationality)
   - Medical information (diagnosis, urgency, etc.)
   - Clinical status (consciousness, airway, breathing, circulation)
   - Treatment details (procedure, specialty, cost)
   - Consent information
3. Click **"Create Emergency Case"**
4. Note the Emergency ID in the success modal

### 5. Add Settlement Account
1. Click the **"Settlement Account"** tab
2. Fill in bank account details:
   - Account holder name
   - Bank name
   - Account number
   - Currency
   - Country
   - Optional: IFSC, SWIFT, IBAN codes
3. Click **"Add Settlement Account"**

### 6. View Emergency History
1. Click the **"Emergency History"** tab
2. See all emergency cases you've created
3. View status, patient details, costs, etc.

---

## 🎯 Key Features

### ✅ Hospital Registration
- Comprehensive form with validation
- File upload (drag & drop or click)
- Real-time validation feedback
- Success confirmation with Request ID

### ✅ Admin Panel
- View all pending requests
- See hospital details
- View registration certificates
- Approve or reject with one click
- Statistics dashboard

### ✅ Authentication
- Secure login with Supabase
- Token-based session
- Auto-redirect to dashboard
- Logout functionality

### ✅ Emergency Case Management
- Detailed medical information capture
- Cross-border validation
- Urgency and complexity tracking
- Cost estimation
- Emergency override consent

### ✅ Settlement Account
- Bank account configuration
- Multiple currency support
- International transfer codes
- Verification status tracking

### ✅ Emergency History
- List all cases
- Color-coded status badges
- Detailed case information
- Real-time updates

---

## 🎨 Design Features

- **Modern Healthcare Theme**: Professional blue/teal color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in, slide, and hover effects
- **Toast Notifications**: Success, error, warning, and info messages
- **Modal Dialogs**: Confirmations and detailed information
- **Loading States**: Visual feedback during API calls
- **Form Validation**: Real-time validation with helpful error messages

---

## 🔧 Configuration

If your backend is running on a different port, update `frontend/js/config.js`:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:YOUR_PORT',  // Change this
  // ...
};
```

---

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `DATABASE_URL` in backend `.env` file

### Login Issues
- Hospital must be approved by admin first
- Check Supabase authentication setup
- Verify email and password

### File Upload Issues
- Max file size: 5MB
- Supported formats: PDF, JPG, PNG
- Check Supabase storage bucket configuration

---

## 📱 Pages Overview

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `index.html` | Platform overview |
| Register | `register.html` | Hospital registration |
| Login | `login.html` | Authentication |
| Dashboard | `dashboard.html` | Main hospital interface |
| Admin | `admin.html` | Approval panel |

---

## 🎉 You're All Set!

The frontend is fully functional and ready to use. Explore all the features and test the complete workflow from registration to emergency case creation.

**Need help?** Check the [full README](README.md) for detailed documentation.
