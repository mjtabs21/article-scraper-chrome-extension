class ArticleScraperPopup {
    constructor() {
        this.currentUrl = '';
        this.currentResult = null;
        this.init();
    }

    async init() {
        // Get current tab URL
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        this.currentUrl = tab.url;

        // Set up event listeners
        this.setupEventListeners();

        // Check if we have cached result for this URL
        this.checkCachedResult();
    }

    setupEventListeners() {
        document.getElementById('extractBtn').addEventListener('click', () => this.extractArticle());
        document.getElementById('copyTitle').addEventListener('click', () => this.copyToClipboard('title'));
        document.getElementById('copyDate').addEventListener('click', () => this.copyToClipboard('date'));
        document.getElementById('copyContent').addEventListener('click', () => this.copyToClipboard('content'));
        document.getElementById('copyAll').addEventListener('click', () => this.copyToClipboard('all'));
        document.getElementById('copyUrl').addEventListener('click', () => this.copyToClipboard('url'));
        document.getElementById('newArticle').addEventListener('click', () => this.resetForNewArticle());
    }

    async checkCachedResult() {
        try {
            const result = await chrome.storage.local.get([this.currentUrl]);
            if (result[this.currentUrl]) {
                this.currentResult = result[this.currentUrl];
                this.displayResult();
            }
        } catch (error) {
            console.error('Error checking cached result:', error);
        }
    }

    async extractArticle() {
        this.showLoading();
        this.hideError();
        this.hideSuccess();

        try {
            // Use the existing scraper API
            const response = await fetch('http://localhost:8000/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: this.currentUrl })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape article');
            }

            this.currentResult = data;
            
            // Cache the result
            await chrome.storage.local.set({ [this.currentUrl]: data });
            
            this.displayResult();
            this.showSuccess('Article extracted successfully!');

        } catch (error) {
            console.error('Extraction error:', error);
            this.showError(error.message || 'Failed to extract article content');
        } finally {
            this.hideLoading();
        }
    }

    displayResult() {
        const result = this.currentResult;
        
        // Show result container
        document.getElementById('result').style.display = 'block';
        document.getElementById('extractBtn').style.display = 'none';

        // Display URL
        document.getElementById('urlDisplay').textContent = `Source: ${this.currentUrl}`;

        // Display title
        document.getElementById('resultTitle').textContent = result.title || 'No title found';

        // Display meta information
        const metaInfo = [];
        if (result.publishedDate) {
            const date = new Date(result.publishedDate).toLocaleDateString();
            metaInfo.push(`Published: ${date}`);
        }
        metaInfo.push(`Extracted: ${new Date().toLocaleString()}`);
        document.getElementById('resultMeta').textContent = metaInfo.join(' • ');

        // Display content (truncated for popup)
        const content = result.content || 'No content extracted';
        const truncatedContent = content.length > 500 ? content.substring(0, 500) + '...' : content;
        document.getElementById('resultContent').textContent = truncatedContent;
    }

    async copyToClipboard(type) {
        if (!this.currentResult) return;

        let textToCopy = '';
        let buttonId = '';
        let successMessage = '';

        switch (type) {
            case 'title':
                textToCopy = this.currentResult.title || '';
                buttonId = 'copyTitle';
                successMessage = 'Title copied!';
                break;
            case 'date':
                textToCopy = this.currentResult.publishedDate ? 
                    new Date(this.currentResult.publishedDate).toLocaleDateString() : '';
                buttonId = 'copyDate';
                successMessage = 'Date copied!';
                break;
            case 'content':
                textToCopy = this.currentResult.content || '';
                buttonId = 'copyContent';
                successMessage = 'Content copied!';
                break;
            case 'url':
                textToCopy = this.currentUrl;
                buttonId = 'copyUrl';
                successMessage = 'URL copied!';
                break;
            case 'all':
                const title = this.currentResult.title || '';
                const date = this.currentResult.publishedDate ? 
                    new Date(this.currentResult.publishedDate).toLocaleDateString() : 'N/A';
                const content = this.currentResult.content || '';
                textToCopy = `Title: ${title}\n\nPublished: ${date}\n\nContent:\n${content}\n\nSource: ${this.currentUrl}`;
                buttonId = 'copyAll';
                successMessage = 'All content copied!';
                break;
        }

        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                this.showCopySuccess(buttonId, successMessage);
            } catch (error) {
                console.error('Copy failed:', error);
                this.showError('Failed to copy to clipboard');
            }
        }
    }

    showCopySuccess(buttonId, message) {
        const button = document.getElementById(buttonId);
        const originalText = button.textContent;
        
        button.classList.add('success');
        button.textContent = '✓ Copied!';
        
        setTimeout(() => {
            button.classList.remove('success');
            button.textContent = originalText;
        }, 2000);

        this.showSuccess(message);
    }

    resetForNewArticle() {
        // Clear cached result for current URL
        chrome.storage.local.remove([this.currentUrl]);
        
        // Reset UI
        document.getElementById('result').style.display = 'none';
        document.getElementById('extractBtn').style.display = 'block';
        this.hideError();
        this.hideSuccess();
        this.currentResult = null;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('extractBtn').disabled = true;
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('extractBtn').disabled = false;
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            this.hideSuccess();
        }, 3000);
    }

    hideSuccess() {
        document.getElementById('successMessage').style.display = 'none';
    }
}

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', () => {
    new ArticleScraperPopup();
});
