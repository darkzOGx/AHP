# **App Name**: AutoAlert

## Core Features:

- User Authentication: Google login and authentication using Firebase.
- User Data Storage: Store user data in Firestore on user creation.
- Dashboard: Dashboard page after login.
- Vehicle Search: Algolia search bar on the dashboard with vehicle search functionality, using appid UAP9GN7E33, search api key e1f1157fb77a9ea03146514f1694bd95, and index vehicles.
- Responsive Design: Mobile-responsive design for all pages.
- Alert Creation: CreateAlert page where users can set alerts based on vehicle type/name and range. Requires user phone number, fetched from profile if available.
- Watchlist Management: Watchlist creation in Firestore (users/{userId}/watchlist/{watchItem}) upon alert creation, containing user email and ID to track the creator. Option to toggle SMS or email alerts.

## Style Guidelines:

- Primary color: Deep teal (#008080). Evokes a sense of reliability and security.
- Background color: Light teal (#E0F8F8) Desaturated shade of primary, for a calming backdrop.
- Accent color: Burnt Orange (#CC6633) creates a balance in design, drawing attention to calls-to-action.
- Body and headline font: 'Inter', a grotesque-style sans-serif providing a modern, machined, objective, neutral look, and readability across devices. 
- Simple, clear icons representing vehicle types and alert preferences.
- Clean, intuitive layout for easy navigation and readability.
- Subtle animations for loading search results and alert creation confirmations.