// Function to generate HTML content for the saved tabs
function generateHtmlTemplate(tabs, date, descriptions) {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Tabs - ${date}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
        }
        h1 {
            color: #2c3e50;
        }
        .stats {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 10px;
        }
        .open-all-button {
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            font-size: 14px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.3s;
        }
        .open-all-button:hover {
            background-color: #2980b9;
        }
        .open-all-button:active {
            background-color: #1f6da9;
        }
        .popup-notice {
            display: none;
            background-color: #fffacd;
            border: 1px solid #ffd700;
            border-radius: 4px;
            padding: 10px 15px;
            margin-top: 15px;
            font-size: 14px;
            color: #806600;
            text-align: left;
        }
        .popup-notice.show {
            display: block;
            animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .tabs-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 50px;
        }
        .tab-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .tab-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .tab-title {
            font-size: 1.1em;
            font-weight: 600;
            color: #3498db;
            margin-bottom: 10px;
            word-break: break-word;
        }
        .tab-description {
            color: #666;
            margin-bottom: 15px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            flex-grow: 1;
        }
        .tab-link {
            font-size: 0.9em;
            color: #7f8c8d;
            text-decoration: none;
            word-break: break-all;
        }
        .tab-link:hover {
            text-decoration: underline;
            color: #3498db;
        }
        .favicon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            vertical-align: middle;
        }
        .no-description {
            font-style: italic;
            color: #999;
        }
        footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.8em;
            color: #95a5a6;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
        }

        .support-text {
            text-align: center;
            margin: 20px 0;
            font-weight: 600;
            color: #555;
        }

        .support-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 15px;
            border-radius: 8px;
            overflow: hidden;
        }

        .tip-container {
            flex: 1;
            padding: 15px;
            background-color: #f0f8ff;
            border-radius: 8px 0 0 8px;
            text-align: center;
            font-size: 0.9em;
        }
        .tip-link {
            color: #3498db;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            padding: 6px 12px;
            background-color: #3498db;
            color: white;
            border-radius: 4px;
            margin: 5px 0;
        }
        .tip-link:hover {
            background-color: #2980b9;
            text-decoration: none;
        }
        .divider {
            width: 1px;
            background-color: #ddd;
            align-self: stretch;
            margin: 0 15px;
        }

        .crypto-addresses {
            flex: 1;
            margin-top: 0;
            text-align: left;
            background-color: #f5f5f5;
            border-radius: 0 8px 8px 0;
            padding: 15px;
            font-size: 1.45em;
        }
        .wallet-address {
            font-family: monospace;
            padding: 2px 4px;
            background-color: #fff;
            border-radius: 3px;
            border: 1px solid #eee;
        }
        .copy-btn {
            background-color: #ddd;
            border: none;
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
            margin-left: 5px;
            font-size: 0.9em;
        }
        .copy-btn:hover {
            background-color: #ccc;
        }
        .tip-icon {
            font-style: normal;
            margin-right: 5px;
        }
        @media (max-width: 768px) {
            .tabs-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Saved Tabs</h1>
        <div class="stats">
            <p>Saved on ${date} • ${tabs.length} tabs</p>
            <button id="openAllTabs" class="open-all-button">Open All Tabs</button>
            <div id="popupNotice" class="popup-notice">
                <strong>Popup Blocker Detected!</strong><br>
                Your browser has blocked additional tabs from opening.<br>
                <ol>
                    <li>Look for the popup blocker icon in your address bar</li>
                    <li>Click it and select "Allow popups from this page"</li>
                    <li>Click the "Open All Tabs" button again</li>
                </ol>
            </div>
        </div>
    </header>
    
    <main class="tabs-container">`;

  // Add each tab as a card
  tabs.forEach(tab => {
    // Make sure we have valid tab data
    if (!tab || typeof tab !== 'object') {
      return; // Skip this iteration
    }
    
    const title = tab.title || "Untitled";
    const url = tab.url || "";
    // Get favicon if available
    const favicon = (tab.favIconUrl && typeof tab.favIconUrl === 'string') ? tab.favIconUrl : '';
    
    // Get description if available
    let description = '';
    if (tab.url && descriptions[tab.url]) {
      description = descriptions[tab.url];
    }
    
    html += `
        <article class="tab-card">
            <a href="${url}" target="_blank" class="tab-title">
                ${favicon ? `<img src="${favicon}" class="favicon" alt="">` : ''}
                ${title}
            </a>
            <div class="tab-description">
                ${description ? description : '<span class="no-description">No description available</span>'}
            </div>
            <a href="${url}" target="_blank" class="tab-link">${url}</a>
        </article>`;
  });

  html += `
    </main>
    
    <footer>
      <p>Generated by Save Tabs to HTML extension created with ❤️ by GlobalCove Technologies, LLC</p>
      <p class="support-text">Find this extension helpful? Consider saying thanks!</p>
      <div class="support-container">
          <div class="tip-container">
              <p><a href="https://donate.stripe.com/cN23eI2me5Pocco4gi" target="_blank" class="tip-link"><i class="tip-icon">💳</i> Tip via Credit Card</a></p>
            <p><img width="150" alt="qr code to tip" src="data:image/png;base64,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" /></p>  
        </div>
          <div class="divider"></div>
          <div class="crypto-addresses">
              <p>Tip via Bitcoin or Solana (including USDC on Solana):</p>
              <p><i class="tip-icon">₿</i> BTC: <span class="wallet-address">bc1qh6xqrfq74mck9mgfspm4hx4ewhqmh5f70vktg7</span> <button class="copy-btn" data-address="bc1qh6xqrfq74mck9mgfspm4hx4ewhqmh5f70vktg7">Copy</button></p>
              <p><i class="tip-icon">◎</i> SOL: <span class="wallet-address">3RMhqzZ4xNyESPr1PtKeyVQkty6SGhNgwWyusrFkHnaS</span> <button class="copy-btn" data-address="3RMhqzZ4xNyESPr1PtKeyVQkty6SGhNgwWyusrFkHnaS">Copy</button></p>
          </div>
      </div>
    </footer>
    
    <script>
    // Simple JS to handle opening tabs
    document.getElementById('openAllTabs').addEventListener('click', function() {
      var links = document.querySelectorAll('.tab-card .tab-link');
      var totalLinks = links.length;
      var popupNotice = document.getElementById('popupNotice');
      
      // Hide popup notice when starting fresh
      popupNotice.classList.remove('show');
      
      if (totalLinks > 10) {
        if (!confirm('This will open ' + totalLinks + ' tabs. Are you sure?')) {
          return;
        }
      }
      
      this.textContent = 'Opening Tabs...';
      var self = this;
      var currentIndex = 0;
      var openedWindows = 0;
      
      function openNext(batch) {
        if (currentIndex >= links.length) {
          setTimeout(function() {
            self.textContent = 'Open All Tabs';
          }, 2000);
          return;
        }
        
        var end = Math.min(currentIndex + batch, links.length);
        var newWindows = [];
        
        // Try to open windows and track successes
        for (var i = currentIndex; i < end; i++) {
          var newWindow = window.open(links[i].href, '_blank');
          if (newWindow) {
            newWindows.push(newWindow);
            openedWindows++;
          }
        }
        
        // Check if we might have been blocked
        if (newWindows.length === 0 && openedWindows <= 1) {
          // Likely blocked by popup blocker after the first window
          popupNotice.classList.add('show');
          self.textContent = 'Try Again';
          return; // Stop trying to open more
        }
        
        var percent = Math.round((Math.min(end, links.length) / links.length) * 100);
        self.textContent = 'Opening Tabs... ' + percent + '%';
        
        currentIndex = end;
        setTimeout(function() {
          openNext(batch);
        }, 500);
      }
      
      openNext(5);
    });
    
    // Copy functionality for wallet addresses
    document.querySelectorAll('.copy-btn').forEach(button => {
      button.addEventListener('click', function() {
        const address = this.getAttribute('data-address');
        navigator.clipboard.writeText(address).then(() => {
          const originalText = this.textContent;
          this.textContent = 'Copied!';
          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        });
      });
    });
    </script>
</body>
</html>`;

  return html;
}

// Export the function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateHtmlTemplate };
}
