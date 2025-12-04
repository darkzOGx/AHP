# Firebase Admin SDK Setup

The Stripe integration requires Firebase Admin SDK for server-side operations. Here's how to set it up:

## 1. Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`autohunter-pro`)
3. Go to **Project Settings** (gear icon)
4. Click **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file

## 2. Extract Credentials

From the downloaded JSON file, you need:
- `client_email`
- `private_key`

## 3. Add to Environment Variables

Add these to your `.env.local` file:

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@autohunter-pro.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

**Critical:** The private key must be exactly as shown in the JSON file, wrapped in quotes, with `\n` for newlines.

**Important Notes:**
- Keep the private key in quotes
- Preserve the `\n` characters in the private key
- Never commit these credentials to version control

## 4. Security

- The service account key provides full admin access to your Firebase project
- Only add these environment variables to your production server
- Consider using your hosting platform's secret management (Vercel secrets, etc.)

## 5. Testing

Once set up, your Stripe subscription flow should work without the "No Firebase App" error.

The API routes now use Firebase Admin SDK which doesn't require client-side Firebase initialization.