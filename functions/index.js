/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// countBooks function
exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection("books");
      const snapshot = await booksCollection.get();
      const count = snapshot.size;

      res.status(200).send({count});
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books");
    }
  });
});

// Capitalise book data
exports.capitalizeBookData = onDocumentCreated("books/{bookId}",
    async (event) => {
      const bookData = event.data.data(); // Get the document data
      if (!bookData) return null;

      const isbn = bookData.isbn;
      const capitalName = bookData.name.toUpperCase();

      try {
        const bookRef = admin.firestore().collection("books")
            .doc(event.params.bookId);
        // Update the document with capitalized fields
        await bookRef.update({
          isbn: isbn,
          name: capitalName,
        });
        console.log(
            `Book ${event.params.bookId} data capitalized successfully!`,
        );
      } catch (error) {
        console.error("Error capitalizing book data:", error.message);
      }
      return null;
    });
