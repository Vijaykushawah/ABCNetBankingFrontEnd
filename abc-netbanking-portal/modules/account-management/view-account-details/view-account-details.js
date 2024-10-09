$(document).ready(function() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    if (!authToken || !userId || !userEmail) {
        window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
        return;
    }

// Load account details
function loadAccountDetails() {
    $.ajax({
        url: `http://localhost:8082/api/account/email/${userEmail}`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        success: function(data) {
            let accountDetails = '';
            data.forEach(account => {
                accountDetails += `
                    <tr>
                        <td>${account.accountNumber}</td>
                        <td>${account.balance}</td>
                        <td>${account.availableCredit}</td>
                        <td>
                            <button class="btn btn-info btn-sm viewTransactionsBtn" data-account-number="${account.accountNumber}">View Last 5 Transactions</button>
                        </td>
                    </tr>
                `;
            });
            $('#accountDetails').html(accountDetails);
        },
        error: function(xhr) {
            showErrorModal('Failed to load account details.');
            window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
            return;
        }
    });
}

// Load last 5 transactions
function loadLastTransactions(accountNumber) {
    $.ajax({
        url: `http://localhost:8082/api/account/${accountNumber}/transactions`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        success: function(data) {
            const lastTransactions = data.slice(0, 5); // Get the last 5 transactions
            let transactionsHtml = '';

            lastTransactions.forEach(transaction => {
                const statusClass = transaction.status === 'success' ? 'text-success' : 'text-danger';
                transactionsHtml += `
                    <tr>
                        <td>${transaction.id}</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.amount}</td>
                        <td>${transaction.description}</td>
                        <td class="${statusClass}">${transaction.status}</td>
                        <td>${transaction.type}</td>
                    </tr>
                `;
            });

            $('#transactionsTableBody').html(transactionsHtml || '<tr><td colspan="6">No Transactions</td></tr>');
            $('#lastTransactionsTable').collapse('show'); // Show the transactions table
          
        },
        error: function(xhr) {
            showErrorModal('Failed to load transactions.');
        }
    });
}

// Show last transactions modal
$(document).on('click', '.viewTransactionsBtn', function() {
    const accountNumber = $(this).data('account-number');
    loadLastTransactions(accountNumber);
});

// Show transaction details modal
$(document).on('click', '.transaction-link', function(event) {
    event.preventDefault();
    const transactionId = $(this).data('id');
    const transactionDate = $(this).data('date');
    const transactionAmount = $(this).data('amount');
    const transactionDescription = $(this).data('description');
    const transactionStatus = $(this).data('status');
    const transactionType = $(this).data('type');

    $('#transactionId').text(transactionId);
    $('#transactionDate').text(transactionDate);
    $('#transactionAmount').text(transactionAmount);
    $('#transactionDescription').text(transactionDescription);
    $('#transactionStatus').text(transactionStatus);
    $('#transactionType').text(transactionType);
    $('#transactionDetailsModal').css('z-index', 1050); // Ensure the modal is in the foreground

    $('#transactionDetailsModal').modal('show');
});
    
    

    // Load initial data
    loadAccountDetails();

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