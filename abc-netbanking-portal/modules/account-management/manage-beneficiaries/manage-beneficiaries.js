$(document).ready(function() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    let isEditMode = false;
    let currentBeneficiaryId = null;

    if (!authToken || !userId || !userEmail) {
        window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
        return;
    }

    // Load beneficiaries
    function loadBeneficiaries() {
        $.ajax({
            url: `http://localhost:8082/api/beneficiary/${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                let beneficiariesList = '';
                data.forEach(beneficiary => {
                    beneficiariesList += `
                        <tr>
                            <td>${beneficiary.name}</td>
                            <td>${beneficiary.accountNumber}</td>
                            <td>
                                <button class="btn btn-warning btn-sm editBeneficiaryBtn" data-id="${beneficiary.id}" data-name="${beneficiary.name}" data-account-number="${beneficiary.accountNumber}">Edit</button>
                                <button class="btn btn-danger btn-sm deleteBeneficiaryBtn" data-id="${beneficiary.id}">Delete</button>
                             </td>
                        </tr>
                    `;
                });
                $('#beneficiariesList').html(beneficiariesList);
            },
            error: function(xhr) {
                showErrorModal('Failed to load beneficiaries.');
                window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
                return;
            }
        });
    }

    //Add or Edit beneficiary
    $('#addBeneficiaryForm').on('submit', function(event) {
        event.preventDefault();
        const formData = {
            name: $('#beneficiaryName').val(),
            accountNumber: $('#beneficiaryAccountNumber').val()
        };

        const url = isEditMode ? `http://localhost:8082/api/beneficiary/${userId}/${currentBeneficiaryId}` : `http://localhost:8082/api/beneficiary/${userId}`;
        const method = isEditMode ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            type: method,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(formData),
            success: function(data) {
                $('#addBeneficiaryModal').modal('hide');
                loadBeneficiaries();
                isEditMode = false;
                currentBeneficiaryId = null;
            },
            error: function(xhr) {
                const response = JSON.parse(xhr.responseText);
                $('#addBeneficiaryModal').modal('hide'); // Hide the add beneficiary modal
                showErrorModal(response.status);
                isEditMode = false;
                currentBeneficiaryId = null;
            }
        });
    });


    // Delete beneficiary
    $(document).on('click', '.deleteBeneficiaryBtn', function() {
        const beneficiaryId = $(this).data('id');

        $.ajax({
            url: `http://localhost:8082/api/beneficiary/${userId}/${beneficiaryId}`,
            type: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                loadBeneficiaries();
            },
            error: function(xhr) {
                const response = JSON.parse(xhr.responseText);
                showErrorModal(response.status);
            }
        });
    });

    // Show add beneficiary modal
    $('#addBeneficiaryBtn').on('click', function() {
        isEditMode = false;
        currentBeneficiaryId = null;
        $('#beneficiaryName').val('');
        $('#beneficiaryAccountNumber').val('');
        $('#addBeneficiaryModalLabel').text('Add Beneficiary');
        $('#addBeneficiarySubmitBtn').text('Add');
        $('#beneficiaryAccountNumber').val('').prop('disabled', false);

        $('#addBeneficiaryModal').modal('show');
    });

    // Show edit beneficiary modal
    $(document).on('click', '.editBeneficiaryBtn', function() {

        isEditMode = true;
        currentBeneficiaryId = $(this).data('id');
        const beneficiaryName = $(this).data('name');
        const beneficiaryAccountNumber = $(this).data('account-number');

        $('#beneficiaryName').val(beneficiaryName);
        $('#beneficiaryAccountNumber').val(beneficiaryAccountNumber).prop('disabled', true);
        $('#addBeneficiaryModalLabel').text('Edit Beneficiary');
        $('#addBeneficiarySubmitBtn').text('Edit');
        $('#addBeneficiaryModal').modal('show');

    });

    

    // Load initial data
    loadBeneficiaries();

    function showErrorModal(message) {
        $('#errorModalBody').text(message);
        $('#errorModal').modal('show');
    }

    // Back button functionality
    $('#backBtn').on('click', function() {
        window.history.back();
    });

    // Home button functionality
    $('#homeBtn').on('click', function() {
        window.location.href = 'http://127.0.0.1:8083/'; // Adjust the path as needed
    });
});