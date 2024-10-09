import java.io.File;

public class CreateDirectoryStructure {
    public static void main(String[] args) {
        String[] directories = {
            "abc-netbanking-portal",
            "abc-netbanking-portal/css",
            "abc-netbanking-portal/js",
            "abc-netbanking-portal/modules/user-management",
            "abc-netbanking-portal/modules/account-management",
            "abc-netbanking-portal/modules/fund-transfers",
            "abc-netbanking-portal/modules/transaction-history",
            "abc-netbanking-portal/modules/notifications",
            "abc-netbanking-portal/assets/images"
        };

        String[] files = {
            "abc-netbanking-portal/index.html",
            "abc-netbanking-portal/css/styles.css",
            "abc-netbanking-portal/js/main.js",
            "abc-netbanking-portal/modules/user-management/user-management.html",
            "abc-netbanking-portal/modules/user-management/user-management.js",
            "abc-netbanking-portal/modules/user-management/user-management.css",
            "abc-netbanking-portal/modules/account-management/account-management.html",
            "abc-netbanking-portal/modules/account-management/account-management.js",
            "abc-netbanking-portal/modules/account-management/account-management.css",
            "abc-netbanking-portal/modules/fund-transfers/fund-transfers.html",
            "abc-netbanking-portal/modules/fund-transfers/fund-transfers.js",
            "abc-netbanking-portal/modules/fund-transfers/fund-transfers.css",
            "abc-netbanking-portal/modules/transaction-history/transaction-history.html",
            "abc-netbanking-portal/modules/transaction-history/transaction-history.js",
            "abc-netbanking-portal/modules/transaction-history/transaction-history.css",
            "abc-netbanking-portal/modules/notifications/notifications.html",
            "abc-netbanking-portal/modules/notifications/notifications.js",
            "abc-netbanking-portal/modules/notifications/notifications.css"
        };

        for (String dir : directories) {
            File directory = new File(dir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
        }

        for (String file : files) {
            try {
                File newFile = new File(file);
                if (!newFile.exists()) {
                    newFile.createNewFile();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        System.out.println("Directory structure created successfully!");
    }
}
