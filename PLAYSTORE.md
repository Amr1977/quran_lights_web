# Google Play Store Submission Guide

## Prerequisites Checklist

- [ ] Google Play Developer Account ($25 one-time)
- [ ] Release APK (`output/app-release.apk`)
- [ ] App icon (512x512 PNG)
- [ ] Privacy policy URL (required)
- [ ] Screenshots (see requirements below)
- [ ] Feature graphic (optional but recommended)

---

## Step 1: Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create account"
3. Pay $25 registration fee
4. Complete your developer profile
   - Developer name (will be visible to users)
   - Email, phone, website

---

## Step 2: Create New App

1. In Play Console, click **"Create app"**
2. Fill in:

| Field | Example |
|-------|---------|
| App name | Quran Lights |
| Default language | English (en) |
| App type | App |
| Free or Paid | Free |

3. Click **"Create app"**

---

## Step 3: Store Listing

### Basic Info

| Field | Max Chars | Your Content |
|-------|----------|--------------|
| Title | 50 | Quran Lights - Track Recitation |
| Short description | 80 | Track your Quran recitation progress and memorization |
| Full description | 4000 | (Write detailed description) |

### Full Description Template

```
Quran Lights - Your Personal Quran Recitation Tracker

Features:
• Track daily recitation pages and verses
• Set and achieve memorization goals
• Visual progress charts and statistics
• Works fully offline
• Beautiful dark theme

How it works:
1. Log your daily recitation
2. Set your targets
3. Track your progress over time

Whether you're memorizing new surahs or reviewing what you've learned, Quran Lights helps you stay consistent on your spiritual journey.

Works offline - no internet required!
```

### Graphics Required

| Asset | Size | Format |
|-------|------|--------|
| App icon | 512x512 | PNG (32-bit) |
| Feature graphic | 1024x500 | PNG/JPG |
| Phone screenshots | 360x640 | PNG/JPG (min 2, max 8) |
| 7" tablet | 720x1280 | PNG/JPG (optional) |
| 10" tablet | 1920x1080 | PNG/JPG (optional) |

### Screenshot Tips

Take screenshots on a real Android device using:
- ADB: `adb shell screencap /sdcard/screen.png`
- Or use screen recording app

---

## Step 4: Upload APK

1. Go to **"App releases"** in sidebar
2. Click **"Create new release"**
3. Under "Android App Bundles", upload `app-release.apk`
4. Fill in "Release notes":
   ```
   Initial release with full offline capability
   ```
5. Click **"Save release"**

---

## Step 5: Content Rating

1. Go to **"Content rating"**
2. Click **"Complete questionnaire"**
3. Answer all questions honestly

**For Quran Lights:**
- Your app likely is "Rating: All"
- No mature content, no violence, no gambling
- Select appropriate answers

4. Click **"Save questionnaire"**
5. Click **"Apply rating"**

---

## Step 6: Pricing & Distribution

1. Go to **"Pricing & distribution"**
2. Set **"Free"** or "Paid" (if paid, set price)
3. Check **"Distribute on Google Play"**
4. Select countries
5. Enable/disable "Education app" (usually no)

---

## Step 7: Privacy Policy

### Required!

You MUST have a privacy policy URL.

### Options:

1. **Create a page** on your website
   - `https://yourdomain.com/privacy-policy.html`

2. **Use a privacy policy generator**
   - Generate free privacy policy
   - Host on your site or GitHub Pages

### What to include:

```
Privacy Policy for Quran Lights

Last updated: [DATE]

This app respects your privacy.

Data collected:
- Local storage only (on your device)
- No personal data sent to our servers
- No analytics or tracking

Your data stays on your device and is never shared with third parties.

Contact: [YOUR EMAIL]
```

---

## Step 8: Review & Submit

1. Go to **"Dashboard"**
2. Check for any warnings/errors
3. All sections should show green checkmarks
4. Click **"Submit for review"**

---

## Timeline

| Phase | Time |
|-------|------|
| Upload review | 1-2 hours |
| Full review | 1-7 days (usually 2-3) |
| Published | Immediately after approval |

---

## After Approval

1. Go to **"Pricing & distribution"**
2. Make sure "Publish" is selected
3. App is live on Play Store!

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Rejected - Privacy policy | Add valid privacy policy URL |
| Rejected - Sensitive permissions | Explain why you need each permission |
| Rejected - Malfunctioning | Test APK on real device first |
| Not in search results | Wait 24-48 hours after approval |
| Update rejected | Include all new permissions in release notes |

---

## Updating the App

1. Bump version in `android/app/build.gradle`:
   ```groovy
   versionCode 2        // Increment
   versionName "1.1"    // User-visible version
   ```

2. Rebuild:
   ```powershell
   .\build.ps1
   ```

3. Upload new APK in Play Console

4. Add release notes

5. Submit for review

---

## Quick Checklist Before Submit

- [ ] Tested APK on real Android device
- [ ] App icon created (512x512)
- [ ] At least 2 screenshots taken
- [ ] Privacy policy URL ready
- [ ] Developer account created
- [ ] Release notes written
- [ ] All content rating questions answered
- [ ] Countries selected

---

*Ready to submit? Go to https://play.google.com/console*