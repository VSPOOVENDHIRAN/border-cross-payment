// API Integration Layer

class API {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Get auth token from storage
    getToken() {
        return Storage.get(APP_CONSTANTS.TOKEN_KEY);
    }

    // Build headers with auth token
    getHeaders(includeAuth = true, isFormData = false) {
        const headers = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(options.auth !== false, options.isFormData),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Request failed');
            }

            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    // GET request
    async get(endpoint, auth = true) {
        return this.request(endpoint, { method: 'GET', auth });
    }

    // POST request
    async post(endpoint, body, auth = true) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            auth
        });
    }

    // POST with FormData (for file uploads)
    async postFormData(endpoint, formData, auth = true) {
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            auth,
            isFormData: true
        });
    }

    // PUT request
    async put(endpoint, body, auth = true) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            auth
        });
    }

    // DELETE request
    async delete(endpoint, auth = true) {
        return this.request(endpoint, { method: 'DELETE', auth });
    }

    // ==================== AUTH ENDPOINTS ====================

    async login(email, password) {
        return this.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password }, false);
    }

    // ==================== HOSPITAL ENDPOINTS ====================

    async registerHospital(formData) {
        return this.postFormData(API_CONFIG.ENDPOINTS.REGISTER_HOSPITAL, formData, false);
    }

    async getHospitalRequests(status = 'pending') {
        return this.get(`${API_CONFIG.ENDPOINTS.GET_HOSPITAL_REQUESTS}?status=${status}`);
    }

    async getPendingRequests() {
        return this.get(API_CONFIG.ENDPOINTS.GET_PENDING_REQUESTS);
    }

    async updateRequestStatus(requestId, status, reviewedBy) {
        return this.post(`${API_CONFIG.ENDPOINTS.UPDATE_REQUEST_STATUS}/${requestId}`, {
            status,
            reviewed_by: reviewedBy
        });
    }

    async createEmergencyCase(caseData) {
        return this.post(API_CONFIG.ENDPOINTS.CREATE_EMERGENCY_CASE, caseData, false);
    }

    async addSettlementAccount(accountData) {
        return this.post(API_CONFIG.ENDPOINTS.ADD_SETTLEMENT_ACCOUNT, accountData);
    }

    async updateSettlementAccount(accountData) {
        return this.put(API_CONFIG.ENDPOINTS.UPDATE_SETTLEMENT_ACCOUNT, accountData);
    }

    // ==================== HISTORY ENDPOINTS ====================

    async getHospitalEmergencies() {
        return this.get(API_CONFIG.ENDPOINTS.GET_HOSPITAL_EMERGENCIES);
    }

    async getDestinationEmergencies() {
        return this.get(API_CONFIG.ENDPOINTS.GET_DESTINATION_EMERGENCIES);
    }

    // ==================== HEALTH CHECK ====================

    async healthCheck() {
        return this.get(API_CONFIG.ENDPOINTS.HEALTH, false);
    }
}

// Create global API instance
const api = new API();
