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

    // Load notification settings
    function loadNotificationSettings() {
        $.ajax({
            url: `http://localhost:8082/api/notifications/settings/${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                $('#emailAlerts').val(data.emailAlerts ? 'enabled' : 'disabled');
                $('#smsAlerts').val(data.smsAlerts ? 'enabled' : 'disabled');
            },
            error: function(xhr) {
                showErrorModal('Failed to load notification settings.');
                window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
                return;
            }
        });
    }

    // Save notification settings
    $('#notificationSettingsForm').on('submit', function(event) {
        event.preventDefault();
        const settings = {
            emailAlerts: $('#emailAlerts').val() === 'enabled',
            smsAlerts: $('#smsAlerts').val() === 'enabled'
        };

        $.ajax({
            url: `http://localhost:8082/api/notifications/settings/${userId}`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(settings),
            success: function(data) {
                $('#notificationModal').modal('show');
                $('#notificationMessage').text('Notification settings saved successfully.');
            },
            error: function(xhr) {
                showErrorModal('Failed to save notification settings.');
            }
        });
    });

    // Load notification history
    function loadNotificationHistory() {
        $.ajax({
            url: `http://localhost:8082/api/notifications/history/${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            success: function(data) {
                let notificationsHtml = '';
                data.forEach(notification => {
                    const statusClass = notification.status === 'read' ? 'text-success' : 'text-danger';
                    notificationsHtml += `
                        <tr>
                            <td>${notification.id}</td>
                            <td>${new Date(notification.date).toLocaleString()}</td>
                            <td>${notification.type}</td>
                            <td>${notification.message}</td>
                            <td class="${statusClass}">${notification.status}</td>
                        </tr>
                    `;
                });
                $('#notificationsTableBody').html(notificationsHtml || '<tr><td colspan="5">No Notifications</td></tr>');
            },
            error: function(xhr) {
                showErrorModal('Failed to load notification history.');
                window.location.href = 'http://127.0.0.1:8083/modules/user-management/user-login.html';
                return;
            }
        });
    }

    // Load notification settings and history on page load
    loadNotificationSettings();
    loadNotificationHistory();
});

function showErrorModal(message) {
    $('#notificationModal').modal('show');
    $('#notificationMessage').text(message);
}