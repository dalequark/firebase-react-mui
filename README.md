1. In `.firebaserc`, set your PROJECT_ID.
2. In `frontend/public/src`, create a file called `firebaseConfig.json`. Fill it in with your firebase config:

        {
            "apiKey": "YOUR_API_KEY",
            "authDomain": "PROJECT_NAME.firebaseapp.com",
            "projectId": "PROJECT_ID",
            "storageBucket": "STORAGE_BUCKET.appspot.com",
            "messagingSenderId": "MESSAGING_SENDING_ID",
            "appId": "APP_ID",
            "measurementId": "MEASUREMENT_ID"
        }
3. In this directory, run `npm install` (this installs `firebase-cli`).
4. If you haven't already: `npm install -g firebase-tools`.
5. Run `firebase login` and log in.

# Firebase Functions
1. If using Firebase Functions, log in and install npm packages: `cd functions && npm install`.
2. `firebase deploy --only functions`

# Hosting
// Todo

# Firestore
// Todo

# Storage


