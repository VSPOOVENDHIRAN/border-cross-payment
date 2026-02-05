// Admin Panel Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Load pending requests
    loadPendingRequests();

    // Also load stats
    loadStats();
});

// Load statistics
async function loadStats() {
    try {
        // Load pending
        const pendingResult = await api.getHospitalRequests('pending');
        if (pendingResult.success) {
            document.getElementById('pending-count').textContent = pendingResult.data.total || 0;
        }

        // Load approved
        const approvedResult = await api.getHospitalRequests('approved');
        if (approvedResult.success) {
            document.getElementById('approved-count').textContent = approvedResult.data.total || 0;
        }

        // Load rejected
        const rejectedResult = await api.getHospitalRequests('rejected');
        if (rejectedResult.success) {
            document.getElementById('rejected-count').textContent = rejectedResult.data.total || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load pending requests
async function loadPendingRequests() {
    const loadingDiv = document.getElementById('loading');
    const listDiv = document.getElementById('requests-list');
    const emptyDiv = document.getElementById('empty-state');

    loadingDiv.classList.remove('hidden');
    listDiv.classList.add('hidden');
    emptyDiv.classList.add('hidden');

    try {
        const result = await api.getPendingRequests();

        loadingDiv.classList.add('hidden');

        if (result.success) {
            const requests = result.data.data || [];

            if (requests.length === 0) {
                emptyDiv.classList.remove('hidden');
            } else {
                listDiv.classList.remove('hidden');
                renderRequests(requests);
            }
        } else {
            Toast.error('Failed to load requests');
            emptyDiv.classList.remove('hidden');
        }
    } catch (error) {
        loadingDiv.classList.add('hidden');
        emptyDiv.classList.remove('hidden');
        Toast.error('Error loading requests');
    }
}

// Render requests
function renderRequests(requests) {
    const listDiv = document.getElementById('requests-list');

    listDiv.innerHTML = requests.map(request => `
    <div class="card mb-3 hover-lift" id="request-${request.id}">
      <div class="flex flex-between mb-3">
        <div>
          <h3 style="margin: 0;">${request.hospital_name}</h3>
          <p style="margin: 0.25rem 0 0 0; color: var(--text-light); font-size: 0.875rem;">
            Request ID: ${request.id}
          </p>
        </div>
        <span class="badge badge-warning">Pending Review</span>
      </div>
      
      <div class="grid grid-3 mb-3" style="gap: 1rem;">
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Type</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.hospital_type}</p>
        </div>
        
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Ownership</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.ownership_type}</p>
        </div>
        
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Registration No.</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.registration_number}</p>
        </div>
      </div>
      
      <div class="grid grid-2 mb-3" style="gap: 1rem;">
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Location</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
            ${request.city ? request.city + ', ' : ''}${request.state}, ${request.country}
          </p>
        </div>
        
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Address</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.address}</p>
        </div>
      </div>
      
      <div class="grid grid-2 mb-3" style="gap: 1rem;">
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Email</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.official_email}</p>
        </div>
        
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Phone</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.official_phone}</p>
        </div>
      </div>
      
      ${request.website ? `
        <div class="mb-3">
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Website</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">
            <a href="${request.website}" target="_blank">${request.website}</a>
          </p>
        </div>
      ` : ''}
      
      <div class="grid grid-2 mb-3" style="gap: 1rem;">
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Admin Name</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.admin_name}</p>
        </div>
        
        <div>
          <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Admin Contact</p>
          <p style="margin: 0.25rem 0 0 0; font-weight: 500;">${request.admin_contact}</p>
        </div>
      </div>
      
      <div class="flex gap-2 mt-4" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
        ${request.certificate_view_url ? `
          <button class="btn btn-outline btn-sm" onclick="viewCertificate('${request.certificate_view_url}')">
            📄 View Certificate
          </button>
        ` : ''}
        <div style="flex: 1;"></div>
        <button class="btn btn-danger btn-sm" onclick="handleReject(${request.id})">
          Reject
        </button>
        <button class="btn btn-success btn-sm" onclick="handleApprove(${request.id})">
          Approve
        </button>
      </div>
    </div>
  `).join('');
}

// View certificate
function viewCertificate(url) {
    const modal = document.getElementById('certificate-modal');
    const content = document.getElementById('certificate-content');

    // Check if it's an image or PDF
    const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);

    if (isImage) {
        content.innerHTML = `<img src="${url}" alt="Certificate" style="max-width: 100%; height: auto; border-radius: var(--radius-md);">`;
    } else {
        content.innerHTML = `
      <iframe src="${url}" style="width: 100%; height: 600px; border: none; border-radius: var(--radius-md);"></iframe>
      <p class="mt-2">
        <a href="${url}" target="_blank" class="btn btn-primary btn-sm">Open in New Tab</a>
      </p>
    `;
    }

    modal.classList.add('active');
}

// Close certificate modal
function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    modal.classList.remove('active');
}

// Handle approve
async function handleApprove(requestId) {
    Modal.confirm(
        'Approve Hospital',
        'Are you sure you want to approve this hospital registration?',
        async () => {
            try {
                Loading.show('Approving hospital...');

                const result = await api.updateRequestStatus(requestId, 'approved', 'Admin');

                Loading.hide();

                if (result.success) {
                    Toast.success('Hospital approved successfully!');

                    // Remove from list
                    const requestCard = document.getElementById(`request-${requestId}`);
                    if (requestCard) {
                        requestCard.style.opacity = '0';
                        requestCard.style.transform = 'translateX(100px)';
                        setTimeout(() => requestCard.remove(), 300);
                    }

                    // Reload stats
                    loadStats();

                    // Check if list is empty
                    setTimeout(() => {
                        const listDiv = document.getElementById('requests-list');
                        if (listDiv.children.length === 0) {
                            listDiv.classList.add('hidden');
                            document.getElementById('empty-state').classList.remove('hidden');
                        }
                    }, 400);
                } else {
                    Toast.error(result.error || 'Failed to approve hospital');
                }
            } catch (error) {
                Loading.hide();
                Toast.error('Error: ' + error.message);
            }
        }
    );
}

// Handle reject
async function handleReject(requestId) {
    Modal.confirm(
        'Reject Hospital',
        'Are you sure you want to reject this hospital registration? This action cannot be undone.',
        async () => {
            try {
                Loading.show('Rejecting hospital...');

                const result = await api.updateRequestStatus(requestId, 'rejected', 'Admin');

                Loading.hide();

                if (result.success) {
                    Toast.success('Hospital rejected');

                    // Remove from list
                    const requestCard = document.getElementById(`request-${requestId}`);
                    if (requestCard) {
                        requestCard.style.opacity = '0';
                        requestCard.style.transform = 'translateX(-100px)';
                        setTimeout(() => requestCard.remove(), 300);
                    }

                    // Reload stats
                    loadStats();

                    // Check if list is empty
                    setTimeout(() => {
                        const listDiv = document.getElementById('requests-list');
                        if (listDiv.children.length === 0) {
                            listDiv.classList.add('hidden');
                            document.getElementById('empty-state').classList.remove('hidden');
                        }
                    }, 400);
                } else {
                    Toast.error(result.error || 'Failed to reject hospital');
                }
            } catch (error) {
                Loading.hide();
                Toast.error('Error: ' + error.message);
            }
        }
    );
}
