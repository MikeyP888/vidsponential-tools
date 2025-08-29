# Vidsponential Design System Components

This document describes the reusable components extracted from the script editor pages to create a consistent design system.

## Overview

The design system includes 6 main components that maintain consistent styling, spacing, colors, and functionality across all script editor pages:

1. **Vidsponential Logo** - Consistent logo sizing and positioning
2. **Tab Navigation** - Navigation buttons with notification badges
3. **Single-Line Text Fields** - For titles, headlines, keywords
4. **Multi-Line Text Fields** - For outlines and descriptions with auto-resize
5. **Rating Input Fields** - Centered numeric input (1-100)
6. **Gradient Buttons** - Chapter number buttons with gradient styling

## Files Created

- `shared/styles/components.css` - All component styles
- `shared/js/components.js` - Component creation and management functions
- `components-example.html` - Live examples of all components
- `COMPONENT-DOCUMENTATION.md` - This documentation file

## Usage

### 1. Include the Component Files

```html
<!-- Include component styles after your base styles -->
<link rel="stylesheet" href="shared/styles/components.css">

<!-- Include component JavaScript -->
<script src="shared/js/components.js"></script>
```

### 2. Use the ComponentLibrary Class

All components are created using the `ComponentLibrary` class:

```javascript
// Access the global ComponentLibrary
const { ComponentLibrary } = window;

// Or if using modules
import ComponentLibrary from './shared/js/components.js';
```

## Component Reference

### 1. Vidsponential Logo

**Purpose**: Consistent logo display across all pages
**Size**: 40.5px height, auto width

```javascript
const logo = ComponentLibrary.createLogo(
    "../shared/assets/vidsponential logo.png", // src (optional)
    "Vidsponential Logo" // alt text (optional)
);
document.getElementById('logo-container').appendChild(logo);
```

**HTML Output**:
```html
<img src="../shared/assets/vidsponential logo.png" 
     alt="Vidsponential Logo" 
     class="vidsponential-logo">
```

### 2. Tab Navigation

**Purpose**: Navigation between editing pages with notification badges
**Features**: Active/inactive states, notification badges, hover effects

```javascript
const tabs = [
    { 
        label: 'Outlines', 
        href: 'script_outline_editor.html', 
        active: true, 
        status: '15', 
        badgeId: 'outlinesBadge', 
        badgeCount: 3 
    },
    { 
        label: 'Chapters', 
        href: 'script_chapter_editor.html', 
        active: false, 
        status: '40', 
        badgeId: 'chaptersBadge', 
        badgeCount: 0 
    }
];

const navigation = ComponentLibrary.createTabNavigation(tabs);
```

**Configuration Options**:
- `label`: Display text
- `href`: Link destination
- `active`: Boolean for primary/secondary styling
- `status`: Data attribute for status tracking
- `badgeId`: ID for the notification badge
- `badgeCount`: Number to display (0 = hidden)

### 3. Single-Line Text Field

**Purpose**: Chapter titles, headlines, keywords
**Features**: Auto-resize, validation states, consistent height (59px)

```javascript
const textField = ComponentLibrary.createSingleLineTextField({
    label: 'Chapter Title:',
    placeholder: 'Enter chapter title...',
    value: 'Introduction to Video Marketing',
    id: 'chapterTitle',
    dataAttributes: {
        'chapter-id': '123',
        'field-type': 'title'
    }
});

// Access elements
textField.container // The wrapper div
textField.input     // The input element
textField.label     // The label element
```

### 4. Multi-Line Text Field

**Purpose**: Chapter outlines, descriptions
**Features**: Auto-resize functionality, minimum height (180px container, 150px input)

```javascript
const outlineField = ComponentLibrary.createMultiLineTextField({
    label: 'Chapter Outline:',
    placeholder: 'Enter detailed chapter outline...',
    value: 'This chapter covers...',
    id: 'chapterOutline',
    dataAttributes: {
        'chapter-id': '123'
    }
});
```

### 5. Rating Input Field

**Purpose**: Numeric ratings (1-100)
**Features**: Centered text, perfect alignment, spinner removal

```javascript
const ratingField = ComponentLibrary.createRatingField({
    label: 'Rating / 100:',
    value: '85',
    id: 'contentRating',
    min: 1,
    max: 100,
    dataAttributes: {
        'field': 'content_rating'
    }
});
```

### 6. Gradient Button

