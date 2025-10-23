// ===========================
// STORAGE & STATE MANAGEMENT
// ===========================
const STORAGE_KEY = 'blog_posts';
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

let currentView = 'list'; // 'list' or 'single'
let currentPostId = null;
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';
let allPosts = [];
let filteredPosts = [];
let activeFilter = null;

// ===========================
// INITIALIZE
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadBlogPosts();
    
    // Check if redirected from editor with a new post
    const urlParams = new URLSearchParams(window.location.search);
    const newPostId = urlParams.get('post');
    if (newPostId) {
        viewPost(newPostId);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// ===========================
// EVENT LISTENERS
// ===========================
function initializeEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    const tocSidebar = document.getElementById('tocSidebar');

    sidebarToggle.addEventListener('click', () => {
        tocSidebar.classList.add('active');
        overlay.classList.add('active');
    });

    closeSidebar.addEventListener('click', () => {
        tocSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        tocSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Admin login
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('loginForm');

    adminBtn.addEventListener('click', () => {
        if (isAdmin) {
            window.location.href = 'editor.html';
        } else {
            adminModal.classList.add('active');
        }
    });

    closeModal.addEventListener('click', () => {
        adminModal.classList.remove('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        if (password === ADMIN_PASSWORD) {
            isAdmin = true;
            sessionStorage.setItem('isAdmin', 'true');
            window.location.href = 'editor.html';
        } else {
            alert('Incorrect password!');
        }
    });

    // Back button
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => {
        showBlogList();
    });

    // Update admin button text
    if (isAdmin) {
        adminBtn.textContent = 'Write New Post';
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }
}

// ===========================
// BLOG POSTS MANAGEMENT
// ===========================
function loadBlogPosts() {
    allPosts = getPosts();
    filteredPosts = allPosts;
    displayPosts(filteredPosts);
    displayPopularTags();
}

function displayPosts(posts) {
    const blogList = document.getElementById('blogList');

    if (posts.length === 0) {
        blogList.innerHTML = `
            <div class="empty-state">
                <h3>${allPosts.length === 0 ? 'No posts yet' : 'No posts found'}</h3>
                <p>${allPosts.length === 0 ? 'Be the first to write something amazing!' : 'Try a different search or filter'}</p>
            </div>
        `;
        return;
    }

    blogList.innerHTML = posts.map(post => `
        <div class="blog-card" onclick="viewPost('${post.id}')">
            ${post.category ? `<span class="category-badge">${escapeHtml(post.category)}</span>` : ''}
            <h2>${escapeHtml(post.title)}</h2>
            <p class="excerpt">${getExcerpt(post.content)}</p>
            <div class="meta">
                <span>By ${escapeHtml(post.author)}</span>
                <span>${formatDate(post.date)}</span>
            </div>
            ${post.readTime ? `<div class="post-stats"><span>📖 ${post.readTime} min read</span></div>` : ''}
            ${post.tags && post.tags.length > 0 ? `
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ===========================
// SEARCH AND FILTER
// ===========================
function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredPosts = activeFilter 
            ? allPosts.filter(post => post.tags && post.tags.includes(activeFilter))
            : allPosts;
    } else {
        const postsToSearch = activeFilter
            ? allPosts.filter(post => post.tags && post.tags.includes(activeFilter))
            : allPosts;
            
        filteredPosts = postsToSearch.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
            (post.category && post.category.toLowerCase().includes(searchTerm))
        );
    }
    
    displayPosts(filteredPosts);
}

function displayPopularTags() {
    const filterTagsContainer = document.getElementById('filterTags');
    if (!filterTagsContainer) return;

    // Collect all tags
    const tagCount = {};
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        }
    });

    // Sort by count and get top tags
    const topTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);

    if (topTags.length === 0) {
        filterTagsContainer.innerHTML = '';
        return;
    }

    filterTagsContainer.innerHTML = topTags.map(tag => 
        `<button class="filter-tag" onclick="filterByTag('${escapeHtml(tag)}')">${escapeHtml(tag)}</button>`
    ).join('');
}

