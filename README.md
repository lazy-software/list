# Lazy List

A minimal, mobile-first Todo List PWA built with React, TypeScript, and Tailwind CSS.

![Lazy List Icon](./public/icon-192.png)

## Features

*   **Lazy & Minimal**: No clutter. No titles. No "Add" buttons. Just type and go.
*   **Mobile-First Design**: Optimized for touch interactions and mobile screens.
*   **PWA Support**: Installable on iOS and Android. Works offline.
*   **Multiple Lists**: Organize your tasks into separate lists.
*   **Snooze Items**: Temporarily hide completed items for 1 hour to declutter your view.
*   **Share Lists**: Export and import lists using a simple encoded string.
*   **Alphabetical Sorting**: Lists and items are automatically sorted for you.
*   **Persistence**: Data is saved automatically to your device's local storage.
*   **Dark Mode**: Automatic device-driven dark mode support.

## Tech Stack

*   **Framework**: React + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v4
*   **PWA**: vite-plugin-pwa + Workbox
*   **Testing**: Vitest + React Testing Library
*   **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

*   Node.js (v20 or later recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/lazy-software/list.git
    cd list
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server:

```bash
npm run dev
```

### Testing

Run the unit tests:

```bash
npm test
```

### Building for Production

Build the app for deployment:

```bash
npm run build
```

The output will be in the `dist` directory.

## Deployment

This project is configured to deploy automatically to **GitHub Pages** using GitHub Actions.

1.  Push changes to the `main` branch.
2.  The workflow in `.github/workflows/deploy.yml` will build and deploy the app.
3.  Ensure your repository Settings > Pages source is set to **"GitHub Actions"**.

## License

MIT
