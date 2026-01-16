# Theme Fix Instructions

The application is configured to use **Light Mode only**, but your browser may have cached the old dark theme preference.

## Quick Fix Steps:

### Option 1: Clear Browser Storage (Recommended)
1. Open your browser DevTools (`F12`)
2. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:3000`
4. Delete the `theme` key if it exists
5. **Hard refresh** the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Option 2: Clear via Console
1. Open DevTools Console (`F12`)
2. Run this command:
   ```javascript
   localStorage.removeItem('theme');
   location.reload();
   ```

### Option 3: Incognito/Private Window
- Open `http://localhost:3000/dashboard` in an incognito/private window
- This will bypass all cached data

## Verification
After clearing, you should see:
- **White background** on all pages
- **Black text** and borders
- **No dark cards** or dark UI elements

If the issue persists after trying all options, please take a screenshot of your browser's DevTools showing the `<html>` element's classes.
