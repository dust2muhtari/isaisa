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
     KAYIT (HERKES USER OLARAK KAYIT OLUR)
  --------------------------------------------------- */
  window.registerUser = async function(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: Date.now(),
        role: "user"   // herkes normal kullanıcı olarak kaydedilir
      });

      alert("Kayıt başarılı!");
      window.location.href = "login.html";
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  /* ---------------------------------------------------
     GİRİŞ (EDITOR Mİ USER MI KONTROL EDİLİR)
  --------------------------------------------------- */
  window.loginUser = async function(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı belgesini çek
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data().role === "editor") {
        // Editor → editor paneline
        window.location.href = "editor.html";
      } else {
        // Normal kullanıcı → kitaplar sayfasına
        window.location.href = "books.html";
      }

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
        <a href="book.html?id=${docItem.id}" class="btn-secondary">Detayları Gör</a>
      `;

      container.appendChild(div);
    });
  }

  loadBooks();

</script>
