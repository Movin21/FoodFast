const admin = require("firebase-admin");

// You need a service account JSON file - download from Firebase console
const serviceAccount = require("../config/firebase-service-account.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "foodordering-86735.appspot.com",
});

module.exports = { admin };
