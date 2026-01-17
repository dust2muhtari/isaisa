// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_0Y9D2ljwwC7pHmaYTrbwc677kwIUrgQ",
  authDomain: "isahalis.firebaseapp.com",
  projectId: "isahalis",
  storageBucket: "isahalis.firebasestorage.app",
  messagingSenderId: "33060832531",
  appId: "1:33060832531:web:31cdc1598686be16aa06e6",
  measurementId: "G-2N25T885EH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Yıl
document.getElementById("year").textContent = new Date().getFullYear();

// Kitapları yükle
function loadBooks() {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const container = document.getElementById("books-container");

  container.innerHTML = "";

  books.forEach((b) => {
    const card = document.createElement("article");
    card.className = "book-card";
    card.innerHTML = `
      <div class="book-cover placeholder-cover">Kapak</div>
      <h3>${b.title}</h3>
      <p class="book-tagline">${b.desc.substring(0, 80)}...</p>
      <button class="btn-secondary" onclick="openBookModal('${b.title}')">Detayları Gör</button>
    `;
    container.appendChild(card);
  });
}

loadBooks();

// MODAL
function openBookModal(bookTitle) {
  const books = JSON.parse(localStorage.getItem("books") || "[]");
  const book = books.find((b) => b.title === bookTitle);

  modalTitle.textContent = book.title;
  modalBody.textContent = book.desc;

  loadComments(book.title);

  document.getElementById("book-modal").classList.remove("hidden");
}

function closeBookModal() {
  document.getElementById("book-modal").classList.add("hidden");
}

// YORUM SİSTEMİ
function getComments(bookTitle) {
  const all = JSON.parse(localStorage.getItem("comments") || "{}");
  return all[bookTitle] || [];
}

function saveComment(bookTitle, comment) {
  const all = JSON.parse(localStorage.getItem("comments") || "{}");

  if (!all[bookTitle]) all[bookTitle] = [];

  all[bookTitle].push(comment);
  localStorage.setItem("comments", JSON.stringify(all));
}

function loadComments(bookTitle) {
  const list = document.getElementById("comment-list");
  list.innerHTML = "";

  const comments = getComments(bookTitle);

  comments.forEach((c) => {
    const div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = `
      <p class="comment-text">${c.text}</p>
      <p class="comment-meta">${c.name} – ${c.date}</p>
    `;
    list.appendChild(div);
  });
}

function submitComment(e) {
  e.preventDefault();

  const name = commentName.value.trim();
  const text = commentText.value.trim();
  const bookTitle = modalTitle.textContent;

  saveComment(bookTitle, {
    name,
    text,
    date: new Date().toLocaleString("tr-TR")
  });

  loadComments(bookTitle);
  e.target.reset();
}

// İletişim formu
function handleContactSubmit(e) {
  e.preventDefault();
  alert("Mesajınız alındı.");
  e.target.reset();

}
