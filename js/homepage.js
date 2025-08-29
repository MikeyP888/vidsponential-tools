// Homepage JavaScript functionality
import { fetchNiches, fetchRecentArticles } from '../shared/js/website-api.js';

// Initialize homepage
document.addEventListener('DOMContentLoaded', async function() {
    await loadNiches();
    await loadRecentArticles();
});

// Load and display niches
async function loadNiches() {
    const { data: niches, error } = await fetchNiches();
    
    if (error) {
        console.error('Error loading niches:', error);
        return;
    }

    const nichesGrid = document.getElementById('nichesGrid');
    if (!niches || niches.length === 0) {
        nichesGrid.innerHTML = '<p>No niches available.</p>';
        return;
    }

    nichesGrid.innerHTML = niches.map(niche => `
        <a href="portfolio/index.html?niche=${encodeURIComponent(niche.website_niche_slug)}" class="niche-card">
            <h3 class="niche-title">${niche.website_niche_name}</h3>
            <p class="niche-description">${niche.website_niche_description || 'Explore our collection of scripts in this category'}</p>
        </a>
    `).join('');
}

// Load and display recent articles
async function loadRecentArticles() {
    const { data: articles, error } = await fetchRecentArticles(3);
    
    if (error) {
        console.error('Error loading recent articles:', error);
        return;
    }

    const articlesGrid = document.getElementById('recentArticles');
    if (!articles || articles.length === 0) {
        articlesGrid.innerHTML = '<p>No recent articles available.</p>';
        return;
    }

    articlesGrid.innerHTML = articles.map(article => `
        <div class="article-card">
            <div class="article-content">
                <h3 class="article-title">${article.website_article_title}</h3>
                <p class="article-excerpt">${truncateText(article.website_article_excerpt || article.website_article_content, 150)}</p>
                <div class="article-date">${formatDate(article.website_article_created_at)}</div>
            </div>
        </div>
    `).join('');
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
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