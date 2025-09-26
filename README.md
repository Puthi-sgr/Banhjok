# Delivery App

A modern delivery application built with React, Vite, and TailwindCSS.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tainuth1/Delivery-App.git
cd delivery-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

Add the following environment variables to your `.env` file:

```env
VITE_API_URL=https://api.example.com
VITE_API_KEY=yourkey1234
```

### 4. Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Linting

To run the linter:

```bash
npm run lint
```

## Tech Stack

- React 19
- Vite
- TailwindCSS
- React Router DOM
- Motion (for animations)
- Lucide UI
- Shadcn

## Deployment (GitHub Pages)

The project is configured for deployment to the `Puthi-sgr/Banhjok` GitHub Pages site. Vite is always built with the `/Banhjok/` base path so GitHub Pages content resolves correctly.

```bash
# build with the correct base path and publish the dist/ folder to gh-pages
npm run deploy
```

The command will create/update the `gh-pages` branch using [gh-pages](https://www.npmjs.com/package/gh-pages). Ensure you have push permissions to the repository and that the site is configured to serve from the `gh-pages` branch in the project settings.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
