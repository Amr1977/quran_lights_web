# Immediate Refactoring Steps

## Quick Start Guide (Next 2-3 Days)

### Step 1: Create Monorepo Structure

```bash
# Create new directory structure
mkdir -p frontend/src backend/src shared/{types,constants,utils} docs

# Move current public/ to frontend/src/
mv public/* frontend/src/

# Create backend package.json
cd backend
npm init -y
npm install express cors helmet morgan dotenv
npm install --save-dev nodemon jest supertest
```

### Step 2: Set Up Root Package.json with Workspaces

```json
{
  "name": "quran-lights-web",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:frontend",
    "build:frontend": "cd frontend && npm run build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### Step 3: Frontend Vite Setup

```bash
cd frontend
npm init -y
npm install vite @vitejs/plugin-react
npm install --save-dev @types/node
```

**frontend/vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

### Step 4: Backend Express Setup

**backend/src/app.js:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quran', require('./routes/quran'));
app.use('/api/users', require('./routes/users'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
```

**backend/src/server.js:**
```javascript
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 5: Environment Configuration

**backend/.env:**
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
AUTH_MICROSERVICE_URL=http://localhost:3002
DATABASE_URL=mongodb://localhost:27017/quran_lights
JWT_SECRET=your-secret-key
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_URL=http://localhost:3002
VITE_FIREBASE_ENV=test
```

### Step 6: Convert First HTML Page to React

**frontend/src/App.jsx:**
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
```

**frontend/src/pages/Home.jsx:**
```jsx
import React from 'react';
import Navigation from '../components/Navigation';

function Home() {
  return (
    <div className="home">
      <Navigation />
      <section id="home">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10 wow fadeIn" data-wow-delay="0.3s">
                <h1 className="text-upper">رسوم و لوحات بيان معدلاتك القرآنية</h1>
                <p className="tm-white">
                  موقع أنوار القرآن يمكنك من متابعة معدلات التلاوة و المراجعة الدورية من خلال الرسوم البيانية
                </p>
              </div>
              <div className="col-md-1"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
```

### Step 7: API Client Setup

**frontend/src/services/api.js:**
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Quran data endpoints
  async getQuranData() {
    return this.request('/quran/data');
  }

  async updateProgress(suraId, progress) {
    return this.request(`/quran/progress/${suraId}`, {
      method: 'PUT',
      body: JSON.stringify(progress),
    });
  }
}

export const apiClient = new ApiClient();
```

### Step 8: Docker Setup

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3001:3001"
    environment:
      - VITE_API_URL=http://localhost:3000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/quran_lights
    depends_on:
      - mongo

  auth-microservice:
    build: ./auth-microservice
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Migration Strategy

### Phase 1: Parallel Development (Week 1-2)
1. **Keep current site running** at current domain
2. **Develop new backend** alongside existing
3. **Create new frontend** with React
4. **Test integration** between new components

### Phase 2: Gradual Migration (Week 3-4)
1. **Deploy new backend** to staging
2. **Migrate one page at a time** (start with login/signup)
3. **Test thoroughly** before switching traffic
4. **Monitor performance** and user feedback

### Phase 3: Full Migration (Week 5-6)
1. **Switch traffic** to new system
2. **Monitor closely** for issues
3. **Decommission old system** once stable
4. **Optimize performance**

## Immediate Action Items

### Today:
- [ ] Create monorepo structure
- [ ] Set up root package.json
- [ ] Configure Vite for frontend
- [ ] Set up Express backend

### This Week:
- [ ] Convert login/signup pages to React
- [ ] Create API client
- [ ] Set up authentication flow
- [ ] Add basic testing

### Next Week:
- [ ] Migrate dashboard page
- [ ] Add more API endpoints
- [ ] Set up database
- [ ] Deploy to staging

## Benefits of This Approach

1. **Zero Downtime**: Keep current site running
2. **Gradual Migration**: Move one feature at a time
3. **Easy Rollback**: Can switch back if issues arise
4. **Modern Stack**: React, Express, proper tooling
5. **Scalable**: Ready for future growth
6. **Maintainable**: Clean separation of concerns

## Risk Mitigation

- **Backup Strategy**: Keep current code in separate branch
- **Feature Parity**: Ensure all current features work in new system
- **Performance Monitoring**: Track metrics during migration
- **User Communication**: Inform users about improvements
- **Rollback Plan**: Keep old system ready for quick switch 