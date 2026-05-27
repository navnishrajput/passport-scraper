```markdown
# 🌐 Passport Social Media Scraper Dashboard

A full-stack real-time dashboard that aggregates and intelligently organizes social media content related to passports from the last 24 hours.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend Dashboard** | [https://dashboard-psi-navy-53.vercel.app](https://dashboard-psi-navy-53.vercel.app) |
| **Backend API** | [https://passport-scraper.onrender.com](https://passport-scraper.onrender.com) |
| **API Stats** | [https://passport-scraper.onrender.com/api/stats](https://passport-scraper.onrender.com/api/stats) |
| **API Health** | [https://passport-scraper.onrender.com/health](https://passport-scraper.onrender.com/health) |

---

## ✨ Features

- 📡 **Real-time RSS Feed Scraping** — Fetches passport-related posts every 5 minutes from Google News, Reddit, Times of India, The Hindu, NDTV, BBC News
- 🌍 **Multi-language Translation** — One-click translation to 10 languages (English, Hindi, Punjabi, Spanish, French, German, Arabic, Chinese, Russian, Japanese)
- 🏷️ **Auto-categorization** — AI-powered classification into 10 categories (Application, Renewal, Appointments, Tatkal, Visa, Travel Issues, Government Announcements, Scams/Fraud, Police Verification, Personal Experiences)
- 🤖 **Spam Detection** — Automatic gibberish and bot-content filtering
- 📝 **AI Summaries** — Concise ~30-word summaries for every post
- 📊 **Clustered View** — Group similar posts to reduce duplicates
- 🔍 **Full-text Search** — Search across original and translated content
- 📥 **CSV Export** — Download filtered results
- 🎨 **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **H2 Database** (file-based, zero configuration)
- **Rome RSS Parser** for feed parsing
- **JSoup** for HTML content extraction
- **Maven** for build management
- Deployed on **Render** (Docker)

### Frontend
- **React 18** with functional components and hooks
- **TailwindCSS 3.4** for styling
- **Axios** for HTTP requests
- **React Icons** for UI icons
- Deployed on **Vercel**

### NLP Engine (Custom Built)
- Keyword-based categorization with weighted scoring
- Lexicon-based sentiment analysis
- Pattern-matching spam detection
- Extractive text summarization
- Free Google Translate API integration

---

## 📡 Data Sources (FREE — No API Keys Required)

| Source | Type | Description |
|--------|------|-------------|
| Google News | RSS | Global passport and visa news |
| Google News India | RSS | India-specific passport news |
| Times of India | RSS | Indian national news |
| The Hindu | RSS | Indian national news |
| NDTV India | RSS | Indian news feed |
| BBC News World | RSS | International news |
| Reddit Search | RSS | Community discussions |

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** ([Download](https://adoptium.net))
- **Node.js 16+** ([Download](https://nodejs.org))
- **Maven 3.8+** ([Download](https://maven.apache.org))

### Clone & Run

```bash
# Clone the repository
git clone https://github.com/navnishrajput/passport-scraper.git
cd passport-scraper
```

### Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: **http://localhost:8080**

### Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
Frontend runs at: **http://localhost:3000**

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Get posts with pagination & filters |
| `GET` | `/api/search?keyword=` | Full-text search |
| `GET` | `/api/stats` | Real-time statistics |
| `POST` | `/api/translate/{id}?targetLanguage=` | Translate a post |
| `GET` | `/api/clusters` | Get clustered posts |
| `GET` | `/api/languages` | Supported languages |
| `GET` | `/api/export/csv` | Download CSV |
| `GET` | `/health` | Health check |

### Query Parameters for `/api/posts`

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 0) |
| `size` | int | Page size (default: 50) |
| `platform` | String | Filter by platform |
| `category` | String | Filter by category |
| `region` | String | Filter by region |
| `sentiment` | String | Filter by sentiment |
| `sortBy` | String | Sort: `date`, `engagement`, `relevance` |

### Example API Calls

```bash
# Get all posts
curl https://passport-scraper.onrender.com/api/posts

# Search for "passport renewal"
curl "https://passport-scraper.onrender.com/api/search?keyword=passport+renewal"

# Get statistics
curl https://passport-scraper.onrender.com/api/stats

# Translate post #1 to Hindi
curl -X POST "https://passport-scraper.onrender.com/api/translate/1?targetLanguage=hi"

# Export CSV
curl "https://passport-scraper.onrender.com/api/export/csv?category=Visa+Related"
```

---

## 📁 Project Structure

```
passport-scraper/
├── backend/
│   ├── src/main/java/com/zebvo/passportscraper/
│   │   ├── PassportScraperApplication.java          # Spring Boot main class
│   │   ├── config/
│   │   │   └── CorsConfig.java                      # CORS configuration
│   │   ├── controller/
│   │   │   ├── HomeController.java                  # Root & health endpoints
│   │   │   └── ScraperController.java               # Main REST API
│   │   ├── model/
│   │   │   └── SocialMediaPost.java                 # JPA Entity
│   │   ├── repository/
│   │   │   └── SocialMediaPostRepository.java       # Data access layer
│   │   └── service/
│   │       ├── NLPProcessorService.java             # NLP engine
│   │       ├── RSSFeedScraperService.java           # RSS feed scraper
│   │       └── TranslationService.java              # Translation service
│   ├── src/main/resources/
│   │   └── application.properties                   # App configuration
│   └── pom.xml                                      # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js                                   # Main React component
│   │   ├── index.js                                 # React entry point
│   │   ├── index.css                                # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── PostCard.js                          # Post display card
│   │   │   ├── FilterSidebar.js                     # Filter panel
│   │   │   ├── StatsBar.js                          # Statistics bar
│   │   │   └── ClusterView.js                       # Clustered view
│   │   └── services/
│   │       └── api.js                               # API service layer
│   ├── public/
│   │   └── index.html                               # HTML template
│   ├── tailwind.config.js                           # TailwindCSS config
│   ├── postcss.config.js                            # PostCSS config
│   └── package.json                                 # Node dependencies
├── Dockerfile                                        # Docker configuration
├── render.yaml                                       # Render deployment config
├── vercel.json                                       # Vercel deployment config
├── .gitignore                                        # Git ignore rules
└── README.md                                         # This file
```

---

## 🏗️ Architecture

```
RSS Feeds (Every 5 min)
    │
    ▼
