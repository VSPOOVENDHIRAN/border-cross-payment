// Authentication Module

const Auth = {
    // Check if user is logged in
    isAuthenticated() {
        const token = Storage.get(APP_CONSTANTS.TOKEN_KEY);
        const user = Storage.get(APP_CONSTANTS.USER_KEY);
        return !!(token && user);
    },

    // Get current user
    getCurrentUser() {
        return Storage.get(APP_CONSTANTS.USER_KEY);
    },

    // Login function
    async login(email, password) {
        try {
            Loading.show('Logging in...');

            const result = await api.login(email, password);

            Loading.hide();

            if (result.success) {
                // Store token and user data
                Storage.set(APP_CONSTANTS.TOKEN_KEY, result.data.access_token);
                Storage.set(APP_CONSTANTS.USER_KEY, result.data.user);

                Toast.success('Login successful!');
                return { success: true, user: result.data.user };
            } else {
                Toast.error(result.error || 'Login failed');
                return { success: false, error: result.error };
            }
        } catch (error) {
            Loading.hide();
            Toast.error('Login failed: ' + error.message);
            return { success: false, error: error.message };
        }
    },

    // Logout function
    logout() {
        Storage.remove(APP_CONSTANTS.TOKEN_KEY);
        Storage.remove(APP_CONSTANTS.USER_KEY);
        Toast.info('Logged out successfully');
        window.location.href = 'login.html';
    },

    // Protect page (redirect to login if not authenticated)
    requireAuth() {
        if (!this.isAuthenticated()) {
            Toast.warning('Please login to continue');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Redirect if already authenticated
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return true;
        }
        return false;
    },

    // Initialize auth state on page load
    init() {
        // Add logout button listener if exists
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Modal.confirm(
                    'Confirm Logout',
                    'Are you sure you want to logout?',
                    () => this.logout()
                );
            });
        }

        // Display user info if logged in
        const userDisplay = document.getElementById('user-display');
        if (userDisplay && this.isAuthenticated()) {
            const user = this.getCurrentUser();
            userDisplay.innerHTML = `
        <div class="user-info">
          <span class="user-email">${user.email}</span>
          <span class="user-role">${user.role || 'Hospital Admin'}</span>
        </div>
      `;
        }
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
