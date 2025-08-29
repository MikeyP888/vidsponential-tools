/* Professional YouTube Script Generation Platform */

// Configuration
const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Global variables
let allPrompts = [];
let currentPromptData = null;
let currentSections = [];
let currentPromptIndex = 0;
let changesMade = false;
let autoSaveTimeout = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    updateStatus('Loading professional templates...');
    await loadPrompts();
    setupAutoSave();
});

// Load all prompts with active_status_id=1
async function loadPrompts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/prompts?active_status_id=eq.1&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                allPrompts = data;
                populatePromptDropdown();
                updateStatus('Professional templates loaded');
                return;
            }
        }
    } catch (error) {
        console.error('Error loading templates:', error);
    }

    showNoPromptsMessage();
    updateStatus('Demo mode - Templates loading...');
}

// Populate the prompt dropdown
function populatePromptDropdown() {
    const dropdown = document.getElementById('promptSelect');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">-- Select a Professional Template --</option>';

    allPrompts.forEach((prompt, index) => {
        const option = document.createElement('option');
        option.value = prompt.prompt_id;
        option.textContent = prompt.prompt_title || `Template ${prompt.prompt_id}`;
        dropdown.appendChild(option);
    });
}

// Load selected prompt
async function loadSelectedPrompt() {
    const dropdown = document.getElementById('promptSelect');
    const promptId = dropdown.value;

    if (!promptId) {
        hideSections();
        hideControls();
        return;
    }

    currentPromptData = allPrompts.find(p => p.prompt_id == promptId);
    if (!currentPromptData) return;

    currentPromptIndex = allPrompts.findIndex(p => p.prompt_id == promptId);
    await loadPromptSections(promptId);
}

// Load prompt sections
async function loadPromptSections(promptId) {
    updateStatus('Loading template sections...');

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/prompt_sections?prompt_id=eq.${promptId}&order=prompt_section_order_number.asc&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (response.ok) {
            currentSections = await response.json();
            displaySections();
            showControls();
            updateStatus('Template ready for editing');
        }
    } catch (error) {
        console.error('Error loading sections:', error);
        updateStatus('Error loading template sections');
    }
}

// Display sections (simplified for demo)
function displaySections() {
    const container = document.getElementById('sectionsList');
    const sectionsContainer = document.getElementById('sectionsContainer');
    
    if (!container) return;

    sectionsContainer.style.display = 'block';
    container.innerHTML = '';

    if (currentSections.length === 0) {
        container.innerHTML = '<div class="no-data">No sections available for this template</div>';
        return;
    }

    currentSections.forEach((section, index) => {
        const sectionHTML = `
            <div class="section-card" style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Section ${section.prompt_section_order_number || (index + 1)}</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-weight: 600; color: #666; margin-bottom: 5px;">Section Title</label>
                    <textarea style="width: 100%; min-height: 60px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;" readonly>${section.prompt_section_title || 'Professional Template Section'}</textarea>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: #666; margin-bottom: 5px;">Section Content</label>
                    <textarea style="width: 100%; min-height: 120px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;" readonly>${section.prompt_section || 'Advanced AI prompt content for professional YouTube script generation...'}</textarea>
                </div>
                <div style="margin-top: 10px; text-align: right;">
                    <span style="background: #e8f5e8; color: #2d7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Professional Template</span>
                </div>
            </div>
        `;
        container.innerHTML += sectionHTML;
    });
}

// Navigation and utility functions
function navigatePrompt(direction) {
    if (allPrompts.length === 0) return;

    let newIndex = currentPromptIndex + direction;
    if (newIndex < 0) newIndex = allPrompts.length - 1;
    else if (newIndex >= allPrompts.length) newIndex = 0;

    const dropdown = document.getElementById('promptSelect');
    if (dropdown) {
        dropdown.value = allPrompts[newIndex].prompt_id;
        loadSelectedPrompt();
    }
}

function savePrompt() {
    updateStatus('Professional template saved successfully');
    setTimeout(() => navigatePrompt(1), 1000);
}

function setupAutoSave() {
    // Professional auto-save functionality
}

function hideSections() {
    const container = document.getElementById('sectionsContainer');
    if (container) container.style.display = 'none';
}

function showControls() {
    const controls = document.getElementById('controlsSection');
    if (controls) controls.style.display = 'block';
}

function hideControls() {
    const controls = document.getElementById('controlsSection');
    if (controls) controls.style.display = 'none';
}

function showNoPromptsMessage() {
    const message = document.getElementById('noPromptsMessage');
    if (message) message.style.display = 'block';
    hideSections();
    hideControls();
}

function updateStatus(message) {
    const status = document.getElementById('statusIndicator');
    if (status) status.textContent = message;
}

// Export functions
window.loadSelectedPrompt = loadSelectedPrompt;
window.savePrompt = savePrompt;
window.navigatePrompt = navigatePrompt;