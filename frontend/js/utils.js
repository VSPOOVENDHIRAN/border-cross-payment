// Utility Functions

// Toast Notification System
const Toast = {
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this.getIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Loading Indicator
const Loading = {
    show(message = 'Loading...') {
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'loader-overlay';
            loader.innerHTML = `
        <div class="loader-content">
          <div class="spinner"></div>
          <p class="loader-message">${message}</p>
        </div>
      `;
            document.body.appendChild(loader);
        } else {
            loader.querySelector('.loader-message').textContent = message;
        }
        loader.classList.add('active');
    },

    hide() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }
};

// Form Validation
const Validator = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    phone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    minLength(value, min) {
        return value && value.length >= min;
    },

    maxLength(value, max) {
        return value && value.length <= max;
    },

    number(value) {
        return !isNaN(value) && isFinite(value);
    },

    positiveNumber(value) {
        return this.number(value) && parseFloat(value) > 0;
    },

    url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// Form Helper
const FormHelper = {
    getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },

    setFormData(formElement, data) {
        Object.keys(data).forEach(key => {
            const input = formElement.elements[key];
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = data[key];
                } else {
                    input.value = data[key];
                }
            }
        });
    },

    clearForm(formElement) {
        formElement.reset();
    },

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
            let errorDiv = field.parentElement.querySelector('.field-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                field.parentElement.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        }
    },

    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.remove('error');
            const errorDiv = field.parentElement.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    },

    clearAllErrors(formElement) {
        formElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        formElement.querySelectorAll('.field-error').forEach(el => el.remove());
    }
};

// Date Formatting
const DateFormatter = {
    format(date, format = 'short') {
        const d = new Date(date);

        if (format === 'short') {
            return d.toLocaleDateString();
        } else if (format === 'long') {
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (format === 'datetime') {
            return d.toLocaleString();
        } else if (format === 'time') {
            return d.toLocaleTimeString();
        } else if (format === 'relative') {
            return this.getRelativeTime(d);
        }

        return d.toISOString();
    },

    getRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return this.format(date, 'short');
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }
};

// Currency Formatting
const CurrencyFormatter = {
    format(amount, currency = 'USD') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(amount);
    }
};

// Modal Helper
const Modal = {
    show(title, content, buttons = []) {
        let modal = document.getElementById('global-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'global-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title"></h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer"></div>
        </div>
      `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close').addEventListener('click', () => this.hide());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hide();
            });
        }

        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;

        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = '';
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `btn ${btn.class || 'btn-secondary'}`;
            button.textContent = btn.text;
            button.addEventListener('click', () => {
                if (btn.onClick) btn.onClick();
                if (btn.closeOnClick !== false) this.hide();
            });
            footer.appendChild(button);
        });

        modal.classList.add('active');
    },

    hide() {
        const modal = document.getElementById('global-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    confirm(title, message, onConfirm, onCancel) {
        this.show(title, `<p>${message}</p>`, [
            {
                text: 'Cancel',
                class: 'btn-secondary',
                onClick: onCancel
            },
            {
                text: 'Confirm',
                class: 'btn-primary',
                onClick: onConfirm
            }
        ]);
    }
};

// Local Storage Helper
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// File Size Formatter
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
