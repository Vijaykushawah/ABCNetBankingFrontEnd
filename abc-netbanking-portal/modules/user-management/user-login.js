$(document).ready(function() {
    const form = $('#loginForm');
    const loginBtn = $('#loginBtn');
    const emailInput = $('#email');
    const passwordInput = $('#password');
    const messageDiv = $('#message');
    const loader = $('#loader');

    const forgotPasswordLink = $('#forgotPasswordLink');
    const forgotPasswordDiv = $('#forgotPasswordDiv');
    const forgotPasswordForm = $('#forgotPasswordForm');
    const forgotPasswordBtn = $('#forgotPasswordBtn');
    const mobileOrEmailInput = $('#mobileOrEmail');
    const otpDiv = $('#otpDiv');
    const otpForm = $('#otpForm');
    const otpInput = $('#otp');
    const verifyOtpBtn = $('#verifyOtpBtn');
    const timerSpan = $('#timer');
    const resendOtpBtn = $('#resendOtpBtn');
    const resetPasswordDiv = $('#resetPasswordDiv');
    const resetPasswordForm = $('#resetPasswordForm');
    const newPasswordInput = $('#newPassword');
    const confirmPasswordInput = $('#confirmPassword');
    const resetPasswordBtn = $('#resetPasswordBtn');

    let mobileOrEmail;
    let otp;

     // Check for URL parameter to start forgot password process
     const urlParams = new URLSearchParams(window.location.search);
     if (urlParams.get('forgotPassword') === 'true') {
         form.hide();
         forgotPasswordDiv.show();
     }

    form.on('submit', function(event) {
        event.preventDefault();
        clearErrors();

        const email = emailInput.val();
        const password = passwordInput.val();

        if (!validateEmail(email)) {
            showError('emailError', 'Invalid email format');
            return;
        }

        if (!email) {
            showError('emailError', 'This field is required');
            return;
        }

        if (!password) {
            showError('passwordError', 'This field is required');
            return;
        }

        loginBtn.prop('disabled', true);
        showLoader();

        const requestBody = {
            email: email,
            password: password
        };

        $.ajax({
            url: 'http://localhost:8082/api/auth/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestBody),
            success: function(data) {
                showErrorModal('Login successful! Redirecting...','Success');
                saveToken(data);
                hideLoader();
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            },
            error: function(xhr) {
                ErrorModal(xhr.responseText,'Error');
                hideLoader();
                loginBtn.prop('disabled', false);
            }
        });
    });

    forgotPasswordLink.on('click', function(event) {
        event.preventDefault();
        form.hide();
        forgotPasswordDiv.show();
    });

    forgotPasswordForm.on('submit', function(event) {
        event.preventDefault();
        clearErrors();

        mobileOrEmail = mobileOrEmailInput.val();

        if (!mobileOrEmail) {
            showError('mobileOrEmailError', 'This field is required');
            return;
        }

        forgotPasswordBtn.prop('disabled', true);
        showLoader();

        $.ajax({
            url: `http://localhost:8082/api/auth/forgot-password?mobileOrEmail=${mobileOrEmail}`,
            type: 'POST',
            success: function(data) {
                showErrorModal('OTP sent. Please enter the OTP to verify.','Success');
                otpDiv.show();
                startTimer();
                forgotPasswordDiv.hide();
                hideLoader();
            },
            error: function(xhr) {
                if (xhr.status === 404) {
                    
                    showErrorModal('User not found.','Error');
                } else {
                    showErrorModal(xhr.responseText,'Error');
                }
                hideLoader();
                forgotPasswordBtn.prop('disabled', false);
            }
        });
    });

    otpForm.on('submit', function(event) {
        event.preventDefault();
        clearErrors();

        otp = otpInput.val();

        if (!otp) {
            showError('otpError', 'This field is required');
            return;
        }

        verifyOtpBtn.prop('disabled', true);
        showLoader();

        $.ajax({
            url: `http://localhost:8082/api/auth/otp/verify?mobileOrEmail=${mobileOrEmail}&otp=${otp}`,
            type: 'POST',
            success: function(data) {
                showErrorModal('OTP verified. Please enter your new password.','Success');
                otpDiv.hide();          
                resetPasswordDiv.show();
                hideLoader();
            },
            error: function(xhr) {
                if (xhr.status === 400) {
                   showErrorModal('Invalid OTP.','Error');
                } else {
                   showErrorModal(xhr.responseText,'Error');
                }
                hideLoader();
                verifyOtpBtn.prop('disabled', false);
            }
        });
    });

    resetPasswordForm.on('submit', function(event) {
        event.preventDefault();
        clearErrors();

        const newPassword = newPasswordInput.val();
        const confirmPassword = confirmPasswordInput.val();

        if (!validatePassword(newPassword)) {
            showError('newPasswordError', 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            return;
        }

        resetPasswordBtn.prop('disabled', true);
        showLoader();

        $.ajax({
            url: `http://localhost:8082/api/auth/reset-password?mobileOrEmail=${mobileOrEmail}&otp=${otp}&newPassword=${newPassword}`,
            type: 'POST',
            success: function(data) {
                showErrorModal('Password reset successfully. Redirecting to login page...','Success');
                setTimeout(() => {
                    window.location.href = 'user-login.html';
                }, 2000);
            },
            error: function(xhr) {
                 showErrorModal(xhr.responseText,'Error');
                hideLoader();
                resetPasswordBtn.prop('disabled', false);
            }
        });
    });

    resendOtpBtn.on('click', function() {
        $.ajax({
            url: `http://localhost:8082/api/auth/forgot-password?mobileOrEmail=${mobileOrEmail}`,
            type: 'POST',
            success: function(data) {
                showErrorModal('OTP resent. Please enter the OTP to verify.','Success');
                startTimer();
                hideLoader();
            },
            error: function(xhr) {
                if (xhr.status === 404) {
                    
                    showErrorModal('User not found.','Error');
                } else {
                    showErrorModal(xhr.responseText,'Error');
                }
                hideLoader();
            }
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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

    function saveToken(data) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userEmail', data.email);
    }

    function startTimer() {
        let timeLeft = 120;
        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerSpan.text('');
                resendOtpBtn.show();
            } else {
                timerSpan.text(`Time left: ${timeLeft} seconds`);
                timeLeft--;
            }
        }, 1000);
    }

    // Back button functionality
    $('#backBtn').on('click', function() {
        window.history.back();
    });

    // Home button functionality
    $('#homeBtn').on('click', function() {
        window.location.href = 'http://127.0.0.1:8083'; // Adjust the path as needed
    });

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


});