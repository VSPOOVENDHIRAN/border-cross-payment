// Dashboard Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Protect page - require authentication
    if (!Auth.requireAuth()) return;

    // Initialize dashboard
    init();
});

async function init() {
    // Populate dropdowns
    populateDropdowns();

    // Setup tabs
    setupTabs();

    // Setup forms
    setupEmergencyForm();
    setupSettlementForm();

    // Load initial data
    await loadDashboardData();
}

// Populate all dropdown fields
function populateDropdowns() {
    // Countries
    const countrySelects = document.querySelectorAll('#source_country, #destination_country, #account_country');
    countrySelects.forEach(select => {
        APP_CONSTANTS.COUNTRIES.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            select.appendChild(option);
        });
    });

    // Urgency Levels
    const urgencySelect = document.getElementById('urgency_level');
    APP_CONSTANTS.URGENCY_LEVELS.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        urgencySelect.appendChild(option);
    });

    // Treatment Complexity
    const complexitySelect = document.getElementById('treatment_complexity');
    APP_CONSTANTS.TREATMENT_COMPLEXITY.forEach(complexity => {
        const option = document.createElement('option');
        option.value = complexity;
        option.textContent = complexity;
        complexitySelect.appendChild(option);
    });

    // Consciousness Status
    const consciousnessSelect = document.getElementById('consciousness_status');
    APP_CONSTANTS.CONSCIOUSNESS_STATUS.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        consciousnessSelect.appendChild(option);
    });

    // Airway Status
    const airwaySelect = document.getElementById('airway_status');
    APP_CONSTANTS.AIRWAY_STATUS.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        airwaySelect.appendChild(option);
    });

    // Breathing Status
    const breathingSelect = document.getElementById('breathing_status');
    APP_CONSTANTS.BREATHING_STATUS.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        breathingSelect.appendChild(option);
    });

    // Circulation Status
    const circulationSelect = document.getElementById('circulation_status');
    APP_CONSTANTS.CIRCULATION_STATUS.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        circulationSelect.appendChild(option);
    });

    // Specialties
    const specialtySelect = document.getElementById('required_specialty');
    APP_CONSTANTS.SPECIALTIES.forEach(specialty => {
        const option = document.createElement('option');
        option.value = specialty;
        option.textContent = specialty;
        specialtySelect.appendChild(option);
    });

    // Currencies
    const currencySelects = document.querySelectorAll('#currency, #account_currency');
    currencySelects.forEach(select => {
        APP_CONSTANTS.CURRENCIES.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            select.appendChild(option);
        });
    });
}

// Setup tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Update active button
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-outline');
            });
            button.classList.add('active', 'btn-primary');
            button.classList.remove('btn-outline');

            // Update active tab pane
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.add('hidden');
                pane.classList.remove('active');
            });

            const activePane = document.getElementById(`${tabName}-tab`);
            if (activePane) {
                activePane.classList.remove('hidden');
                activePane.classList.add('active');

                // Load data for specific tabs
                if (tabName === 'history') {
                    loadEmergencyHistory();
                }
            }
        });
    });
}

// Setup emergency case form
function setupEmergencyForm() {
    const form = document.getElementById('emergency-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = FormHelper.getFormData(form);

        // Validate cross-border requirement
        if (formData.source_country === formData.destination_country) {
            Toast.error('Source and destination countries must be different');
            return;
        }

        // Convert checkbox to boolean
        formData.life_threatening = document.getElementById('life_threatening').checked;
        formData.emergency_override_consent = document.getElementById('emergency_override_consent').checked;

        try {
            Loading.show('Creating emergency case...');

            const result = await api.createEmergencyCase(formData);

            Loading.hide();

            if (result.success) {
                Toast.success('Emergency case created successfully!');

                Modal.show(
                    'Emergency Case Created',
                    `
            <div class="text-center">
              <div style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;">✓</div>
              <p><strong>Emergency ID:</strong> ${result.data.emergency_id}</p>
              <p><strong>Status:</strong> <span class="badge badge-info">${result.data.status}</span></p>
              <p class="mt-3" style="color: var(--text-light);">
                The emergency case has been submitted and is being processed.
              </p>
            </div>
          `,
                    [
                        {
                            text: 'View History',
                            class: 'btn-primary',
                            onClick: () => {
                                document.querySelector('[data-tab="history"]').click();
                            }
                        }
                    ]
                );

                form.reset();
                await loadDashboardData();
            } else {
                Toast.error(result.error || 'Failed to create emergency case');
            }
        } catch (error) {
            Loading.hide();
            Toast.error('Error: ' + error.message);
        }
    });
}