**Purpose**: Chapter number buttons, call-to-action buttons
**Features**: Gradient background, hover effects, consistent sizing

```javascript
const chapterButton = ComponentLibrary.createGradientButton({
    text: 'CHAPTER 1',
    onClick: () => console.log('Chapter 1 clicked'),
    id: 'chapter1Btn',
    dataAttributes: {
        'chapter-number': '1'
    }
});
```

## Layout Components

### Form Row Layout

Combines text field and rating field in horizontal layout:

```javascript
const formRow = ComponentLibrary.createFormRow({
    textField: titleField,
    ratingField: ratingField
});

// Access elements
formRow.container   // The row wrapper
formRow.textField   // The text field object
formRow.ratingField // The rating field object
```

### Section Container

Creates consistent section background and spacing:

```javascript
const section = ComponentLibrary.createSectionContainer([
    chapterButton,
    formRow.container,
    // Can mix strings, HTML elements, or arrays
]);
```

## Utility Functions

### Auto-Resize

Automatically applied to multi-line fields, can be manually applied:

```javascript
ComponentLibrary.setupAutoResize(textareaElement);
```

### Notification Badge Management

```javascript
// Update badge count
ComponentLibrary.updateNotificationBadge('badgeId', 5);

// Hide badge (count = 0)
ComponentLibrary.updateNotificationBadge('badgeId', 0);
```

### Field State Management

```javascript
// Mark field as having unsaved changes
ComponentLibrary.markFieldUnsaved(inputElement);

// Mark field as saved
ComponentLibrary.markFieldSaved(inputElement);
```

### Validation

```javascript
// Show validation error
ComponentLibrary.showValidationError(inputElement, 'This field is required');

// Clear validation error
ComponentLibrary.clearValidationError(inputElement);
```

## Complete Chapter Example

Here's how to create a complete chapter section using the components:

```javascript
// Create chapter button
const chapterButton = ComponentLibrary.createGradientButton({
    text: 'CHAPTER 1',
    id: 'chapter1Btn'
});

// Create title row
const titleRow = ComponentLibrary.createFormRow({
    textField: ComponentLibrary.createSingleLineTextField({
        label: 'Chapter Title:',
        placeholder: 'Enter chapter title...',
        dataAttributes: { 'chapter-id': '1' }
    }),
    ratingField: ComponentLibrary.createRatingField({
        label: 'Rating / 100:',
        dataAttributes: { 'field': 'title_rating' }
    })
});

// Create outline row
const outlineRow = ComponentLibrary.createFormRow({
    textField: ComponentLibrary.createMultiLineTextField({
        label: 'Chapter Outline:',
        placeholder: 'Enter chapter outline...',
        dataAttributes: { 'chapter-id': '1' }
    }),
    ratingField: ComponentLibrary.createRatingField({
        label: 'Rating / 100:',
        dataAttributes: { 'field': 'outline_rating' }
    })
});

// Wrap in section container
const chapterSection = ComponentLibrary.createSectionContainer([
    chapterButton,
    titleRow.container,
    outlineRow.container
]);

// Add to page
document.getElementById('chaptersContainer').appendChild(chapterSection);
```

## Styling Details

### Colors
- **Primary Gradient**: `linear-gradient(to right, rgba(11, 230, 255, 1) 0%, rgba(175, 11, 255, 1) 100%)`
- **Secondary Background**: `#d5dbdb`
- **Text Color**: `#2c3e50`
- **Border Color**: `#5b5a5a`
- **Error Color**: `#e74c3c`
- **Success Color**: `#27ae60`

### Typography
- **Primary Font**: "Inter", sans-serif
- **Secondary Font**: "Tahoma", sans-serif
- **Label Font Size**: 11px
- **Input Font Size**: 19px
- **Button Font Size**: 19px

### Spacing
- **Container Padding**: 10px 20px
- **Input Padding**: 15px
- **Form Gap**: 10px
- **Section Margin**: 20px bottom

## Browser Compatibility

The components work in all modern browsers and include:
- CSS Grid and Flexbox layouts
- CSS Custom Properties fallbacks
- Webkit/Mozilla specific styles for inputs
- Responsive design breakpoints

## Migration from Existing Pages

To migrate existing script editor pages:

1. Include the component CSS and JS files
2. Replace existing HTML structures with component function calls
3. Update event listeners to work with the new component structure
4. Test auto-resize and validation functionality

The components maintain the exact same visual appearance and behavior as the original implementations.