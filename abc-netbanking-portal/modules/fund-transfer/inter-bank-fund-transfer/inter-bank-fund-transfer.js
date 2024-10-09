$(document).ready(function() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    if (!authToken || !userId || !userEmail) {
        window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
        return;
    }

    // Back button functionality
    $('#backBtn').on('click', function() {
        window.history.back();
    });

    // Home button functionality
    $('#homeBtn').on('click', function() {
        window.location.href = 'http://127.0.0.1:8083'; // Adjust the path as needed
    });

    // Load accounts for dropdowns
    function loadAccounts() {
        $.ajax({
            url: `http://localhost:8082/api/account/email/${userEmail}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                let options = '';
                data.forEach(account => {
                    options += `<option value="${account.accountNumber}">${account.accountNumber}</option>`;
                });
                $('#fromAccount, #fromAccountInter').html(options);
            },
            error: function(xhr) {
                showErrorModal('Failed to load accounts.');
                window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
                return;
            }
        });
    }

     // Load beneficiaries for the toAccount dropdown
     function loadBeneficiaries() {
        $.ajax({
            url: `http://localhost:8082/api/beneficiary/${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                let options = '';
                data.forEach(beneficiary => {
                    options += `<option value="${beneficiary.accountNumber}">${beneficiary.name} (${beneficiary.accountNumber})</option>`;
                });
                $('#toAccount').html(options);
            },
            error: function(xhr) {
                showErrorModal('Failed to load beneficiaries.');
            }
        });
    }

   
    // Inter-bank fund transfer
    $('#interBankTransferForm').on('submit', function(event) {
        event.preventDefault();
        const formData = {
            fromAccountNumber: $('#fromAccountInter').val(),
            toAccountNumber: $('#toAccountInter').val(),
            amount: $('#amountInter').val(),
            transferType: $('#transferType').val(),
            description: $('#description').val()
        };

        $.ajax({
            url: `http://localhost:8082/api/fundtransfer/inter`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(formData),
            success: function(data) {
                $('#successModal').modal('show');
                $('#interBankTransferForm')[0].reset();
            },
            error: function(xhr) {
                const response = JSON.parse(xhr.responseText);
                showErrorModal(response.status);
            }
        });
    });

    // Load accounts on page load
    loadAccounts();
    loadBeneficiaries();
});

function showErrorModal(message) {
    $('#errorModalBody').text(message);
    $('#errorModal').modal('show');
    //alert(message); // Simple alert for error handling
}