RSSFeedScraperService
    │
    ├── Parse XML/RSS
    ├── Filter passport-related content
    ├── Remove duplicates
    │
    ▼
NLPProcessorService
    │
    ├── Categorize (10 categories)
    ├── Generate summary (~30 words)
    ├── Analyze sentiment (Positive/Negative/Neutral)
    ├── Detect spam/gibberish
    └── Calculate relevance score
    │
    ▼
H2 Database (social_media_posts)
    │
    ▼
REST API Controller
    │
    ├── GET /api/posts (paginated, filtered)
    ├── GET /api/search (full-text)
    ├── GET /api/stats (real-time stats)
    ├── POST /api/translate (multi-language)
    ├── GET /api/clusters (grouped view)
    └── GET /api/export/csv (download)
    │
    ▼
React Frontend (Vercel)
    │
    ├── StatsBar (live metrics)
    ├── PostCard (individual posts)
    ├── FilterSidebar (filtering)
    ├── Search (full-text search)
    ├── Translate (one-click translation)
    └── Export (CSV download)
```

---

## 🎯 Categories

| # | Category | Keywords |
|---|----------|----------|
| 1 | Application Process | apply, form, submit, documents, portal |
| 2 | Passport Renewal | renew, expire, expiry, extension, validity |
| 3 | Appointment Booking | appointment, slot, booking, schedule, PSK |
| 4 | Tatkal Service | tatkal, urgent, emergency, express, priority |
| 5 | Visa Related | visa, stamp, immigration, embassy, consulate |
| 6 | Travel Issues | travel, flight, airport, border, customs |
| 7 | Government Announcements | government, ministry, MEA, official, circular |
| 8 | Scams and Fraud | scam, fraud, fake, cheat, warning, alert |
| 9 | Police Verification | police, verification, background, clearance |
| 10 | Personal Experiences | experience, story, journey, got, received |

---

## 🌍 Supported Languages

| Code | Language |
|------|----------|
| en | English |
| hi | Hindi |
| pa | Punjabi |
| es | Spanish |
| fr | French |
| de | German |
| ar | Arabic |
| zh-CN | Chinese |
| ru | Russian |
| ja | Japanese |

---

## 📈 Performance

- **Scraping cycle:** Every 5 minutes
- **Posts per cycle:** 150-200+
- **API response time:** <500ms
- **Auto-cleanup:** Posts older than 24 hours deleted hourly
- **Database:** File-based H2, no external database required

---

## 🔧 Configuration

### Backend (`application.properties`)

```properties
server.port=8080
spring.datasource.url=jdbc:h2:file:./data/passportdb
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.task.scheduling.pool.size=5
```

### Frontend (`.env`)

```env
REACT_APP_API_URL=https://passport-scraper.onrender.com/api
```

---

## 📦 Dependencies

### Backend (pom.xml)
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- h2 (runtime)
- rome (RSS parser)
- jsoup (HTML parser)
- lombok
- jackson-databind

### Frontend (package.json)
- react 18
- react-dom 18
- axios
- react-icons
- tailwindcss
- postcss
- autoprefixer

---

## 🚢 Deployment

### Backend — Render
1. Push to GitHub
2. Connect repository on [Render](https://render.com)
3. Select **Docker** runtime
4. Render auto-detects `Dockerfile`
5. Deploys automatically on `git push`

### Frontend — Vercel
1. Connect repository on [Vercel](https://vercel.com)
2. Framework: Create React App
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Add Environment Variable: `REACT_APP_API_URL`

---

## ✅ Feature Checklist

- [x] Real-time RSS scraping from multiple sources
- [x] Translation to 10 languages
- [x] Auto-categorization into 10 categories
- [x] Gibberish/spam detection
- [x] AI-powered summaries (~30 words)
- [x] Clustered/grouped view
- [x] Filters by platform, category, region, sentiment
- [x] Sorting by date, engagement, relevance
- [x] Full-text search
- [x] CSV export
- [x] Responsive design
- [x] Live deployment (frontend + backend)
- [x] No API keys required
- [x] Clean GitHub commit history
- [x] Complete README documentation

---

## 📝 License

MIT License — Free to use, modify, and distribute.

---

## 👤 Developer

**Navnish Rajput**
- GitHub: [github.com/navnishrajput](https://github.com/navnishrajput)
- Project: [github.com/navnishrajput/passport-scraper](https://github.com/navnishrajput/passport-scraper)

