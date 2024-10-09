$(document).ready(function() {
    // Back button functionality
    $('#backBtn').on('click', function() {
        window.history.back();
    });

    // Home button functionality
    $('#homeBtn').on('click', function() {
        window.location.href = 'http://127.0.0.1:8083'; // Adjust the path as needed
    });

    // Show notification modal with a message
    function showNotification(message) {
        $('#notificationMessage').text(message);
        $('#notificationModal').modal('show');
    }

    // Example usage of notification modal
    // showNotification('Welcome to User Management Home!');
});