// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEHvY7F90VDJAxGYpU0cjqVizNfZmejRA",
  authDomain: "autenticacao-administrativa.firebaseapp.com",
  databaseURL: "https://autenticacao-administrativa-default-rtdb.firebaseio.com",
  projectId: "autenticacao-administrativa",
  storageBucket: "autenticacao-administrativa.appspot.com",
  messagingSenderId: "724706435418",
  appId: "1:724706435418:web:cc90055d710060cf381363"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
