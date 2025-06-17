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

### 5. Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

### 6. Linting

To run the linter:

```bash
npm run lint
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- TailwindCSS
- React Router DOM
- Motion (for animations)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

