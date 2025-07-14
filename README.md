# Quran Lights Web Application

A comprehensive web application for tracking and visualizing Quran recitation and memorization progress. Each Quran chapter is represented as a "light cell" that dims over time until refreshed through recitation.

## 🌟 Features

- **Visual Light Cells**: Each of the 114 Quran chapters represented as interactive light cells
- **Comprehensive Analytics**: Daily, monthly, and yearly progress tracking
- **Memorization Progress**: Track memorization status and percentage
- **Multiple Visualizations**: Radar charts, treemaps, time series, and gauge charts
- **Flexible Sorting**: Sort chapters by revelation order, character count, verse count, and more
- **Data Import/Export**: Backup and restore your progress data
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Arabic RTL Support**: Full right-to-left layout support

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Firebase CLI (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/Amr1977/quran_lights_web.git
cd quran_lights_web

# Install dependencies
npm install

# Build for development
npm run build

# Start local development server
npm run dev
```

### Environment Setup

Create a `.env` file for production configuration:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=quran-lights.firebaseapp.com
FIREBASE_DATABASE_URL=https://quran-lights.firebaseio.com
FIREBASE_PROJECT_ID=quran-lights
FIREBASE_STORAGE_BUCKET=quran-lights.appspot.com
FIREBASE_MESSAGING_SENDER_ID=35819574492

# App Configuration
NODE_ENV=production
APP_VERSION=8.6.19
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=false
ENABLE_OFFLINE_SUPPORT=true
```

## 📊 How It Works

### Light Cells System
- Each Quran chapter is represented as a visual cell
- Cells dim over time based on user-defined refresh periods
- Visual indicators show time elapsed since last recitation
- Different refresh periods for memorized vs. non-memorized chapters

### Scoring System
- **Character-based scoring**: Each chapter scored by character count
- **Total Quran characters**: 322,604 characters
- **Daily thresholds**: Configurable daily reading goals
- **Debt tracking**: Tracks overdue chapters

### Analytics Features
- **Daily/Monthly/Yearly Score Tracking**: Character-based scoring system
- **Memorization Progress**: Percentage of Quran memorized
- **Light Ratio Charts**: Visual representation of engagement
- **Radar Charts**: Track chapters that are "escaping" (being forgotten)
- **Treemap Visualization**: Hierarchical view of chapter engagement

## 🛠️ Development

### Project Structure
```
quran_lights_web/
├── public/                    # Main application directory
│   ├── index.html            # Landing page (Arabic RTL)
│   ├── dashboard.html        # Main application interface
│   ├── login.html           # Authentication page
│   ├── dashboard/           # Core application modules
│   │   ├── scripts/         # JavaScript modules (25 files)
│   │   ├── css/            # Styling
│   │   └── images/         # Assets
│   └── js/                 # Shared JavaScript utilities
├── build-config.js          # Build configuration generator
├── package.json             # Dependencies and scripts
└── firebase.json           # Firebase hosting configuration
```

### Available Scripts

```bash
# Development
npm run build          # Build for development
npm run dev            # Build and start Firebase serve
npm start              # Start Firebase serve

# Production
npm run build:prod     # Build for production
npm run deploy         # Build and deploy to Firebase

# Configuration
npm run build          # Generate config from environment variables
```

### Key JavaScript Modules

- **`main.js`**: Core refresh functionality and event handling
- **`cells.js`**: Visual cell management and rendering
- **`state.js`**: Application state management
- **`sync.js`**: Firebase synchronization
- **`charts.js`**: Data visualization components
- **`memorization.js`**: Memorization progress tracking

## 🚀 Deployment

### Firebase Hosting (Current)
```bash
# Deploy to Firebase
npm run deploy
```

### Alternative Hosting Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### GitHub Pages
```bash
# Add to package.json
"scripts": {
  "deploy:gh": "npm run build:prod && gh-pages -d public"
}
```

## 🔧 Configuration

### Build Process
The application uses a build-time configuration system:

1. **Environment Variables**: Set in `.env` file
2. **Build Script**: `build-config.js` generates `public/js/config.js`
3. **Runtime Access**: Use `window.getConfig('key')` to access config

### Firebase Security Rules
```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 🎯 Usage Guide

### Basic Operations
1. **Refresh a Chapter**: Double-click on any light cell
2. **Select Multiple**: Single-click to select/deselect chapters
3. **Change Memorization Status**: Alt+click on a cell
4. **Open Chapter for Reading**: Shift+click on a cell

### Keyboard Shortcuts
- **L**: Sort by light intensity
- **N**: Sort by Quran order
- **C**: Sort by character count
- **V**: Sort by verse count
- **W**: Sort by word count
- **R**: Sort by revelation order
- **F**: Sort by refresh count
- **X**: Reverse sort order
- **D**: Deselect all

### Data Management
- **Export Data**: Use the Import/Export tab to backup your progress
- **Import Data**: Restore your progress from a backup file
- **Sync**: Data automatically syncs across devices via Firebase

## 🔒 Security

### Current Security Measures
- Firebase Authentication for user management
- Secure API keys (though exposed in client-side code)
- HTTPS enforcement through Firebase hosting

### Recommended Improvements
1. **API Key Security**: Move sensitive keys to environment variables
2. **Input Validation**: Add client-side validation for user inputs
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Server-side Operations**: Consider adding a Node.js backend for sensitive operations

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Firebase Deployment Issues
```bash
# Login to Firebase
firebase login

# Initialize Firebase (if needed)
firebase init hosting

# Deploy
firebase deploy
```

#### Configuration Issues
```bash
# Regenerate config
npm run build

# Check config file
cat public/js/config.js
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📱 Related Projects

- **iOS App**: [Quran Lights on App Store](https://itunes.apple.com/us/app/quran-lights/id1218872513?mt=8)
- **Web App**: [QuranLights.net](https://quranlights.net)

## 📄 License

This project is licensed under the **GPL License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for hosting and authentication
- **Highcharts** for data visualization
- **Bootstrap** for responsive design
- **Material Design Lite** for UI components

## 📞 Support

- **Website**: [QuranLights.net](https://quranlights.net)
- **Issues**: [GitHub Issues](https://github.com/Amr1977/quran_lights_web/issues)
- **Contact**: Reach out for Trello board access

---

**Version**: 8.6.19  
**Last Updated**: July 2024 