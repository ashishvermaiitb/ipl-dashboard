# IPL T20 Live Dashboard

A responsive dashboard application that displays real-time IPL T20 match information, including live matches, upcoming fixtures, points table, and complete schedule.

## 🏏 Features

Live Match Updates: Real-time scores and match details when games are in progress
Upcoming Matches: Display of upcoming fixtures with timings and venue details
Points Table: Current IPL standings with wins, losses, points, and net run rate
Complete Schedule: Full match schedule for the season
Mobile-First Design: Optimized for smartphones and tablets
Real-time Data: Periodic updates to reflect current match status

## 🛠️ Tech Stack

Next.js 14: React framework with App Router
TypeScript: Type-safe development
Tailwind CSS: Utility-first CSS framework
Node.js API Routes: Server-side data fetching and scraping
Cheerio: Server-side HTML parsing for web scraping
Axios: HTTP client for API requests
Lucide React: Icon library

## 🚀 Getting Started

### Prerequisites

Node.js 18+
npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ashishvermaiitb/ipl-dashboard.git
cd ipl-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser.

## 📁 Project Structure

src/
├── app/
│ ├── api/scrape/ # API routes for data fetching
│ ├── layout.tsx # Root layout
│ └── page.tsx # Homepage
├── components/
│ ├── dashboard/ # Dashboard-specific components
│ └── ui/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries
├── types/ # TypeScript type definitions
└── utils/ # Helper functions

## 🔄 Data Sources

The application scrapes data from iplt20 .com to provide:

- Live match scores and updates
- Match schedules and fixtures
- Current points table standings
- Team information and statistics

## 📱 Mobile Optimization

This dashboard is built with a mobile-first approach, ensuring:

- Responsive design across all device sizes
- Touch-friendly interface elements
- Optimized loading times
- Smooth scrolling and navigation

## 🔧 Development

Available Scripts

npm run dev - Start development server
npm run build - Build for production
npm run start - Start production server
npm run lint - Run ESLint