// Setup settlement account form
function setupSettlementForm() {
    const form = document.getElementById('settlement-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = FormHelper.getFormData(form);

        try {
            Loading.show('Saving settlement account...');

            const result = await api.addSettlementAccount(formData);

            Loading.hide();

            if (result.success) {
                Toast.success('Settlement account added successfully!');

                Modal.show(
                    'Settlement Account Added',
                    `
            <div class="text-center">
              <div style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;">✓</div>
              <p>Your settlement account has been submitted for verification.</p>
              <p><strong>Status:</strong> <span class="badge badge-warning">${result.data.verification_status}</span></p>
              <p class="mt-3" style="color: var(--text-light);">
                You will be notified once the account is verified.
              </p>
            </div>
          `,
                    [
                        {
                            text: 'OK',
                            class: 'btn-primary'
                        }
                    ]
                );

                form.reset();
                document.getElementById('settlement-submit-btn').textContent = 'Update Settlement Account';
            } else {
                Toast.error(result.error || 'Failed to add settlement account');
            }
        } catch (error) {
            Loading.hide();
            Toast.error('Error: ' + error.message);
        }
    });
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load emergency history to get stats
        const historyResult = await api.getHospitalEmergencies();

        if (historyResult.success) {
            const emergencies = historyResult.data.emergencies || [];

            // Update stats
            document.getElementById('total-cases').textContent = emergencies.length;

            const activeCases = emergencies.filter(e =>
                ['WAITING_FOR_HOSPITAL', 'ACCEPTED', 'IN_PROGRESS'].includes(e.status)
            ).length;
            document.getElementById('active-cases').textContent = activeCases;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load emergency history
async function loadEmergencyHistory() {
    const loadingDiv = document.getElementById('history-loading');
    const contentDiv = document.getElementById('history-content');
    const emptyDiv = document.getElementById('history-empty');
    const listDiv = document.getElementById('history-list');

    loadingDiv.classList.remove('hidden');
    contentDiv.classList.add('hidden');
    emptyDiv.classList.add('hidden');

    try {
        const result = await api.getHospitalEmergencies();

        loadingDiv.classList.add('hidden');

        if (result.success) {
            const emergencies = result.data.emergencies || [];

            if (emergencies.length === 0) {
                emptyDiv.classList.remove('hidden');
            } else {
                contentDiv.classList.remove('hidden');

                // Render emergency cases
                listDiv.innerHTML = emergencies.map(emergency => `
          <div class="card mb-3 hover-lift">
            <div class="flex flex-between mb-2">
              <div>
                <h4 style="margin: 0;">Emergency #${emergency.emergency_id}</h4>
                <p style="margin: 0.25rem 0 0 0; color: var(--text-light); font-size: 0.875rem;">
                  ${DateFormatter.format(emergency.created_at, 'datetime')}
                </p>
              </div>
              <span class="badge ${getStatusBadgeClass(emergency.status)}">${emergency.status}</span>
            </div>
            
            <div class="grid grid-2 mt-3" style="gap: 1rem;">
              <div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Patient</p>
                <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
                  ${emergency.patient_gender}, Age ${emergency.patient_age}
                </p>
              </div>
              
              <div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Route</p>
                <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
                  ${emergency.source_country} → ${emergency.destination_country}
                </p>
              </div>
              
              <div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Diagnosis</p>
                <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
                  ${emergency.primary_diagnosis_code}
                </p>
              </div>
              
              <div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Urgency</p>
                <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
                  ${emergency.urgency_level}
                  ${emergency.life_threatening ? '<span class="badge badge-error ml-1">Life Threatening</span>' : ''}
                </p>
              </div>
              
              <div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Estimated Cost</p>
                <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
                  ${CurrencyFormatter.format(emergency.estimated_treatment_cost, emergency.currency)}
                </p>
              </div>
              
              <div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Destination</p>
                <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
                  ${emergency.destination_hospital_ref_code || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        `).join('');
            }
        } else {
            emptyDiv.classList.remove('hidden');
            Toast.error('Failed to load emergency history');
        }
    } catch (error) {
        loadingDiv.classList.add('hidden');
        emptyDiv.classList.remove('hidden');
        Toast.error('Error loading emergency history');
    }
}

// Get status badge class
function getStatusBadgeClass(status) {
    const statusMap = {
        'WAITING_FOR_HOSPITAL': 'badge-warning',
        'ACCEPTED': 'badge-info',
        'IN_PROGRESS': 'badge-primary',
        'COMPLETED': 'badge-success',
        'REJECTED': 'badge-error',
        'CANCELLED': 'badge-error'
    };
    return statusMap[status] || 'badge-info';
}
