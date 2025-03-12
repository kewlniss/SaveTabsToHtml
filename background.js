// Store descriptions keyed by URL
const pageDescriptions = {};

// Import html template
importScripts('html-template.js');

// Listen for descriptions from content scripts
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'pageDescription' && message.url) {
    pageDescriptions[message.url] = message.description;
  }
});

// Function to collect descriptions for all tabs
async function collectDescriptions(tabs) {
  const promises = tabs.map(tab => {
    return new Promise((resolve) => {
      // Skip non-http pages (like chrome:// or extension:// URLs)
      if (!tab.url || !tab.url.match(/^https?:\/\//)) {
        resolve();
        return;
      }
      
      // Execute content script in the tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      }).catch(err => {
        console.warn(`Could not inject script into tab ${tab.id} to get description:`, err);
      }).finally(() => {
        // Resolve after a short delay to allow the message to be sent back
        setTimeout(() => resolve(), 100);
      });
    });
  });
  
  // Wait for all content scripts to execute (with a timeout)
  await Promise.all(promises);
  
  // Additional 200ms delay to collect any pending messages
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return pageDescriptions;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  
  if (request.action === 'saveTabs') {
    try {
      // Validate tabs array
      if (!request.tabs || !Array.isArray(request.tabs)) {
        console.error('Invalid tabs data:', request.tabs);
        sendResponse({ success: false, error: 'Invalid tabs data received' });
        return true;
      }
      
      // Process tabs
      saveTabsToHtml(request.tabs, request.filename)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error('Error saving tabs:', error);
          sendResponse({ success: false, error: error.message || 'Unknown error occurred' });
        });
      return true; // Required for async sendResponse
    } catch (e) {
      console.error('Exception in message handler:', e);
      sendResponse({ success: false, error: 'Internal extension error: ' + e.message });
      return true;
    }
  }
});

// Function to save tabs to HTML
async function saveTabsToHtml(tabs, customFilename) {
  try {
    await collectDescriptions(tabs);
    
    // Get filename from parameter or generate default
    let filename = customFilename;
    
    // Create default filename with date if not provided
    if (!filename) {
      const date = new Date();
      filename = `saved_tabs_${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}.html`;
    }
    
    // Create HTML content using the template
    const date = new Date().toLocaleString();
    const htmlContent = generateHtmlTemplate(tabs, date, pageDescriptions);
    
    // Create a data URL
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    
    // Save the file using the data URL
    let downloadId;
    try {
      downloadId = await chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: true
      });
    } catch (downloadError) {
      console.error('Download API error:', downloadError);
      
      // Fallback method - try to open in a new tab
      const newTab = await chrome.tabs.create({ url: dataUrl });
      console.log('Fallback: Opened in new tab:', newTab);
      return; // We're done with the fallback
    }
    console.log(`Download started with ID: ${downloadId}`);
  } catch (error) {
    console.error("Error saving tabs:", error);
    throw error; // Re-throw to propagate to caller
  }
}
