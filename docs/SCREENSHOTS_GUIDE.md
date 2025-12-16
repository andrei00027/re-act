# App Store Screenshots Guide

## Requirements

### iOS Screenshot Sizes (Required)
You need screenshots for these device sizes:

1. **6.7" Display (iPhone 15 Pro Max, 14 Pro Max, etc.)**
   - Resolution: 1290 x 2796 pixels
   - Format: PNG or JPEG

2. **6.5" Display (iPhone 11 Pro Max, XS Max)**
   - Resolution: 1242 x 2688 pixels
   - Format: PNG or JPEG

3. **5.5" Display (iPhone 8 Plus, 7 Plus, 6s Plus)** - Optional but recommended
   - Resolution: 1242 x 2208 pixels
   - Format: PNG or JPEG

### Quantity
- Minimum: 1 screenshot (not recommended)
- Recommended: 5-8 screenshots
- Maximum: 10 screenshots

## Screenshot Sequence (Order Matters!)

### 1. Home Screen - Daily Habits
**What to show:**
- Home screen with 4-6 sample habits
- Some habits completed (checkmarks), some not
- Mix of binary and counter habits
- Current streak numbers visible
- Progress indicator at top (e.g., "4/6 completed today")

**Caption (RU):** Отслеживайте привычки каждый день с красивыми карточками и актуальными стриками
**Caption (EN):** Track your habits daily with beautiful cards and live streaks

**Setup:**
- Create sample habits:
  - 🏃 Пробежка (Running) - Binary, streak: 12 days
  - 💧 Вода (Water) - Counter, 8/8 glasses
  - 📚 Чтение (Reading) - Binary, streak: 5 days
  - 🧘 Медитация (Meditation) - Binary, completed
  - 💪 Тренировка (Workout) - Binary, not completed
  - 🥗 Здоровая еда (Healthy Food) - Binary, completed

---

### 2. Create Habit Screen
**What to show:**
- Create/Edit habit form
- Show emoji picker or habit being configured
- Visible fields: name, icon, color picker, frequency settings

**Caption (RU):** Создавайте привычки за минуту - выберите иконку, цвет и частоту
**Caption (EN):** Create habits in a minute - choose icon, color, and frequency

**Setup:**
- Open "Create Habit" screen
- Fill in example: "Тренировка" / "Workout"
- Show frequency picker with "Daily" selected
- Color picker showing blue/turquoise selected

---

### 3. Calendar View
**What to show:**
- Calendar screen showing a full month
- Green dots on completed days
- Red/gray on missed days
- Current month with good completion pattern (not perfect, shows flexibility)

**Caption (RU):** Календарь показывает историю выполнения с цветовой индикацией
**Caption (EN):** Calendar displays completion history with color indicators

**Setup:**
- Navigate to Calendar tab
- Select a habit with good history (e.g., "Пробежка")
- Month should show ~20-25 completed days out of 30 (realistic)

---

### 4. Statistics & Charts
**What to show:**
- Stats screen with multiple graphs visible
- Completion rate chart
- Streak chart
- Time distribution chart (if visible)
- Summary cards with numbers

**Caption (RU):** Детальная статистика: графики выполнения, динамика стриков
**Caption (EN):** Detailed statistics: completion charts, streak dynamics

**Setup:**
- Navigate to Stats tab
- Make sure there's data for charts to display
- Scroll to show multiple chart types if needed

---

### 5. Habit Detail & Streak
**What to show:**
- HabitDetailScreen or expanded habit view
- Large streak number (e.g., 🔥 15 days)
- Mini calendar or recent history
- Edit/Delete buttons visible

**Caption (RU):** Отслеживайте прогресс каждой привычки с гибкими стриками
**Caption (EN):** Track progress of each habit with flexible streaks

**Setup:**
- Tap on a habit with good streak (e.g., 15+ days)
- Show detail view

---

### 6. Notifications/Reminders Setup
**What to show:**
- Settings or create habit screen
- Reminder toggle ON
- Time picker showing selected time
- Days of week selector

**Caption (RU):** Настраиваемые напоминания помогают не забывать о привычках
**Caption (EN):** Customizable reminders help you stay on track

**Setup:**
- Create or edit habit
- Show reminder section expanded
- Time: 09:00 or 18:00 (common times)
- Some days selected (e.g., Mon-Fri)

---

### 7. Profile & Settings (Optional)
**What to show:**
- Profile screen
- User info (Sign in with Apple)
- iCloud sync status (✓ Synced)
- Settings options

**Caption (RU):** Синхронизация через iCloud - ваши данные всегда в безопасности
**Caption (EN):** iCloud sync - your data is always safe and accessible

**Setup:**
- Navigate to Profile tab
- Make sure "Synced" status is showing
- User name visible

---

### 8. Apple Health Integration (Optional but great!)
**What to show:**
- Settings screen with Apple Health toggle ON
- Or a toast notification: "Workout completed automatically!"
- Or Stats screen showing health data integration

**Caption (RU):** Интеграция с Apple Health - автоматическая отметка на основе тренировок
**Caption (EN):** Apple Health integration - automatic completion based on workouts

**Setup:**
- Enable Health integration
- Show permission granted or auto-completion notification

---

## How to Take Screenshots

### Method 1: Using iOS Simulator (Easier)
```bash
# Run app in simulator
npm start
# Then press 'i' for iOS

# In Simulator, choose device:
# Device > iPhone 15 Pro Max (for 6.7")

# Take screenshot:
# Cmd + S (saves to Desktop)
```

### Method 2: Using Real Device
1. Connect iPhone to Mac
2. Run app on device
3. Take screenshots:
   - Press **Volume Up + Side Button** simultaneously
4. Transfer via AirDrop or Finder

### Method 3: Using Xcode
1. Run app in Xcode
2. Window > Devices and Simulators
3. Select device
4. Click "Take Screenshot" button

## Screenshot Enhancement (Optional)

### Add Device Frames
Use tools like:
- **Previewed** (Mac app) - https://previewed.app/
- **Screenshots.pro** - https://screenshots.pro/
- **Figma** - Manual device mockups

### Tips for Better Screenshots
- Use light mode for consistency
- Fill screen with content (avoid empty states for main screenshots)
- Show realistic data (not "Lorem Ipsum")
- Use Russian language for RU screenshots, English for EN
- Make sure time/battery indicators look normal
- Remove notification badges or make them minimal

## Localization

### Russian Screenshots
- Set device/simulator language to Russian
- All UI should display in Russian
- Sample habits: Пробежка, Вода, Чтение, Медитация, Тренировка

### English Screenshots
- Set device/simulator language to English
- All UI should display in English
- Sample habits: Running, Water, Reading, Meditation, Workout

**Note:** You can upload both RU and EN screenshots, or just use English (Apple allows same screenshots for all languages)

## Final Checklist

- [ ] 5-8 screenshots prepared
- [ ] All required device sizes (6.7", 6.5")
- [ ] Screenshots show real, polished UI
- [ ] Captions written for each screenshot (optional in App Store Connect)
- [ ] Order is logical (Home → Create → Calendar → Stats → Details)
- [ ] No personal/sensitive data visible
- [ ] Good lighting and contrast
- [ ] No status bar issues (time, battery, signal)

## Upload to App Store Connect

1. Go to App Store Connect
2. Select your app
3. iOS App > Screenshots
4. Choose device size
5. Drag and drop images (they reorder automatically)
6. Add localized captions (optional but recommended)
7. Save changes

---

**Time estimate:** 30-60 minutes to capture all screenshots
**Tools needed:** Xcode + Simulator or Real iPhone device
