// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// HTTPS function
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// Same as onRequest but call from within your firebase frontend.
exports.addMessage = functions.https.onCall((data, context) => {
  // Message text passed from the client.
  const text = data.text;
  // Authentication / user information is automatically added to the request.
  const uid = context.auth.uid;
  const name = context.auth.token.name || null;
  const picture = context.auth.token.picture || null;
  const email = context.auth.token.email || null;
  // returning result.
  throw new functions.https.HttpsError(
    "invalid-argument",
    "Heres how you throw an error."
  );
  return {
    some: "data",
  };
});

// Firestore function
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

// Scheduled functions
exports.scheduledFunction = functions.pubsub
  .schedule("every 5 minutes")
  .onRun((context) => {
    console.log("This will be run every 5 minutes!");
    return null;
  });

// Auth function
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the
});

// Storage function
exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    // Download file from bucket.
    const bucket = admin.storage().bucket(bucket);
    const tempFilePath = path.join(os.tmpdir(), filePath);
    const metadata = {
      contentType: contentType,
    };
    await bucket.file(filePath).download({ destination: tempFilePath });
    functions.logger.log("Image downloaded locally to", tempFilePath);
    // Generate a thumbnail using ImageMagick.
    await spawn("convert", [
      tempFilePath,
      "-thumbnail",
      "200x200>",
      tempFilePath,
    ]);
    functions.logger.log("Thumbnail created at", tempFilePath);
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `thumb_${filePath}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Uploading the thumbnail.
    await bucket.upload(tempFislePath, {
      destination: thumbFilePath,
      metadata: metadata,
    });
    return fs.unlinkSync(tempFilePath);
  });

// Pubsub function
// gcloud pubsub topics publish topic-name --message '{"name":"Xenia"}'
exports.helloPubSub = functions.pubsub
  .topic("topic-name")
  .onPublish((message) => {
    console.log(message.json.name);
    // Get the `name` attribute of the message.
    const name = message.attributes.name;
  });
