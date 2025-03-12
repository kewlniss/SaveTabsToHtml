// Handle "Open All Tabs" button
document.getElementById('openAllTabs').addEventListener('click', function() {
    const links = document.querySelectorAll('.tab-card .tab-link');
    const totalLinks = links.length;
    
    // Ask for confirmation if many tabs will be opened
    if (totalLinks > 10) {
        if (!confirm('This will open ' + totalLinks + ' tabs. Are you sure you want to continue?')) {
            return;
        }
    }
    
    // Function to open tabs with a small delay to prevent browser from blocking
    function openTabsWithDelay(links, index, batchSize, delay) {
        if (index >= links.length) return;
        
        // Open a batch of tabs
        const end = Math.min(index + batchSize, links.length);
        for (let i = index; i < end; i++) {
            window.open(links[i].href, '_blank');
        }
        
        // Update button text to show progress
        const openedCount = Math.min(end, links.length);
        const percent = Math.round((openedCount / links.length) * 100);
        document.getElementById('openAllTabs').textContent = 'Opening Tabs... ' + percent + '%';
        
        // Schedule the next batch
        if (end < links.length) {
            setTimeout(function() {
                openTabsWithDelay(links, end, batchSize, delay);
            }, delay);
        } else {
            setTimeout(function() {
                document.getElementById('openAllTabs').textContent = 'Open All Tabs';
            }, 2000);
        }
    }
    
    // Change button text and start opening tabs
    this.textContent = 'Opening Tabs...';
    openTabsWithDelay(Array.from(links), 0, 5, 500);
});
