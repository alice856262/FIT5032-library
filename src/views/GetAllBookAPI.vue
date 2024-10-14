<template>
  <pre>{{ allBooks }}</pre>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import db from '../firebase/init.js';

export default {
  name: 'GetAllBookAPI',
  data() {
    return {
      allBooks: [], // Store all books here
    };
  },
  async mounted() {
      await this.fetchAllBooks();
  },
  methods: {
    // Method to fetch all books from Firestore
    async fetchAllBooks() {
      try {
        const booksCollection = collection(db, 'books');
        const querySnapshot = await getDocs(booksCollection);

        // Map each document in the collection to its data
        this.allBooks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error('Error fetching all books:', error);
      }
    },
  },
};
</script>