# 📝 Personal Blog Platform

A beautiful, feature-rich blog platform with markdown editing, live preview, image support, and advanced filtering capabilities.

## ✨ Features

### 🎨 Design & UI
- **Modern Gradient Theme**: Beautiful purple gradient accents throughout
- **Minimal & Clean**: White background with subtle gradient overlays
- **Smooth Animations**: Elegant hover effects and transitions
- **Fully Responsive**: Perfect experience on desktop and mobile

### ✍️ Editor Features
- **Side-by-Side Editing**: Markdown editor with real-time preview
- **Rich Toolbar**: Quick formatting buttons (Bold, Italic, Heading, Link, Image, Code, Quote, List)
- **Image Upload**: Upload images from device or use URLs
- **Live Statistics**: Real-time word count, character count, and reading time
- **Auto-save**: Drafts automatically saved every 2 seconds
- **Keyboard Shortcuts**: Ctrl/Cmd+B (Bold), Ctrl/Cmd+I (Italic), Ctrl/Cmd+S (Save)

### 📚 Blog Features
- **Table of Contents**: Auto-generated TOC sidebar with smooth scrolling
- **Search**: Real-time search across titles, content, authors, tags, and categories
- **Tag Filtering**: Click popular tags to filter posts
- **Categories**: Organize posts by category
- **Reading Time**: Automatic reading time calculation
- **Tags System**: Add multiple tags to posts
- **Excerpts**: Auto-generated post previews

### 🔒 Admin Features
- **Password Protection**: Secure admin access
- **Easy Publishing**: One-click post publishing
- **Draft Management**: Auto-save and restore drafts

## 🚀 Getting Started

### 1. Open the Blog
Simply open `index.html` in your web browser to view your blog.

### 2. Login as Admin
- Click the "Admin Login" button
- Enter password: `admin123` (you can change this in `script.js`)
- You'll be redirected to the editor

### 3. Write a Blog Post
- Enter your title, author name, tags, and category
- Write your content in markdown on the left pane
- See the live preview on the right pane
- Upload images using the 📤 Upload Image button
- Watch the word count and reading time update in real-time
- Click "Publish Post" when ready

### 4. View Your Blog
- The post will appear on the main page
- Use the search bar to find specific posts
- Click popular tags to filter posts
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
- **Images**: `![alt text](image-url)` or use the upload button

## 🖼️ Adding Images

### Method 1: Upload from Device
1. Click the "📤 Upload Image" button
2. Click "Choose File" and select an image
3. Add alt text (optional)
4. Click "Insert Image"

### Method 2: Use Image URL
1. Click the "📤 Upload Image" button
2. Paste the image URL
3. Add alt text (optional)
4. Click "Insert Image"

**Note**: Uploaded images are converted to Base64 and stored locally

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
    --primary-color: #1a202c;
    --secondary-color: #667eea;
    --accent-color: #f56565;
    --success-color: #48bb78;
    /* ... other colors */
}
```

### Customize Gradient
Change the gradient in `styles.css`:
```css
--bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
5. **Search**: Use the search bar to quickly find posts by title, content, author, tags, or category
6. **Tags**: Click any tag to filter posts by that tag
7. **Images**: Uploaded images are stored as Base64 in localStorage (be mindful of size limits)
8. **Reading Time**: Automatically calculated based on 200 words per minute
9. **Categories**: Organize your posts with categories for better structure
10. **Gradient Theme**: Beautiful purple gradient accents make your blog stand out

## 📱 Mobile Friendly

The blog is fully responsive and works great on mobile devices. The TOC sidebar transforms into a slide-out menu on smaller screens.

## 🔧 Technical Details

- **No Backend Required**: Everything runs in the browser
- **Storage**: Uses localStorage for data persistence
- **Markdown Parser**: Uses [marked.js](https://marked.js.org/) for parsing
- **Pure HTML/CSS/JS**: No frameworks or build tools needed

## 🎉 Happy Coding!

Start writing your amazing blog posts and share your thoughts with the world!
