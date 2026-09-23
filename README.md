# grocs-2

A minimal Angular 21 progressive web app with Firebase integration.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+

## Setup

```bash
npm install
npm start
```

Open `http://localhost:4200` in a browser.

## Firebase configuration

Replace the placeholder values in `src/environments/environment.ts` and `src/environments/environment.prod.ts` with the Firebase Web App configuration from the Firebase console. The application initializes Firebase Auth and Firestore through AngularFire.

For a production build:

```bash
npm run build
```

The production output is written to `dist/grocs-2/browser` and includes the Angular service worker and web app manifest.
