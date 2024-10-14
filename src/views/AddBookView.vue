<template>
  <div class="col-md-8 offset-md-2">
    <h2>Add or Update Book</h2>
    <form @submit.prevent="editMode ? updateBook() : addBook()">
    <div>
      <label for="isbn" style="margin-right: 5px">ISBN:</label>
      <input type="text" v-model="isbn" id="isbn" required />
    </div>
    <div>
      <label for="name" style="margin-right: 5px">Name:</label>
      <input type="text" v-model="name" id="name" required />
    </div>
    <button type="submit" class="btn btn-primary me-2">{{ editMode ? 'Update Book' : 'Add Book' }}</button>
    </form>
    <br>
    <!-- Load BookList component and listen to edit and delete events -->
    <BookList :refresh="refresh" @edit="editBook" @delete="deleteBook" />
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../firebase/init.js'
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import BookList from '../components/BookList.vue';

export default {
  components: {
    BookList
  },
  setup() {
    const isbn = ref('');
    const name = ref('');
    const editMode = ref(false);
    const selectedBookId = ref(null);
    const refresh = ref(0);  // A simple counter to trigger refresh in BookList

    // Add new book
    const addBook = async () => {
      try {
        const isbnNumber = Number(isbn.value);
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }

        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value
        });

        isbn.value = '';
        name.value = '';
        alert('Book added successfully!');

        // Update the BookList by changing the refresh variable
        // Every time a new book is added, the refresh value is incremented, which will trigger the BookList component to reload
        refresh.value++;
      } catch (error) {
        console.error('Error adding book: ', error);
      }
    };

    // Edit a book
    const editBook = (book) => {
      isbn.value = String(book.isbn);
      name.value = book.name;
      selectedBookId.value = book.id;
      editMode.value = true;
    };

    // Update the selected book
    const updateBook = async () => {
      try {
        const isbnNumber = Number(isbn.value);  // Ensure that the ISBN is converted to a number
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }

        const bookDocRef = doc(db, 'books', selectedBookId.value);
        await updateDoc(bookDocRef, {
          isbn: isbnNumber,
          name: name.value
        });

        isbn.value = '';
        name.value = '';
        selectedBookId.value = null;
        editMode.value = false;
        alert('Book updated successfully!');
        refresh.value++;
      } catch (error) {
        console.error('Error updating book: ', error);
      }
    };

    // Delete a book
    const deleteBook = async (bookId) => {
      try {
        const bookDocRef = doc(db, 'books', bookId);
        await deleteDoc(bookDocRef);
        alert('Book deleted successfully!');
        refresh.value++;
      } catch (error) {
        console.error('Error deleting book: ', error);
      }
    };

    return {
      isbn,
      name,
      addBook,
      editBook,
      deleteBook,
      updateBook,
      editMode,
      refresh
    };
  }
};
</script>

<style scoped>

</style>