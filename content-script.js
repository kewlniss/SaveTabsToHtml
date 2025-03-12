// This content script extracts page description and header information
(function() {
    // Try to get meta description
    let description = '';
    const metaDesc = document.querySelector('meta[name="description"]') || 
                    document.querySelector('meta[property="og:description"]');
    
    if (metaDesc && metaDesc.getAttribute('content')) {
        description = metaDesc.getAttribute('content').trim();
    }
    
    // If no meta description, try to get the first heading (h1, h2, h3)
    if (!description) {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        const h3 = document.querySelector('h3');
        
        if (h1 && h1.textContent) {
            description = h1.textContent.trim();
        } else if (h2 && h2.textContent) {
            description = h2.textContent.trim();
        } else if (h3 && h3.textContent) {
            description = h3.textContent.trim();
        }
    }
    
    // Limit description length to prevent extremely long descriptions
    if (description.length > 200) {
        description = description.substring(0, 197) + '...';
    }
    
    // Send back to background script
    chrome.runtime.sendMessage({
        action: 'pageDescription',
        description: description,
        url: window.location.href
    });
})();
