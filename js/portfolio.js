// Portfolio page JavaScript functionality
import { fetchNiches, fetchScriptsByNiche } from '../shared/js/website-api.js';

let currentNiche = null;
let allScripts = [];
let allNiches = [];

// Initialize portfolio page
document.addEventListener('DOMContentLoaded', async function() {
    // Get niche from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const nicheSlug = urlParams.get('niche');
    
    await loadNiches();
    await loadScripts(nicheSlug);
    setupModal();
    setupFilters();
});

// Load and display niches for filters
async function loadNiches() {
    const { data: niches, error } = await fetchNiches();
    
    if (error) {
        console.error('Error loading niches:', error);
        return;
    }

    allNiches = niches || [];
    const nicheFilters = document.getElementById('nicheFilters');
    
    if (allNiches.length > 0) {
        nicheFilters.innerHTML = allNiches.map(niche => `
            <button class="filter-btn" data-niche="${niche.website_niche_slug}">
                ${niche.website_niche_name}
            </button>
        `).join('');
    }
}

// Load and display scripts
async function loadScripts(nicheSlug = null) {
    const scriptsGrid = document.getElementById('scriptsGrid');
    scriptsGrid.innerHTML = '<div class="loading">Loading scripts...</div>';

    // Find niche ID if slug provided
    let nicheId = null;
    if (nicheSlug && allNiches.length > 0) {
        const niche = allNiches.find(n => n.website_niche_slug === nicheSlug);
        nicheId = niche ? niche.website_niche_id : null;
        currentNiche = nicheSlug;
    }

    const { data: scripts, error } = await fetchScriptsByNiche(nicheId);
    
    if (error) {
        console.error('Error loading scripts:', error);
        scriptsGrid.innerHTML = '<div class="no-scripts">Error loading scripts. Please try again later.</div>';
        return;
    }

    allScripts = scripts || [];
    displayScripts(allScripts);
    
    // Update active filter
    updateActiveFilter(currentNiche || 'all');
}

// Display scripts in grid
function displayScripts(scripts) {
    const scriptsGrid = document.getElementById('scriptsGrid');
    
    if (!scripts || scripts.length === 0) {
        scriptsGrid.innerHTML = '<div class="no-scripts">No scripts found for this category.</div>';
        return;
    }

    scriptsGrid.innerHTML = scripts.map(script => `
        <div class="script-card">
            ${script.website_script_thumbnail_url ? 
                `<img src="${script.website_script_thumbnail_url}" alt="${script.website_script_title}" class="script-thumbnail">` :
                '<div class="script-thumbnail" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666;">No Thumbnail</div>'
            }
            <div class="script-content">
                <h3 class="script-title">${script.website_script_title}</h3>
                ${script.website_script_subtitle ? 
                    `<p class="script-subtitle">${script.website_script_subtitle}</p>` : 
                    ''
                }
                <div class="script-meta">
                    <span class="script-niche">${script.website_niches?.website_niche_name || 'Uncategorized'}</span>
                </div>
                ${script.website_script_description ? 
                    `<p class="script-description">${truncateText(script.website_script_description, 120)}</p>` : 
                    ''
                }
                <button class="view-pdf-btn" 
                        data-pdf="${script.website_script_pdf_url}" 
                        data-title="${script.website_script_title}"
                        ${!script.website_script_pdf_url ? 'disabled' : ''}>
                    ${script.website_script_pdf_url ? 'View Script' : 'PDF Not Available'}
                </button>
            </div>
        </div>
    `).join('');

    // Reattach event listeners for PDF buttons
    setupPDFButtons();
}

// Setup filter functionality
function setupFilters() {
    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const nicheSlug = e.target.dataset.niche;
            
            if (nicheSlug === 'all') {
                currentNiche = null;
                await loadScripts();
            } else {
                currentNiche = nicheSlug;
                await loadScripts(nicheSlug);
            }
            
            // Update URL
            const url = new URL(window.location);
            if (nicheSlug === 'all') {
                url.searchParams.delete('niche');
            } else {
                url.searchParams.set('niche', nicheSlug);
            }
            window.history.pushState({}, '', url);
        }
    });
}

// Update active filter button
function updateActiveFilter(activeNiche) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((activeNiche === 'all' && btn.dataset.niche === 'all') ||
            (activeNiche !== 'all' && btn.dataset.niche === activeNiche)) {
            btn.classList.add('active');
        }
    });
}

// Setup PDF modal functionality
function setupModal() {
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.getElementById('pdfViewer').src = '';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('pdfViewer').src = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.getElementById('pdfViewer').src = '';
        }
    });
}

// Setup PDF button functionality
function setupPDFButtons() {
    document.querySelectorAll('.view-pdf-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const pdfUrl = e.target.dataset.pdf;
            const title = e.target.dataset.title;
            
            if (!pdfUrl) return;

            document.getElementById('modalTitle').textContent = title;
            document.getElementById('pdfViewer').src = pdfUrl;
            document.getElementById('pdfModal').style.display = 'block';
        });
    });
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}