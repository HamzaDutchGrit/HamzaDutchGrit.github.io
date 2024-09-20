// Object to store counts for each status
const orderCounts = {
    all: 0,
    completed: 0,
    pending: 0,
    failed: 0
};

// Function to count orders by status
function countOrders() {
    // Reset counts
    orderCounts.all = 0;
    orderCounts.completed = 0;
    orderCounts.pending = 0;
    orderCounts.failed = 0;

    // Count the orders
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('[data-label="Status"]');
        if (statusCell) {
            const statusClass = statusCell.classList.contains('completed') ? 'completed' :
                                statusCell.classList.contains('pending') ? 'pending' :
                                statusCell.classList.contains('failed') ? 'failed' : '';

            // Update counts
            orderCounts.all++;
            if (statusClass) {
                orderCounts[statusClass]++;
            }
        }
    });

    // Update the counters for all tabs
    updateCounters(orderCounts);
}

// Function to filter orders based on the status
function filterOrders(status) {
    // Remove 'active' class from all tabs
    const tabs = document.querySelectorAll('.order-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Add 'active' class to clicked tab
    const activeTab = document.getElementById(status + '-orders');
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Filter orders based on the status
    const rows = document.querySelectorAll('.orders-table tbody tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('[data-label="Status"]');
        if (statusCell) {
            const statusClass = statusCell.classList.contains('completed') ? 'completed' :
                                statusCell.classList.contains('pending') ? 'pending' :
                                statusCell.classList.contains('failed') ? 'failed' : '';

            if (status === 'all' || statusClass === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// Function to update the counters
function updateCounters(totalCounts) {
    const counters = {
        all: document.querySelector('#all-orders .order-counter'),
        completed: document.querySelector('#completed-orders .order-counter'),
        pending: document.querySelector('#pending-orders .order-counter'),
        failed: document.querySelector('#failed-orders .order-counter'),
    };

    // Update the count for each status
    Object.keys(counters).forEach(key => {
        if (counters[key]) {
            counters[key].textContent = `(${totalCounts[key] || 0})`;
        }
    });
}

// Default to showing all orders on page load
document.addEventListener('DOMContentLoaded', () => {
    countOrders();  // Count all orders on page load
    filterOrders('all');  // Show all orders by default
});
