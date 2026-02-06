# 🎨 Quick Start: Adding Images (5 Minutes)

## Step 1: Add Your Image File

Drag your image into the `src/assets` folder:

```
src/assets/
  ├── my-awesome-photo.jpg    ← Your new image!
  ├── logo.png
  └── ...other images
```

## Step 2: Open Your Page File

For example, edit `src/pages/HomePage.tsx` or any page where you want the image.

## Step 3: Add These Two Lines

```tsx
// At the top, with other imports
import myImage from '../assets/my-awesome-photo.jpg';

// In your component, where you want to show the image
<img src={myImage} alt="My awesome photo" className="w-64 rounded-lg shadow-lg" />
```

## That's it! 🎉

Your image will now appear on your page.

---

## Common Use Cases

### Show a Logo
```tsx
import logo from '../assets/logo.png';

<img src={logo} alt="Company logo" className="w-16 h-16" />
```

### Hero Background Image
```tsx
import heroBg from '../assets/hero-background.jpg';

<div 
  className="h-screen bg-cover bg-center"
  style={{ backgroundImage: `url(${heroBg})` }}
>
  <h1>Welcome!</h1>
</div>
```

### Profile Picture
```tsx
import profile from '../assets/profile-pic.jpg';

<img 
  src={profile} 
  alt="Profile" 
  className="w-32 h-32 rounded-full border-4 border-white shadow-xl" 
/>
```

### Image Gallery Grid
```tsx
import img1 from '../assets/photo1.jpg';
import img2 from '../assets/photo2.jpg';
import img3 from '../assets/photo3.jpg';

<div className="grid grid-cols-3 gap-4">
  <img src={img1} alt="Photo 1" className="rounded-lg" />
  <img src={img2} alt="Photo 2" className="rounded-lg" />
  <img src={img3} alt="Photo 3" className="rounded-lg" />
</div>
```

---

## Pro Tips 💡

### Make Images Pop
```tsx
<img 
  src={myImage} 
  alt="Amazing"
  className="
    rounded-2xl           ← Rounded corners
    shadow-2xl            ← Big shadow
    hover:scale-105       ← Grows on hover
    transition-transform  ← Smooth animation
  "
/>
```

### Responsive Sizes
```tsx
<img 
  src={myImage} 
  alt="Responsive"
  className="
    w-32 md:w-48 lg:w-64  ← Different sizes for mobile/tablet/desktop
  "
/>
```

### Animate with Framer Motion
```tsx
import { motion } from 'motion/react';
import coolImage from '../assets/cool.png';

<motion.img
  src={coolImage}
  alt="Animated"
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  className="w-64"
/>
```

---

## Before Adding Images: Optimize Them! 📦

1. **Visit [TinyPNG.com](https://tinypng.com/)**
2. **Upload your image**
3. **Download the compressed version**
4. **Use the compressed image in your project**

This makes your site load faster!

---

## Image Sizes Guide

| Type | Size | Format |
|------|------|--------|
| Small Icon | 32x32 - 64x64 | PNG/SVG |
| Logo | 200x200 - 500x500 | PNG/SVG |
| Profile Pic | 200x200 - 400x400 | JPG |
| Card Image | 600x400 | JPG |
| Hero Background | 1920x1080 | JPG |

---

## Need More Help?

📖 Read the full guide: [ADDING_GRAPHICS_AND_PICTURES.md](./ADDING_GRAPHICS_AND_PICTURES.md)

🎯 Look at examples in: `src/pages/PricingPage.tsx` and `src/pages/GameHomePage.tsx`

---

**Now go make your site stunning! 🚀✨**
