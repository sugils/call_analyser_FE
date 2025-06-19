AI Call Analytics Dashboard
A modern React application for analyzing customer service calls using AI, featuring a beautiful UI with animations and comprehensive analytics tools.
Features

Landing Page: Animated login/signup forms with gradient styling
Dashboard: Real-time metrics display with interactive charts
User Management: CRUD operations for managing users
Audio Upload: Drag-and-drop interface for uploading call recordings
Feedback Sessions: Detailed call analysis with performance metrics

Tech Stack

React 18
Tailwind CSS (via CDN)
Lucide React for icons
Custom animations and gradients

Getting Started
Prerequisites

Node.js (v14 or higher)
npm or yarn

Installation

Clone the repository:

bashgit clone <your-repo-url>
cd ai-call-analytics

Install dependencies:

bashnpm install

Start the development server:

bashnpm start
The application will open at http://localhost:3000.
Project Structure
ai-call-analytics/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UserManagement.jsx
│   │   ├── UploadAudio.jsx
│   │   └── FeedbackSessions.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
├── .gitignore
└── README.md
Available Scripts

npm start - Runs the app in development mode
npm build - Builds the app for production
npm test - Launches the test runner
npm eject - Ejects from Create React App (one-way operation)

Features Overview
Dashboard

View key metrics: Total Calls, Average Rating, High/Low Ratings, Total Users
Monthly performance trend visualization
Ratings distribution chart

User Management

Add new users (single or bulk via CSV)
Edit user information inline
Delete users with confirmation

Audio Upload

Select user before uploading
Drag-and-drop or browse file selection
Audio player with playback controls
Transcript display

Feedback Sessions

List of recent calls with ratings
Detailed call analysis
Performance categories with scores
Actionable insights for improvement

Customization
Styling

All components use Tailwind CSS classes
Custom animations defined in App.css
Gradient color schemes throughout

Fonts

Montserrat for headings
Open Sans for body text
Inter as fallback

License
This project is licensed under the MIT License.