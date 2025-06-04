# Mini-Dashboard

A mini-dashboard application designed to visualise data from mock generate readings of devices.

Access the project through https://smudgelord200.github.io/mini-dashboard/

## Design Decisions & Tech Stack

This project utilizes the following technologies:

*   **React:** Chosen for its component-based architecture, efficient state management (especially with Hooks), and extensive ecosystem.
*   **TypeScript:** Used for static type checking, improving code quality, maintainability, and developer experience by catching errors early.
*   **Vite:** Selected as the build tool for its fast development server startup and optimized build process.
*   **Material UI (MUI):** Employed as the UI library to provide pre-built, customizable, and aesthetically pleasing UI components, ensuring a consistent look and feel.
*   **TanStack Table (React Table):** Integrated for creating organized and feature-rich tables, offering functionalities like sorting, filtering, and pagination.
*   **Recharts:** Used as the charting library for visualizing data, specifically for displaying line charts of readings over time.
*   **Vitest:** Chosen for running unit and integration tests within the Vite ecosystem, offering a fast and modern testing experience.
*   **faker:** Generated fake readings data of the devices
*   **motion:** Applied animation effects on some components

## Getting Started

### Prerequisites

*   Node.js (e.g., v18.x or later)
*   npm (v9.x or later) or yarn (v1.22.x or later)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd mini-dashboard
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

```bash
npm run dev
```
or
```bash
yarn dev
```
This will typically start the application, and you can access it at `http://localhost:3000` (the port might vary depending on your setup).

### Building for Production

```bash
npm run build
```
or
```bash
yarn build
```
The production-ready files will usually be generated in a `dist/` or `build/` directory.

### Running Tests

```bash
npm test
```
or
```bash
yarn test
```