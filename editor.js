// ===========================
// EDITOR STATE
// ===========================
const STORAGE_KEY = 'blog_posts';
let autoSaveTimer = null;

// ===========================
// INITIALIZE
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        alert('Please login as admin first!');
        window.location.href = 'index.html';
        return;
    }

    initializeEditor();
    loadDraft();
});

// ===========================
// EDITOR INITIALIZATION
// ===========================
function initializeEditor() {
    const markdownEditor = document.getElementById('markdownEditor');
    const previewContent = document.getElementById('previewContent');
    const publishBtn = document.getElementById('publishBtn');
    const backToHome = document.getElementById('backToHome');
    const toggleTocPreview = document.getElementById('toggleTocPreview');

    // Live preview
    markdownEditor.addEventListener('input', () => {
        updatePreview();
        autoSave();
    });

    // Publish button
    publishBtn.addEventListener('click', publishPost);

    // Back to home
    backToHome.addEventListener('click', () => {
        if (confirm('Are you sure? Any unsaved changes will be lost.')) {
            clearDraft();
            window.location.href = 'index.html';
        }
    });

    // Toggle TOC preview
    toggleTocPreview.addEventListener('click', () => {
        const tocPreview = document.getElementById('tocPreview');
        const isVisible = tocPreview.style.display !== 'none';
        tocPreview.style.display = isVisible ? 'none' : 'block';
        toggleTocPreview.textContent = isVisible ? 'Show TOC' : 'Hide TOC';
    });

    // Toolbar buttons
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            applyMarkdownFormat(action);
        });
    });

    // Keyboard shortcuts
    markdownEditor.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    applyMarkdownFormat('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    applyMarkdownFormat('italic');
                    break;
                case 's':
                    e.preventDefault();
                    saveDraft();
                    showNotification('Draft saved!');
                    break;
            }
        }
    });

    // Initial preview update
    updatePreview();
}

// ===========================
// MARKDOWN FORMATTING
// ===========================
function applyMarkdownFormat(action) {
    const editor = document.getElementById('markdownEditor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    let replacement = '';

    switch(action) {
        case 'bold':
            replacement = `**${selectedText || 'bold text'}**`;
            break;
        case 'italic':
            replacement = `*${selectedText || 'italic text'}*`;
            break;
        case 'heading':
            replacement = `## ${selectedText || 'Heading'}`;
            break;
        case 'link':
            replacement = `[${selectedText || 'link text'}](url)`;
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                replacement = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
            } else {
                replacement = `\`${selectedText || 'code'}\``;
            }
            break;
    }

    editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
    
    // Set cursor position
    const newPos = start + replacement.length;
    editor.focus();
    editor.setSelectionRange(newPos, newPos);

    updatePreview();
}

// ===========================
// PREVIEW UPDATE
// ===========================
function updatePreview() {
    const markdown = document.getElementById('markdownEditor').value;
    const previewContent = document.getElementById('previewContent');

    if (markdown.trim() === '') {
        previewContent.innerHTML = '<p class="empty-preview">Your preview will appear here...</p>';
        document.getElementById('tocPreviewContent').innerHTML = '';
        return;
    }

    // Parse and render markdown
    const html = marked.parse(markdown);
    previewContent.innerHTML = html;

    // Update TOC preview
    updateTOCPreview(previewContent);
}

function updateTOCPreview(contentElement) {
    const headings = contentElement.querySelectorAll('h1, h2, h3');
    const tocPreviewContent = document.getElementById('tocPreviewContent');

    if (headings.length === 0) {
        tocPreviewContent.innerHTML = '<p style="color: #999;">No headings found</p>';
        return;
    }

    const tocItems = Array.from(headings).map((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const indent = (level - 1) * 16;
        return `<div style="padding-left: ${indent}px; margin-bottom: 8px; font-size: ${16 - level}px;">
            ${level === 1 ? '📌' : level === 2 ? '▸' : '·'} ${heading.textContent}
        </div>`;
    });

    tocPreviewContent.innerHTML = tocItems.join('');
}

// ===========================
// PUBLISH POST
// ===========================
function publishPost() {
    const title = document.getElementById('postTitleInput').value.trim();
    const author = document.getElementById('postAuthorInput').value.trim() || 'Anonymous';
    const content = document.getElementById('markdownEditor').value.trim();

    if (!title) {
        alert('Please enter a title for your post!');
        return;
    }

    if (!content) {
        alert('Please write some content for your post!');
        return;
    }

    const post = {
        id: generateId(),
        title: title,
        author: author,
        content: content,
        date: new Date().toISOString()
    };

    // Save to localStorage
    const posts = getPosts();
    posts.unshift(post); // Add to beginning
    savePosts(posts);

    // Clear draft
    clearDraft();

    // Show success message
    showNotification('Post published successfully! 🎉');

    // Redirect to view the post
    setTimeout(() => {
        window.location.href = `index.html?post=${post.id}`;
    }, 1000);
}

// ===========================
// AUTO-SAVE DRAFT
// ===========================
function autoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveDraft();
    }, 2000); // Auto-save after 2 seconds of inactivity
}

function saveDraft() {
    const draft = {
        title: document.getElementById('postTitleInput').value,
        author: document.getElementById('postAuthorInput').value,
        content: document.getElementById('markdownEditor').value
    };
    localStorage.setItem('blog_draft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem('blog_draft');
    if (draft) {
        const { title, author, content } = JSON.parse(draft);
        document.getElementById('postTitleInput').value = title || '';
        document.getElementById('postAuthorInput').value = author || '';
        document.getElementById('markdownEditor').value = content || '';
        updatePreview();
    }
}

function clearDraft() {
    localStorage.removeItem('blog_draft');
}

// ===========================
// STORAGE HELPERS
// ===========================
function getPosts() {
    const posts = localStorage.getItem(STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===========================
// NOTIFICATIONS
// ===========================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
