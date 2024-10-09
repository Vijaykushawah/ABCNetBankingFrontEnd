$(document).ready(function() {
    const form = $('#accountForm');
    const createAccountBtn = $('#createAccountBtn');
    const messageDiv = $('#message');
    const loader = $('#loader');
    const branchSelect = $('#branch');
    const bankNameInput = $('#bankName');
    const micrCodeInput = $('#micrNumber');
    const ifscCodeInput = $('#ifscCode');
    const branchAddressInput = $('#branchAddress');
    const branchCityInput = $('#branchCity');
    const branchCodeInput = $('#branchCode');
    const searchEmailOrMobileInput = $('#searchEmailOrMobile');
    const emailInput = $('#email');
    const mobileInput = $('#mobile');
    const statusInput = $('#status');
    const searchUserBtn = $('#searchUserBtn');
    const errorModal = $('#errorModal');
    const errorModalBody = $('#errorModalBody');

    let bankDetails = [];

    // Function to load bank details
    function loadBankDetails() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
            return;
        }

        $.ajax({
            url: 'http://localhost:8082/api/bank',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                bankDetails = data;
                populateBranchOptions(data);
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
                } else {
                    showErrorModal('Failed to load bank details.');
                }
            }
        });
    }

    // Function to populate branch options
    function populateBranchOptions(data) {
        data.forEach(bank => {
            const option = $('<option>').val(bank.id).text(`${bank.name} - ${bank.branch}`);
            branchSelect.append(option);
        });
    }

    // Event listener for branch selection
    branchSelect.on('change', function() {
        const selectedBranchId = $(this).val();
        const selectedBranch = bankDetails.find(bank => bank.id == selectedBranchId);

        if (selectedBranch) {
            bankNameInput.val(selectedBranch.name);
            micrCodeInput.val(selectedBranch.micrCode);
            ifscCodeInput.val(selectedBranch.ifscCode);
            branchAddressInput.val(selectedBranch.address);
            branchCityInput.val(selectedBranch.city);
            branchCodeInput.val(selectedBranch.branchCode);
        } else {
            bankNameInput.val('');
            micrCodeInput.val('');
            ifscCodeInput.val('');
            branchAddressInput.val('');
            branchCityInput.val('');
            branchCodeInput.val('');
        }
    });

        // Event listener for search button
        searchUserBtn.on('click', function() {
            const emailOrMobile = searchEmailOrMobileInput.val();
            if (!emailOrMobile) {
                showError('searchEmailOrMobileError', 'Please enter an email or mobile number.');
                return;
            }
    
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
                return;
            }
    
            showLoader();
    
            $.ajax({
                url: `http://localhost:8082/api/users/search?emailOrMobile=${emailOrMobile}`,
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                success: function(data) {
                    emailInput.val(data.email);
                    mobileInput.val(data.mobile);
                    statusInput.val(data.active ? 'Active' : 'Inactive');
                    hideLoader();
                },
                error: function(xhr) {
                    showErrorModal(xhr.responseText);
                    hideLoader();
                }
            });
        });

    // Load bank details on page load
    loadBankDetails();

    form.on('submit', function(event) {
        event.preventDefault();
        clearErrors();
// add logs
        console.log('Account open form submitted');
        

        const checklist = [];
        $('input[name="checklist"]:checked').each(function() {
            checklist.push($(this).val());
        });

        if (checklist.length === 0) {
            showError('message', 'Please check at least one item in the checklist.');
            return;
        }

        createAccountBtn.prop('disabled', true);
        showLoader();

        const formData = new FormData();
        formData.append('checklist', checklist);
        formData.append('signature', $('#signature')[0].files[0]);
        formData.append('photo', $('#photo')[0].files[0]);
        //formData.append('identityProof', $('#identityProof')[0].files[0]);
        formData.append('email', emailInput.val());
        formData.append('accountNumber', $('#accountNumber').val());
        formData.append('bankId', branchSelect.val());

        const authToken = localStorage.getItem('authToken');
        

        $.ajax({
            url: 'http://localhost:8082/api/account/open',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                messageDiv.text('Account created successfully!')
                          .removeClass('error')
                          .addClass('success');
                hideLoader();
            },
            error: function(xhr) {
                showErrorModal(xhr.responseText);
                hideLoader();
                createAccountBtn.prop('disabled', false);
            }
        });
    });

    function showErrorModal(message) {
        errorModalBody.text(message);
        errorModal.modal('show');
    }

    function showError(elementId, message) {
        $('#' + elementId).text(message).addClass('error');
    }

    function clearErrors() {
        $('.error-message').text('').removeClass('error');
    }

    function showLoader() {
        loader.show();
        $('body').addClass('loading');
    }

    function hideLoader() {
        loader.hide();
        $('body').removeClass('loading');
    }
});