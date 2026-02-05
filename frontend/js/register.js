// Hospital Registration Form Handler

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already authenticated
    Auth.redirectIfAuthenticated();

    // Populate dropdowns
    populateDropdowns();

    // Setup file upload
    setupFileUpload();

    // Setup form submission
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', handleSubmit);
});

// Populate dropdown fields
function populateDropdowns() {
    // Hospital Types
    const hospitalTypeSelect = document.getElementById('hospital_type');
    APP_CONSTANTS.HOSPITAL_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        hospitalTypeSelect.appendChild(option);
    });

    // Ownership Types
    const ownershipTypeSelect = document.getElementById('ownership_type');
    APP_CONSTANTS.OWNERSHIP_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        ownershipTypeSelect.appendChild(option);
    });

    // Countries
    const countrySelect = document.getElementById('country');
    APP_CONSTANTS.COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('registration_certificate');
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileNameDisplay = document.getElementById('file-name');

    // Click to upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                Toast.error('File size must be less than 5MB');
                fileInput.value = '';
                return;
            }

            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                Toast.error('Only PDF, JPG, and PNG files are allowed');
                fileInput.value = '';
                return;
            }

            // Display file name
            fileNameDisplay.textContent = `✓ ${file.name} (${formatFileSize(file.size)})`;
            fileNameDisplay.classList.remove('hidden');
            fileUploadArea.style.borderColor = 'var(--success-color)';
        }
    });

    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--primary-color)';
        fileUploadArea.style.background = 'var(--bg-secondary)';
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = 'var(--border-color)';
        fileUploadArea.style.background = 'var(--bg-primary)';
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--border-color)';
        fileUploadArea.style.background = 'var(--bg-primary)';

        const file = e.dataTransfer.files[0];
        if (file) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });
}

// Validate form
function validateForm(formData) {
    const errors = [];

    // Required fields
    const requiredFields = [
        'hospital_name',
        'hospital_type',
        'ownership_type',
        'country',
        'state',
        'address',
        'official_email',
        'official_phone',
        'registration_number',
        'admin_name',
        'admin_contact'
    ];

    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            errors.push(`${field.replace(/_/g, ' ')} is required`);
            FormHelper.showFieldError(field, 'This field is required');
        } else {
            FormHelper.clearFieldError(field);
        }
    });

    // Email validation
    const email = formData.get('official_email');
    if (email && !Validator.email(email)) {
        errors.push('Invalid email address');
        FormHelper.showFieldError('official_email', 'Please enter a valid email');
    }

    // Phone validation
    const phone = formData.get('official_phone');
    if (phone && !Validator.phone(phone)) {
        errors.push('Invalid phone number');
        FormHelper.showFieldError('official_phone', 'Please enter a valid phone number');
    }

    const adminContact = formData.get('admin_contact');
    if (adminContact && !Validator.phone(adminContact)) {
        errors.push('Invalid admin contact number');
        FormHelper.showFieldError('admin_contact', 'Please enter a valid phone number');
    }

    // Website validation (if provided)
    const website = formData.get('website');
    if (website && website.trim() !== '' && !Validator.url(website)) {
        errors.push('Invalid website URL');
        FormHelper.showFieldError('website', 'Please enter a valid URL');
    }

    // File validation
    const file = formData.get('registration_certificate');
    if (!file || file.size === 0) {
        errors.push('Registration certificate is required');
        Toast.error('Please upload a registration certificate');
    }

    // Consent validation
    const consent = formData.get('consent_given');
    if (!consent) {
        errors.push('You must consent to continue');
        Toast.error('Please accept the consent to continue');
    }

    return errors;
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Clear previous errors
    FormHelper.clearAllErrors(form);

    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        Toast.error('Please fix the errors in the form');
        return;
    }

    try {
        Loading.show('Submitting registration request...');

        // Submit to API
        const result = await api.registerHospital(formData);

        Loading.hide();

        if (result.success) {
            Toast.success('Registration request submitted successfully!');

            // Show success modal
            Modal.show(
                'Registration Submitted',
                `
          <div class="text-center">
            <div style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;">✓</div>
            <p>Your hospital registration request has been submitted successfully.</p>
            <p><strong>Request ID:</strong> ${result.data.request_id}</p>
            <p class="mt-3" style="color: var(--text-light);">
              Our admin team will review your request and you will receive a confirmation email once approved.
            </p>
          </div>
        `,
                [
                    {
                        text: 'Go to Login',
                        class: 'btn-primary',
                        onClick: () => {
                            window.location.href = 'login.html';
                        }
                    }
                ]
            );

            // Reset form
            form.reset();
            document.getElementById('file-name').classList.add('hidden');
            document.getElementById('file-upload-area').style.borderColor = 'var(--border-color)';

        } else {
            Toast.error(result.error || 'Registration failed');
        }

    } catch (error) {
        Loading.hide();
        Toast.error('An error occurred: ' + error.message);
    }
}
