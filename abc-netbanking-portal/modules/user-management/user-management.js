$(document).ready(function() {
    const form = $('#registrationForm');
    const submitBtn = $('#submitBtn');
    const emailInput = $('#email');
    const mobileInput = $('#mobile');
    const passwordInput = $('#password');
    const confirmPasswordInput = $('#confirmPassword');
    const messageDiv = $('#message');
    const loader = $('#loader');

    form.on('submit', function(event) {
        event.preventDefault();
        clearErrors();

        const email = emailInput.val();
        const mobile = mobileInput.val();
        const password = passwordInput.val();
        const confirmPassword = confirmPasswordInput.val();

        if (!validateEmail(email)) {
            showError('emailError', 'Invalid email format');
            return;
        }

        if (!validateMobile(mobile)) {
            showError('mobileError', 'Invalid mobile number format');
            return;
        }

        if (!validatePassword(password)) {
            showError('passwordError', 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            return;
        }

        submitBtn.prop('disabled', true);
        showLoader();

        const requestBody = {
            email: email,
            mobile: mobile,
            password: password
        };

        $.ajax({
            url: 'http://localhost:8082/api/auth/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestBody),
            success: function(data) {
                if (data.id) {
                    showErrorModal('User registered successfully. Please verify your mobile number.','Success');
                    setTimeout(() => {
                        send2faCode(mobile);
                    }, 2000); // 2 seconds delay
                } else {
                    showErrorModal(data);
                    hideLoader();
                    submitBtn.prop('disabled', false);
                }
            },
            error: function(xhr) {
                showErrorModal(xhr.responseText,'Error');   
                hideLoader();
                submitBtn.prop('disabled', false);
            }
        });
    });

    

    function send2faCode(mobile) {
        $.ajax({
            url: `http://localhost:8082/api/auth/2fa?mobile=${mobile}`,
            type: 'POST',
            success: function(data) {
                if (data === '2FA code sent.') {
                              showErrorModal('2FA code sent. Please enter the code to verify.', '2FA Code');          
                              hideLoader();
                    setTimeout(() => {
                        show2faInput(mobile);
                    }, 100); // 2 seconds delay
                } else {
                    showErrorModal(data, '2FA Code');
                    hideLoader();
                    submitBtn.prop('disabled', false);
                }
            },
            error: function(xhr) {
                if (xhr.status === 409) {
                    showErrorModal('User not found.','Error');
                } else {
                    showErrorModal(xhr.responseText, 'Error');
                }
                hideLoader();
                submitBtn.prop('disabled', false);
            }
        });
    }

    function show2faInput(mobile) {
        const twoFaDiv = $('<div class="form-group" id="twoFaDiv">')
            .append('<label for="twoFaCode">Enter 2FA Code:</label>')
            .append('<input type="text" class="form-control" id="twoFaCode" placeholder="Enter 6-digit 2FA code" required>')
            .append('<button type="button" class="btn btn-primary mt-2" id="verify2faBtn">2FA Verify</button>');
        form.append(twoFaDiv);

        $('#verify2faBtn').on('click', function() {
            const code = $('#twoFaCode').val();
            verify2faCode(mobile, code);
        });
    }

    function verify2faCode(mobile, code) {
        showLoader();
        $.ajax({
            url: `http://localhost:8082/api/auth/2fa/verify?mobile=${mobile}&code=${code}`,
            type: 'POST',
            success: function(data) {
                if (data === '2FA verified.') {
                    showErrorModal('2FA verified. Registration complete!','Success');
                    setTimeout(() => {
                        window.location.href = 'user-login.html';
                    }, 2000);
                } else {
                    showErrorModal('Invalid 2FA code.'+data,'Error');
                }
                hideLoader();
            },
            error: function(xhr) {
                if (xhr.status === 400) {
                    showErrorModal('Invalid 2FA code.','Error');
                } else {
                    showErrorModal(xhr.responseText,'Error');
                }
                hideLoader();
            }
        });
    }

    emailInput.on('input', function() {
        if (validateEmail(emailInput.val())) {
            $('#emailError').text('');
        } else {
            showError('emailError', 'Invalid email format');
        }
    });

    mobileInput.on('input', function() {
        if (validateMobile(mobileInput.val())) {
            $('#mobileError').text('');
        } else {
            showError('mobileError', 'Invalid mobile number format');
        }
    });

    passwordInput.on('input', function() {
        if (validatePassword(passwordInput.val())) {
            $('#passwordError').text('');
        } else {
            showError('passwordError', 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long');
        }
    });

    confirmPasswordInput.on('input', function() {
        if (passwordInput.val() === confirmPasswordInput.val()) {
            $('#confirmPasswordError').text('');
        } else {
            showError('confirmPasswordError', 'Passwords do not match');
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateMobile(mobile) {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(mobile);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    function showError(elementId, message) {
        $('#' + elementId).text(message);
    }

    function clearErrors() {
        $('.error-message').text('');
    }

    function showLoader() {
        loader.show();
        $('body').addClass('loading');
    }

    function hideLoader() {
        loader.hide();
        $('body').removeClass('loading');
    }

    function showErrorModal(message,title) {
        $('#errorModalBody').text(message);
        $('#errorModalLabel').text('');
        $('#errorModalLabel').text(title);
        // if title error then change the color of the modal
        if(title === 'Error'){
            $('#errorModal').removeClass('modal-success').addClass('modal-danger');
            //model title color red
            $('#errorModalTitle').css('color','red');
            // add error message color red
            $('#errorModalBody').css('color','red');
            //change color of classs modal-header
            $('.modal-header').css('background-color','red');
            
        }else{
            
            $('#errorModal').removeClass('modal-danger').addClass('modal-success');
            //model title color green
            $('#errorModalTitle').css('color','green');
            // add error message color green
            $('#errorModalBody').css('color','green');
            //change color of classs modal-header
            $('.modal-header').css('background-color','green');
        }

        $('#errorModal').modal('show');
        //alert(message); // Simple alert for error handling
    }

    // Back button functionality
    $('#backBtn').on('click', function() {
        window.history.back();
    });

    // Home button functionality
    $('#homeBtn').on('click', function() {
        window.location.href = 'http://127.0.0.1:8083'; // Adjust the path as needed
    });
});