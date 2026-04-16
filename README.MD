# Quran Lights (نور القرآن)

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
  <a href="https://quranlights.et3am.com"><img src="https://img.shields.io/badge/Live Demo-quranlights.et3am.com-blue" alt="Live Demo"></a>
  <!-- Suggested GitHub Topics to add via repo Settings > Topics:
       quran, islamic, pwa, memorization, arabic, hafiz, quran-tracker -->
  <img src="https://img.shields.io/badge/topics-quran%20%7C%20islamic%20%7C%20pwa%20%7C%20memorization%20%7C%20arabic-green" alt="Topics">
</p>

---

## ✨ Features

- **📅 Daily Review Tracking** - Log your daily refreshment sessions for each Surah
- **🔥 Streak Tracking** - Track consecutive days of review with visual heatmaps
- **📊 Visual Analytics** - Charts showing progress, light/dark days, and memorization patterns
- **🔔 Reminders** - Daily notifications to keep you consistent
- **📱 Cross-Platform** - Works on web and Android (PWA)
- **🌐 Multi-language** - Arabic, English, and 8 other languages
- **🔒 Privacy-First** - Your data stored locally with optional cloud sync

---

## 📸 Screenshots

> Add screenshots here to showcase the dashboard, heatmaps, and analytics.
> Recommended: drag and drop images into this section via GitHub's editor,
> or place them in `public/images/screenshots/` and reference them below.

| Dashboard | Heatmap | Analytics |
|-----------|---------|-----------|
| _screenshot coming soon_ | _screenshot coming soon_ | _screenshot coming soon_ |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Plain JavaScript + jQuery + Bootstrap |
| Backend | Firebase (Realtime Database + Auth) |
| Charts | Highcharts |
| PWA | Service Workers + Manifest |
| Storage | localStorage + Firebase |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (for cloud features)
- Node.js (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Amr1977/quran_lights_web.git
cd quran_lights_web
```

2. Set up Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Copy your config to `public/js/constants.js`

3. Deploy to Firebase (optional):
```bash
firebase deploy
```

### Development

To run locally:
```bash
firebase serve
# or
npx firebase serve
```

---

## 📁 Project Structure

```
quran_lights_web/
├── public/
│   ├── dashboard/         # Main dashboard UI
│   │   ├── scripts/        # JavaScript modules
│   │   └── css/            # Stylesheets
│   ├── js/                 # Shared utilities
│   ├── locales/            # i18n translations
│   ├── login/              # Authentication pages
│   └── index.html          # Landing page
├── firebase.json           # Firebase config
├── database.rules.json     # Database security rules
└── README.md               # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Email:** amr.lotfy.othman@gmail.com
- **Website:** https://quranlights.et3am.com

---

## 🙏 Acknowledgments

- Quranic data from [Al-Quran Cloud API](https://alquran.cloud/)
- Inspired by the concept of **Sadaqah Jariyah** (continuous charity)
- Thanks to all contributors and users!
