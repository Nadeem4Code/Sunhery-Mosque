const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');

if (fs.existsSync(keyPath)) {
  try {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK Initialized Successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK (check serviceAccountKey.json):', error.message);
  }
} else {
  console.log('Warning: serviceAccountKey.json not found in backend/config/. Firebase Auth user deletion will be skipped.');
}

module.exports = admin;
