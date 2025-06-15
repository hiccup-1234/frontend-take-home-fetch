# Fetch Dog Adoption Platform

A modern web application for browsing and adopting dogs from shelters. Built with React, TypeScript, and Material-UI.

## Features

- User authentication with name and email
- Browse available dogs with filtering by breed
- Sort dogs alphabetically by breed (ascending/descending)
- Pagination for search results
- Favorite dogs and generate a match
- Responsive design for all devices
- Modern UI with Material-UI components

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI
- React Router
- React Query
- Zustand
- Axios

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:hiccup-1234/frontend-take-home-fetch.git
cd frontend-take-home-fetch
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── store/         # State management
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## API Integration

The application integrates with the Fetch Dog Adoption API at `https://frontend-take-home-service.fetch.com`. The API provides endpoints for:

- Authentication
- Dog search and filtering
- Breed listing
- Location data
- Dog matching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
