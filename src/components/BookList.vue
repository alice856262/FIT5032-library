<template>
    <div>
      <h2>Books with ISBN < 1000</h2>
      <ul>
        <li v-for="book in booksUnder1000" :key="book.id" class="book-item">
          <div class="book-details">
            ISBN: {{ book.isbn }} - {{ book.name }}
          </div>
          <div class="book-actions">
            <button class="btn btn-outline-primary" @click="$emit('edit', book)">Edit</button>
            <button class="btn btn-outline-primary" @click="$emit('delete', book.id)">Delete</button>
          </div>
        </li>
      </ul>
      <h2>Books with ISBN ≥ 1000</h2>
      <ul>
        <li v-for="book in booksAbove1000" :key="book.id" class="book-item">
          <div class="book-details">
            ISBN: {{ book.isbn }} - {{ book.name }}
          </div>
          <div class="book-actions">
            <button class="btn btn-outline-primary" @click="$emit('edit', book)">Edit</button>
            <button class="btn btn-outline-primary" @click="$emit('delete', book.id)">Delete</button>
          </div>
        </li>
      </ul>

      <!-- Controls for sorting and limiting books -->
      <div>
        <label for="sortOrder" style="margin-right: 5px">Sort Order:</label>
        <select v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <label for="limitBooks" style="margin-left: 20px; margin-right: 5px">Number of books to display:</label>
        <select v-model="bookLimit">
          <option value="3">3</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>
    <br>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import db from '../firebase/init.js';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export default {
  props: {
    refresh: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const booksUnder1000 = ref([]);
    const booksAbove1000 = ref([]);
    const sortOrder = ref('asc');  // Default sorting order
    const bookLimit = ref(3);  // Default book limit

    // Function to fetch books based on the selected conditions
    const fetchBooks = async () => {
      try {
        // Fetch books with ISBN < 1000
        const queryUnder1000 = query(
          collection(db, 'books'),
          where('isbn', '<', 1000),
          orderBy('isbn', sortOrder.value),
          limit(bookLimit.value)
        );
        const querySnapshotUnder1000 = await getDocs(queryUnder1000);
        const booksArrayUnder1000 = [];
        querySnapshotUnder1000.forEach((doc) => {
          booksArrayUnder1000.push({ id: doc.id, ...doc.data() });
        });
        booksUnder1000.value = booksArrayUnder1000;

        // Fetch books with ISBN ≥ 1000
        const queryAbove1000 = query(
          collection(db, 'books'),
          where('isbn', '>=', 1000),
          orderBy('isbn', sortOrder.value),
          limit(bookLimit.value)
        );
        const querySnapshotAbove1000 = await getDocs(queryAbove1000);
        const booksArrayAbove1000 = [];
        querySnapshotAbove1000.forEach((doc) => {
          booksArrayAbove1000.push({ id: doc.id, ...doc.data() });
        });
        booksAbove1000.value = booksArrayAbove1000;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    onMounted(() => {
      fetchBooks(); // Fetch books when the component is mounted
    });

    // Watch for changes in sortOrder or bookLimit, and refetch the books accordingly
    watch([sortOrder, bookLimit], fetchBooks);

    // Watch for changes in the "refresh" prop to refetch books when a book is added, updated, or deleted
    watch(() => props.refresh, fetchBooks);

    return {
      booksUnder1000,
      booksAbove1000,
      sortOrder,
      bookLimit,
      fetchBooks
    };
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.book-details {
  flex-grow: 1;
}

.book-actions button {
  margin-left: 5px;
}
</style>