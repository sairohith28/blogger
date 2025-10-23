# 📝 Personal Blog Platform

A beautiful, minimal blog platform with markdown editing, live preview, and table of contents navigation.

## ✨ Features

- **Markdown Editor**: Write your blogs in markdown with a side-by-side live preview
- **Table of Contents**: Automatic TOC generation with smooth scrolling (like in the image you provided)
- **Admin System**: Password-protected admin access for publishing posts
- **Clean UI**: Minimal white background with attractive, readable design
- **Responsive**: Works great on desktop and mobile devices
- **Auto-save**: Drafts are automatically saved while you write
- **Local Storage**: All posts are stored in browser's localStorage

## 🚀 Getting Started

### 1. Open the Blog
Simply open `index.html` in your web browser to view your blog.

### 2. Login as Admin
- Click the "Admin Login" button
- Enter password: `admin123` (you can change this in `script.js`)
- You'll be redirected to the editor

### 3. Write a Blog Post
- Enter your title and author name
- Write your content in markdown on the left pane
- See the live preview on the right pane
- Click "Publish Post" when ready

### 4. View Your Blog
- The post will appear on the main page
- Click the sidebar toggle (☰) on the left to see the table of contents
- Click any heading to jump to that section

## 📖 Markdown Features Supported

- **Headings**: `# H1`, `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Links**: `[link text](url)`
- **Lists**: Use `-` or `1.` for lists
- **Code**: `` `inline code` `` or triple backticks for code blocks
- **Blockquotes**: `> quote text`
- **Images**: `![alt text](image-url)`

## 🎨 Customization

### Change Admin Password
Edit `script.js` line 4:
```javascript
const ADMIN_PASSWORD = 'your-password-here';
```

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* ... other colors */
}
```

## 📁 File Structure

```
blogger/
├── index.html          # Main blog viewing page
├── editor.html         # Admin editor page
├── styles.css          # All styles
├── script.js           # Blog functionality
├── editor.js           # Editor functionality
└── README.md          # This file
```

## 🎯 Keyboard Shortcuts (in Editor)

- `Ctrl/Cmd + B`: Bold
- `Ctrl/Cmd + I`: Italic
- `Ctrl/Cmd + S`: Save draft

## 🌟 Tips

1. **TOC Only Shows When Viewing a Post**: The table of contents sidebar appears when you're reading a blog post
2. **Auto-save**: Your drafts are saved automatically every 2 seconds
3. **Smooth Scrolling**: Click any TOC item to smoothly scroll to that section
4. **Active Highlighting**: The current section is highlighted in the TOC as you scroll

## 📱 Mobile Friendly

The blog is fully responsive and works great on mobile devices. The TOC sidebar transforms into a slide-out menu on smaller screens.

## 🔧 Technical Details

- **No Backend Required**: Everything runs in the browser
- **Storage**: Uses localStorage for data persistence
- **Markdown Parser**: Uses [marked.js](https://marked.js.org/) for parsing
- **Pure HTML/CSS/JS**: No frameworks or build tools needed

## 🎉 Happy Coding!

Start writing your amazing blog posts and share your thoughts with the world!
