# NEST Frontend - Developer Instructions

## Prerequisites
- Node.js 18.x or later
- Angular CLI 17+ (Project uses Angular 21)

## Setup
1. Open terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Development Server
To run the development server with the backend proxy enabled:
```bash
ng serve
```
The app will be available at `http://localhost:4200/`.
**Note:** The backend must be running on `http://localhost:3000/` for API requests to work, as the `proxy.conf.json` forwards `/api/v1/*` to port 3000.

## Building for Production
To generate a production-ready build:
```bash
ng build --configuration=production
```
The compiled files will be output to the `dist/frontend/browser/` directory. These static files can be served using any web server (Nginx, Apache, Firebase Hosting, etc.).

## Adding a New Feature
1. **API Service**: Add the HTTP calls in `core/api/feature-api.service.ts`.
2. **NgRx Store**: Create the 6-file structure in `store/feature/`.
3. **Register Store**: Add the reducer and effects to `app.config.ts`.
4. **Resolver**: Create a resolver in `core/resolvers/feature.resolver.ts` to dispatch the load action.
5. **Components**: Create lazy-loaded standalone components in `features/feature/`.
6. **Routing**: Add the route and attach the resolver in `app.routes.ts`.
