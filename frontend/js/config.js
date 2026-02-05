// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    ENDPOINTS: {
        // Auth
        LOGIN: '/api/auth/login',

        // Hospital
        REGISTER_HOSPITAL: '/api/hospitals/register',
        GET_HOSPITAL_REQUESTS: '/api/hospitals/show_requests',
        GET_PENDING_REQUESTS: '/api/hospitals/pending_requests',
        UPDATE_REQUEST_STATUS: '/api/hospitals/update_request',
        CREATE_EMERGENCY_CASE: '/api/hospitals/create_emergency_case',
        ADD_SETTLEMENT_ACCOUNT: '/api/hospitals/add_settlement_account',
        UPDATE_SETTLEMENT_ACCOUNT: '/api/hospitals/update_account',

        // History
        GET_HOSPITAL_EMERGENCIES: '/api/history/hos',
        GET_DESTINATION_EMERGENCIES: '/api/history/dest',

        // Health
        HEALTH: '/health'
    }
};

// App Constants
const APP_CONSTANTS = {
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',

    HOSPITAL_TYPES: [
        'General Hospital',
        'Specialty Hospital',
        'Teaching Hospital',
        'Research Hospital',
        'Trauma Center',
        'Rehabilitation Center'
    ],

    OWNERSHIP_TYPES: [
        'Government',
        'Private',
        'Non-Profit',
        'Public-Private Partnership'
    ],

    COUNTRIES: [
        'United States',
        'India',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Singapore',
        'UAE'
    ],

    URGENCY_LEVELS: [
        'Critical',
        'High',
        'Medium',
        'Low'
    ],

    TREATMENT_COMPLEXITY: [
        'Simple',
        'Moderate',
        'Complex',
        'Highly Complex'
    ],

    CONSCIOUSNESS_STATUS: [
        'Alert',
        'Drowsy',
        'Unconscious',
        'Sedated'
    ],

    AIRWAY_STATUS: [
        'Clear',
        'Obstructed',
        'Intubated',
        'Tracheostomy'
    ],

    BREATHING_STATUS: [
        'Normal',
        'Labored',
        'Assisted',
        'Mechanical Ventilation'
    ],

    CIRCULATION_STATUS: [
        'Stable',
        'Unstable',
        'Shock',
        'Cardiac Arrest'
    ],

    CURRENCIES: [
        'USD',
        'INR',
        'EUR',
        'GBP',
        'AUD',
        'CAD',
        'JPY',
        'SGD',
        'AED'
    ],

    SPECIALTIES: [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Oncology',
        'Pediatrics',
        'Emergency Medicine',
        'Trauma Surgery',
        'Critical Care',
        'Transplant Surgery'
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, APP_CONSTANTS };
}
