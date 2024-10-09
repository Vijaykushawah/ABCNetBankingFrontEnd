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

    // Load accounts for dropdown
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
                $('#accountNumber').html(options);
            },
            error: function(xhr) {
                showErrorModal('Failed to load accounts.');
            }
        });
    }

    // Handle date option change
    $('input[name="dateOption"]').on('change', function() {
        const selectedOption = $('input[name="dateOption"]:checked').val();
        const today = new Date();
        let startDate, endDate;

        if (selectedOption === 'last3Months') {
            startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
            endDate = new Date().toISOString().split('T')[0];
            $('#startDate').val(startDate).prop('disabled', true);
            $('#endDate').val(endDate).prop('disabled', true);
        } else if (selectedOption === 'last6Months') {
            startDate = new Date(today.setMonth(today.getMonth() - 6)).toISOString().split('T')[0];
            endDate = new Date().toISOString().split('T')[0];
            $('#startDate').val(startDate).prop('disabled', true);
            $('#endDate').val(endDate).prop('disabled', true);
        } else {
            $('#startDate').val('').prop('disabled', false);
            $('#endDate').val('').prop('disabled', false);
        }
    });

   
    // Download PDF
    $('#downloadPdfBtn').on('click', function() {
        const accountNumber = $('#accountNumber').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        //  $('#loaderModal').modal('show');

        $.ajax({
            url: `http://localhost:8082/api/transactions/download/pdf?accountId=${accountNumber}&startDate=${startDate}&endDate=${endDate}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: function(data) {
                $('#loaderModal').modal('hide');
                const url = window.URL.createObjectURL(new Blob([data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.pdf';
                document.body.append(a);
                a.click();
                a.remove();
                $('#loaderModal').modal('hide');
            },
            error: function(xhr) {
                $('#loaderModal').modal('hide');
                showErrorModal('Failed to download PDF.');
            }
        });
    });

    // Download CSV
    $('#downloadCsvBtn').on('click', function() {
        const accountNumber = $('#accountNumber').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

      //  $('#loaderModal').modal('show');

        $.ajax({
            url: `http://localhost:8082/api/transactions/download/csv?accountId=${accountNumber}&startDate=${startDate}&endDate=${endDate}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: function(data) {
                $('#loaderModal').modal('hide');
                const url = window.URL.createObjectURL(new Blob([data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                document.body.append(a);
                a.click();
                a.remove();
                $('#loaderModal').modal('hide');
            },
            error: function(xhr) {
                $('#loaderModal').modal('hide');
                showErrorModal('Failed to download CSV.');
            }
        });
    });

    // Load accounts on page load
    loadAccounts();
});

function showErrorModal(message) {
    alert(message); // Simple alert for error handling
}