document.addEventListener('DOMContentLoaded', function () {
    const books = []; // Array untuk menyimpan data buku sementara
  
    const bookForm = document.getElementById('bookForm');
    const incompleteBookshelfList = document.getElementById('incompleteBookList');
    const completeBookshelfList = document.getElementById('completeBookList');
    const searchForm = document.getElementById('searchBook');
  
    // Memuat buku saat halaman pertama kali dimuat
    loadBooks();
    renderBooks();
  
    // Event listener untuk menambahkan buku
    bookForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const title = document.getElementById('bookFormTitle').value;
      const author = document.getElementById('bookFormAuthor').value;
      const year = parseInt(document.getElementById('bookFormYear').value);
      const isComplete = document.getElementById('bookFormIsComplete').checked;
  
      // Membuat buku baru
      const book = {
        id: new Date().getTime(),
        title,
        author,
        year,
        isComplete,
      };
  
      books.push(book); // Menambahkan buku ke array
      saveBooks(); // Menyimpan ke localStorage
      renderBooks(); // Merender ulang daftar buku
      bookForm.reset(); // Reset form setelah menambahkan buku
      showNotification('Buku berhasil ditambahkan!');
    });
  
    // Event listener untuk pencarian buku
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
      renderBooks(searchTerm);
    });
  
    // Fungsi untuk menyimpan data buku ke localStorage
    function saveBooks() {
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    // Fungsi untuk mengambil data buku dari localStorage
    function loadBooks() {
      const storedBooks = localStorage.getItem('books');
      if (storedBooks) {
        books.push(...JSON.parse(storedBooks));
      }
    }
  
    // Fungsi untuk merender buku pada rak
    function renderBooks(searchTerm = '') {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
  
      let foundBooks = false;
  
      for (const book of books) {
        if (book.title.toLowerCase().includes(searchTerm)) {
          const bookElement = createBookElement(book);
          if (book.isComplete) {
            completeBookshelfList.append(bookElement);
          } else {
            incompleteBookshelfList.append(bookElement);
          }
          foundBooks = true;
        }
      }
  
      // Menampilkan pesan jika tidak ada buku yang ditemukan berdasarkan pencarian
      if (!foundBooks && searchTerm !== '') {
        const notFoundMessage = document.createElement('p');
        notFoundMessage.textContent = 'Buku tidak ditemukan.';
        notFoundMessage.style.textAlign = 'center';
        notFoundMessage.style.fontWeight = 'bold';
        notFoundMessage.style.color = '#333';
        incompleteBookshelfList.append(notFoundMessage);
        completeBookshelfList.append(notFoundMessage.cloneNode(true));
      }
  
      // Menampilkan pesan jika rak kosong tanpa pencarian
      if (incompleteBookshelfList.innerHTML === '' && searchTerm === '') {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Rak kosong, silakan tambahkan buku.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.fontWeight = 'bold';
        emptyMessage.style.color = '#333';
        incompleteBookshelfList.append(emptyMessage);
      }
  
      if (completeBookshelfList.innerHTML === '' && searchTerm === '') {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Rak kosong, silakan tambahkan buku.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.fontWeight = 'bold';
        emptyMessage.style.color = '#333';
        completeBookshelfList.append(emptyMessage);
      }
    }
  
    // Fungsi untuk membuat elemen buku
    function createBookElement(book) {
      const bookItem = document.createElement('div');
      bookItem.classList.add('bookItem');
      bookItem.setAttribute('data-bookid', book.id);
      bookItem.setAttribute('data-testid', 'bookItem');
  
      const bookTitle = document.createElement('h3');
      bookTitle.setAttribute('data-testid', 'bookItemTitle');
      bookTitle.textContent = book.title;
  
      const bookAuthor = document.createElement('p');
      bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
      bookAuthor.textContent = `Penulis: ${book.author}`;
  
      const bookYear = document.createElement('p');
      bookYear.setAttribute('data-testid', 'bookItemYear');
      bookYear.textContent = `Tahun: ${book.year}`;
  
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('buttonContainer');
  
      const toggleButton = document.createElement('button');
      toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
      toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
      toggleButton.addEventListener('click', () => {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
        showNotification('Status buku berhasil diperbarui!');
      });
  
      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
      deleteButton.textContent = 'Hapus Buku';
      deleteButton.addEventListener('click', () => {
        const index = books.findIndex(b => b.id === book.id);
        if (index !== -1) {
          books.splice(index, 1);
          saveBooks();
          renderBooks();
          showNotification('Buku berhasil dihapus!');
        }
      });
  
      const editButton = document.createElement('button');
      editButton.setAttribute('data-testid', 'bookItemEditButton');
      editButton.textContent = 'Edit Buku';
      editButton.addEventListener('click', () => {
        const newTitle = prompt('Masukkan judul baru', book.title);
        const newAuthor = prompt('Masukkan penulis baru', book.author);
        const newYear = prompt('Masukkan tahun rilis baru', book.year);
  
        if (newTitle && newAuthor && newYear) {
          book.title = newTitle;
          book.author = newAuthor;
          book.year = parseInt(newYear);
          saveBooks();
          renderBooks();
          showNotification('Buku berhasil diperbarui!');
        }
      });
  
      buttonContainer.append(toggleButton, editButton, deleteButton);
  
      bookItem.append(bookTitle, bookAuthor, bookYear, buttonContainer);
      return bookItem;
    }
  
    // Fungsi untuk menampilkan notifikasi kepada pengguna
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
  
      document.body.append(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000); // Notifikasi akan hilang setelah 3 detik
    }
  
    // Sinkronisasi jika ada perubahan pada localStorage dari tab lain
    window.addEventListener('storage', function () {
      books.length = 0; // Kosongkan array
      loadBooks(); // Ambil ulang data dari localStorage
      renderBooks(); // Render ulang tampilan
    });
  });
  