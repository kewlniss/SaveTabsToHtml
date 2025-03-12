document.addEventListener('DOMContentLoaded', async function() {
    const saveButton = document.getElementById('saveTabsBtn');
    const statusDiv = document.getElementById('status');
    const tabScopeToggle = document.getElementById('tabScopeToggle');
    const filenameInput = document.getElementById('filenameInput');
    
    // Load saved preferences
    await loadPreferences();
    
    // Generate default filename with date and time
    setDefaultFilename();
    
    // Show current tab counts
    await updateTabCounts();
    
    // Add event listener for the toggle to update counts
    tabScopeToggle.addEventListener('change', async () => {
        await updateTabCounts();
        // Save preference when changed
        savePreferences();
    });
    
    // Main save button click handler
    saveButton.addEventListener('click', async () => {
        try {
            // Get selected scope (all windows or current window)
            const allWindows = tabScopeToggle.checked;
            
            // Save the current preferences
            savePreferences();
            
            showStatus('Gathering tab information...', 'info');
            
            // Get tabs based on scope selection
            const tabs = await chrome.tabs.query(allWindows ? {} : {currentWindow: true});
            
            showStatus(`Processing ${tabs.length} tabs...`, 'info');
            
            // Get custom filename or use default
            let filename = filenameInput.value.trim();
            if (!filename) {
                setDefaultFilename();
                filename = filenameInput.value;
            }
            
            // Make sure filename has .html extension
            if (!filename.toLowerCase().endsWith('.html')) {
                filename += '.html';
            }
            
            showStatus(`Preparing HTML file with ${tabs.length} tabs...`, 'info');
            
            chrome.runtime.sendMessage({
                action: 'saveTabs',
                tabs: tabs,
                filename: filename
            }, (response) => {
                if (response && response.success) {
                    showStatus('Your tabs are being saved! Check your downloads.', 'success');
                    // Close the popup after successful save (optional)
                    setTimeout(() => window.close(), 2000);
                } else {
                    showStatus('Error: ' + (response?.error || 'Unknown error'), 'error');
                    console.error('Error response:', response);
                }
            });
        } catch (error) {
            console.error('Error in popup:', error);
            showStatus('Error: ' + error.message, 'error');
        }
    });
    
    // Helper function to show status messages
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
    }
    
    // Helper function to update tab counts based on toggle
    async function updateTabCounts() {
        try {
            const allWindows = tabScopeToggle.checked;
            
            // Get tabs based on scope selection
            const allTabs = await chrome.tabs.query({});
            const currentWindowTabs = await chrome.tabs.query({currentWindow: true});
            
            // Create or update tab count element
            let tabCount = document.querySelector('.count');
            if (!tabCount) {
                tabCount = document.createElement('div');
                tabCount.className = 'count';
                document.body.insertBefore(tabCount, document.querySelector('.toggle-container'));
            }
            
            // Update tab count text
            if (allWindows) {
                tabCount.innerHTML = `Total tabs across all windows: <span>${allTabs.length}</span>`;
            } else {
                tabCount.innerHTML = `Tabs in current window: <span>${currentWindowTabs.length}</span>`;
            }
            
            // Update button text
            const count = allWindows ? allTabs.length : currentWindowTabs.length;
            saveButton.textContent = `Save ${count} Tabs`;
        } catch (error) {
            console.error('Error getting tab count:', error);
        }
    }
    
    // Helper function to set default filename with date and time
    function setDefaultFilename() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        filenameInput.value = `saved_tabs_${year}-${month}-${day}-${hours}-${minutes}-${seconds}.html`;
    }
    
    // Save preferences to chrome.storage
    function savePreferences() {
        const preferences = {
            allWindows: tabScopeToggle.checked,
            lastFilename: filenameInput.value
        };
        
        chrome.storage.local.set({ preferences }, function() {
            console.log('Preferences saved');
        });
    }
    
    // Load preferences from chrome.storage
    async function loadPreferences() {
        return new Promise((resolve) => {
            chrome.storage.local.get('preferences', function(result) {
                if (result.preferences) {
                    // Set toggle based on saved preference
                    tabScopeToggle.checked = result.preferences.allWindows !== false; // Default to true if not set
                    
                    // Don't restore the filename - always generate a new one with current timestamp
                    console.log('Preferences loaded');
                }
                resolve();
            });
        });
    }
});
