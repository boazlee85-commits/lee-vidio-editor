# Lee Video Editor

Standalone Vite + React video editor with direct YouTube upload from the browser.

## Local setup

1. Install dependencies:
   `npm install`
2. Create `.env.local`:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

3. Run:
   `npm run dev`

For YouTube upload, enable **YouTube Data API v3** in Google Cloud and add your local origin (for example `http://localhost:5173`) to the OAuth client's **Authorized JavaScript origins**.

## Deploy on Render

This repo includes [`render.yaml`](./render.yaml) for Blueprint deploys.

1. Push to GitHub.
2. In Render: **New +** -> **Blueprint**.
3. Select this repo and deploy.
4. Set environment variable:
   `VITE_GOOGLE_CLIENT_ID`
5. Add your Render domain (for example `https://your-service.onrender.com`) to Google OAuth **Authorized JavaScript origins**.
6. Redeploy.
