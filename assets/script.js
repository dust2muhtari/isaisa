<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
  import { getFirestore, setDoc, doc } 
    from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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

  // Kayıt fonksiyonu
  window.registerUser = async function(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: Date.now()
      });

      alert("Kayıt başarılı!");
      window.location.href = "login.html";
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  // Giriş fonksiyonu
  window.loginUser = async function(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Giriş başarılı!");
      window.location.href = "editor.html";
    } catch (error) {
      alert("Giriş hatası: " + error.message);
    }
  };

  // Senin mevcut kodların buraya devam eder...
</script>
