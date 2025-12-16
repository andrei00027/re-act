# Build and Deploy Guide

Complete guide for building and deploying MomentumFlow to the App Store.

## Prerequisites

### 1. Apple Developer Account
- Cost: $99/year
- Sign up at: https://developer.apple.com/programs/
- Wait for approval (usually 24-48 hours)

### 2. Install EAS CLI
```bash
npm install -g eas-cli
```

### 3. Expo Account
```bash
# Login or create account
eas login
```

## Step-by-Step Deployment

### Phase 1: Prepare Assets (Day 22-23)

#### 1.1 Generate Icons
```bash
# Open generators in browser
open scripts/generate-icon.html
open scripts/generate-splash.html
open scripts/generate-android-icons.html

# Download all assets and replace in assets/images/
# - icon.png (1024x1024)
# - splash-icon.png (200x200)
# - android-icon-foreground.png
# - android-icon-background.png
# - android-icon-monochrome.png
```

#### 1.2 Update app.json
```bash
# Edit app.json and update:
# - name: "MomentumFlow"
# - bundleIdentifier: "com.yourname.MomentumFlow" (change from anonymous)
# - version: "1.0.0"
```

#### 1.3 Take Screenshots
Follow [SCREENSHOTS_GUIDE.md](./SCREENSHOTS_GUIDE.md) to capture 5-8 screenshots.

#### 1.4 Prepare Privacy Policy
- Host PRIVACY_POLICY.md on a public URL
- Options:
  - GitHub Pages
  - Your website
  - Notion (public page)
  - Google Sites
- Update support email in Privacy Policy

---

### Phase 2: Configure EAS Build (Day 24)

#### 2.1 Initialize EAS
```bash
eas build:configure
```

This creates `eas.json` config file.

#### 2.2 Update eas.json
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

#### 2.3 Update Bundle Identifier
```json
// In app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.momentumflow"
    },
    "android": {
      "package": "com.yourcompany.momentumflow"
    }
  }
}
```

---

### Phase 3: Apple Developer Setup

#### 3.1 Create App ID
1. Go to https://developer.apple.com/account/
2. Certificates, Identifiers & Profiles
3. Identifiers > + (Add)
4. Select "App IDs" > Continue
5. Type: App
6. Description: MomentumFlow
7. Bundle ID: `com.yourcompany.momentumflow`
8. Capabilities:
   - ✅ Sign in with Apple
   - ✅ iCloud (CloudKit)
   - ✅ Push Notifications
   - ✅ HealthKit
9. Register

#### 3.2 Enable Capabilities in App Store Connect
Will be done automatically by EAS, but verify:
- iCloud
- HealthKit
- Sign in with Apple

---

### Phase 4: Build for iOS (Day 24)

#### 4.1 Build for TestFlight (Internal Testing)
```bash
# Start production build
eas build --platform ios --profile production

# EAS will prompt:
# - Generate new credentials? Yes
# - Apple ID email: your-email@example.com
# - Apple ID password: (app-specific password recommended)
```

**What happens:**
- EAS creates certificates and provisioning profiles
- Builds your app in the cloud (~15-30 minutes)
- Generates .ipa file

#### 4.2 Monitor Build
```bash
# Check build status
eas build:list

# Or visit:
# https://expo.dev/accounts/[your-account]/projects/momentumflow/builds
```

#### 4.3 Download Build (Optional)
```bash
# Download .ipa locally
eas build:download --platform ios --latest
```

---

### Phase 5: App Store Connect Setup (Day 24-25)

#### 5.1 Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com/
2. My Apps > + > New App
3. Fill in:
   - Platform: iOS
   - Name: MomentumFlow
   - Primary Language: English (U.S.)
   - Bundle ID: Select your bundle ID
   - SKU: momentumflow-1.0.0
   - User Access: Full Access

#### 5.2 Fill App Information
**General Information:**
- Name: MomentumFlow - Habit Tracker
- Subtitle: Flexible Streaks, Motivation
- Category: Health & Fitness
- Secondary Category: Productivity

**Privacy:**
- Privacy Policy URL: (your hosted URL)
- User Privacy Choices URL: (optional)

**App Privacy:**
Click "Start" and answer questions:
- Do you collect data? Yes
  - Health & Fitness (used for habit tracking)
  - User ID (Sign in with Apple)
- Is data linked to user? Yes
- Is data used for tracking? No

#### 5.3 Add Screenshots
1. Click "iOS App" > "Screenshots"
2. Upload for each device size:
   - 6.7" Display (iPhone 15 Pro Max): 5-8 screenshots
   - 6.5" Display: Same or different screenshots
3. Add localized captions (optional)

#### 5.4 Promotional Text & Description
Copy from [APP_STORE_LISTING.md](./APP_STORE_LISTING.md):
- Promotional Text (170 chars)
- Description
- Keywords (100 chars)
- Support URL (if you have one, otherwise use GitHub)
- Marketing URL (optional)

#### 5.5 App Review Information
- Contact Information:
  - First Name: Your name
  - Last Name: Your last name
  - Phone: Your phone
  - Email: your-support-email@example.com

