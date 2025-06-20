// Content script for Article Scraper Extension
// Runs on all web pages to provide additional functionality

class ArticleScraperContent {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard shortcut for quick extraction
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+E (or Cmd+Shift+E on Mac) to extract article
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                this.quickExtract();
            }
        });

        // Add floating action button for easy access
        this.addFloatingButton();

        // Listen for messages from popup or background
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getPageInfo') {
                sendResponse({
                    url: window.location.href,
                    title: document.title,
                    hasArticle: this.detectArticleContent()
                });
            }
        });
    }

    detectArticleContent() {
        // Simple heuristic to detect if page likely contains an article
        const articleSelectors = [
            'article',
            '[role="main"]',
            '.article',
            '.post',
            '.entry',
            '.content',
            'main'
        ];

        for (const selector of articleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.length > 500) {
                return true;
            }
        }

        // Check for multiple paragraphs
        const paragraphs = document.querySelectorAll('p');
        let totalLength = 0;
        for (const p of paragraphs) {
            totalLength += p.textContent.length;
            if (totalLength > 1000) return true;
        }

        return false;
    }

    async quickExtract() {
        try {
            // Show loading indicator
            this.showNotification('Extracting article...', 'info');

            // Send message to background script to extract
            const response = await chrome.runtime.sendMessage({
                action: 'extractArticle',
                url: window.location.href
            });

            if (response.success) {
                this.showNotification('Article extracted! Click extension icon to view.', 'success');
            } else {
                this.showNotification(`Extraction failed: ${response.error}`, 'error');
            }
        } catch (error) {
            console.error('Quick extract error:', error);
            this.showNotification('Extraction failed. Please try again.', 'error');
        }
    }

    addFloatingButton() {
        // Only add on article-like pages
        if (!this.detectArticleContent()) return;

        const button = document.createElement('div');
        button.id = 'article-scraper-fab';
        button.innerHTML = '📄';
        button.title = 'Extract Article Content (Ctrl+Shift+E)';
        
        // Styling
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#667eea',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        });

        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.backgroundColor = '#5a67d8';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = '#667eea';
        });

        // Click handler
        button.addEventListener('click', () => {
            this.quickExtract();
        });

        // Add to page
        document.body.appendChild(button);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (button.parentNode) {
                button.style.opacity = '0.3';
            }
        }, 10000);

        // Show on hover after auto-hide
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.getElementById('article-scraper-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'article-scraper-notification';
        notification.textContent = message;

        const colors = {
            info: { bg: '#3498db', text: 'white' },
            success: { bg: '#2ecc71', text: 'white' },
            error: { bg: '#e74c3c', text: 'white' }
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            backgroundColor: colors[type].bg,
            color: colors[type].text,
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            zIndex: '10001',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '300px',
            wordWrap: 'break-word',
            animation: 'slideInRight 0.3s ease'
        });

        // Add animation keyframes
        if (!document.getElementById('article-scraper-styles')) {
            const style = document.createElement('style');
            style.id = 'article-scraper-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);
    }
}

// Initialize content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ArticleScraperContent();
    });
} else {
    new ArticleScraperContent();
}
