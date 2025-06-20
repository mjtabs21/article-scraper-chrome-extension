# Article Scraper - One Click Chrome Extension

A powerful Chrome extension that extracts article content with just one click! Built to work with the Article Scraper web application.

## Features

### 🚀 One-Click Extraction
- Click the extension icon to instantly extract article content
- No need to copy/paste URLs manually
- Works on any webpage with article content

### 📋 Multiple Copy Options
- **Copy Title**: Extract just the article title
- **Copy Date**: Get the publication date
- **Copy Content**: Full article text content
- **Copy All**: Formatted content with title, date, content, and source
- **Copy URL**: Source URL of the article

### ⚡ Quick Access Methods
- **Extension Popup**: Click the extension icon in toolbar
- **Keyboard Shortcut**: `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
- **Floating Button**: Appears on article pages for quick access
- **Context Menu**: Right-click on any page to extract content

### 🎯 Smart Features
- **Auto-Detection**: Automatically detects article-like content
- **Caching**: Remembers extracted content for quick access
- **Visual Feedback**: Success/error notifications
- **Responsive Design**: Beautiful, modern interface

## Installation

### Prerequisites
1. Make sure the Article Scraper web application is running on `http://localhost:8000`
2. Chrome browser (or Chromium-based browser)

### Install the Extension

1. **Create Icons** (Required):
   - Open `create-icons.html` in your browser
   - It will automatically generate and download the required icon files
   - Move the downloaded `icon16.png`, `icon32.png`, `icon48.png`, and `icon128.png` files to the `icons/` folder

2. **Load Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your toolbar!

## Usage

### Method 1: Extension Popup
1. Navigate to any article webpage
2. Click the Article Scraper extension icon in your toolbar
3. Click "🚀 Extract Article Content"
4. Use the copy buttons to get the content you need

### Method 2: Keyboard Shortcut
1. Navigate to any article webpage
2. Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
3. Article content will be extracted automatically
4. Click the extension icon to view and copy the content

### Method 3: Floating Button
1. Navigate to an article webpage
2. Look for the floating 📄 button in the bottom-right corner
3. Click it to extract content instantly

### Method 4: Context Menu
1. Right-click anywhere on an article page
2. Select "Extract Article Content" from the context menu
3. Content will be extracted in the background

## Supported Websites

The extension works with the same websites as the web application:

### ✅ Excellent Support
- Wikipedia
- Many blog sites and smaller publications
- Educational and research websites
- Sites with standard article structures

### ⚠️ Limited Support
- Major publications with paywalls (NYT, WSJ)
- Sites with heavy anti-bot protection
- JavaScript-heavy sites
- Subscription-only content

## File Structure

```
article-scraper-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for web pages
├── create-icons.html     # Icon generator utility
├── icons/
│   ├── icon.svg         # Source SVG icon
│   ├── icon16.png       # 16x16 icon (generate with create-icons.html)
│   ├── icon32.png       # 32x32 icon (generate with create-icons.html)
│   ├── icon48.png       # 48x48 icon (generate with create-icons.html)
│   └── icon128.png      # 128x128 icon (generate with create-icons.html)
└── README.md            # This file
```

## Technical Details

### Permissions
- `activeTab`: Access current tab URL
- `storage`: Cache extracted content
- `host_permissions`: Access to scraper API and web content

### API Integration
- Uses the existing Article Scraper API at `http://localhost:8000/api/scrape`
- Maintains the same extraction capabilities as the web application
- Caches results locally for quick access

### Browser Compatibility
- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Troubleshooting

### Extension Not Working
1. Ensure the Article Scraper web app is running on `http://localhost:8000`
2. Check that all icon files are present in the `icons/` folder
3. Reload the extension in `chrome://extensions/`

### Extraction Fails
1. Check if the website blocks automated scraping
2. Try the web application directly to see if it works there
3. Some sites may require different extraction strategies

### Icons Missing
1. Open `create-icons.html` in your browser
2. Download the generated icon files
3. Place them in the `icons/` folder
4. Reload the extension

## Development

To modify the extension:

1. Edit the relevant files (`popup.js`, `background.js`, `content.js`)
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Article Scraper extension
4. Test your changes

## Privacy

- No data is sent to external servers (except the local scraper API)
- Extracted content is cached locally in your browser
- No tracking or analytics
- All processing happens locally

## License

This extension is part of the Article Scraper project and follows the same licensing terms.
