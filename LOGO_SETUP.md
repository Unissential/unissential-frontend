# How to Add Your Unissential Logo

The Logo component has been updated to support image-based logos! Follow these steps:

## Step 1: Save Your Logo Image
Save your Unissential logo image as **`logo.png`** in the **`public/`** folder.

Folder structure should look like:
```
Unissential/
├── public/
│   └── logo.png          ← Place your logo here
├── src/
├── package.json
└── ...
```

## Step 2: The Logo Component is Ready
Your Logo component at `src/components/ui/Logo.tsx` is now configured to:

- ✅ Automatically load the logo from `/logo.png`
- ✅ Support responsive sizing (sm, md, lg)
- ✅ Display your full "Unissential" logo with "U" text and the brown/blue colors
- ✅ Maintain all navbar functionality (hover effects, responsiveness, mobile menu)

## Step 3: Logo Size Options
The Logo component supports three sizes:

```typescript
<Logo size="sm" />   // Small: 32×32 (mobile)
<Logo size="md" />   // Medium: 120×40 (default navbar)
<Logo size="lg" />   // Large: 180×60 (hero section, etc.)
```

## Step 4: Custom Logo Path
If your logo is at a different path, customize it:

```typescript
<Logo size="md" src="/path/to/custom-logo.png" alt="My Logo" />
```

## Step 5: Logo Requirements
For best results, your logo image should:
- **Format**: PNG with transparent background
- **Aspect Ratio**: Maintain a 3:1 width-to-height ratio (e.g., 240×80px for size="lg")
- **Quality**: High resolution (300+ DPI for printing, 2x resolution for web)

## Next Steps
1. **Save your logo** to the `public/` folder
2. **Start the dev server**: `npm run dev`
3. **View it live** at http://localhost:3000
4. **The navbar will automatically display your logo!**

## Navbar Features (All Working!)
✅ Sticky navigation at top
✅ Logo with hover effects
✅ Navigation links (Lease, Roommates, Marketplace)
✅ Login/Sign Up buttons
✅ Mobile responsive menu
✅ Smooth animations with Framer Motion

---

**Ready to go!** Your logo component is production-ready and waiting for your image.
