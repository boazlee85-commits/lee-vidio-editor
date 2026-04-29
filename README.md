\*\*Welcome to your Base44 project\*\* 



\*\*About\*\*



View and Edit  your app on \[Base44.com](http://Base44.com) 



This project contains everything you need to run your app locally.



\*\*Edit the code in your local development environment\*\*



Any change pushed to the repo will also be reflected in the Base44 Builder.



\*\*Prerequisites:\*\* 



1\. Clone the repository using the project's Git URL 

2\. Navigate to the project directory

3\. Install dependencies: `npm install`

4\. Create an `.env.local` file and set the right environment variables



```

VITE\_BASE44\_APP\_ID=your\_app\_id

VITE\_BASE44\_APP\_BASE\_URL=your\_backend\_url

VITE\_GOOGLE\_CLIENT\_ID=your\_google\_oauth\_client\_id



e.g.

VITE\_BASE44\_APP\_ID=cbef744a8545c389ef439ea6

VITE\_BASE44\_APP\_BASE\_URL=https://my-to-do-list-81bfaad7.base44.app

VITE\_GOOGLE\_CLIENT\_ID=1234567890-abc123def456.apps.googleusercontent.com

```

For YouTube upload to work, create a Google OAuth Client (Web application), enable the YouTube Data API v3, and add your local origin (for example `http://localhost:5173`) to Authorized JavaScript origins.



Run the app: `npm run dev`



\*\*Deploy on Render\*\*



This project includes a `render.yaml` file for one-click Blueprint deployment.

1\. Push your latest code to GitHub/GitLab.

2\. In Render, choose **New +** > **Blueprint**.

3\. Select this repo and deploy the Blueprint.

4\. In Render service settings, set these environment variables:

- `VITE_BASE44_APP_ID`
- `VITE_BASE44_APP_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`

5\. In Google Cloud OAuth credentials, add your Render URL (`https://<your-service>.onrender.com`) to **Authorized JavaScript origins** so YouTube upload works in production.



\*\*Publish your changes\*\*



Open \[Base44.com](http://Base44.com) and click on Publish.



\*\*Docs \& Support\*\*



Documentation: \[https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)



Support: \[https://app.base44.com/support](https://app.base44.com/support)

