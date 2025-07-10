

A full-featured React app built with Google Maps API, Firebase Authentication, and Material UI. This app lets users:

🔐 Authenticate using Firebase (Google login)

🧭 Plan routes between two locations

🚗 Choose travel modes (driving, walking, bicycling, transit)

⏱️ View real-time distance and duration

📍 Auto-detect and use your current location

🔒 Protected routes using Firebase Auth state

🚀 Getting Started

1. Clone this repo

git clone https://github.com/your-username/smart-route-planner.git
cd smart-route-planner

2. Install dependencies

npm install

3. Setup Environment Variables

Create a .env file in the root of the project and add the following:

VITE_GOOGLE_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

⚠️ Replace the placeholders with your actual API keys and Firebase project values.

4. Start the development server

If you're using Vite:

npm run dev

If you're using Create React App (CRA):

npm start


🔐 Firebase Authentication

Google login via Firebase

Auth state maintained with Firebase's onAuthStateChanged

Protected routes using a ProtectedRoute component with redirect logic



🧠 Features

Google Maps integration with route drawing and marker

Autocomplete search for origin and destination

Travel mode selection

Distance and duration display using Google Directions API

Distance validation (shows alert if route is too far)

Geolocation for user's current location

Material UI-based floating control panel




🧪 Tech Stack

React.js + Vite

Firebase Auth

Google Maps JavaScript API

MUI (Material-UI)

JavaScript