function filterByTag(tag) {
    const searchInput = document.getElementById('searchInput');
    
    if (activeFilter === tag) {
        // Remove filter
        activeFilter = null;
        filteredPosts = allPosts;
        document.querySelectorAll('.filter-tag').forEach(btn => btn.classList.remove('active'));
    } else {
        // Apply filter
        activeFilter = tag;
        filteredPosts = allPosts.filter(post => post.tags && post.tags.includes(tag));
        document.querySelectorAll('.filter-tag').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === tag);
        });
    }
    
    // Clear search
    if (searchInput) searchInput.value = '';
    
    displayPosts(filteredPosts);
}

function viewPost(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
        alert('Post not found!');
        return;
    }

    currentPostId = postId;
    currentView = 'single';

    // Hide blog list, show post
    document.getElementById('blogList').style.display = 'none';
    document.querySelector('.blog-header').style.display = 'none';
    
    const blogPost = document.getElementById('blogPost');
    blogPost.style.display = 'block';

    // Set post content
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postAuthor').textContent = `By ${post.author}`;
    document.getElementById('postDate').textContent = formatDate(post.date);
    
    // Add category and reading time to meta
    const postMeta = document.querySelector('.post-meta');
    postMeta.innerHTML = `
        <span class="post-author">By ${escapeHtml(post.author)}</span>
        <span class="post-date">${formatDate(post.date)}</span>
        ${post.category ? `<span class="category-badge">${escapeHtml(post.category)}</span>` : ''}
    `;
    
    // Add reading time and tags after title
    const postHeader = document.querySelector('.post-header');
    if (post.readTime) {
        const readingTime = document.createElement('p');
        readingTime.className = 'post-reading-time';
        readingTime.innerHTML = `📖 ${post.readTime} minute read`;
        postHeader.appendChild(readingTime);
    }
    
    if (post.tags && post.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'post-tags';
        tagsContainer.innerHTML = post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
        postHeader.appendChild(tagsContainer);
    }
    
    const postContent = document.getElementById('postContent');
    postContent.innerHTML = marked.parse(post.content);

    // Generate table of contents
    generateTableOfContents(postContent);

    // Scroll to top
    window.scrollTo(0, 0);
}

function showBlogList() {
    currentView = 'list';
    currentPostId = null;

    document.getElementById('blogPost').style.display = 'none';
    document.getElementById('blogList').style.display = 'grid';
    document.querySelector('.blog-header').style.display = 'block';

    // Clear TOC and dynamic elements
    document.getElementById('tocNav').innerHTML = '';
    
    // Remove dynamic elements from post header
    const postHeader = document.querySelector('.post-header');
    const readingTime = postHeader.querySelector('.post-reading-time');
    const postTags = postHeader.querySelector('.post-tags');
    if (readingTime) readingTime.remove();
    if (postTags) postTags.remove();

    window.scrollTo(0, 0);
}

// ===========================
// TABLE OF CONTENTS
// ===========================
function generateTableOfContents(contentElement) {
    const headings = contentElement.querySelectorAll('h1, h2, h3');
    const tocNav = document.getElementById('tocNav');
    tocNav.innerHTML = '';

    if (headings.length === 0) return;

    headings.forEach((heading, index) => {
        // Add ID to heading for smooth scroll
        const id = `heading-${index}`;
        heading.id = id;

        // Create TOC link
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.dataset.level = heading.tagName.charAt(1); // '1', '2', or '3'
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update active state
            tocNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('tocSidebar').classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });

        tocNav.appendChild(link);
    });

    // Intersection Observer for active state
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                const activeLink = tocNav.querySelector(`a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-80px 0px -80% 0px' });

    headings.forEach(heading => observer.observe(heading));
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

// ===========================
// UTILITY FUNCTIONS
// ===========================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getExcerpt(markdown, length = 150) {
    // Remove markdown syntax for excerpt
    const text = markdown.replace(/[#*`\[\]()]/g, '').trim();
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ===========================
// EXPOSE FUNCTIONS GLOBALLY
// ===========================
window.viewPost = viewPost;
window.filterByTag = filterByTag;
