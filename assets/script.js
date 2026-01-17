<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

  import {
    getFirestore,
    setDoc,
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc
  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyD_0Y9D2ljwwC7pHmaYTrbwc677kwIUrgQ",
    authDomain: "isahalis.firebaseapp.com",
    projectId: "isahalis",
    storageBucket: "isahalis.firebasestorage.app",
    messagingSenderId: "33060832531",
    appId: "1:33060832531:web:31cdc1598686be16aa06e6",
    measurementId: "G-2N25T885EH"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  /* ---------------------------------------------------
     KAYIT
  --------------------------------------------------- */
  window.registerUser = async function(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: Date.now(),
        role: "user"
      });

      alert("Kayıt başarılı!");
      window.location.href = "login.html";
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  /* ---------------------------------------------------
     GİRİŞ
  --------------------------------------------------- */
  window.loginUser = async function(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Giriş başarılı!");
      window.location.href = "editor.html";
    } catch (error) {
      alert("Giriş hatası: " + error.message);
    }
  };

  /* ---------------------------------------------------
     KİTAPLARI FIRESTORE'DAN ÇEKME (books.html)
  --------------------------------------------------- */
  async function loadBooks() {
    const container = document.getElementById("books-container");
    if (!container) return; // Bu sayfada değilsek çalışmasın

    container.innerHTML = "<p>Yükleniyor...</p>";

    const snap = await getDocs(collection(db, "books"));
    container.innerHTML = "";

    snap.forEach((docItem) => {
      const b = docItem.data();

      const div = document.createElement("div");
      div.className = "book-card";
      div.innerHTML = `
        <img src="${b.cover}" class="book-cover">
        <h3>${b.title}</h3>
        <p>${b.desc.substring(0, 80)}...</p>
        <button class="btn-secondary" onclick="openBookModal('${docItem.id}')">Detayları Gör</button>
      `;

      container.appendChild(div);
    });
  }

  loadBooks();

  /* ---------------------------------------------------
     MODAL AÇMA
  --------------------------------------------------- */
  window.openBookModal = async function(id) {
    const modal = document.getElementById("book-modal");
    const titleEl = document.getElementById("modal-title");
    const bodyEl = document.getElementById("modal-body");
    const commentList = document.getElementById("comment-list");

    const ref = doc(db, "books", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const b = snap.data();

    titleEl.textContent = b.title;
    bodyEl.textContent = b.fullText;

    modal.dataset.bookId = id;
    modal.classList.remove("hidden");

    loadComments(id);
  };

  window.closeBookModal = function() {
    document.getElementById("book-modal").classList.add("hidden");
  };

  /* ---------------------------------------------------
     YORUMLARI ÇEKME
  --------------------------------------------------- */
  async function loadComments(bookId) {
    const list = document.getElementById("comment-list");
    list.innerHTML = "<p>Yorumlar yükleniyor...</p>";

    const snap = await getDocs(collection(db, "books", bookId, "comments"));
    list.innerHTML = "";

    snap.forEach((c) => {
      const data = c.data();
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `
        <strong>${data.name}</strong>
        <p>${data.text}</p>
      `;
      list.appendChild(div);
    });
  }

  /* ---------------------------------------------------
     YORUM EKLEME
  --------------------------------------------------- */
  window.submitComment = async function(e) {
    e.preventDefault();

    const modal = document.getElementById("book-modal");
    const bookId = modal.dataset.bookId;

    const name = document.getElementById("comment-name").value;
    const text = document.getElementById("comment-text").value;

    await addDoc(collection(db, "books", bookId, "comments"), {
      name,
      text,
      createdAt: Date.now()
    });

    document.getElementById("comment-form").reset();
    loadComments(bookId);
  };

</script>
