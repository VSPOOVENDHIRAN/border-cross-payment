# Frontend - Healthcare Coordination Platform

## Overview
A modern, dynamic frontend built with HTML, CSS, and JavaScript for the cross-border emergency medical payment system.

## Features

### 🏠 Landing Page (`index.html`)
- Professional hero section
- Feature highlights
- How it works section
- Call-to-action

### 📝 Hospital Registration (`register.html`)
- Comprehensive registration form
- File upload for registration certificates
- Real-time form validation
- Integration with backend API

### 🔐 Login (`login.html`)
- Secure authentication
- Token-based session management
- Auto-redirect to dashboard

### 📊 Hospital Dashboard (`dashboard.html`)
- **Emergency Case Creation**: Create cross-border emergency cases with detailed medical information
- **Settlement Account Management**: Add and manage bank account details for settlements
- **Emergency History**: View all emergency cases with status tracking
- Real-time statistics
- Tab-based navigation

### 👨‍💼 Admin Panel (`admin.html`)
- View pending hospital registration requests
- Approve or reject requests
- View registration certificates
- Statistics dashboard

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Fetch API**: For backend communication

## File Structure

```
frontend/
├── index.html              # Landing page
├── register.html           # Hospital registration
├── login.html              # Authentication
├── dashboard.html          # Hospital dashboard
├── admin.html              # Admin panel
├── css/
│   ├── styles.css          # Main stylesheet
│   └── animations.css      # Animation definitions
└── js/
    ├── config.js           # API configuration
    ├── utils.js            # Utility functions
    ├── api.js              # API integration layer
    ├── auth.js             # Authentication module
    ├── register.js         # Registration logic
    ├── dashboard.js        # Dashboard functionality
    └── admin.js            # Admin panel logic
```

## Getting Started

### Prerequisites
- Backend server running on `http://localhost:5000`
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Running the Frontend

1. **Option 1: Direct File Access**
   - Simply open `index.html` in your browser
   - Navigate through the application

2. **Option 2: Local Server (Recommended)**
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   ```
   Then open `http://localhost:8000` in your browser

### Configuration

Update the API base URL in `js/config.js` if your backend is running on a different port:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',  // Change this if needed
  // ...
};
```

## User Flows

### 1. Hospital Registration Flow
1. Navigate to **Register Hospital**
2. Fill in all required fields:
   - Hospital information
   - Location details
   - Contact information
   - Administrator details
3. Upload registration certificate (PDF, JPG, or PNG)
4. Accept consent
5. Submit registration
6. Wait for admin approval

### 2. Login & Dashboard Flow
1. Navigate to **Login**
2. Enter email and password
3. Click **Login**
4. Redirected to dashboard
5. Access features:
   - Create emergency cases
   - Manage settlement account
   - View emergency history

### 3. Admin Approval Flow
1. Navigate to **Admin** panel
2. View pending hospital requests
3. Review hospital details
4. View registration certificate
5. Approve or reject request

## API Integration

All API calls are handled through the `api.js` module:

```javascript
// Example: Create emergency case
const result = await api.createEmergencyCase(caseData);

if (result.success) {
  // Handle success
} else {
  // Handle error
}
```

### Available API Methods

- `api.login(email, password)`
- `api.registerHospital(formData)`
- `api.createEmergencyCase(caseData)`
- `api.addSettlementAccount(accountData)`
- `api.getHospitalEmergencies()`
- `api.getPendingRequests()`
- `api.updateRequestStatus(id, status, reviewer)`

## Features & Components

### Form Validation
- Real-time validation
- Field-level error messages
- Email and phone number validation
- Required field checking

### File Upload
- Drag and drop support
- File type validation (PDF, JPG, PNG)
- File size validation (max 5MB)
- Visual feedback

### Notifications
- Toast notifications for success/error messages
- Modal dialogs for confirmations
- Loading indicators for async operations

### Authentication
- Token-based authentication
- Session persistence with localStorage
- Protected routes
- Auto-redirect for authenticated users

### Responsive Design
- Mobile-friendly layouts
- Flexible grid system
- Responsive navigation
- Touch-friendly buttons

## Styling

### Color Scheme
- **Primary**: Blue (#0066cc) - Trust and healthcare
- **Secondary**: Teal (#00a8cc) - Modern and professional
- **Accent**: Green (#00d4aa) - Success and growth
- **Status Colors**: Success, warning, error, info

### Design Principles
- Clean and professional
- Healthcare-focused aesthetics
- Consistent spacing and typography
- Smooth animations and transitions
- Accessible color contrasts

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- No sensitive data stored in localStorage (only tokens)
- HTTPS recommended for production
- CORS enabled on backend
- Input validation on both frontend and backend
- File upload validation

## Troubleshooting

### Issue: "Failed to connect to server"
**Solution**: Ensure backend is running on `http://localhost:5000`

### Issue: "Login failed"
**Solution**: 
- Check if hospital is approved by admin
- Verify email and password
- Check browser console for errors

### Issue: "File upload failed"
**Solution**:
- Ensure file is less than 5MB
- Use supported formats (PDF, JPG, PNG)
- Check network connection

### Issue: "Page not loading properly"
**Solution**:
- Clear browser cache
- Check browser console for JavaScript errors
- Ensure all CSS and JS files are loaded

## Development

### Adding New Features

1. **Add new page**:
   - Create HTML file
   - Add navigation link
   - Create corresponding JS file

2. **Add new API endpoint**:
   - Add endpoint to `config.js`
   - Add method to `api.js`
   - Use in page-specific JS file

3. **Add new styles**:
   - Add to `styles.css` for components
   - Add to `animations.css` for animations

### Code Style

- Use ES6+ features
- Async/await for promises
- Descriptive variable names
- Comments for complex logic
- Consistent indentation (2 spaces)

## Performance

- Minimal dependencies (no frameworks)
- Optimized CSS with variables
- Lazy loading for images
- Efficient DOM manipulation
- Debounced event handlers

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced filtering and search
- [ ] Data export functionality
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA) features

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify backend is running correctly
4. Check network requests in browser DevTools

---

**Built with ❤️ for healthcare professionals**
