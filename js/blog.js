// Blog page JavaScript functionality
import { fetchArticles } from '../shared/js/website-api.js';

let allArticles = [];

// Initialize blog page
document.addEventListener('DOMContentLoaded', async function() {
    await loadArticles();
});

// Load and display articles
async function loadArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    articlesGrid.innerHTML = '<div class="loading">Loading articles...</div>';

    const { data: articles, error } = await fetchArticles();
    
    if (error) {
        console.error('Error loading articles:', error);
        articlesGrid.innerHTML = '<div class="no-articles">Error loading articles. Please try again later.</div>';
        return;
    }

    allArticles = articles || [];
    displayArticles(allArticles);
}

// Display articles in grid
function displayArticles(articles) {
    const articlesGrid = document.getElementById('articlesGrid');
    
    if (!articles || articles.length === 0) {
        articlesGrid.innerHTML = '<div class="no-articles">No articles found. Check back soon for new content!</div>';
        return;
    }

    articlesGrid.innerHTML = articles.map(article => `
        <article class="article-card" data-id="${article.website_article_id}">
            ${article.website_article_featured_image_url ? 
                `<img src="${article.website_article_featured_image_url}" alt="${article.website_article_title}" class="article-image">` :
                '<div class="article-image" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666;">No Image</div>'
            }
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.website_article_categories?.website_article_category_name || 'Uncategorized'}</span>
                    <span class="article-date">${formatDate(article.website_article_created_at)}</span>
                </div>
                <h2 class="article-title">${article.website_article_title}</h2>
                <p class="article-excerpt">${getExcerpt(article)}</p>
                <a href="#" class="read-more" data-id="${article.website_article_id}">Read More →</a>
            </div>
        </article>
    `).join('');

    // Setup click handlers for articles
    setupArticleHandlers();
}

// Setup article click handlers
function setupArticleHandlers() {
    document.querySelectorAll('.article-card, .read-more').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = element.dataset.id || element.closest('.article-card').dataset.id;
            openArticle(articleId);
        });
    });
}

// Open article (placeholder - you could implement a modal or separate page)
function openArticle(articleId) {
    const article = allArticles.find(a => a.website_article_id.toString() === articleId);
    if (article) {
        // For now, just scroll to top and show an alert
        // In a real implementation, you'd probably navigate to a separate article page
        // or open a modal with the full article content
        window.scrollTo(0, 0);
        
        // Create a simple modal to display article content
        showArticleModal(article);
    }
}

// Show article in a modal
function showArticleModal(article) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('articleModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'articleModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content article-modal-content">
                <div class="modal-header">
                    <h2 id="articleModalTitle"></h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div id="articleModalContent"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .article-modal-content {
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                overflow: auto;
            }

            .modal-content {
                background-color: white;
                margin: 5% auto;
                width: 90%;
                border-radius: 8px;
                overflow: hidden;
            }

            .modal-header {
                padding: 1rem 1.5rem;
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-body {
                padding: 1.5rem;
                line-height: 1.6;
            }

            .close {
                color: #aaa;
                font-size: 1.5rem;
                font-weight: bold;
                cursor: pointer;
            }

            .close:hover {
                color: #333;
            }
        `;
        document.head.appendChild(style);

        // Setup close handlers
        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Populate modal with article content
    document.getElementById('articleModalTitle').textContent = article.website_article_title;
    document.getElementById('articleModalContent').innerHTML = `
        <div class="article-meta" style="margin-bottom: 1rem;">
            <span class="article-category">${article.website_article_categories?.website_article_category_name || 'Uncategorized'}</span>
            <span class="article-date" style="margin-left: 1rem;">${formatDate(article.website_article_created_at)}</span>
        </div>
        ${article.website_article_featured_image_url ? 
            `<img src="${article.website_article_featured_image_url}" alt="${article.website_article_title}" style="width: 100%; margin-bottom: 1rem; border-radius: 4px;">` : 
            ''
        }
        <div class="article-content">
            ${article.website_article_content || article.website_article_excerpt || 'Content not available.'}
        </div>
    `;

    // Show modal
    modal.style.display = 'block';
}

// Get article excerpt
function getExcerpt(article) {
    if (article.website_article_excerpt) {
        return truncateText(article.website_article_excerpt, 150);
    } else if (article.website_article_content) {
        // Remove HTML tags and get excerpt from content
        const textContent = article.website_article_content.replace(/<[^>]*>/g, '');
        return truncateText(textContent, 150);
    }
    return 'No excerpt available.';
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}