# Cloud App Simple

A simplified React application that provides a clean interface for Cloud Campaign dashboard with just the essential navigation menu and iframe content.

## Features

- Clean, minimal interface without Talkdesk-specific navigation
- Left sidebar menu for navigation between different views
- Embedded iframe for Cloud Campaign dashboard
- Responsive design
- Easy deployment to Vercel

## Menu Items

- Dashboard
- Analytics
- Campaigns
- Reports
- Settings

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Option 2: Using GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push

### Option 3: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Vercel

## Configuration

The app uses the following configuration constants in `src/App.js`:

- `CLOUD_CAMPAIGN_BASE_URL`: The base URL for the Cloud Campaign service
- `CLOUD_CAMPAIGN_WORKSPACE_ID`: Your workspace ID
- `CLOUD_CAMPAIGN_API_KEY`: Your API key
- `CLOUD_CAMPAIGN_API_SECRET`: Your API secret
- `CLOUD_CAMPAIGN_AGENCY_ID`: Your agency ID

Update these values according to your Cloud Campaign setup.

## Environment Variables

For production deployment, consider using environment variables for sensitive configuration:

```bash
REACT_APP_CLOUD_CAMPAIGN_BASE_URL=https://talkdesk.cldportal.com
REACT_APP_CLOUD_CAMPAIGN_WORKSPACE_ID=your-workspace-id
REACT_APP_CLOUD_CAMPAIGN_API_KEY=your-api-key
REACT_APP_CLOUD_CAMPAIGN_API_SECRET=your-api-secret
REACT_APP_CLOUD_CAMPAIGN_AGENCY_ID=your-agency-id
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (one-way operation)

## Technologies Used

- React 19
- Styled Components
- Create React App
- Vercel (for deployment)
