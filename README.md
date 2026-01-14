# TrackChat - WhatsApp AI Sales Agent Portal

A frontend-only React + Tailwind SPA demonstrating a production-quality dashboard for managing WhatsApp AI agents, campaigns, and leads.

## Features

- **Dashboard**: KPI overview, activity feed, and pipeline visualization.
- **Inbox**: Real-time chat interface with mock WebSocket behavior, human takeover, and template sending.
- **Campaigns**: Multi-step wizard for creating broadcast campaigns with audience segmentation constraints.
- **Templates**: Management of WhatsApp templates with mock approval flows.
- **Leads CRM**: Searchable, filterable list of contacts with lead scoring and tagging.
- **Analytics**: Interactive charts for conversation volume and sentiment analysis.
- **Credits System**: Simulated billing system where actions (sending messages) deduct credits.

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS + Lucide Icons
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **State Management**: React Context (simulating backend state)

## Getting Started

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Run logic development server**
    ```bash
    npm run dev
    ```

3.  **Open in browser** (usually http://localhost:5173)

## Mock Data Architecture

This project uses a frontend-only mock layer located in `src/mocks/`.
The data is loaded into `src/context/AppContext.jsx` on initialization.

To replace with a real backend:
1.  Update `src/context/AppContext.jsx` to fetch data from your API endpoints instead of importing JSON files.
2.  Replace `deductCredits` and `addCredits` logic with API calls.
3.  Update page components to handle loading states (currently minimal as data is synchronous).

## Folder Structure

```
src/
├── components/         # Reusable UI components
│   ├── chat/           # Inbox specific components (ChatViewer, LeadsList)
│   ├── ui/             # Generic primitives (Button, Input, Modal, KPIcard)
│   ├── Layout.jsx      # Main application shell
│   └── ...
├── context/            # Global state (AppContext)
├── mocks/              # JSON data files for Leads, Campaigns, etc.
├── pages/              # Route views (Dashboard, Inbox, leads, etc.)
└── App.jsx             # Main router configuration
```

## Credits & Pricing Logic

The app simulates a credit system found in `src/mocks/credits.json` and `src/context/AppContext.jsx`.
- **Marketing Templates**: Cost 0.90 credits.
- **Utility Templates**: Cost 0.13 credits.
- **Campaigns**: Cost = Audience Size * Template Cost.

## License

MIT
