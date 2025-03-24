# Save Tabs to Html

A browser extension that saves all your open tabs to a beautifully formatted HTML file with extracted descriptions. It also allows you to restore your saved tabs session with a single click.

## Official Extension Download
Chrome:
https://chromewebstore.google.com/detail/save-tabs-to-html/nkhgajohinombcanphnhlfjlangpfahp

Edge:
https://microsoftedge.microsoft.com/addons/detail/save-tabs-to-html/kipamjjiobcgapkgfgcdekfhoinfhccn


## Features

- Save all open tabs with a single click
- Choose to save tabs from all windows or just the current window
- Customize the output filename
- Remember your preferences between uses
- Intelligent page description extraction:
  - Uses meta description tags when available
  - Falls back to page headings if no meta description exists
- "Open All Tabs" button to restore your saved tabs session
  - Includes popup blocker detection and guidance
- Clean, responsive design
- Displays tab titles, descriptions, and URLs
- Links remain clickable in the saved HTML file
- Tabs are organized in an easy-to-read card layout

## Installation

### Chrome/Edge/Brave (and other Chromium browsers)

1. Download or clone this repository
2. Open your browser's extension management page:
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
   - Brave: brave://extensions/
3. Enable "Developer mode" (usually a toggle in the top right)
4. Click "Load unpacked"
5. Select the `SaveTabsToHtml` folder

### Firefox

1. Download or clone this repository
2. Open Firefox
3. Enter "about:debugging" in the URL bar
4. Click "This Firefox"
5. Click "Load Temporary Add-on"
6. Select any file in the `SaveTabsToHtml` folder

## Usage

1. Click the extension icon in your browser toolbar
2. Choose where to save your HTML file
3. Open the saved HTML file in any web browser to view your saved tabs

## Customization

You can customize the appearance of the saved HTML by modifying the CSS in the `html-template.js` file.

## Requirements

The extension requires the following permissions:
- `tabs`: To access the list of open tabs
- `downloads`: To save the HTML file
- `activeTab`: To access the current active tab
- `storage`: To remember your preferences
- `scripting`: To extract page descriptions
- `host_permissions`: To access content on the pages

## License

MIT

## Privacy

This extension is designed with your privacy in mind:
- No data is transmitted from your machine to any external servers
- All processing happens locally in your browser
- No usage data or browsing history is collected or stored outside your device
- Your tab information is only saved to the HTML file that you explicitly download

# Want to send a tip?
Stripe / Credit Card:
https://donate.stripe.com/cN23eI2me5Pocco4gi

Tip via Bitcoin:

BTC: `bc1qh6xqrfq74mck9mgfspm4hx4ewhqmh5f70vktg7`

Tip via Solana (including USDC on Solana):

SOL: `3RMhqzZ4xNyESPr1PtKeyVQkty6SGhNgwWyusrFkHnaS`
