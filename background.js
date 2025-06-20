// Background service worker for Article Scraper Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('Article Scraper Extension installed');
    
    // Set up context menu
    chrome.contextMenus.create({
        id: 'extractArticle',
        title: 'Extract Article Content',
        contexts: ['page', 'selection', 'link']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'extractArticle') {
        try {
            // Get the current tab URL
            const url = info.linkUrl || tab.url;
            
            // Extract article content
            const response = await fetch('http://localhost:8000/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (response.ok) {
                // Store the result
                await chrome.storage.local.set({ [url]: data });
                
                // Show notification
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Article Extracted!',
                    message: `Successfully extracted: ${data.title || 'Article content'}`
                });
            } else {
                throw new Error(data.error || 'Failed to extract article');
            }
        } catch (error) {
            console.error('Background extraction error:', error);
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Extraction Failed',
                message: error.message || 'Failed to extract article content'
            });
        }
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    // This will open the popup, but we can also add additional logic here if needed
    console.log('Extension icon clicked for tab:', tab.url);
});

// Listen for tab updates to clear old cached data
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Optional: Clear old cache entries to prevent storage bloat
        const storage = await chrome.storage.local.get();
        const keys = Object.keys(storage);
        
        // Keep only the last 10 cached articles
        if (keys.length > 10) {
            const oldKeys = keys.slice(0, keys.length - 10);
            await chrome.storage.local.remove(oldKeys);
        }
    }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractArticle') {
        extractArticleFromUrl(request.url)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep message channel open for async response
    }
});

async function extractArticleFromUrl(url) {
    const response = await fetch('http://localhost:8000/api/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to extract article');
    }

    // Cache the result
    await chrome.storage.local.set({ [url]: data });
    
    return data;
}