- Sign-in Required? No (or provide test account)
- Notes: "This app uses Sign in with Apple for authentication and Apple Health for automatic habit completion."

#### 5.6 Version Information
- Version: 1.0.0
- Copyright: 2024 Your Name
- Age Rating: 4+ (take questionnaire, should be 4+)

---

### Phase 6: Submit Build to App Store (Day 25)

#### 6.1 Upload Build via EAS Submit
```bash
# Submit to App Store Connect
eas submit --platform ios --latest

# Or manually upload via Transporter app
```

#### 6.2 Select Build in App Store Connect
1. Go to App Store Connect > Your App > App Store
2. Click "+ Build" under Build section
3. Select your uploaded build from list
4. Click "Done"

#### 6.3 Export Compliance
- Does your app use encryption? Yes
- Does it use encryption beyond HTTPS? No
- (This is standard for most apps)

#### 6.4 Submit for Review
1. Review all information
2. Click "Add for Review"
3. Click "Submit to App Review"

**Review time:** Usually 1-3 days

---

### Phase 7: TestFlight (Optional but Recommended)

Before submitting to App Store, test via TestFlight:

#### 7.1 Internal Testing
```bash
# Build automatically goes to TestFlight
# No need for separate command
```

1. Open TestFlight app on iOS
2. Install MomentumFlow
3. Test all features
4. Get feedback from team (if any)

#### 7.2 External Testing (Optional)
1. In App Store Connect > TestFlight
2. External Testing > + (Add)
3. Add testers by email (up to 10,000)
4. Wait for beta review (~24 hours)
5. Testers receive invite via email

---

### Phase 8: After Approval

#### 8.1 Release to App Store
Once approved, you have options:
- **Manual Release:** You click "Release this version" when ready
- **Automatic Release:** Released immediately upon approval
- **Scheduled Release:** Release on specific date/time

Recommended: **Manual Release** for first version

#### 8.2 Monitor Reviews
- Check App Store Connect for reviews
- Respond to user feedback
- Track downloads and analytics

#### 8.3 Promote Your App
- Share on social media
- Product Hunt launch
- Reddit (r/SideProject, r/iOS)
- Your network

---

## Common Issues & Solutions

### Issue: Build fails with "Credentials error"
**Solution:**
```bash
# Clear credentials and regenerate
eas credentials
# Select "Remove all credentials"
# Then rebuild
eas build --platform ios --profile production
```

### Issue: "Missing entitlements"
**Solution:**
Add to app.json:
```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.applesignin": ["Default"],
        "com.apple.developer.healthkit": true,
        "com.apple.developer.icloud-container-identifiers": [
          "iCloud.$(CFBundleIdentifier)"
        ]
      }
    }
  }
}
```

### Issue: App rejected for privacy issues
**Solution:**
- Ensure Privacy Policy is accessible
- Fill out App Privacy section completely
- Add clear permission request messages in app.json

### Issue: Screenshots rejected
**Solution:**
- Make sure screenshots show actual app UI
- Remove any beta/test indicators
- Use high-resolution images (retina)

---

## Cost Breakdown

### Initial Costs
- Apple Developer: $99/year (required)
- Domain (optional): $10-15/year for privacy policy hosting
- Total: ~$100-115/year

### Free Services
- Expo EAS: Free tier includes builds
- GitHub Pages: Free hosting for privacy policy
- iCloud: Uses user's iCloud (free for you)

---

## Timeline Summary

| Day | Task | Time |
|-----|------|------|
| 22-23 | Prepare assets (icons, screenshots, descriptions) | 6-8h |
| 24 | Configure EAS, build iOS, TestFlight testing | 4-6h |
| 25 | App Store Connect setup, submit for review | 4-6h |
| 26-28 | Wait for review (passive) | - |
| 29+ | Release and promote | 2-4h |

**Total active work:** 14-18 hours over 4 days
**Total calendar time:** ~1-2 weeks (including review wait)

---

## Checklist Before Submission

- [ ] All icons generated and replaced (1024x1024, splash, etc.)
- [ ] Bundle identifier changed from "anonymous" to yours
- [ ] Privacy Policy hosted publicly
- [ ] Support email configured
- [ ] 5-8 screenshots captured (6.7" and 6.5")
- [ ] App Store listing written (RU + EN)
- [ ] Keywords researched and set
- [ ] Apple Developer account active ($99 paid)
- [ ] EAS build completed successfully
- [ ] TestFlight tested (optional but recommended)
- [ ] App Privacy section filled out
- [ ] Age rating completed (should be 4+)
- [ ] Export compliance answered
- [ ] All app info filled in App Store Connect
- [ ] Build selected and ready for submission

---

## Next Steps

After App Store approval:

1. **Version 1.1 Planning**
   - Social features (friends, challenges)
   - Dark mode
   - More chart types
   - Widgets

2. **Android Version**
   - Follow similar process with Google Play Console
   - Google Fit integration instead of Apple Health
   - Adaptive icons already prepared

3. **Marketing**
   - Create landing page
   - Social media presence
   - User testimonials

4. **Maintenance**
   - Monitor crash reports
   - Respond to reviews
   - Plan updates based on feedback

---

**Good luck with your App Store launch! 🚀**
